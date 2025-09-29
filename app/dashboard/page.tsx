"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, ChartPie as PieChart, Target, Calendar, Plus, ArrowUpRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  email: string
  subscription_tier: "free" | "casual" | "professional"
  trial_ends_at?: string
}

export default function DashboardOverview() {
  const router = useRouter()
  const portfolioSymbols = ["AAPL", "MSFT", "JNJ", "KO", "PG"]

  const demoHoldings = [
    {
      id: "1",
      asset_ticker: "AAPL",
      asset_name: "Apple Inc.",
      investment_amount: 12500,
      shares: 65,
      portfolio_id: "demo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      asset_ticker: "MSFT",
      asset_name: "Microsoft Corporation",
      investment_amount: 8750,
      shares: 25,
      portfolio_id: "demo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      asset_ticker: "JNJ",
      asset_name: "Johnson & Johnson",
      investment_amount: 5200,
      shares: 32,
      portfolio_id: "demo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      asset_ticker: "KO",
      asset_name: "The Coca-Cola Company",
      investment_amount: 3500,
      shares: 58,
      portfolio_id: "demo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const handleHoldingUpdate = () => {
    // Demo function - no actual update needed
    console.log("Holdings updated")
  }

  const handleAddAsset = () => {
    router.push("/calculator")
  }

  const handleAIAnalysis = () => {
    router.push("/dashboard/chat")
  }

  const handleExportReport = () => {
    // Create a simple CSV export
    const csvContent = [
      ["Asset", "Investment Amount", "Shares"],
      ...demoHoldings.map(h => [h.asset_ticker, h.investment_amount, h.shares])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio-report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 lg:h-12 lg:w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 text-primary-foreground" />
                  </div>
                  <div className="h-4 w-8 lg:h-6 lg:w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="text-xs text-muted-foreground font-medium">📈</div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1 truncate">
                    Total Value
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-slate-900">$29,959</p>
                  <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1 truncate">
                    <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3" />
                    +$1,247 (4.3%)
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 lg:h-12 lg:w-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 font-semibold text-xs">
                    +12.5%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1 truncate">
                    Monthly Income
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-slate-900">$487</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">Next: $156 on Dec 15</p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 lg:h-12 lg:w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 font-semibold text-xs">
                    1.94%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1 truncate">
                    Annual Income
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-slate-900">$5,844</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">Avg yield: 1.94%</p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 lg:h-12 lg:w-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <PieChart className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50 font-semibold text-xs">
                    3 assets
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1 truncate">
                    Diversification
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-slate-900">Good</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">3 sectors covered</p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 lg:h-10 lg:w-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Target className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-amber-700 border-amber-300 bg-amber-50 font-medium text-xs capitalize"
                  >
                    casual
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 truncate">Plan Usage</p>
                  <p className="text-lg lg:text-xl font-bold text-slate-900">3/25</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">Assets tracked</p>
                </div>
              </Card>
            </div>

            {/* Chart Section */}
            <div className="space-y-6 min-w-0">
              <Card className="p-4 lg:p-6 bg-white border border-slate-200 shadow-sm">
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-2">Interactive Dividend Projections</h3>
                  <p className="text-sm text-slate-600">Real-time analysis with confidence intervals and growth tracking</p>
                </div>
                
                {/* Mobile Controls */}
                <div className="lg:hidden mb-4 space-y-3">
                  <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
                    {["30D", "90D", "1Y", "3Y", "5Y"].map((range) => (
                      <button
                        key={range}
                        className="px-3 py-2 text-xs font-medium rounded-md bg-white shadow-sm text-slate-900 flex-shrink-0"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <button className="px-3 py-2 text-xs bg-slate-100 rounded-md">Settings</button>
                    <button className="px-3 py-2 text-xs bg-slate-100 rounded-md">Export</button>
                  </div>
                </div>
                
                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    {["30D", "90D", "1Y", "3Y", "5Y"].map((range) => (
                      <button
                        key={range}
                        className="px-3 py-2 text-xs font-medium rounded-md bg-white shadow-sm text-slate-900"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-2 text-xs bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Settings</button>
                    <button className="px-3 py-2 text-xs bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Export</button>
                    <button className="px-3 py-2 text-xs bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Fullscreen</button>
                  </div>
                </div>
                
                {/* Chart placeholder */}
                <div className="h-64 lg:h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-blue-900 font-semibold">Dividend Projection Chart</p>
                    <p className="text-blue-600 text-sm">Add assets to see projections</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Holdings Table */}
            <div className="space-y-6 min-w-0">
              <Card className="p-4 lg:p-6 bg-white border border-slate-200 shadow-sm">
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-slate-900">Portfolio Holdings</h3>
                  <p className="text-sm text-slate-600 mt-1">Manage your dividend-paying investments</p>
                </div>
                
                {/* Mobile Holdings - Card Layout */}
                <div className="lg:hidden space-y-3">
                  {demoHoldings.map((holding) => (
                    <Card key={holding.id} className="p-4 bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {holding.asset_ticker.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{holding.asset_ticker}</div>
                            <div className="text-sm text-slate-600 truncate max-w-32">{holding.asset_name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-500">Investment</div>
                          <div className="font-semibold">${holding.investment_amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Shares</div>
                          <div className="font-semibold">{holding.shares}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Desktop Holdings - Table Layout */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-semibold text-slate-700">Asset</th>
                        <th className="text-right py-3 px-2 font-semibold text-slate-700">Investment</th>
                        <th className="text-right py-3 px-2 font-semibold text-slate-700">Shares</th>
                        <th className="text-right py-3 px-2 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoHoldings.map((holding) => (
                        <tr key={holding.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                {holding.asset_ticker.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{holding.asset_ticker}</div>
                                <div className="text-sm text-slate-600">{holding.asset_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2 font-semibold">${holding.investment_amount.toLocaleString()}</td>
                          <td className="text-right py-3 px-2 font-semibold">{holding.shares}</td>
                          <td className="text-right py-3 px-2">
                            <button className="text-slate-600 hover:text-slate-900 text-sm">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 min-w-0">
            {/* Quick Actions */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleAddAsset}
                  className="w-full justify-start gap-3 bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 text-base font-semibold rounded-lg border-2 border-slate-900 transition-all duration-200 hover:shadow-lg h-12"
                >
                  <Plus className="h-4 w-4" />
                  Add Asset
                </Button>
                <Button 
                  onClick={handleAIAnalysis}
                  variant="outline" 
                  className="w-full justify-start gap-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-white px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-lg h-12"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </Button>
                <Button 
                  onClick={handleExportReport}
                  variant="outline" 
                  className="w-full justify-start gap-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-white px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-lg h-12"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </Card>

            {/* Market Overview */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Market Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">S&P 500</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">4,567.23</div>
                    <div className="text-xs text-green-600">+0.85%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Dividend Aristocrats</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">2,134.56</div>
                    <div className="text-xs text-green-600">+1.23%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">10Y Treasury</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">4.52%</div>
                    <div className="text-xs text-red-600">+0.03%</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Performers */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Dividend Performers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-blue-100 rounded text-xs font-semibold flex items-center justify-center text-blue-700">
                      KO
                    </div>
                    <span className="text-sm font-medium text-slate-900">Coca-Cola</span>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
                    3.1%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-purple-100 rounded text-xs font-semibold flex items-center justify-center text-purple-700">
                      JNJ
                    </div>
                    <span className="text-sm font-medium text-slate-900">Johnson & Johnson</span>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
                    2.9%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-red-100 rounded text-xs font-semibold flex items-center justify-center text-red-700">
                      PG
                    </div>
                    <span className="text-sm font-medium text-slate-900">Procter & Gamble</span>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
                    2.4%
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Upcoming Dividends */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Ex-Dividend Dates</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">AAPL</div>
                    <div className="text-xs text-slate-500">Dec 15, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">$0.24</div>
                    <div className="text-xs text-slate-500">per share</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">MSFT</div>
                    <div className="text-xs text-slate-500">Dec 18, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">$0.75</div>
                    <div className="text-xs text-slate-500">per share</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">JNJ</div>
                    <div className="text-xs text-slate-500">Dec 22, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">$1.19</div>
                    <div className="text-xs text-slate-500">per share</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* News Feed */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Market News</h3>
                <Badge variant="outline" className="text-slate-600 border-slate-200">
                  Live
                </Badge>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    title: "Apple Reports Strong Q4 Earnings",
                    source: "MarketWatch",
                    time: "2 hours ago",
                    sentiment: "bullish"
                  },
                  {
                    title: "Microsoft Announces Dividend Increase",
                    source: "Reuters", 
                    time: "4 hours ago",
                    sentiment: "bullish"
                  },
                  {
                    title: "Market Analysis: Tech Stocks Show Resilience",
                    source: "Bloomberg",
                    time: "6 hours ago", 
                    sentiment: "neutral"
                  }
                ].map((article, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <h4 className="font-medium text-slate-900 mb-2">{article.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{article.time}</span>
                      <span>{article.source}</span>
                      <Badge variant="outline" className="text-xs">
                        {article.sentiment}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
