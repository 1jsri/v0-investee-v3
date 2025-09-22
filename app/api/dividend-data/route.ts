import { type NextRequest, NextResponse } from "next/server"

const FMP_API_KEY = process.env.FMP_API_KEY
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3"
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

async function getDividendDataFromFinnhub(symbol: string) {
  try {
    console.log(`[v0] Finnhub backup for ${symbol}`)

    const quoteResponse = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const quoteData = await quoteResponse.json()

    const profileResponse = await fetch(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const profileData = await profileResponse.json()

    const dividendResponse = await fetch(
      `${FINNHUB_BASE_URL}/stock/dividend2?symbol=${symbol}&from=2020-01-01&to=2025-12-31&token=${FINNHUB_API_KEY}`,
    )
    const dividendData = await dividendResponse.json()

    let annualDividend = 0
    let dividendYield = 0

    // Calculate annual dividend from dividend2 endpoint data
    if (dividendData && Array.isArray(dividendData)) {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const recentDividends = dividendData
        .filter((div: any) => {
          const divDate = new Date(div.date)
          return divDate >= oneYearAgo && div.amount
        })
        .reduce((sum: number, div: any) => sum + Number.parseFloat(div.amount || 0), 0)

      annualDividend = recentDividends

      if (quoteData.c && quoteData.c > 0 && annualDividend > 0) {
        dividendYield = (annualDividend / quoteData.c) * 100
      }
    }

    console.log(`[v0] Finnhub data for ${symbol}:`, {
      price: quoteData.c,
      dividendYield,
      annualDividend,
      dividendHistoryCount: dividendData?.length || 0,
    })

    return {
      symbol,
      price: quoteData.c || 0,
      previousClose: quoteData.pc || 0,
      change: quoteData.d || 0,
      changePercent: quoteData.dp || 0,
      annualDividend,
      dividendYield,
      companyName: profileData.name || symbol,
      currency: profileData.currency || "USD",
      lastUpdated: new Date().toISOString(),
      hasData: !!(quoteData.c && quoteData.c > 0),
      source: "finnhub",
    }
  } catch (error) {
    console.error(`[v0] Finnhub failed for ${symbol}:`, error)
    return {
      symbol,
      price: 0,
      annualDividend: 0,
      dividendYield: 0,
      companyName: symbol,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      hasData: false,
      error: "Finnhub failed",
      source: "finnhub",
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")

    if (!symbols) {
      return NextResponse.json({ error: "Symbols parameter is required" }, { status: 400 })
    }

    const symbolList = symbols.split(",").filter(Boolean)

    const dividendData = await Promise.all(
      symbolList.map(async (symbol) => {
        let result = null
        let dataSource = "fmp"
        let errorMessage = ""

        if (FMP_API_KEY) {
          try {
            console.log(`[v0] Fetching dividend data from FMP: ${symbol}`)

            // Get quote data
            const quoteResponse = await fetch(`${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`)
            const quoteData = await quoteResponse.json()
            const quote = Array.isArray(quoteData) ? quoteData[0] : quoteData

            // Get company profile
            const profileResponse = await fetch(`${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`)
            const profileData = await profileResponse.json()
            const profile = Array.isArray(profileData) ? profileData[0] : profileData

            // Get dividend data
            const dividendResponse = await fetch(
              `${FMP_BASE_URL}/historical-price-full/stock_dividend/${symbol}?apikey=${FMP_API_KEY}`,
            )
            const dividendData = await dividendResponse.json()

            let annualDividend = 0
            let dividendYield = 0

            // Calculate annual dividend from historical data
            if (dividendData?.historical && Array.isArray(dividendData.historical)) {
              const oneYearAgo = new Date()
              oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

              const recentDividends = dividendData.historical
                .filter((div: any) => {
                  const divDate = new Date(div.date)
                  return divDate >= oneYearAgo && div.dividend
                })
                .reduce((sum: number, div: any) => sum + Number.parseFloat(div.dividend || 0), 0)

              annualDividend = recentDividends

              if (quote?.price && quote.price > 0 && annualDividend > 0) {
                dividendYield = (annualDividend / quote.price) * 100
              }
            }

            console.log(`[v0] FMP data for ${symbol}:`, {
              price: quote?.price,
              dividendYield,
              annualDividend,
              dividendHistoryCount: dividendData?.historical?.length || 0,
            })

            // Check if we got meaningful data
            if (!quote?.price || (annualDividend === 0 && dividendYield === 0)) {
              throw new Error("No meaningful data from FMP")
            }

            result = {
              symbol,
              price: quote.price || 0,
              previousClose: quote.previousClose || 0,
              change: quote.change || 0,
              changePercent: quote.changesPercentage || 0,
              annualDividend,
              dividendYield,
              companyName: profile?.companyName || symbol,
              currency: profile?.currency || "USD",
              lastUpdated: new Date().toISOString(),
              hasData: !!(quote?.price && quote.price > 0),
              source: "fmp",
            }

            console.log(`[v0] Final result for ${symbol}: source=fmp, hasData=true`)
          } catch (error) {
            console.log(`[v0] FMP failed for ${symbol}:`, error)
            errorMessage = "FMP failed, trying Finnhub"

            console.log(`[v0] Attempting Finnhub fallback for ${symbol}`)
            if (FINNHUB_API_KEY) {
              try {
                result = await getDividendDataFromFinnhub(symbol)
                dataSource = "finnhub"
                console.log(`[v0] Finnhub success for ${symbol}:`, result)
              } catch (finnhubError) {
                console.log(`[v0] Finnhub also failed for ${symbol}:`, finnhubError)
                errorMessage = "Both FMP and Finnhub failed"
              }
            }
          }
        } else {
          errorMessage = "FMP_API_KEY not configured, using Finnhub"
          console.log(`[v0] No FMP API key, trying Finnhub for ${symbol}`)

          if (FINNHUB_API_KEY) {
            try {
              result = await getDividendDataFromFinnhub(symbol)
              dataSource = "finnhub"
              console.log(`[v0] Finnhub success for ${symbol}:`, result)
            } catch (finnhubError) {
              console.log(`[v0] Finnhub failed for ${symbol}:`, finnhubError)
              errorMessage = "Finnhub failed and no FMP key"
            }
          }
        }

        // If both failed, return error result
        if (!result) {
          result = {
            symbol,
            price: 0,
            annualDividend: 0,
            dividendYield: 0,
            companyName: symbol,
            currency: "USD",
            lastUpdated: new Date().toISOString(),
            hasData: false,
            error: "No dividends found",
            source: "none",
          }
        }

        if (errorMessage) {
          result.message = errorMessage
        }

        console.log(`[v0] Final result for ${symbol}: source=${result.source}, hasData=${result.hasData}`)
        return result
      }),
    )

    return NextResponse.json({ data: dividendData })
  } catch (error) {
    console.error("[v0] Dividend data error:", error)
    return NextResponse.json({ error: "Failed to fetch dividend data" }, { status: 500 })
  }
}
