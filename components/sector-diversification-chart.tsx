"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Holding {
  id: string
  asset_ticker: string
  asset_name: string
  investment_amount: number
  shares: number
}

interface SectorDiversificationChartProps {
  holdings: Holding[]
}

export function SectorDiversificationChart({ holdings }: SectorDiversificationChartProps) {
  // Mock sector data - in real implementation, this would come from asset profile API
  const sectorMapping: Record<string, string> = {
    AAPL: "Technology",
    MSFT: "Technology",
    GOOGL: "Technology",
    AMZN: "Consumer Discretionary",
    TSLA: "Consumer Discretionary",
    JNJ: "Healthcare",
    PFE: "Healthcare",
    JPM: "Financials",
    BAC: "Financials",
    XOM: "Energy",
    CVX: "Energy",
    PG: "Consumer Staples",
    KO: "Consumer Staples",
    VTI: "Diversified",
    SPY: "Diversified",
    QQQ: "Technology",
  }

  const totalValue = holdings.reduce((sum, holding) => sum + holding.investment_amount, 0)

  const sectorData = holdings.reduce(
    (acc, holding) => {
      const sector = sectorMapping[holding.asset_ticker] || "Other"
      if (!acc[sector]) {
        acc[sector] = 0
      }
      acc[sector] += holding.investment_amount
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(sectorData)
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: ((value / totalValue) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (holdings.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sector Diversification</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">No data to display</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sector Diversification</h3>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis type="category" dataKey="sector" width={80} stroke="#64748b" fontSize={12} />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Value"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="#1f2937" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {chartData.map((item) => (
          <div key={item.sector} className="flex justify-between">
            <span className="text-slate-600">{item.sector}</span>
            <span className="font-semibold">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
