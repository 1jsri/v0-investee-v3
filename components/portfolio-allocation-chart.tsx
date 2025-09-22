"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Holding {
  id: string
  asset_ticker: string
  asset_name: string
  investment_amount: number
  shares: number
}

interface PortfolioAllocationChartProps {
  holdings: Holding[]
}

export function PortfolioAllocationChart({ holdings }: PortfolioAllocationChartProps) {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.investment_amount, 0)

  const allocationData = holdings.map((holding, index) => ({
    name: holding.asset_ticker,
    value: holding.investment_amount,
    percentage: ((holding.investment_amount / totalValue) * 100).toFixed(1),
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }))

  const COLORS = [
    "#1f2937",
    "#059669",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
  ]

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
        <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">No assets to display</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Value"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {allocationData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{item.percentage}%</div>
              <div className="text-slate-500 text-xs">{formatCurrency(item.value)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
