"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DividendHistoryChartProps {
  symbol: string
}

export function DividendHistoryChart({ symbol }: DividendHistoryChartProps) {
  // Mock dividend data - replace with real API data
  const dividendData = [
    { year: "2019", dividend: 0.77, growth: 0 },
    { year: "2020", dividend: 0.82, growth: 6.5 },
    { year: "2021", dividend: 0.87, growth: 6.1 },
    { year: "2022", dividend: 0.91, growth: 4.6 },
    { year: "2023", dividend: 0.96, growth: 5.5 },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Dividend History</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dividendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
              formatter={(value: any, name: string) => [
                name === "dividend" ? `$${value}` : `${value}%`,
                name === "dividend" ? "Annual Dividend" : "Growth Rate",
              ]}
            />
            <Bar dataKey="dividend" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
