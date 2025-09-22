import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get unique assets from user's portfolio holdings
    const { data: holdings } = await supabase
      .from("portfolio_holdings")
      .select("asset_ticker, portfolios!inner(user_id)")
      .eq("portfolios.user_id", user.id)

    const uniqueAssets = [...new Set(holdings?.map((h) => h.asset_ticker) || [])]

    return NextResponse.json({ assets: uniqueAssets })
  } catch (error) {
    console.error("User assets API error:", error)
    return NextResponse.json({ error: "Failed to fetch user assets" }, { status: 500 })
  }
}
