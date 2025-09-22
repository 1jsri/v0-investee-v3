import { pgTable, text, uuid, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  subscriptionTier: text("subscription_tier").default("free"),
  chatQuotaUsed: integer("chat_quota_used").default(0),
  chatQuotaLimit: integer("chat_quota_limit").default(100),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const portfolioHoldings = pgTable("portfolio_holdings", {
  id: uuid("id").primaryKey(),
  portfolioId: uuid("portfolio_id")
    .references(() => portfolios.id, { onDelete: "cascade" })
    .notNull(),
  assetTicker: text("asset_ticker").notNull(),
  assetName: text("asset_name").notNull(),
  shares: numeric("shares").notNull(),
  investmentAmount: numeric("investment_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  maxPortfolios: integer("max_portfolios").notNull(),
  maxAssets: integer("max_assets").notNull(),
  chatQuota: integer("chat_quota").notNull(),
  billingInterval: text("billing_interval").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const calcSnapshots = pgTable("calc_snapshots", {
  id: uuid("id").primaryKey(),
  portfolioId: uuid("portfolio_id")
    .references(() => portfolios.id, { onDelete: "cascade" })
    .notNull(),
  payload: text("payload"), // jsonb stored as text
  pricesFresh: boolean("prices_fresh").default(false),
  dividendsFresh: boolean("dividends_fresh").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
