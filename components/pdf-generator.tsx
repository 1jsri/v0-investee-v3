"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Download,
  FileText,
  Share2,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  Star,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Portfolio {
  id: string
  name: string
  description?: string
  holdings: Array<{
    id: string
    asset_ticker: string
    asset_name?: string
    investment_amount: number
    shares: number
  }>
}

interface PDFGeneratorProps {
  portfolio: Portfolio
  userTier: "free" | "casual" | "professional"
  className?: string
}

export function PDFGenerator({ portfolio, userTier, className }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getPortfolioAnalytics = () => {
    const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.investment_amount, 0)
    const monthlyIncome = portfolio.holdings.reduce((sum, h) => sum + (h.investment_amount * 0.04) / 12, 0)
    const annualIncome = monthlyIncome * 12
    const yieldValue = totalValue > 0 ? (annualIncome / totalValue) * 100 : 0

    return {
      totalValue,
      monthlyIncome,
      annualIncome,
      yield: yieldValue,
      assetCount: portfolio.holdings.length,
    }
  }

  const analytics = getPortfolioAnalytics()

  const generatePDF = async () => {
    if (userTier === "free") {
      setGenerationStatus("error")
      setErrorMessage("PDF generation requires Casual or Professional subscription")
      return
    }

    setIsGenerating(true)
    setGenerationStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          portfolioData: {
            name: portfolio.name,
            description: portfolio.description,
            totalValue: analytics.totalValue,
            monthlyIncome: analytics.monthlyIncome,
            annualIncome: analytics.annualIncome,
            yield: analytics.yield,
            holdings: portfolio.holdings.map((h) => ({
              ticker: h.asset_ticker,
              name: h.asset_name,
              investment: h.investment_amount,
              shares: h.shares,
              monthlyIncome: (h.investment_amount * 0.04) / 12,
              annualIncome: h.investment_amount * 0.04,
            })),
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate PDF")
      }

      const result = await response.json()

      if (result.success) {
        setGenerationStatus("success")
        // In a real implementation, you would trigger the download here
        // For now, we'll simulate a successful generation
        setTimeout(() => {
          // Simulate PDF download
          const link = document.createElement("a")
          link.href = "#" // In real implementation, this would be the PDF blob URL
          link.download = `${portfolio.name.replace(/\s+/g, "_")}_Portfolio_Report.pdf`
          // link.click() // Uncomment when actual PDF is generated
          console.log("PDF would be downloaded:", link.download)
        }, 1000)
      } else {
        throw new Error("PDF generation failed")
      }
    } catch (error) {
      console.error("PDF generation error:", error)
      setGenerationStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  const sharePDF = () => {
    if (navigator.share) {
      navigator.share({
        title: `${portfolio.name} - Portfolio Report`,
        text: `Check out my dividend portfolio: ${portfolio.name}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Portfolio link copied to clipboard!")
    }
  }

  const emailPDF = () => {
    const subject = encodeURIComponent(`${portfolio.name} - Portfolio Report`)
    const body = encodeURIComponent(`
Hi,

I wanted to share my dividend portfolio report with you:

Portfolio: ${portfolio.name}
Total Investment: ${formatCurrency(analytics.totalValue)}
Annual Dividend Income: ${formatCurrency(analytics.annualIncome)}
Dividend Yield: ${analytics.yield.toFixed(2)}%
Number of Holdings: ${analytics.assetCount}

This report was generated using Investee - your dividend investing companion.

Best regards
    `)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <Card className={cn("p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Portfolio Report</h3>
              <p className="text-sm text-gray-600">Professional PDF report for sharing</p>
            </div>
          </div>
          {userTier !== "free" && (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              {userTier === "professional" ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Feature
                </>
              ) : (
                <>
                  <Star className="h-3 w-3 mr-1" />
                  Casual Feature
                </>
              )}
            </Badge>
          )}
        </div>

        {/* Portfolio Preview */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-black mb-3">Report Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Portfolio Name</span>
                <span className="font-medium text-black">{portfolio.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Investment</span>
                <span className="font-medium text-black">{formatCurrency(analytics.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Holdings</span>
                <span className="font-medium text-black">{analytics.assetCount} assets</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Income</span>
                <span className="font-medium text-green-600">{formatCurrency(analytics.annualIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend Yield</span>
                <span className="font-medium text-green-600">{analytics.yield.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Generated</span>
                <span className="font-medium text-black">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {generationStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              PDF report generated successfully! Your download should start automatically.
            </AlertDescription>
          </Alert>
        )}

        {generationStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {userTier === "free" && (
          <Alert className="border-orange-200 bg-orange-50">
            <Crown className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <span>PDF reports are available with Casual and Professional plans</span>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white ml-4">
                  Upgrade Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Report Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-black">Report Includes:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span>Portfolio overview & metrics</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Dividend income projections</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span>Asset allocation breakdown</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span>Performance analytics</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={generatePDF}
            disabled={isGenerating || userTier === "free"}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate PDF Report
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={sharePDF}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            onClick={emailPDF}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>

        {/* Professional Features */}
        {userTier === "professional" && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-800">Professional Features</span>
            </div>
            <div className="text-sm text-purple-700 space-y-1">
              <div>• Custom branding and logo</div>
              <div>• Advanced analytics and charts</div>
              <div>• White-label reports for clients</div>
              <div>• Automated monthly reports</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
