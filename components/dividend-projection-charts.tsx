"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Maximize2,
  BarChart3,
  Activity,
  Percent,
  ArrowUp,
  Info,
  Settings,
} from "lucide-react"

interface Holding {
  id: string
  asset_ticker: string
  asset_name?: string
  investment_amount: number
  shares: number
}

interface ProjectionData {
  period: string
  date: Date
  cumulativeDividends: number
  monthlyIncome: number
  quarterlyIncome: number
  annualIncome: number
  totalValue: number
  assets: Record<
    string,
    {
      dividend: number
      value: number
      yield: number
    }
  >
}

interface DividendCalendarData {
  date: string
  amount: number
  assets: string[]
  intensity: number
}

type TimeView = "30D" | "90D" | "1Y" | "3Y" | "5Y"
type ChartType = "cumulative" | "calendar" | "stacked" | "comparison"

interface DividendProjectionChartsProps {
  holdings: Holding[]
  portfolioName?: string
}

export function DividendProjectionCharts({ holdings, portfolioName = "Portfolio" }: DividendProjectionChartsProps) {
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([])
  const [calendarData, setCalendarData] = useState<DividendCalendarData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTimeView, setActiveTimeView] = useState<TimeView>("1Y")
  const [activeChart, setActiveChart] = useState<ChartType>("cumulative")
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [growthAssumption, setGrowthAssumption] = useState(3) // 3% default
  const [scenario, setScenario] = useState<"conservative" | "optimistic">("conservative")

  const timeViewConfig = {
    "30D": { days: 30, interval: "daily", label: "30 Days" },
    "90D": { days: 90, interval: "weekly", label: "90 Days" },
    "1Y": { days: 365, interval: "monthly", label: "1 Year" },
    "3Y": { days: 1095, interval: "quarterly", label: "3 Years" },
    "5Y": { days: 1825, interval: "annual", label: "5 Years" },
  }

  const chartColors = {
    primary: "#1f2937",
    secondary: "#059669",
    accent: "#3b82f6",
    warning: "#f59e0b",
    danger: "#ef4444",
    gradient: ["#1f2937", "#374151", "#4b5563", "#6b7280", "#9ca3af"],
  }

  useEffect(() => {
    if (holdings.length === 0) {
      setProjectionData([])
      setCalendarData([])
      return
    }

    generateProjections()
  }, [holdings, activeTimeView, growthAssumption, scenario])

  const generateProjections = async () => {
    setIsLoading(true)

    try {
      const dividendPromises = holdings.map(async (holding) => {
        try {
          const response = await fetch(`/api/dividend-data?symbols=${holding.asset_ticker}`)
          const data = await response.json()
          return {
            ticker: holding.asset_ticker,
            name: holding.asset_name || holding.asset_ticker,
            dividendData: data.result?.[0] || null,
            investment: holding.investment_amount,
            shares: holding.shares,
          }
        } catch (error) {
          console.warn(`Failed to fetch dividend data for ${holding.asset_ticker}`)
          return {
            ticker: holding.asset_ticker,
            name: holding.asset_name || holding.asset_ticker,
            dividendData: null,
            investment: holding.investment_amount,
            shares: holding.shares,
          }
        }
      })

      const dividendResults = await Promise.all(dividendPromises)
      const config = timeViewConfig[activeTimeView]
      const projections: ProjectionData[] = []
      const calendar: DividendCalendarData[] = []

      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + config.days * 24 * 60 * 60 * 1000)

      let currentDate = new Date(startDate)
      let cumulativeTotal = 0

      while (currentDate <= endDate) {
        const periodIncome = calculatePeriodIncome(dividendResults, currentDate, config.interval)
        cumulativeTotal += periodIncome.total

        const projectionPoint: ProjectionData = {
          period: formatPeriodLabel(currentDate, config.interval),
          date: new Date(currentDate),
          cumulativeDividends: cumulativeTotal,
          monthlyIncome: periodIncome.monthly,
          quarterlyIncome: periodIncome.quarterly,
          annualIncome: periodIncome.annual,
          totalValue: calculatePortfolioValue(dividendResults, currentDate),
          assets: periodIncome.assets,
        }

        projections.push(projectionPoint)

        if (periodIncome.total > 0) {
          calendar.push({
            date: currentDate.toISOString().split("T")[0],
            amount: periodIncome.total,
            assets: Object.keys(periodIncome.assets).filter((ticker) => periodIncome.assets[ticker].dividend > 0),
            intensity: Math.min(periodIncome.total / 1000, 10), // Normalize intensity
          })
        }

        // Advance to next period
        currentDate = getNextPeriod(currentDate, config.interval)
      }

      setProjectionData(projections)
      setCalendarData(calendar)
    } catch (error) {
      console.error("Error generating projections:", error)
      generateFallbackProjections()
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePeriodIncome = (dividendResults: any[], date: Date, interval: string) => {
    const growthRate = scenario === "conservative" ? growthAssumption / 100 : (growthAssumption + 2) / 100
    const yearsSinceStart = (date.getTime() - new Date().getTime()) / (365.25 * 24 * 60 * 60 * 1000)

    let total = 0
    const assets: Record<string, { dividend: number; value: number; yield: number }> = {}

    dividendResults.forEach((result) => {
      const baseYield = result.dividendData?.dividendYield || 3.5
      const adjustedYield = baseYield * Math.pow(1 + growthRate, yearsSinceStart)
      const currentValue = result.investment * Math.pow(1 + growthRate * 0.5, yearsSinceStart)

      let periodDividend = 0

      // Calculate dividend based on interval and payment frequency
      switch (interval) {
        case "daily":
          periodDividend = (currentValue * adjustedYield) / 100 / 365
          break
        case "weekly":
          periodDividend = (currentValue * adjustedYield) / 100 / 52
          break
        case "monthly":
          periodDividend = (currentValue * adjustedYield) / 100 / 12
          break
        case "quarterly":
          periodDividend = (currentValue * adjustedYield) / 100 / 4
          break
        case "annual":
          periodDividend = (currentValue * adjustedYield) / 100
          break
      }

      total += periodDividend
      assets[result.ticker] = {
        dividend: periodDividend,
        value: currentValue,
        yield: adjustedYield,
      }
    })

    return {
      total,
      monthly: total * (interval === "monthly" ? 1 : interval === "quarterly" ? 3 : interval === "annual" ? 12 : 30),
      quarterly: total * (interval === "quarterly" ? 1 : interval === "annual" ? 4 : 90),
      annual: total * (interval === "annual" ? 1 : 365),
      assets,
    }
  }

  const calculatePortfolioValue = (dividendResults: any[], date: Date) => {
    const yearsSinceStart = (date.getTime() - new Date().getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    const growthRate = scenario === "conservative" ? growthAssumption / 100 : (growthAssumption + 2) / 100

    return dividendResults.reduce((total, result) => {
      return total + result.investment * Math.pow(1 + growthRate * 0.5, yearsSinceStart)
    }, 0)
  }

  const formatPeriodLabel = (date: Date, interval: string) => {
    switch (interval) {
      case "daily":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "weekly":
        return `Week ${Math.ceil(date.getDate() / 7)}`
      case "monthly":
        return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      case "quarterly":
        return `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`
      case "annual":
        return date.getFullYear().toString()
      default:
        return date.toLocaleDateString()
    }
  }

  const getNextPeriod = (date: Date, interval: string) => {
    const newDate = new Date(date)
    switch (interval) {
      case "daily":
        newDate.setDate(newDate.getDate() + 1)
        break
      case "weekly":
        newDate.setDate(newDate.getDate() + 7)
        break
      case "monthly":
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case "quarterly":
        newDate.setMonth(newDate.getMonth() + 3)
        break
      case "annual":
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    return newDate
  }

  const generateFallbackProjections = () => {
    // Fallback implementation with conservative estimates
    const config = timeViewConfig[activeTimeView]
    const projections: ProjectionData[] = []

    for (let i = 0; i <= config.days / 30; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)

      projections.push({
        period: formatPeriodLabel(date, "monthly"),
        date,
        cumulativeDividends: i * 100,
        monthlyIncome: 100,
        quarterlyIncome: 300,
        annualIncome: 1200,
        totalValue: 10000 + i * 200,
        assets: {},
      })
    }

    setProjectionData(projections)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const downloadChart = () => {
    // Implementation for chart download
    console.log("Downloading chart...")
  }

  const calculateCAGR = () => {
    if (projectionData.length < 2) return 0
    const initial = projectionData[0]?.cumulativeDividends || 1
    const final = projectionData[projectionData.length - 1]?.cumulativeDividends || 1
    const years = projectionData.length / 12 // Approximate years
    return ((final / initial) ** (1 / years) - 1) * 100
  }

  const totalInvestment = holdings.reduce((sum, h) => sum + h.investment_amount, 0)
  const currentProjection = projectionData[0]
  const finalProjection = projectionData[projectionData.length - 1]
  const cagr = calculateCAGR()

  if (holdings.length === 0) {
    return (
      <Card className="p-12 border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50 text-center">
        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">Build Your Dividend Projection</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Add dividend-paying assets to your portfolio to see sophisticated projections, growth scenarios, and income
          forecasts.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Dividend Projection Analysis</h2>
            <p className="text-slate-300">Advanced forecasting for {portfolioName}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              {(Object.keys(timeViewConfig) as TimeView[]).map((view) => (
                <Button
                  key={view}
                  variant={activeTimeView === view ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTimeView(view)}
                  className={activeTimeView === view ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}
                >
                  {timeViewConfig[view].label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="border-slate-600 text-slate-300"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadChart}
                className="border-slate-600 text-slate-300 bg-transparent"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullscreen(true)}
                className="border-slate-600 text-slate-300"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              {scenario === "conservative" ? "Conservative" : "Optimistic"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Projected Annual Income</p>
            <p className="text-2xl font-bold text-green-900">
              {finalProjection ? formatCurrency(finalProjection.annualIncome) : formatCurrency(0)}
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              {cagr.toFixed(1)}% CAGR
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {timeViewConfig[activeTimeView].label}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-blue-900">
              {finalProjection ? formatCurrency(finalProjection.totalValue) : formatCurrency(totalInvestment)}
            </p>
            <p className="text-xs text-blue-600">
              {(((finalProjection?.totalValue || totalInvestment) / totalInvestment) * 100 - 100).toFixed(1)}% growth
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Percent className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              Yield
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">Effective Yield</p>
            <p className="text-2xl font-bold text-purple-900">
              {finalProjection && totalInvestment > 0
                ? ((finalProjection.annualIncome / totalInvestment) * 100).toFixed(2)
                : "0.00"}
              %
            </p>
            <p className="text-xs text-purple-600">Current portfolio yield</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              Monthly
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-orange-700 uppercase tracking-wide">Monthly Income</p>
            <p className="text-2xl font-bold text-orange-900">
              {finalProjection ? formatCurrency(finalProjection.monthlyIncome) : formatCurrency(0)}
            </p>
            <p className="text-xs text-orange-600">Estimated monthly dividends</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { type: "cumulative" as ChartType, label: "Cumulative Income", icon: TrendingUp },
            { type: "calendar" as ChartType, label: "Payment Calendar", icon: Calendar },
            { type: "stacked" as ChartType, label: "Income by Asset", icon: BarChart3 },
            { type: "comparison" as ChartType, label: "Scenario Comparison", icon: Activity },
          ].map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={activeChart === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart(type)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        <div className="h-96">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-600">Calculating projections...</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === "cumulative" && (
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="dividendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} tick={{ fill: "#64748b" }} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Cumulative Dividends"]}
                    labelStyle={{ color: "#1f2937", fontWeight: 600 }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeDividends"
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    fill="url(#dividendGradient)"
                    dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2, fill: "white" }}
                  />
                </AreaChart>
              )}

              {activeChart === "stacked" && (
                <BarChart data={projectionData.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  {holdings.map((holding, index) => (
                    <Bar
                      key={holding.asset_ticker}
                      dataKey={`assets.${holding.asset_ticker}.dividend`}
                      stackId="dividends"
                      fill={chartColors.gradient[index % chartColors.gradient.length]}
                      name={holding.asset_ticker}
                    />
                  ))}
                </BarChart>
              )}

              {activeChart === "comparison" && (
                <ComposedChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulativeDividends"
                    stroke={chartColors.secondary}
                    strokeWidth={3}
                    name="Conservative Scenario"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalValue"
                    stroke={chartColors.accent}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Portfolio Value"
                    dot={false}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="h-4 w-4" />
            <span>
              Projections based on {scenario} growth assumptions ({growthAssumption}% annual dividend growth).
              Historical performance does not guarantee future results.
              <button className="text-blue-600 hover:underline ml-1" onClick={() => setShowSettings(true)}>
                Adjust assumptions
              </button>
            </span>
          </div>
        </div>
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Projection Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scenario Type</label>
              <div className="flex gap-2">
                <Button
                  variant={scenario === "conservative" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScenario("conservative")}
                  className="flex-1"
                >
                  Conservative
                </Button>
                <Button
                  variant={scenario === "optimistic" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScenario("optimistic")}
                  className="flex-1"
                >
                  Optimistic
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Annual Dividend Growth Rate: {growthAssumption}%
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={growthAssumption}
                onChange={(e) => setGrowthAssumption(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
              </div>
            </div>

            <Button onClick={() => setShowSettings(false)} className="w-full">
              Apply Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Dividend Projection Analysis - Full View</DialogTitle>
          </DialogHeader>

          <div className="h-full">
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="fullscreenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Cumulative Dividends"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeDividends"
                  stroke={chartColors.primary}
                  strokeWidth={4}
                  fill="url(#fullscreenGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
