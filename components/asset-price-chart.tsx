"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AssetPriceChartProps {
  symbol: string
}

export function AssetPriceChart({ symbol }: AssetPriceChartProps) {
  const [timeframe, setTimeframe] = useState("1M")

  // Mock price data - replace with real API data
  const priceData = [
    { date: "2024-01-01", price: 145.23, volume: 45000000 },
    { date: "2024-01-02", price: 147.89, volume: 52000000 },
    { date: "2024-01-03", price: 146.12, volume: 48000000 },
    { date: "2024-01-04", price: 149.45, volume: 55000000 },
    { date: "2024-01-05", price: 150.25, volume: 47000000 },
  ]

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y"]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
