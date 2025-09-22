"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PortfolioPerformanceChartProps {
  portfolioId: string
  holdings: any[]
  metrics: any
}

export function PortfolioPerformanceChart({ portfolioId, holdings, metrics }: PortfolioPerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("3M")
  const [performanceData, setPerformanceData] = useState<any[]>([])

  useEffect(() => {
    generatePerformanceData()
  }, [timeRange, holdings])

  const generatePerformanceData = () => {
    // Mock performance data - in real implementation, this would come from historical data
    const days =
      timeRange === "1M" ? 30 : timeRange === "3M" ? 90 : timeRange === "6M" ? 180 : timeRange === "1Y" ? 365 : 730
    const data = []

    const startValue = metrics?.totalInvested || 10000
    let currentValue = startValue

    for (let i = 0; i <= days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))

      // Simulate some volatility
      const dailyChange = (Math.random() - 0.5) * 0.02 // ±1% daily volatility
      currentValue *= 1 + dailyChange

      data.push({
        date: date.toISOString().split("T")[0],
        value: currentValue,
        benchmark: startValue * (1 + (i / days) * 0.08), // 8% annual benchmark
      })
    }

    setPerformanceData(data)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Portfolio Performance</h3>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(["1M", "3M", "6M", "1Y", "ALL"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-xs"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "value" ? "Portfolio Value" : "Benchmark",
              ]}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#1f2937" strokeWidth={3} dot={false} name="value" />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="benchmark"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-slate-600">Total Return</div>
          <div className="text-lg font-semibold text-green-600">
            {metrics ? `+${((metrics.totalValue / metrics.totalInvested - 1) * 100).toFixed(2)}%` : "+0.00%"}
          </div>
        </div>
        <div>
          <div className="text-sm text-slate-600">Annualized Return</div>
          <div className="text-lg font-semibold">8.2%</div>
        </div>
        <div>
          <div className="text-sm text-slate-600">vs Benchmark</div>
          <div className="text-lg font-semibold text-blue-600">+1.4%</div>
        </div>
      </div>
    </Card>
  )
}
