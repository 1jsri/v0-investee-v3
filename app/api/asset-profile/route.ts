import { type NextRequest, NextResponse } from "next/server"

const FMP_API_KEY = process.env.FMP_API_KEY
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    if (!FMP_API_KEY) {
      return NextResponse.json({ error: "FMP_API_KEY not configured" }, { status: 500 })
    }

    const response = await fetch(`${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }

    const data = await response.json()
    const profile = data[0]

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      symbol: profile.symbol,
      companyName: profile.companyName,
      image: profile.image,
      sector: profile.sector,
      industry: profile.industry,
      website: profile.website,
      description: profile.description,
      mktCap: profile.mktCap,
      lastDiv: profile.lastDiv,
      beta: profile.beta,
      pe: profile.pe,
      eps: profile.eps,
      revenue: profile.revenue,
      fullTimeEmployees: profile.fullTimeEmployees,
      ipoDate: profile.ipoDate,
    })
  } catch (error) {
    console.error("[v0] Asset profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
