"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AssetSearch } from "@/components/asset-search"
import { DividendResults } from "@/components/dividend-results"
import { useDividendCalculator } from "@/hooks/use-dividend-calculator"
import type { Asset } from "@/types/asset"
import { Calculator, DollarSign, X, RefreshCw } from "lucide-react"

export default function CalculatorPage() {
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([])
  const [numericAmount, setNumericAmount] = useState(0)

  const {
    calculations,
    totalAnnualDividend,
    totalMonthlyDividend,
    totalInvestment,
    averageYield,
    isLoading,
    error,
    calculateDividends,
  } = useDividendCalculator()

  const handleAssetSelect = (asset: Asset) => {
    if (!selectedAssets.find((a) => a.symbol === asset.symbol)) {
      setSelectedAssets((prev) => [...prev, asset])
    }
  }

  const removeAsset = (symbol: string) => {
    setSelectedAssets((prev) => prev.filter((asset) => asset.symbol !== symbol))
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "")
    if (numericValue) {
      const num = Number.parseFloat(numericValue)
      setNumericAmount(num)
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num)
      return formatted
    }
    setNumericAmount(0)
    return ""
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setInvestmentAmount(formatted)
  }

  const handleCalculate = () => {
    console.log("[v0] Manual calculate triggered:", { numericAmount, selectedAssetsCount: selectedAssets.length })
    if (numericAmount > 0 && selectedAssets.length > 0) {
      console.log("[v0] Executing manual calculateDividends")
      calculateDividends(selectedAssets, numericAmount)
    }
  }

  // Auto-calculate when inputs change
  useEffect(() => {
    console.log("[v0] Auto-calculate triggered:", { numericAmount, selectedAssetsCount: selectedAssets.length })
    if (numericAmount > 0 && selectedAssets.length > 0) {
      console.log("[v0] Starting auto-calculation with debounce")
      const timeoutId = setTimeout(() => {
        console.log("[v0] Executing calculateDividends:", {
          assets: selectedAssets.map((a) => a.symbol),
          amount: numericAmount,
        })
        calculateDividends(selectedAssets, numericAmount)
      }, 1000) // Debounce for 1 second

      return () => clearTimeout(timeoutId)
    } else {
      console.log("[v0] Auto-calculate conditions not met")
    }
  }, [numericAmount, selectedAssets, calculateDividends])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dividend Calculator</h1>
        <p className="text-muted-foreground">Calculate your potential dividend income with real-time market data</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Investment Amount</label>
                <Input
                  type="text"
                  placeholder="$10,000"
                  value={investmentAmount}
                  onChange={handleAmountChange}
                  className="text-lg h-12"
                />
                <p className="text-xs text-muted-foreground">Enter the total amount you want to invest</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search Assets</label>
                <AssetSearch
                  onAssetSelect={handleAssetSelect}
                  selectedAssets={selectedAssets}
                  placeholder="Search stocks, ETFs, funds..."
                />
                <p className="text-xs text-muted-foreground">
                  Add multiple assets to diversify your dividend portfolio
                </p>
              </div>

              {/* Selected Assets */}
              {selectedAssets.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Selected Assets</label>
                  <div className="space-y-2">
                    {selectedAssets.map((asset) => (
                      <div key={asset.symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{asset.displaySymbol}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-48">{asset.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAsset(asset.symbol)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {numericAmount > 0 && selectedAssets.length > 0 && (
                <Button onClick={handleCalculate} className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Calculate Dividends
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
          <DividendResults
            calculations={calculations}
            totalAnnualDividend={totalAnnualDividend}
            totalMonthlyDividend={totalMonthlyDividend}
            totalInvestment={totalInvestment}
            averageYield={averageYield}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
