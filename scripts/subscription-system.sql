-- 1001_plans_and_entitlements.sql
-- Reference plans (no PII)
create table if not exists public.plans(
  id text primary key,            -- 'free' | 'casual' | 'pro'
  name text not null,
  monthly_chat_quota int,         -- null = unlimited
  trial_days int default 0,
  created_at timestamptz default now()
);

insert into public.plans(id,name,monthly_chat_quota,trial_days)
values
  ('free','Free',5,0),
  ('casual','Casual',50,3),
  ('pro','Professional',null,0)
on conflict (id) do nothing;

-- Feature flags (for "coming soon")
create table if not exists public.features(
  key text primary key,           -- e.g., 'advanced_screener'
  label text not null,
  status text not null default 'coming_soon' check (status in ('enabled','disabled','coming_soon'))
);

-- User subscription state (simple, Stripe-agnostic)
create table if not exists public.user_subscriptions(
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'active' check (status in ('active','trialing','past_due','canceled')),
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  current_period_start timestamptz not null default date_trunc('month', now()),
  current_period_end timestamptz not null default (date_trunc('month', now()) + interval '1 month' - interval '1 day'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chat usage per period
create table if not exists public.chat_usage(
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  prompts_used int not null default 0,
  updated_at timestamptz default now(),
  unique (user_id, period_start, period_end)
);

-- Audit trail (minimal)
create table if not exists public.subscription_events(
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event text not null,            -- 'trial_started','plan_changed','period_reset'
  details jsonb,
  created_at timestamptz default now()
);

-- 1002_rls_and_views.sql
-- RLS
alter table public.user_subscriptions enable row level security;
alter table public.chat_usage enable row level security;
alter table public.subscription_events enable row level security;

create policy if not exists "subs_self"
on public.user_subscriptions for select using (user_id = auth.uid());
create policy if not exists "chat_usage_self"
on public.chat_usage for select using (user_id = auth.uid());
create policy if not exists "sub_events_self"
on public.subscription_events for select using (user_id = auth.uid());

-- Resolved entitlements view
create or replace view public.v_user_entitlements as
select
  u.id as user_id,
  coalesce(us.plan_id, 'free') as plan_id,
  case
    when us.status='trialing' and now() <= us.trial_ends_at then 'trialing'
    else coalesce(us.status, 'active')
  end as effective_status,
  p.monthly_chat_quota,
  -- Active period
  coalesce(us.current_period_start, date_trunc('month', now())) as period_start,
  coalesce(us.current_period_end, (date_trunc('month', now()) + interval '1 month' - interval '1 day')) as period_end,
  -- Used and remaining
  (select cu.prompts_used
     from public.chat_usage cu
    where cu.user_id = u.id
      and cu.period_start = coalesce(us.current_period_start, date_trunc('month', now()))
      and cu.period_end = coalesce(us.current_period_end, (date_trunc('month', now()) + interval '1 month' - interval '1 day'))
  ) as prompts_used,
  case
    when p.monthly_chat_quota is null then null
    else greatest(p.monthly_chat_quota - coalesce(
      (select cu.prompts_used from public.chat_usage cu
       where cu.user_id = u.id
         and cu.period_start = coalesce(us.current_period_start, date_trunc('month', now()))
         and cu.period_end = coalesce(us.current_period_end, (date_trunc('month', now()) + interval '1 month' - interval '1 day'))
      ), 0), 0)
  end as prompts_remaining,
  -- Trial info
  us.trial_ends_at,
  case when us.status='trialing' and now() <= us.trial_ends_at 
       then extract(days from us.trial_ends_at - now())::int 
       else 0 end as trial_days_remaining
from auth.users u
left join public.user_subscriptions us on us.user_id = u.id
left join public.plans p on p.id = coalesce(us.plan_id,'free');

-- 1003_functions_and_triggers.sql
-- Ensure a row exists in chat_usage for the active period
create or replace function public.fn_ensure_chat_usage_row(p_user uuid)
returns void language plpgsql security definer as $$
declare ps timestamptz; pe timestamptz; cnt int;
begin
  select coalesce(us.current_period_start, date_trunc('month', now())),
         coalesce(us.current_period_end, (date_trunc('month', now()) + interval '1 month' - interval '1 day'))
    into ps, pe
  from public.user_subscriptions us
  where us.user_id = p_user;

  if ps is null then
    ps := date_trunc('month', now());
    pe := date_trunc('month', now()) + interval '1 month' - interval '1 day';
  end if;

  select count(*) into cnt from public.chat_usage
   where user_id = p_user and period_start = ps and period_end = pe;
  if cnt = 0 then
    insert into public.chat_usage(user_id, period_start, period_end, prompts_used) values (p_user, ps, pe, 0);
  end if;
end; $$;

-- Consume one prompt if within quota; returns remaining count (null = unlimited)
create or replace function public.fn_consume_chat_prompt(p_user uuid)
returns int language plpgsql security definer as $$
declare
  plan_id text;
  quota int;
  ps timestamptz; pe timestamptz; used int; remaining int;
  status text;
begin
  perform public.fn_ensure_chat_usage_row(p_user);

  select plan_id,
         case when status='trialing' and now() <= trial_ends_at then 'trialing' else status end,
         (select monthly_chat_quota from public.plans p where p.id = us.plan_id)
  into plan_id, status, quota
  from public.user_subscriptions us
  where us.user_id = p_user;

  if plan_id is null then
    plan_id := 'free';
    quota := (select monthly_chat_quota from public.plans where id='free');
  end if;

  select period_start, period_end into ps, pe
  from public.v_user_entitlements
  where user_id = p_user;

  select prompts_used into used
  from public.chat_usage
  where user_id = p_user and period_start = ps and period_end = pe
  for update;

  if quota is null then
    -- unlimited
    update public.chat_usage set prompts_used = used + 1, updated_at = now()
    where user_id = p_user and period_start = ps and period_end = pe;
    return null;
  else
    remaining := greatest(quota - coalesce(used,0), 0);
    if remaining <= 0 then
      raise exception 'CHAT_QUOTA_EXCEEDED';
    end if;
    update public.chat_usage set prompts_used = used + 1, updated_at = now()
    where user_id = p_user and period_start = ps and period_end = pe;
    return remaining - 1;
  end if;
end; $$;

-- Start 3-day trial of 'casual' at first user profile creation (if no sub row)
create or replace function public.fn_start_trial_if_needed()
returns trigger language plpgsql security definer as $$
declare exists_sub int;
begin
  select count(*) into exists_sub from public.user_subscriptions where user_id = new.id;
  if exists_sub = 0 then
    insert into public.user_subscriptions(user_id, plan_id, status, trial_started_at, trial_ends_at)
    values (new.id, 'casual', 'trialing', now(), now() + interval '3 days')
    on conflict (user_id) do nothing;

    insert into public.subscription_events(user_id, event, details)
    values (new.id, 'trial_started', jsonb_build_object('plan','casual','days',3));

    perform public.fn_ensure_chat_usage_row(new.id);
  end if;
  return new;
end; $$;

-- Attach to your existing public.users table if present; skip if trigger already exists
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='users') then
    if not exists (select 1 from pg_trigger where tgname='trg_users_start_trial') then
      create trigger trg_users_start_trial
      after insert on public.users
      for each row execute function public.fn_start_trial_if_needed();
    end if;
  end if;
end $$;

-- Monthly period rollover (idempotent; schedule via cron monthly)
create or replace function public.fn_subscription_period_rollover()
returns void language plpgsql security definer as $$
declare r record; new_start timestamptz; new_end timestamptz;
begin
  for r in select * from public.user_subscriptions loop
    new_start := date_trunc('month', now());
    new_end   := date_trunc('month', now()) + interval '1 month' - interval '1 day';

    if r.current_period_start < new_start then
      update public.user_subscriptions
         set current_period_start = new_start,
             current_period_end = new_end,
             updated_at = now()
       where user_id = r.user_id;

      -- ensure chat_usage row for new period
      perform public.fn_ensure_chat_usage_row(r.user_id);

      insert into public.subscription_events(user_id, event, details)
      values (r.user_id, 'period_reset', jsonb_build_object('from', r.current_period_start, 'to', new_start));
    end if;
  end loop;
end; $$;
