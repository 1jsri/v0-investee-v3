import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { portfolioId, portfolioData } = await request.json()

    if (!portfolioId || !portfolioData) {
      return NextResponse.json({ error: "Portfolio ID and data are required" }, { status: 400 })
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

    // Get user profile to check subscription tier
    const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Check if user has PDF generation access (casual and professional tiers)
    if (profile.subscription_tier === "free") {
      return NextResponse.json(
        { error: "PDF generation requires Casual or Professional subscription" },
        { status: 403 },
      )
    }

    // Generate PDF data (in a real implementation, you'd use a PDF library here)
    const pdfData = {
      portfolioName: portfolioData.name,
      totalValue: portfolioData.totalValue,
      monthlyIncome: portfolioData.monthlyIncome,
      annualIncome: portfolioData.annualIncome,
      holdings: portfolioData.holdings,
      generatedAt: new Date().toISOString(),
      userEmail: user.email,
    }

    // In a real implementation, you would generate an actual PDF here
    // For now, we'll return the data that would be used to generate the PDF
    return NextResponse.json({
      success: true,
      pdfData,
      downloadUrl: `/api/download-pdf/${portfolioId}`, // Mock download URL
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
