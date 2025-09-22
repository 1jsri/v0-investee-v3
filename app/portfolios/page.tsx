"use client"

import type React from "react"

import { useState } from "react"
import { PortfolioManager } from "@/components/portfolio-manager"
import { AssetSearch } from "@/components/asset-search"
import { DividendResults } from "@/components/dividend-results"
import { useDividendCalculator } from "@/hooks/use-dividend-calculator"
import { usePortfolioStorage } from "@/hooks/use-portfolio-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Asset } from "@/types/asset"
import type { Portfolio, PortfolioAsset } from "@/types/portfolio"
import { Calculator, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PortfoliosPage() {
  const { currentPortfolio, autoSaveCurrentPortfolio } = usePortfolioStorage()
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [numericAmount, setNumericAmount] = useState(0)
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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

  const handlePortfolioSelect = (portfolio: Portfolio) => {
    // Load portfolio data into calculator
    setNumericAmount(portfolio.totalAmount)
    setInvestmentAmount(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(portfolio.totalAmount),
    )
    setSelectedAssets(portfolio.assets)
    setHasUnsavedChanges(false)

    // Auto-calculate if there's data
    if (portfolio.totalAmount > 0 && portfolio.assets.length > 0) {
      calculateDividends(portfolio.assets, portfolio.totalAmount)
    }
  }

  const handleAssetSelect = (asset: Asset) => {
    if (!selectedAssets.find((a) => a.symbol === asset.symbol)) {
      const newAssets = [...selectedAssets, asset]
      setSelectedAssets(newAssets)
      setHasUnsavedChanges(true)
    }
  }

  const removeAsset = (symbol: string) => {
    const newAssets = selectedAssets.filter((asset) => asset.symbol !== symbol)
    setSelectedAssets(newAssets)
    setHasUnsavedChanges(true)
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "")
    if (numericValue) {
      const num = Number.parseFloat(numericValue)
      setNumericAmount(num)
      setHasUnsavedChanges(true)
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

  const handleSavePortfolio = () => {
    if (currentPortfolio) {
      // Convert assets to portfolio assets with equal allocation
      const portfolioAssets: PortfolioAsset[] = selectedAssets.map((asset) => ({
        ...asset,
        allocation: selectedAssets.length > 0 ? 100 / selectedAssets.length : 0,
      }))

      autoSaveCurrentPortfolio({
        totalAmount: numericAmount,
        assets: portfolioAssets,
      })
      setHasUnsavedChanges(false)
    }
  }

  const handleCalculate = () => {
    if (numericAmount > 0 && selectedAssets.length > 0) {
      calculateDividends(selectedAssets, numericAmount)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Portfolio Manager */}
        <PortfolioManager onPortfolioSelect={handlePortfolioSelect} />

        {/* Calculator Section */}
        {currentPortfolio && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Portfolio Calculator</h2>
              {hasUnsavedChanges && (
                <Button onClick={handleSavePortfolio} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </div>

            {hasUnsavedChanges && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You have unsaved changes to your portfolio. Click "Save Changes" to persist your updates.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Input Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      {currentPortfolio.name}
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
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Add Assets</label>
                      <AssetSearch
                        onAssetSelect={handleAssetSelect}
                        selectedAssets={selectedAssets}
                        placeholder="Search stocks, ETFs, funds..."
                      />
                    </div>

                    {selectedAssets.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Portfolio Assets</label>
                        <div className="space-y-2">
                          {selectedAssets.map((asset) => (
                            <div
                              key={asset.symbol}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-foreground">{asset.displaySymbol}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-48">
                                  {asset.description}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAsset(asset.symbol)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {numericAmount > 0 && selectedAssets.length > 0 && (
                      <Button onClick={handleCalculate} className="w-full" size="lg" disabled={isLoading}>
                        <Calculator className="mr-2 h-4 w-4" />
                        {isLoading ? "Calculating..." : "Calculate Dividends"}
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
        )}
      </div>
    </div>
  )
}
