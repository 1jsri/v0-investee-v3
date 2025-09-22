"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { PieChartIcon, BarChart3, TrendingUp, DollarSign } from "lucide-react"

interface DividendCalculation {
  symbol: string
  companyName: string
  investmentAmount: number
  shares: number
  annualDividend: number
  monthlyDividend: number
  dividendYield: number
  price: number
  hasData: boolean
  error?: string
}

interface DividendChartsProps {
  calculations: DividendCalculation[]
  totalAnnualDividend: number
  totalInvestment: number
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210, 100%, 60%)",
  "hsl(280, 100%, 60%)",
  "hsl(45, 100%, 60%)",
  "hsl(120, 100%, 40%)",
  "hsl(0, 100%, 60%)",
]

export function DividendCharts({ calculations, totalAnnualDividend, totalInvestment }: DividendChartsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(1)}%`
  }

  // Prepare data for charts
  const validCalculations = calculations.filter((calc) => calc.hasData && calc.annualDividend > 0)

  if (validCalculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Charts will appear when dividend data is available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pie chart data for dividend allocation
  const pieData = validCalculations.map((calc, index) => ({
    name: calc.symbol,
    value: calc.annualDividend,
    percentage: ((calc.annualDividend / totalAnnualDividend) * 100).toFixed(1),
    color: CHART_COLORS[index % CHART_COLORS.length],
    companyName: calc.companyName,
    yield: calc.dividendYield,
  }))

  // Bar chart data for dividend comparison
  const barData = validCalculations.map((calc, index) => ({
    symbol: calc.symbol,
    annual: calc.annualDividend,
    monthly: calc.monthlyDividend,
    yield: calc.dividendYield,
    investment: calc.investmentAmount,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }))

  // Investment vs Dividend data
  const investmentData = validCalculations.map((calc, index) => ({
    symbol: calc.symbol,
    investment: calc.investmentAmount,
    dividend: calc.annualDividend,
    roi: ((calc.annualDividend / calc.investmentAmount) * 100).toFixed(1),
    color: CHART_COLORS[index % CHART_COLORS.length],
  }))

  // Monthly projection data (simulated for 12 months)
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString("en-US", { month: "short" }),
    dividend: totalAnnualDividend / 12,
    cumulative: ((i + 1) * totalAnnualDividend) / 12,
  }))

  return (
    <div className="space-y-6">
      {/* Portfolio Allocation Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Dividend Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              dividend: {
                label: "Annual Dividend",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="space-y-2">
                            <div className="font-semibold">{data.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-48">{data.companyName}</div>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-4">
                                <span>Annual Dividend:</span>
                                <span className="font-medium">{formatCurrency(data.value)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Percentage:</span>
                                <span className="font-medium">{data.percentage}%</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Yield:</span>
                                <span className="font-medium">{formatPercent(data.yield)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dividend Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dividend Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              annual: {
                label: "Annual Dividend",
                color: "hsl(var(--chart-1))",
              },
              yield: {
                label: "Dividend Yield",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="symbol" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="space-y-2">
                            <div className="font-semibold">{label}</div>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-4">
                                <span>Annual Dividend:</span>
                                <span className="font-medium">{formatCurrency(data.annual)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Monthly Dividend:</span>
                                <span className="font-medium">{formatCurrency(data.monthly)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Dividend Yield:</span>
                                <span className="font-medium">{formatPercent(data.yield)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Investment:</span>
                                <span className="font-medium">{formatCurrency(data.investment)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar yAxisId="left" dataKey="annual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Investment vs Return Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Investment vs Annual Return
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              investment: {
                label: "Investment Amount",
                color: "hsl(var(--chart-3))",
              },
              dividend: {
                label: "Annual Dividend",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="symbol" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="space-y-2">
                            <div className="font-semibold">{label}</div>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-4">
                                <span>Investment:</span>
                                <span className="font-medium">{formatCurrency(data.investment)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Annual Dividend:</span>
                                <span className="font-medium">{formatCurrency(data.dividend)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>ROI:</span>
                                <span className="font-medium">{data.roi}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="investment" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dividend" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-3" />
              <span>Investment Amount</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <span>Annual Dividend</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Projection Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Dividend Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              dividend: {
                label: "Monthly Dividend",
                color: "hsl(var(--chart-1))",
              },
              cumulative: {
                label: "Cumulative Dividend",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="space-y-2">
                            <div className="font-semibold">{label}</div>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-4">
                                <span>Monthly Dividend:</span>
                                <span className="font-medium">{formatCurrency(payload[0].value as number)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Cumulative:</span>
                                <span className="font-medium">{formatCurrency(payload[1].value as number)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="dividend"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <span>Monthly Dividend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <span>Cumulative Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">{validCalculations.length}</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalInvestment)}</div>
              <div className="text-sm text-muted-foreground">Total Investment</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalAnnualDividend)}</div>
              <div className="text-sm text-muted-foreground">Annual Dividend</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {formatPercent((totalAnnualDividend / totalInvestment) * 100)}
              </div>
              <div className="text-sm text-muted-foreground">Average Yield</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
