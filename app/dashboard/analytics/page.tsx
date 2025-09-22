"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, BarChart3, Target, Award, AlertTriangle, Download, Maximize2 } from "lucide-react"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Pie,
} from "recharts"

interface PerformanceData {
  date: string
  portfolioValue: number
  sp500: number
  dividendIncome: number
  cumulativeDividends: number
}

interface AssetPerformance {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  dividendYield: number
  sector: string
  weight: number
}

interface SectorAllocation {
  sector: string
  value: number
  percentage: number
  color: string
}

interface DividendProjection {
  month: string
  projected: number
  actual?: number
  growth: number
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("1Y")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem("user_email")
    if (userEmail) {
      setUser({ email: userEmail })
      setProfile({
        email: userEmail,
        subscription_tier: "casual",
        trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    setLoading(false)
  }, [])

  // Mock data - in real app, this would come from API
  const performanceData: PerformanceData[] = [
    { date: "Jan", portfolioValue: 100000, sp500: 100000, dividendIncome: 250, cumulativeDividends: 250 },
    { date: "Feb", portfolioValue: 102500, sp500: 101200, dividendIncome: 275, cumulativeDividends: 525 },
    { date: "Mar", portfolioValue: 98500, sp500: 97800, dividendIncome: 280, cumulativeDividends: 805 },
    { date: "Apr", portfolioValue: 105200, sp500: 103500, dividendIncome: 290, cumulativeDividends: 1095 },
    { date: "May", portfolioValue: 108900, sp500: 106200, dividendIncome: 310, cumulativeDividends: 1405 },
    { date: "Jun", portfolioValue: 112400, sp500: 108900, dividendIncome: 325, cumulativeDividends: 1730 },
    { date: "Jul", portfolioValue: 115800, sp500: 111200, dividendIncome: 340, cumulativeDividends: 2070 },
    { date: "Aug", portfolioValue: 113200, sp500: 109800, dividendIncome: 350, cumulativeDividends: 2420 },
    { date: "Sep", portfolioValue: 118500, sp500: 114200, dividendIncome: 365, cumulativeDividends: 2785 },
    { date: "Oct", portfolioValue: 121900, sp500: 116800, dividendIncome: 380, cumulativeDividends: 3165 },
    { date: "Nov", portfolioValue: 125300, sp500: 119500, dividendIncome: 395, cumulativeDividends: 3560 },
    { date: "Dec", portfolioValue: 128700, sp500: 122100, dividendIncome: 410, cumulativeDividends: 3970 },
  ]

  const topPerformers: AssetPerformance[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      value: 25400,
      change: 1247,
      changePercent: 5.2,
      dividendYield: 0.5,
      sector: "Technology",
      weight: 19.7,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      value: 22100,
      change: 892,
      changePercent: 4.2,
      dividendYield: 0.7,
      sector: "Technology",
      weight: 17.2,
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      value: 18900,
      change: -234,
      changePercent: -1.2,
      dividendYield: 2.9,
      sector: "Healthcare",
      weight: 14.7,
    },
    {
      symbol: "KO",
      name: "Coca-Cola Co.",
      value: 15600,
      change: 456,
      changePercent: 3.0,
      dividendYield: 3.1,
      sector: "Consumer Staples",
      weight: 12.1,
    },
    {
      symbol: "PG",
      name: "Procter & Gamble",
      value: 14200,
      change: 289,
      changePercent: 2.1,
      dividendYield: 2.4,
      sector: "Consumer Staples",
      weight: 11.0,
    },
  ]

  const sectorAllocation: SectorAllocation[] = [
    { sector: "Technology", value: 47500, percentage: 36.9, color: "#3B82F6" },
    { sector: "Healthcare", value: 28900, percentage: 22.4, color: "#10B981" },
    { sector: "Consumer Staples", value: 29800, percentage: 23.1, color: "#F59E0B" },
    { sector: "Financials", value: 15200, percentage: 11.8, color: "#8B5CF6" },
    { sector: "Utilities", value: 7300, percentage: 5.7, color: "#EF4444" },
  ]

  const dividendProjections: DividendProjection[] = [
    { month: "Jan 2025", projected: 420, actual: undefined, growth: 2.4 },
    { month: "Feb 2025", projected: 435, actual: undefined, growth: 3.6 },
    { month: "Mar 2025", projected: 445, actual: undefined, growth: 2.3 },
    { month: "Apr 2025", projected: 460, actual: undefined, growth: 3.4 },
    { month: "May 2025", projected: 475, actual: undefined, growth: 3.3 },
    { month: "Jun 2025", projected: 490, actual: undefined, growth: 3.2 },
  ]

