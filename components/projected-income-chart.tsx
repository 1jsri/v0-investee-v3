"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts"
import { Download, TrendingUp, Maximize2, RotateCcw, Play, Pause, Settings } from "lucide-react"

type TimeRange = "30D" | "90D" | "1Y" | "3Y" | "5Y"
type ChartType = "line" | "bar" | "area"

interface ChartDataPoint {
  period: string
  projectedIncome: number
  actualIncome: number | null
  cumulativeIncome: number
  growthRate: number
  confidence: number
}

const generateChartData = (timeRange: TimeRange, realTimeUpdate = false): ChartDataPoint[] => {
  const periods = {
    "30D": 30,
    "90D": 90,
    "1Y": 12,
    "3Y": 36,
    "5Y": 60,
  }

  const period = periods[timeRange]
  const isDaily = timeRange === "30D" || timeRange === "90D"
  const baseIncome = 450
  const growthRate = 0.025 // 2.5% monthly growth

  return Array.from({ length: period }, (_, i) => {
    const timeMultiplier = realTimeUpdate ? Date.now() / 1000000 : 1
    const income = baseIncome * Math.pow(1 + growthRate, i) + (Math.random() * 50 - 25) * timeMultiplier
    const actualIncome = i < period * 0.7 ? income * (0.9 + Math.random() * 0.2) : null

    return {
      period: isDaily ? `Day ${i + 1}` : `Month ${i + 1}`,
      projectedIncome: Math.max(0, income),
      actualIncome: actualIncome ? Math.max(0, actualIncome) : null,
      cumulativeIncome: income * (i + 1),
      growthRate: (income / baseIncome - 1) * 100,
      confidence: Math.max(60, 95 - i * 2), // Decreasing confidence over time
    }
  })
}

export function ProjectedIncomeChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isRealTime, setIsRealTime] = useState(false)
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true)

  const timeRanges: TimeRange[] = ["30D", "90D", "1Y", "3Y", "5Y"]

  const updateData = useCallback(() => {
    setData(generateChartData(timeRange, isRealTime))
  }, [timeRange, isRealTime])

  useEffect(() => {
    updateData()
  }, [updateData])

  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(updateData, animationSpeed)
    return () => clearInterval(interval)
  }, [isRealTime, animationSpeed, updateData])

  const handleZoom = (domain: [number, number] | null) => {
    setZoomDomain(domain)
  }

  const resetZoom = () => {
    setZoomDomain(null)
  }

  const downloadChart = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      // Simple chart export implementation
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `dividend-projection-${timeRange}.png`
      link.href = dataUrl
      link.click()
    }
  }

  const currentIncome = data[data.length - 1]?.projectedIncome || 0
  const totalProjected = data.reduce((sum, point) => sum + point.projectedIncome, 0)
  const averageGrowth = data.length > 0 ? data.reduce((sum, point) => sum + point.growthRate, 0) / data.length : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-blue-600">Projected:</span> ${payload[0].value?.toFixed(2)}
            </p>
            {data.actualIncome && (
              <p className="text-sm">
                <span className="text-green-600">Actual:</span> ${data.actualIncome.toFixed(2)}
              </p>
            )}
            <p className="text-sm">
              <span className="text-purple-600">Growth:</span> {data.growthRate.toFixed(1)}%
            </p>
            {showConfidenceInterval && (
              <p className="text-sm">
                <span className="text-amber-600">Confidence:</span> {data.confidence.toFixed(0)}%
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <>
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Interactive Dividend Projections</h3>
            <p className="text-sm text-slate-600 mt-1">
              Real-time analysis with confidence intervals and growth tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {timeRanges.map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={`h-8 px-3 text-xs ${timeRange === range ? "bg-white shadow-sm" : "hover:bg-slate-200"}`}
                >
                  {range}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
                className={`gap-2 ${isRealTime ? "bg-green-50 border-green-200 text-green-700" : ""}`}
              >
                {isRealTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRealTime ? "Live" : "Static"}
              </Button>

              <Button variant="outline" size="sm" onClick={resetZoom} disabled={!zoomDomain}>
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={downloadChart}>
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowFullscreen(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Current Projection</span>
              {isRealTime && <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />}
            </div>
            <p className="text-2xl font-bold text-blue-900">${currentIncome.toFixed(2)}</p>
            <p className="text-xs text-blue-600">Monthly income</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Total Projected</span>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100">
                {timeRange}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-green-900">${totalProjected.toFixed(0)}</p>
            <p className="text-xs text-green-600">Cumulative income</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Avg Growth</span>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{averageGrowth.toFixed(1)}%</p>
            <p className="text-xs text-purple-600">Monthly growth rate</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {[
              { type: "area" as ChartType, label: "Area" },
              { type: "line" as ChartType, label: "Line" },
              { type: "bar" as ChartType, label: "Bar" },
            ].map(({ type, label }) => (
              <Button
                key={type}
                variant={chartType === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType(type)}
                className={`h-8 px-3 text-xs ${chartType === type ? "bg-white shadow-sm" : "hover:bg-slate-200"}`}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Projected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Actual</span>
            </div>
            {showConfidenceInterval && (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Confidence</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={data}
                onMouseDown={(e) => e && handleZoom([e.activeLabel as number, (e.activeLabel as number) + 5])}
              >
                <defs>
                  <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="period"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  domain={zoomDomain || ["dataMin", "dataMax"]}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="projectedIncome"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#projectedGradient)"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  animationDuration={animationSpeed}
                />
                <Area
                  type="monotone"
                  dataKey="actualIncome"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#actualGradient)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                  animationDuration={animationSpeed}
                />
                {showConfidenceInterval && (
                  <ReferenceLine
                    y={currentIncome * 0.9}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    label="90% Confidence"
                  />
                )}
                <Brush dataKey="period" height={30} stroke="#3b82f6" />
              </AreaChart>
            ) : chartType === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="projectedIncome"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
                  animationDuration={animationSpeed}
                />
                <Line
                  type="monotone"
                  dataKey="actualIncome"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  connectNulls={false}
                  animationDuration={animationSpeed}
                />
                <Brush dataKey="period" height={30} stroke="#3b82f6" />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="projectedIncome"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={animationSpeed}
                />
                <Brush dataKey="period" height={30} stroke="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {isRealTime && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live updates enabled - Data refreshes every {animationSpeed / 1000}s</span>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chart Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Animation Speed: {animationSpeed / 1000}s
              </label>
              <input
                type="range"
                min="500"
                max="5000"
                step="500"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Show Confidence Interval</label>
              <input
                type="checkbox"
                checked={showConfidenceInterval}
                onChange={(e) => setShowConfidenceInterval(e.target.checked)}
                className="rounded"
              />
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
            <DialogTitle>Dividend Projections - Full View</DialogTitle>
          </DialogHeader>
          <div className="h-full">
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="fullscreenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="projectedIncome"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fill="url(#fullscreenGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="actualIncome"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="none"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
