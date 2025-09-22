import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const EDUCATIONAL_GUARDRAILS = {
  systemPrompt: `You are an educational AI assistant for Investee, a dividend investing learning platform. Your role is to provide educational information about dividend investing, not financial advice.

STRICT GUIDELINES:
- Provide educational content about dividend investing concepts only
- Never give specific buy/sell recommendations
- Always include disclaimers about not being financial advice
- Focus on teaching dividend fundamentals, terminology, and general strategies
- Redirect specific investment questions to "consult with a financial advisor"
- Keep responses conversational but educational
- Use examples of well-known dividend stocks for educational purposes only
- Emphasize the importance of research and professional advice

TOPICS YOU CAN DISCUSS:
- What dividends are and how they work
- Dividend yield calculations and meanings
- Types of dividend-paying investments (stocks, REITs, ETFs)
- Dividend growth investing concepts
- Portfolio diversification principles
- Risk management basics
- Tax implications of dividends (general information)
- Historical dividend trends and patterns

TOPICS TO AVOID:
- Specific buy/sell recommendations
- Predictions about stock prices or market movements
- Personal financial planning advice
- Tax advice for specific situations
- Guarantees about returns or performance

Always end responses with: "This is educational information only and not financial advice. Please consult with a qualified financial advisor for personalized investment guidance."`,

  forbiddenPhrases: [
    "buy this stock",
    "sell this stock",
    "guaranteed returns",
    "sure thing",
    "can't lose",
    "hot tip",
    "insider information",
    "market crash",
    "get rich quick",
  ],

  requiredDisclaimer:
    "This is educational information only and not financial advice. Please consult with a qualified financial advisor for personalized investment guidance.",
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, assetSymbol, portfolioId, history } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile and check chat quota
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, chat_quota_used, chat_quota_limit")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const quotaLimits = {
      free: 5,
      casual: 50,
      professional: -1, // unlimited
    }

    const userLimit = quotaLimits[profile.subscription_tier as keyof typeof quotaLimits] || 5

    if (userLimit !== -1 && (profile.chat_quota_used || 0) >= userLimit) {
      return NextResponse.json(
        {
          error: "Chat quota exceeded for this month",
          quotaUsed: profile.chat_quota_used || 0,
          quotaLimit: userLimit,
        },
        { status: 429 },
      )
    }

    // Apply content guardrails
    const lowerMessage = message.toLowerCase()
    const containsForbiddenPhrase = EDUCATIONAL_GUARDRAILS.forbiddenPhrases.some((phrase) =>
      lowerMessage.includes(phrase),
    )

    if (containsForbiddenPhrase) {
      return NextResponse.json({
        response:
          "I can't provide specific investment recommendations. Instead, let me help you understand dividend investing concepts! What would you like to learn about dividend investing? " +
          EDUCATIONAL_GUARDRAILS.requiredDisclaimer,
        quotaUsed: profile.chat_quota_used,
        quotaLimit: userLimit,
      })
    }

    // Build educational context
    let contextPrompt = EDUCATIONAL_GUARDRAILS.systemPrompt

    if (context === "portfolio" && portfolioId) {
      // Fetch portfolio data for context
      const { data: portfolio } = await supabase
        .from("portfolios")
        .select(`
          *,
          portfolio_holdings (
            asset_ticker,
            shares,
            purchase_price
          )
        `)
        .eq("id", portfolioId)
        .single()

      if (portfolio) {
        contextPrompt += `\n\nUser's Portfolio Context: ${JSON.stringify(portfolio)}`
      }
    }

    if (context === "asset" && assetSymbol) {
      contextPrompt += `\n\nAsset Context: User is asking about ${assetSymbol}`
    }

    // Generate educational response
    const educationalResponse = generateEducationalResponse(message, context, assetSymbol)

    // Update chat quota
    await supabase
      .from("profiles")
      .update({ chat_quota_used: (profile.chat_quota_used || 0) + 1 })
      .eq("id", user.id)

    return NextResponse.json({
      response: educationalResponse + "\n\n" + EDUCATIONAL_GUARDRAILS.requiredDisclaimer,
      quotaUsed: (profile.chat_quota_used || 0) + 1,
      quotaLimit: userLimit,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

function generateEducationalResponse(message: string, context?: string, assetSymbol?: string): string {
  const lowerMessage = message.toLowerCase()

  // Educational responses based on common dividend investing questions
  if (lowerMessage.includes("dividend yield") || lowerMessage.includes("yield")) {
    return `Dividend yield is a key metric in dividend investing! It's calculated as the annual dividend per share divided by the stock price, expressed as a percentage.

For example, if a stock trades at $100 and pays $4 in annual dividends, the yield is 4%. 

Key points about dividend yield:
- Higher yields aren't always better (could indicate a struggling company)
- Compare yields within the same industry
- Consider dividend growth alongside current yield
- Typical dividend yields range from 1-6% for most stocks`
  }

  if (lowerMessage.includes("dividend growth") || lowerMessage.includes("growth")) {
    return `Dividend growth investing focuses on companies that consistently increase their dividend payments over time. This strategy can help combat inflation and build wealth.

Key concepts:
- Dividend Growth Rate: The annual percentage increase in dividends
- Dividend Aristocrats: S&P 500 companies with 25+ years of consecutive increases
- Dividend Kings: Companies with 50+ years of consecutive increases
- Compound growth: Reinvesting dividends can accelerate wealth building

Look for companies with:
- Strong cash flow generation
- Reasonable payout ratios (typically 40-60%)
- History of consistent increases
- Sustainable business models`
  }

  if (lowerMessage.includes("payout ratio")) {
    return `The payout ratio shows what percentage of a company's earnings are paid out as dividends. It's calculated as: (Dividends per Share / Earnings per Share) × 100

Understanding payout ratios:
- 0-40%: Conservative, room for growth
- 40-60%: Moderate, balanced approach
- 60-80%: Higher, less room for increases
- 80%+: Potentially unsustainable

Different industries have different norms:
- Utilities: Often 60-80% (stable cash flows)
- Tech: Often 20-40% (growth focus)
- REITs: Required to pay out 90%+ of income

A sustainable payout ratio is crucial for dividend reliability.`
  }

  if (lowerMessage.includes("reit") || lowerMessage.includes("real estate")) {
    return `REITs (Real Estate Investment Trusts) are popular dividend investments! They're required by law to distribute at least 90% of their taxable income to shareholders.

Types of REITs:
- Equity REITs: Own and operate income-producing real estate
- Mortgage REITs: Finance real estate through mortgages
- Hybrid REITs: Combination of both

Benefits:
- High dividend yields (often 4-8%)
- Real estate exposure without direct ownership
- Professional management
- Liquidity (can trade like stocks)

Considerations:
- Interest rate sensitivity
- Different tax treatment (ordinary income rates)
- Sector concentration risk
- Economic cycle sensitivity`
  }

  if (lowerMessage.includes("tax") || lowerMessage.includes("taxes")) {
    return `Dividend taxation is an important consideration for investors:

Types of Dividends:
- Qualified Dividends: Taxed at capital gains rates (0%, 15%, or 20%)
- Ordinary Dividends: Taxed at regular income rates (up to 37%)

To qualify for preferential tax treatment:
- Must be from U.S. corporations or qualified foreign companies
- Must hold stock for required holding periods
- REITs typically pay ordinary dividends

Tax-Advantaged Accounts:
- 401(k), IRA, Roth IRA: Dividends grow tax-deferred or tax-free
- Taxable accounts: Consider tax implications in planning

Tax strategies vary by individual situation, so consult with a tax professional for personalized advice.`
  }

  if (assetSymbol) {
    return `Let me share some educational information about ${assetSymbol}:

When analyzing any dividend-paying investment, consider these key factors:

1. Dividend History: Look at the track record of payments and increases
2. Financial Health: Review debt levels, cash flow, and profitability
3. Industry Position: Understand the competitive landscape
4. Payout Sustainability: Ensure dividends are covered by earnings/cash flow
5. Growth Prospects: Consider the company's future potential

For educational purposes, you can research ${assetSymbol} using:
- Company annual reports (10-K filings)
- Quarterly reports (10-Q filings)
- Dividend history on financial websites
- Industry analysis and comparisons

Remember to always do your own research and consider multiple sources when evaluating any investment.`
  }

  // Default educational response
  return `Great question about dividend investing! Here are some key educational concepts that might help:

**Dividend Investing Basics:**
- Dividends are cash payments companies make to shareholders
- They're typically paid quarterly from company profits
- Not all companies pay dividends (growth companies often reinvest profits)

**Key Metrics to Understand:**
- Dividend Yield: Annual dividends ÷ stock price
- Payout Ratio: Dividends ÷ earnings (sustainability measure)
- Dividend Growth Rate: How fast dividends increase over time

**Popular Dividend Strategies:**
- Dividend Growth Investing: Focus on companies that increase dividends
- High Yield Investing: Focus on current income
- Dividend ETFs: Diversified exposure to dividend stocks

What specific aspect of dividend investing would you like to learn more about?`
}
