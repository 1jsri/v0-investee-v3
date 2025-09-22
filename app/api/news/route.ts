import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get("symbols") || ""
  const category = searchParams.get("category") || "all"

  try {
    const apiKey = process.env.FMP_API_KEY
    if (!apiKey) {
      console.log("[v0] FMP API key not configured, using demo data")
      return NextResponse.json(getDemoNews())
    }

    // Get news for specific symbols or general market news
    const newsUrl = symbols
      ? `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbols}&limit=50&apikey=${apiKey}`
      : `https://financialmodelingprep.com/api/v3/stock_news?limit=50&apikey=${apiKey}`

    const response = await fetch(newsUrl)

    if (!response.ok) {
      console.log("[v0] FMP API error:", response.status, "using demo data")
      return NextResponse.json(getDemoNews())
    }

    const newsData = await response.json()

    if (!Array.isArray(newsData)) {
      console.log("[v0] FMP API returned non-array data, using demo data")
      return NextResponse.json(getDemoNews())
    }

    // Filter by category if specified
    let filteredNews = newsData || []
    if (category !== "all") {
      filteredNews = filteredNews.filter((article: any) => {
        const title = article.title?.toLowerCase() || ""
        const text = article.text?.toLowerCase() || ""

        switch (category) {
          case "dividends":
            return title.includes("dividend") || text.includes("dividend")
          case "earnings":
            return title.includes("earnings") || title.includes("quarterly") || text.includes("earnings")
          case "analysis":
            return title.includes("analysis") || title.includes("rating") || title.includes("target")
          default:
            return true
        }
      })
    }

    // Add sentiment analysis (simplified)
    const enrichedNews = filteredNews.map((article: any) => ({
      ...article,
      sentiment: getSentiment(article.title + " " + article.text),
      category: getCategory(article.title + " " + article.text),
      relevantTickers: extractTickers(article.title + " " + article.text),
    }))

    return NextResponse.json(enrichedNews.slice(0, 20))
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json(getDemoNews())
  }
}

function getDemoNews() {
  return [
    {
      title: "Apple Reports Strong Q4 Earnings, iPhone Sales Beat Expectations",
      text: "Apple Inc. reported better-than-expected quarterly earnings driven by strong iPhone sales and services revenue growth. The company's revenue increased 8% year-over-year.",
      url: "#",
      image: "/placeholder.svg?height=100&width=100",
      publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      site: "MarketWatch",
      sentiment: "bullish",
      category: "earnings",
      relevantTickers: ["AAPL"],
    },
    {
      title: "Microsoft Announces Dividend Increase for Q1 2024",
      text: "Microsoft Corporation announced a 10% increase in its quarterly dividend, reflecting strong cash flow and commitment to returning value to shareholders.",
      url: "#",
      image: "/placeholder.svg?height=100&width=100",
      publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      site: "Reuters",
      sentiment: "bullish",
      category: "dividends",
      relevantTickers: ["MSFT"],
    },
    {
      title: "Market Analysis: Tech Stocks Show Resilience Amid Economic Uncertainty",
      text: "Technology stocks continue to outperform broader market indices as investors seek growth opportunities despite macroeconomic headwinds.",
      url: "#",
      image: "/placeholder.svg?height=100&width=100",
      publishedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      site: "Bloomberg",
      sentiment: "neutral",
      category: "analysis",
      relevantTickers: ["AAPL", "MSFT", "GOOGL"],
    },
    {
      title: "Johnson & Johnson Maintains Strong Dividend Track Record",
      text: "Healthcare giant Johnson & Johnson continues its impressive dividend growth streak, marking 61 consecutive years of dividend increases.",
      url: "#",
      image: "/placeholder.svg?height=100&width=100",
      publishedDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      site: "CNBC",
      sentiment: "bullish",
      category: "dividends",
      relevantTickers: ["JNJ"],
    },
    {
      title: "Coca-Cola Reports Steady Growth in Emerging Markets",
      text: "The Coca-Cola Company reported solid quarterly results with particular strength in emerging market segments, offsetting slower growth in developed markets.",
      url: "#",
      image: "/placeholder.svg?height=100&width=100",
      publishedDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      site: "Financial Times",
      sentiment: "neutral",
      category: "earnings",
      relevantTickers: ["KO"],
    },
  ]
}

function getSentiment(text: string): "bullish" | "bearish" | "neutral" {
  const bullishWords = ["up", "rise", "gain", "positive", "strong", "beat", "exceed", "growth", "increase"]
  const bearishWords = ["down", "fall", "drop", "negative", "weak", "miss", "decline", "loss", "decrease"]

  const lowerText = text.toLowerCase()
  const bullishCount = bullishWords.filter((word) => lowerText.includes(word)).length
  const bearishCount = bearishWords.filter((word) => lowerText.includes(word)).length

  if (bullishCount > bearishCount) return "bullish"
  if (bearishCount > bullishCount) return "bearish"
  return "neutral"
}

function getCategory(text: string): string {
  const lowerText = text.toLowerCase()
  if (lowerText.includes("dividend")) return "dividends"
  if (lowerText.includes("earnings") || lowerText.includes("quarterly")) return "earnings"
  if (lowerText.includes("analysis") || lowerText.includes("rating")) return "analysis"
  return "market"
}

function extractTickers(text: string): string[] {
  const tickerRegex = /\b[A-Z]{1,5}\b/g
  const matches = text.match(tickerRegex) || []
  return [...new Set(matches)].slice(0, 3) // Limit to 3 unique tickers
}
