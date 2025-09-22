"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { BarChart3 } from "lucide-react"

interface Portfolio {
  id: string
  name: string
  totalValue: number
  totalReturn: number
  dividendYield: number
  monthlyIncome: number
  riskScore: number
}

interface ComparisonMetric {
  name: string
  portfolio1: number
  portfolio2: number
  unit: string
  better: "higher" | "lower"
}

export function PortfolioComparisonTool() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio1, setSelectedPortfolio1] = useState<string>("")
  const [selectedPortfolio2, setSelectedPortfolio2] = useState<string>("")
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPortfolios()
  }, [])

  useEffect(() => {
    if (selectedPortfolio1 && selectedPortfolio2) {
      generateComparison()
    }
  }, [selectedPortfolio1, selectedPortfolio2])

  const loadPortfolios = async () => {
    try {
      const portfoliosWithMetrics = [
        {
          id: "1",
          name: "Dividend Growth Portfolio",
          totalValue: 45250,
          totalReturn: 8.3,
          dividendYield: 2.8,
          monthlyIncome: 187.5,
          riskScore: 6.2,
        },
        {
          id: "2",
          name: "High Yield Income",
          totalValue: 28900,
          totalReturn: 5.7,
          dividendYield: 4.2,
          monthlyIncome: 245.8,
          riskScore: 7.8,
        },
        {
          id: "3",
          name: "Balanced Core Holdings",
          totalValue: 67800,
          totalReturn: 12.1,
          dividendYield: 3.1,
          monthlyIncome: 298.4,
          riskScore: 5.4,
        },
      ]

      setPortfolios(portfoliosWithMetrics)
    } catch (error) {
      console.error("Error loading portfolios:", error)
    }
  }

  const generateComparison = () => {
    setLoading(true)

    // Generate mock comparison data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const data = months.map((month) => ({
      month,
      portfolio1: Math.random() * 1000 + 500,
      portfolio2: Math.random() * 1000 + 500,
    }))

    setComparisonData(data)
    setLoading(false)
  }

  const getSelectedPortfolios = () => {
    const p1 = portfolios.find((p) => p.id === selectedPortfolio1)
    const p2 = portfolios.find((p) => p.id === selectedPortfolio2)
    return { p1, p2 }
  }

  const { p1, p2 } = getSelectedPortfolios()

  const comparisonMetrics: ComparisonMetric[] = [
    {
      name: "Total Value",
      portfolio1: p1?.totalValue || 0,
      portfolio2: p2?.totalValue || 0,
      unit: "$",
      better: "higher",
    },
    {
      name: "Total Return",
      portfolio1: p1?.totalReturn || 0,
      portfolio2: p2?.totalReturn || 0,
      unit: "%",
      better: "higher",
    },
    {
      name: "Dividend Yield",
      portfolio1: p1?.dividendYield || 0,
      portfolio2: p2?.dividendYield || 0,
      unit: "%",
      better: "higher",
    },
    {
      name: "Monthly Income",
      portfolio1: p1?.monthlyIncome || 0,
      portfolio2: p2?.monthlyIncome || 0,
      unit: "$",
      better: "higher",
    },
    {
      name: "Risk Score",
      portfolio1: p1?.riskScore || 0,
      portfolio2: p2?.riskScore || 0,
      unit: "/10",
      better: "lower",
    },
  ]

  const formatValue = (value: number, unit: string) => {
    if (unit === "$") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    return `${value.toFixed(2)}${unit}`
  }

  const getBetterValue = (metric: ComparisonMetric) => {
    if (metric.better === "higher") {
      return metric.portfolio1 > metric.portfolio2 ? "portfolio1" : "portfolio2"
    } else {
      return metric.portfolio1 < metric.portfolio2 ? "portfolio1" : "portfolio2"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Portfolio Comparison</h3>
            <p className="text-slate-600">Compare performance and metrics across your portfolios</p>
          </div>
          <BarChart3 className="h-8 w-8 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio 1</label>
            <Select value={selectedPortfolio1} onValueChange={setSelectedPortfolio1}>
              <SelectTrigger>
                <SelectValue placeholder="Select first portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio 2</label>
            <Select value={selectedPortfolio2} onValueChange={setSelectedPortfolio2}>
              <SelectTrigger>
                <SelectValue placeholder="Select second portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios
                  .filter((p) => p.id !== selectedPortfolio1)
                  .map((portfolio) => (
                    <SelectItem key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {p1 && p2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {comparisonMetrics.map((metric, index) => {
                const better = getBetterValue(metric)
                return (
                  <Card key={index} className="p-4 text-center">
                    <div className="text-sm text-slate-600 mb-2">{metric.name}</div>
                    <div className="space-y-2">
                      <div
                        className={`text-lg font-bold ${better === "portfolio1" ? "text-green-600" : "text-slate-900"}`}
                      >
                        {formatValue(metric.portfolio1, metric.unit)}
                      </div>
                      <div className="text-xs text-slate-400">vs</div>
                      <div
                        className={`text-lg font-bold ${better === "portfolio2" ? "text-green-600" : "text-slate-900"}`}
                      >
                        {formatValue(metric.portfolio2, metric.unit)}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Monthly Income Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(0)}`,
                        name === "portfolio1" ? p1.name : p2.name,
                      ]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="portfolio1" fill="#1f2937" name="portfolio1" />
                    <Bar dataKey="portfolio2" fill="#059669" name="portfolio2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  )
}
