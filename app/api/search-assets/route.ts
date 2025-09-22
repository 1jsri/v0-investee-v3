import { type NextRequest, NextResponse } from "next/server"

const FMP_API_KEY = process.env.FMP_API_KEY
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3"
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

async function searchWithFinnhub(query: string) {
  try {
    console.log(`[v0] Using Finnhub backup for search: ${query}`)
    const response = await fetch(`${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`)
    }

    const data = await response.json()
    const formattedResults =
      data.result
        ?.filter((asset: any) => asset.symbol && asset.description)
        ?.slice(0, 10)
        ?.map((asset: any) => ({
          symbol: asset.symbol,
          description: asset.description,
          displaySymbol: asset.displaySymbol || asset.symbol,
          type: asset.type || "Unknown",
          currency: asset.currency,
          exchange: asset.exchange,
          source: "finnhub",
        })) || []

    console.log(`[v0] Finnhub returned ${formattedResults.length} results`)
    return formattedResults
  } catch (error) {
    console.error("[v0] Finnhub search failed:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ count: 0, result: [] })
    }

    let results = []
    let dataSource = "fmp"
    let errorMessage = ""

    if (FMP_API_KEY) {
      try {
        console.log(`[v0] Searching with FMP: ${query}`)
        const response = await fetch(
          `${FMP_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_API_KEY}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            next: { revalidate: 300 },
          },
        )

        if (!response.ok) {
          throw new Error(`FMP API error: ${response.status}`)
        }

        const data = await response.json()
        console.log(`[v0] FMP returned ${data?.length || 0} results`)

        results =
          data
            ?.filter((asset: any) => asset.symbol && asset.name)
            ?.slice(0, 10)
            ?.map((asset: any) => ({
              symbol: asset.symbol,
              description: asset.name,
              displaySymbol: asset.symbol,
              type: asset.exchangeShortName === "NASDAQ" || asset.exchangeShortName === "NYSE" ? "Stock" : "ETF",
              currency: asset.currency || "USD",
              exchange: asset.exchangeShortName || "Unknown",
              source: "fmp",
            })) || []

        if (results.length === 0) {
          throw new Error("No results from FMP")
        }
      } catch (error) {
        console.error("[v0] FMP search failed:", error)
        errorMessage = "No data from FMP, using Finnhub"

        if (FINNHUB_API_KEY) {
          results = await searchWithFinnhub(query)
          dataSource = "finnhub"
        }
      }
    } else {
      errorMessage = "FMP_API_KEY not configured, using Finnhub"

      if (FINNHUB_API_KEY) {
        results = await searchWithFinnhub(query)
        dataSource = "finnhub"
      } else {
        return NextResponse.json(
          {
            error: "FMP_API_KEY is not configured and no Finnhub backup available. Please add your FMP API key.",
            requiresApiKey: true,
          },
          { status: 400 },
        )
      }
    }

    console.log(`[v0] Final search results: ${results.length} from ${dataSource}`)

    return NextResponse.json({
      count: results.length,
      result: results,
      dataSource,
      message: errorMessage || undefined,
    })
  } catch (error) {
    console.error("[v0] Asset search error:", error)
    return NextResponse.json({ error: "Failed to search assets" }, { status: 500 })
  }
}