  const timeRangeOptions = [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "3Y", label: "3 Years" },
    { value: "5Y", label: "5 Years" },
    { value: "ALL", label: "All Time" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Analytics</h2>
          <p className="text-slate-600">Preparing your performance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Portfolio Analytics</h1>
            <p className="text-slate-600">Comprehensive analysis of your dividend investment performance</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="dividends">Dividends</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-white to-blue-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Return</p>
                    <p className="text-lg font-bold text-slate-900">+28.7%</p>
                    <p className="text-xs text-green-600">vs S&P 500: +22.1%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-white to-green-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dividend Income</p>
                    <p className="text-lg font-bold text-slate-900">$3,970</p>
                    <p className="text-xs text-green-600">+15.2% YoY</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-white to-purple-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg Yield</p>
                    <p className="text-lg font-bold text-slate-900">3.08%</p>
                    <p className="text-xs text-slate-600">vs Market: 1.8%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-white to-amber-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sharpe Ratio</p>
                    <p className="text-lg font-bold text-slate-900">1.42</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <CardTitle className="text-xl font-semibold">Portfolio Performance vs S&P 500</CardTitle>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="portfolioValue"
                      fill="url(#portfolioGradient)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Portfolio Value"
                    />
                    <Line
                      type="monotone"
                      dataKey="sp500"
                      stroke="#64748b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="S&P 500"
                      dot={false}
                    />
                    <defs>
                      <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Performers Table */}
            <Card className="p-6">
              <CardTitle className="text-xl font-semibold mb-6">Top Performers</CardTitle>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 font-semibold text-slate-700">Asset</th>
                      <th className="text-right py-3 px-2 font-semibold text-slate-700">Value</th>
                      <th className="text-right py-3 px-2 font-semibold text-slate-700">Change</th>
                      <th className="text-right py-3 px-2 font-semibold text-slate-700">Yield</th>
                      <th className="text-right py-3 px-2 font-semibold text-slate-700">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPerformers.map((asset) => (
                      <tr key={asset.symbol} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-semibold text-slate-900">{asset.symbol}</div>
                            <div className="text-sm text-slate-600">{asset.name}</div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 font-semibold text-slate-900">
                          ${asset.value.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-2">
                          <div className={`font-semibold ${asset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {asset.change >= 0 ? "+" : ""}${asset.change.toLocaleString()}
                          </div>
                          <div className={`text-sm ${asset.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {asset.changePercent >= 0 ? "+" : ""}
                            {asset.changePercent}%
                          </div>
                        </td>
                        <td className="text-right py-3 px-2">
                          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                            {asset.dividendYield}%
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-2 font-medium text-slate-700">{asset.weight}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dividends" className="space-y-6">
            {/* Dividend Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardTitle className="text-xl font-semibold mb-6">Monthly Dividend Income</CardTitle>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="dividendIncome" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <CardTitle className="text-xl font-semibold mb-6">Cumulative Dividend Growth</CardTitle>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulativeDividends"
                        stroke="#10b981"
                        fill="url(#dividendGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="dividendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Dividend Calendar */}
            <Card className="p-6">
              <CardTitle className="text-xl font-semibold mb-6">Upcoming Dividend Payments</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { symbol: "AAPL", date: "Dec 15", amount: "$0.24", shares: 150 },
                  { symbol: "MSFT", date: "Dec 18", amount: "$0.75", shares: 120 },
                  { symbol: "JNJ", date: "Dec 22", amount: "$1.19", shares: 85 },
                  { symbol: "KO", date: "Jan 15", amount: "$0.46", shares: 200 },
                  { symbol: "PG", date: "Jan 20", amount: "$0.91", shares: 95 },
                  { symbol: "VZ", date: "Feb 1", amount: "$0.66", shares: 110 },
                ].map((dividend, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{dividend.symbol}</span>
                      <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100">
                        {dividend.date}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      {dividend.amount} × {dividend.shares} shares
                    </div>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      ${(Number.parseFloat(dividend.amount.replace("$", "")) * dividend.shares).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sector Allocation Pie Chart */}
              <Card className="p-6">
                <CardTitle className="text-xl font-semibold mb-6">Sector Allocation</CardTitle>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={sectorAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sectorAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`$${value.toLocaleString()}`, "Value"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Sector Breakdown */}
              <Card className="p-6">
                <CardTitle className="text-xl font-semibold mb-6">Sector Breakdown</CardTitle>
                <div className="space-y-4">
                  {sectorAllocation.map((sector) => (
                    <div key={sector.sector} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: sector.color }} />
                        <span className="font-medium text-slate-900">{sector.sector}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">{sector.percentage}%</div>
                        <div className="text-sm text-slate-600">${sector.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Risk Analysis */}
            <Card className="p-6">
              <CardTitle className="text-xl font-semibold mb-6">Risk Analysis</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">Low</div>
                  <div className="text-sm text-slate-600">Portfolio Risk</div>
                  <div className="text-xs text-green-600 mt-1">Beta: 0.85</div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">Good</div>
                  <div className="text-sm text-slate-600">Diversification</div>
                  <div className="text-xs text-blue-600 mt-1">5 sectors</div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">12.5%</div>
                  <div className="text-sm text-slate-600">Max Drawdown</div>
                  <div className="text-xs text-amber-600 mt-1">Last 12 months</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            {/* Income Projections */}
            <Card className="p-6">
              <CardTitle className="text-xl font-semibold mb-6">Dividend Income Projections</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {dividendProjections.map((projection, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{projection.month}</span>
                      <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-100">
                        +{projection.growth}%
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">${projection.projected}</div>
                    <div className="text-sm text-slate-600 mt-1">Projected income</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Growth Scenarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardTitle className="text-xl font-semibold mb-6">Growth Scenarios</CardTitle>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-800">Conservative (3% growth)</span>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">$6,200</div>
                    <div className="text-sm text-green-600">Annual income in 5 years</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-800">Moderate (5% growth)</span>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">$7,450</div>
                    <div className="text-sm text-blue-600">Annual income in 5 years</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-800">Aggressive (7% growth)</span>
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-700">$8,900</div>
                    <div className="text-sm text-purple-600">Annual income in 5 years</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <CardTitle className="text-xl font-semibold mb-6">Reinvestment Impact</CardTitle>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">Without Reinvestment</div>
                    <div className="text-xl font-bold text-slate-900">$4,920</div>
                    <div className="text-xs text-slate-500">Annual income in 5 years</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 mb-1">With Dividend Reinvestment</div>
                    <div className="text-xl font-bold text-green-700">$7,450</div>
                    <div className="text-xs text-green-600">Annual income in 5 years</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-800">Additional Income</span>
                      <Badge className="bg-blue-600">+51%</Badge>
                    </div>
                    <div className="text-lg font-bold text-blue-700 mt-1">$2,530</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
