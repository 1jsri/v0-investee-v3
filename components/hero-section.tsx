"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Calculator, AlertTriangle, Play, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AssetSearch } from "@/components/asset-search"
import { useDividendCalculator } from "@/hooks/use-dividend-calculator"
import { debounce } from "lodash"

export function HeroSection() {
  const [investmentAmount, setInvestmentAmount] = useState(1000)
  const [selectedAssets, setSelectedAssets] = useState<any[]>([])
  const router = useRouter()

  const { calculateDividends, calculations, totalAnnualDividend, isLoading, error } = useDividendCalculator()

  const debouncedCalculate = useCallback(
    debounce((amount: number, assets: any[]) => {
      console.log("[v0] Hero calculator - amount:", amount, "assets:", assets)
      if (amount > 0 && assets.length > 0) {
        console.log("[v0] Triggering calculation for:", { amount, assets })
        calculateDividends(assets, amount)
      }
    }, 500),
    [calculateDividends],
  )

  useEffect(() => {
    console.log("[v0] Effect triggered - amount:", investmentAmount, "assets:", selectedAssets)
    debouncedCalculate(investmentAmount, selectedAssets)
  }, [investmentAmount, selectedAssets, debouncedCalculate])

  const handleSliderChange = (value: number[]) => {
    console.log("[v0] Slider changed to:", value[0])
    setInvestmentAmount(value[0])
  }

  const handleAssetSelect = (asset: any) => {
    console.log("[v0] Asset selected:", asset)
    const assetWithDefaults = {
      symbol: asset.symbol || asset.ticker,
      name: asset.name || asset.companyName,
      type: asset.type || "stock",
      ...asset,
    }

    if (!selectedAssets.find((a) => a.symbol === assetWithDefaults.symbol)) {
      const newAssets = [assetWithDefaults]
      console.log("[v0] Setting new assets:", newAssets)
      setSelectedAssets(newAssets)

      if (investmentAmount > 0) {
        console.log("[v0] Immediately calculating for new asset")
        calculateDividends(newAssets, investmentAmount)
      }
    }
  }

  const handleAssetRemove = (symbol: string) => {
    console.log("[v0] Removing asset:", symbol)
    setSelectedAssets(selectedAssets.filter((a) => a.symbol !== symbol))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDividend = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const scrollToCalculator = () => {
    if (typeof document !== "undefined") {
      const calculatorSection = document.getElementById("calculator-preview")
      calculatorSection?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const totalMonthly = totalAnnualDividend / 12

  console.log("[v0] Current state - calculations:", calculations, "totalAnnual:", totalAnnualDividend)

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-black/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-900/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8 sm:mb-12 flex justify-center">
          <Alert className="border-2 border-gray-900 bg-gray-50 max-w-4xl shadow-lg">
            <AlertTriangle className="h-5 w-5 text-gray-900" />
            <AlertDescription className="text-sm font-medium text-gray-900">
              Educational tool only. Not financial advice. Always consult professionals for investment decisions.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex flex-col items-center justify-center gap-12 lg:gap-16">
          <div className="text-center space-y-8 sm:space-y-10 max-w-4xl">
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
                Learn How
                <br />
                <span className="relative inline-block">
                  Dividends Work
                  <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-black" />
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Ever wondered how people make money while they sleep? Discover dividend investing - where companies pay
                you just for owning their stock. No complex trading required.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-black">Perfect if you're:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700 text-center text-sm">New to investing</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700 text-center text-sm">Want passive income</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700 text-center text-sm">Building for the future</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700 text-center text-sm">Learning about money</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-8 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                onClick={() => router.push("/signup")}
              >
                <Play className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Start Learning Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-black text-black bg-white hover:bg-gray-50 text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-8 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                onClick={scrollToCalculator}
              >
                <Calculator className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Try Calculator Below
              </Button>
            </div>
          </div>

          <div className="w-full flex justify-center" id="calculator-preview">
            <Card className="p-6 sm:p-8 lg:p-10 shadow-2xl border-2 border-black bg-white max-w-lg w-full transform hover:scale-105 transition-all duration-300">
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">See Your Potential</h3>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Pick a stock and investment amount to see potential monthly income
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-base sm:text-lg font-semibold text-black">How much to invest?</label>
                      <div className="text-2xl sm:text-3xl font-bold text-black">
                        {formatCurrency(investmentAmount)}
                      </div>
                    </div>
                    <Slider
                      value={[investmentAmount]}
                      onValueChange={handleSliderChange}
                      max={10000}
                      min={20}
                      step={20}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>$20</span>
                      <span>$10,000</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-base sm:text-lg font-semibold text-black">Pick a dividend stock</label>
                    <AssetSearch
                      onAssetSelect={handleAssetSelect}
                      selectedAssets={selectedAssets}
                      onAssetRemove={handleAssetRemove}
                      placeholder="Try AAPL, KO, JNJ, or SCHD..."
                      className="text-base sm:text-lg h-14 sm:h-16 border-2 border-gray-300 focus:border-black rounded-xl"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 sm:p-8 rounded-xl space-y-4 sm:space-y-6">
                    <h4 className="text-base sm:text-lg font-bold text-black text-center">
                      💰 Your Potential Monthly Income
                    </h4>
                    {isLoading ? (
                      <div className="text-center text-gray-500 py-6">
                        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-3"></div>
                        <div className="text-base sm:text-lg">Calculating...</div>
                      </div>
                    ) : selectedAssets.length === 0 ? (
                      <div className="text-center text-gray-500 py-6">
                        <div className="text-base sm:text-lg">👆 Select a stock above to see potential income</div>
                      </div>
                    ) : error ? (
                      <div className="text-center text-red-600 py-6">
                        <div className="text-base sm:text-lg">Unable to calculate. Try a different stock.</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-3">
                          {totalMonthly > 0 ? formatDividend(totalMonthly) : "$0.00"}
                        </div>
                        <div className="text-base sm:text-lg text-gray-600 mb-4">per month</div>
                        <div className="text-xl sm:text-2xl text-black font-semibold">
                          {totalAnnualDividend > 0 ? formatDividend(totalAnnualDividend) : "$0.00"} per year
                        </div>
                        {calculations && calculations.length > 0 && calculations[0]?.dividendYield && (
                          <div className="text-sm text-gray-600 mt-3">
                            Based on {(calculations[0].dividendYield * 100).toFixed(2)}% annual yield
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
