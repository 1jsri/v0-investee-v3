-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'casual', 'professional')),
  trial_ends_at timestamptz,
  chat_quota_used integer DEFAULT 0,
  chat_quota_limit integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create plans table with billing intervals
CREATE TABLE IF NOT EXISTS public.plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  chat_quota integer DEFAULT 5,
  max_assets integer DEFAULT 2,
  max_portfolios integer DEFAULT 1,
  billing_interval text DEFAULT 'monthly' CHECK (billing_interval IN ('monthly','yearly')),
  created_at timestamptz DEFAULT now()
);

-- Create plan prices table
CREATE TABLE IF NOT EXISTS public.plan_prices (
  plan_id text REFERENCES public.plans(id),
  billing_interval text,
  amount_cents integer,
  currency char(3) DEFAULT 'USD',
  PRIMARY KEY(plan_id, billing_interval)
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolio holdings table
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES public.portfolios(id) ON DELETE CASCADE,
  asset_ticker text NOT NULL,
  asset_name text,
  investment_amount numeric(12,2) DEFAULT 0,
  shares numeric(12,6) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create learn articles table
CREATE TABLE IF NOT EXISTS public.learn_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text,
  content text,
  tags text[],
  published_at timestamptz,
  status text CHECK (status IN ('draft','published')) DEFAULT 'published'
);

-- Create sample portfolios table
CREATE TABLE IF NOT EXISTS public.sample_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create sample portfolio items table
CREATE TABLE IF NOT EXISTS public.sample_portfolio_items (
  sample_id uuid REFERENCES public.sample_portfolios(id) ON DELETE CASCADE,
  asset_ticker text,
  weight_pct numeric(6,3),
  PRIMARY KEY(sample_id, asset_ticker)
);

-- Create calculation snapshots table
CREATE TABLE IF NOT EXISTS public.calc_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES public.portfolios(id) ON DELETE CASCADE,
  payload jsonb,
  prices_fresh boolean DEFAULT true,
  dividends_fresh boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert default plans
INSERT INTO public.plans (id, name, description, chat_quota, max_assets, max_portfolios) VALUES
  ('free', 'Free', 'Perfect for getting started', 5, 2, 1),
  ('casual', 'Casual', 'Great for individual investors', 50, 50, 3),
  ('professional', 'Professional', 'For serious investors', -1, 150, 10)
ON CONFLICT (id) DO NOTHING;

-- Insert plan prices
INSERT INTO public.plan_prices (plan_id, billing_interval, amount_cents, currency) VALUES
  ('casual', 'monthly', 900, 'USD'),
  ('casual', 'yearly', 9000, 'USD'),
  ('professional', 'monthly', 1900, 'USD'),
  ('professional', 'yearly', 19000, 'USD')
ON CONFLICT DO NOTHING;

-- Insert sample portfolios
INSERT INTO public.sample_portfolios (name, description) VALUES
  ('Income Starter', 'A beginner-friendly portfolio focused on stable dividend income'),
  ('Monthly Payers', 'Companies that pay dividends monthly for consistent cash flow'),
  ('High Yield Caution', 'Higher yield stocks with careful risk management')
ON CONFLICT DO NOTHING;

-- Insert sample portfolio items
INSERT INTO public.sample_portfolio_items (sample_id, asset_ticker, weight_pct) 
SELECT sp.id, ticker, weight FROM public.sample_portfolios sp, 
(VALUES 
  ('Income Starter', 'VTI', 40.0),
  ('Income Starter', 'SCHD', 30.0),
  ('Income Starter', 'VYM', 30.0),
  ('Monthly Payers', 'REML', 25.0),
  ('Monthly Payers', 'SPHD', 25.0),
  ('Monthly Payers', 'JEPI', 25.0),
  ('Monthly Payers', 'JEPQ', 25.0),
  ('High Yield Caution', 'QYLD', 20.0),
  ('High Yield Caution', 'RYLD', 20.0),
  ('High Yield Caution', 'XYLD', 20.0),
  ('High Yield Caution', 'SCHD', 20.0),
  ('High Yield Caution', 'VYM', 20.0)
) AS items(portfolio_name, ticker, weight)
WHERE sp.name = items.portfolio_name
ON CONFLICT DO NOTHING;

-- Insert learn articles
INSERT INTO public.learn_articles (slug, title, content, tags, status) VALUES
  ('what-are-dividends', 'What Are Dividends?', 'Dividends are payments made by companies to their shareholders...', ARRAY['basics', 'dividends'], 'published'),
  ('dividend-yield-explained', 'Understanding Dividend Yield', 'Dividend yield is a financial ratio that shows how much...', ARRAY['basics', 'yield'], 'published'),
  ('passive-income-basics', 'Building Passive Income with Dividends', 'Passive income through dividends can provide...', ARRAY['passive-income', 'strategy'], 'published')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calc_snapshots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own portfolios" ON public.portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own holdings" ON public.portfolio_holdings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view own snapshots" ON public.calc_snapshots FOR ALL USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND user_id = auth.uid())
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_tier, trial_ends_at, chat_quota_limit)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'casual',
    now() + interval '3 days',
    50
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.portfolio_holdings FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
