"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, Calendar } from "lucide-react"

interface Holding {
  id: string
  asset_ticker: string
  asset_name?: string
  investment_amount: number
  shares: number
}

interface ProjectedReturnsChartProps {
  holdings: Holding[]
}

export function ProjectedReturnsChart({ holdings }: ProjectedReturnsChartProps) {
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (holdings.length === 0) {
      setProjectionData([])
      return
    }

    const generateProjections = async () => {
      setIsLoading(true)

      try {
        const dividendPromises = holdings.map(async (holding) => {
          const response = await fetch(`/api/dividend-data?symbols=${holding.asset_ticker}`)
          const data = await response.json()
          return {
            ticker: holding.asset_ticker,
            dividendData: data.result?.[0] || null,
            investment: holding.investment_amount,
          }
        })

        const dividendResults = await Promise.all(dividendPromises)

        const currentYear = new Date().getFullYear()
        const projections = []

        for (let year = 0; year <= 10; year++) {
          const yearData = {
            year: currentYear + year,
            yearLabel: year === 0 ? "Current" : `Year ${year}`,
            totalDividends: 0,
            totalValue: 0,
            assets: {} as any,
          }

          dividendResults.forEach((result) => {
            if (result.dividendData) {
              // Use real dividend yield and apply conservative growth
              const currentYield = result.dividendData.dividendYield || 0.03
              const growthRate = 0.03 // Conservative 3% annual growth

              const currentValue = result.investment * Math.pow(1 + growthRate, year)
              const annualDividend = currentValue * (currentYield / 100)

              yearData.totalDividends += annualDividend
              yearData.totalValue += currentValue
              yearData.assets[result.ticker] = {
                dividend: annualDividend,
                value: currentValue,
              }
            }
          })

          projections.push(yearData)
        }

        setProjectionData(projections)
      } catch (error) {
        console.error("Error generating projections:", error)
        // Fallback to conservative estimates if API fails
        const fallbackProjections = []
        const currentYear = new Date().getFullYear()

        for (let year = 0; year <= 10; year++) {
          const yearData = {
            year: currentYear + year,
            yearLabel: year === 0 ? "Current" : `Year ${year}`,
            totalDividends: 0,
            totalValue: 0,
            assets: {} as any,
          }

          holdings.forEach((holding) => {
            const conservativeYield = 0.035 // 3.5% conservative estimate
            const growthRate = 0.025 // 2.5% conservative growth

            const currentValue = holding.investment_amount * Math.pow(1 + growthRate, year)
            const annualDividend = currentValue * conservativeYield

            yearData.totalDividends += annualDividend
            yearData.totalValue += currentValue
            yearData.assets[holding.asset_ticker] = {
              dividend: annualDividend,
              value: currentValue,
            }
          })

          fallbackProjections.push(yearData)
        }

        setProjectionData(fallbackProjections)
      } finally {
        setIsLoading(false)
      }
    }

    generateProjections()
  }, [holdings])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalInvestment = holdings.reduce((sum, h) => sum + h.investment_amount, 0)
  const currentYearProjection = projectionData[0]
  const tenYearProjection = projectionData[10]

  if (holdings.length === 0) {
    return (
      <Card className="p-8 border border-gray-200 bg-white shadow-sm text-center">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-black mb-2">Add Assets to See Projections</h3>
        <p className="text-gray-600">Start building your portfolio to view projected dividend returns over time</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Invested</p>
              <p className="text-2xl font-bold text-black">{formatCurrency(totalInvestment)}</p>
            </div>
            <DollarSign className="h-6 w-6 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4 border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Est. Annual Dividends</p>
              <p className="text-2xl font-bold text-green-600">
                {currentYearProjection ? formatCurrency(currentYearProjection.totalDividends) : "$0"}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">10-Year Projection</p>
              <p className="text-2xl font-bold text-blue-600">
                {tenYearProjection ? formatCurrency(tenYearProjection.totalDividends) : "$0"}
              </p>
            </div>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Projection Chart */}
      <Card className="p-6 border border-gray-200 bg-white shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">Projected Annual Dividend Income</h3>
          <p className="text-gray-600 text-sm">
            Based on your current portfolio allocation and estimated dividend growth
          </p>
        </div>

        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="yearLabel" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Annual Dividends"]}
                  labelStyle={{ color: "#000" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalDividends"
                  stroke="#000"
                  strokeWidth={3}
                  dot={{ fill: "#000", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#000", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          * Projections are estimates based on historical dividend yields and growth rates. Actual results may vary.
        </div>
      </Card>
    </div>
  )
}
