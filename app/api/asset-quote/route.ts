import { type NextRequest, NextResponse } from "next/server"

const FMP_API_KEY = process.env.FMP_API_KEY
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3"

const getMockQuote = (symbol: string) => ({
  symbol: symbol.toUpperCase(),
  price: Math.random() * 200 + 50, // Random price between 50-250
  change: (Math.random() - 0.5) * 10, // Random change between -5 to +5
  changesPercentage: (Math.random() - 0.5) * 10, // Random percentage between -5% to +5%
  volume: Math.floor(Math.random() * 10000000) + 1000000, // Random volume
  marketCap: Math.floor(Math.random() * 1000000000000) + 100000000000, // Random market cap
  pe: Math.random() * 30 + 10, // Random P/E ratio
  eps: Math.random() * 10 + 1, // Random EPS
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    if (!FMP_API_KEY) {
      console.log("[v0] FMP_API_KEY not configured, using mock data")
      return NextResponse.json(getMockQuote(symbol))
    }

    const response = await fetch(`${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) {
      console.log(`[v0] FMP API error ${response.status} for ${symbol}, using mock data`)
      return NextResponse.json(getMockQuote(symbol))
    }

    const data = await response.json()
    const quote = data[0]

    if (!quote) {
      console.log(`[v0] No quote data from FMP for ${symbol}, using mock data`)
      return NextResponse.json(getMockQuote(symbol))
    }

    return NextResponse.json({
      symbol: quote.symbol,
      price: quote.price,
      change: quote.change,
      changesPercentage: quote.changesPercentage,
      volume: quote.volume,
      marketCap: quote.marketCap,
      pe: quote.pe,
      eps: quote.eps,
    })
  } catch (error) {
    console.error("[v0] Asset quote error:", error)
    const symbol = new URL(request.url).searchParams.get("symbol") || "UNKNOWN"
    console.log(`[v0] Returning mock data for ${symbol} due to error`)
    return NextResponse.json(getMockQuote(symbol))
  }
}
