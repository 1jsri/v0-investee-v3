"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, PieChart, Target, Calendar, Plus, ArrowUpRight, Sparkles } from "lucide-react"
import { ProjectedIncomeChart } from "@/components/projected-income-chart"
import { PortfolioHoldingsTable } from "@/components/portfolio-holdings-table"
import { NewsFeed } from "@/components/news-feed"

interface Profile {
  email: string
  subscription_tier: "free" | "casual" | "professional"
  trial_ends_at?: string
}

export default function DashboardOverview() {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <Card className="p-3 sm:p-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="h-6 w-12 sm:h-8 sm:w-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <div className="text-xs text-blue-600 font-medium">📈</div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Value</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    $29,959
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +$1,247 (4.3%)
                  </p>
                </div>
              </Card>

              <Card className="p-3 sm:p-6 bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 bg-emerald-50 font-medium text-xs group-hover:bg-emerald-100 transition-colors"
                  >
                    +12.5%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Monthly Income</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    $487
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Next: $156 on Dec 15</p>
                </div>
              </Card>

              <Card className="p-3 sm:p-6 bg-gradient-to-br from-white via-purple-50/30 to-violet-50/50 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-purple-600 border-purple-200 bg-purple-50 font-medium text-xs group-hover:bg-purple-100 transition-colors"
                  >
                    1.94%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Annual Income</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                    $5,844
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Avg yield: 1.94%</p>
                </div>
              </Card>

              <Card className="p-3 sm:p-6 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <PieChart className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-200 bg-amber-50 font-medium text-xs group-hover:bg-amber-100 transition-colors"
                  >
                    3 assets
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Diversification</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                    Good
                  </p>
                  <p className="text-xs text-slate-500 mt-1">3 sectors covered</p>
                </div>
              </Card>

              <Card className="p-3 sm:p-6 bg-gradient-to-br from-white via-slate-50/30 to-slate-50/50 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-slate-600 border-slate-200 bg-slate-50 font-medium text-xs capitalize group-hover:bg-slate-100 transition-colors"
                  >
                    casual
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Plan Usage</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                    3/25
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Assets tracked</p>
                </div>
              </Card>
            </div>

            <div className="mb-6 sm:mb-8">
              <ProjectedIncomeChart />
            </div>

            <PortfolioHoldingsTable holdings={demoHoldings} onHoldingUpdate={handleHoldingUpdate} portfolioId="demo" />
          </div>

          <div className="hidden lg:block lg:col-span-3">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-3 bg-slate-900 hover:bg-slate-800">
                    <Plus className="h-4 w-4" />
                    Add Asset
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                    <Sparkles className="h-4 w-4" />
                    AI Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
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
                      <div className="text-sm font-medium">4,567.23</div>
                      <div className="text-xs text-green-600">+0.85%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Dividend Aristocrats</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">2,134.56</div>
                      <div className="text-xs text-green-600">+1.23%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">10Y Treasury</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">4.52%</div>
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
                      <span className="text-sm font-medium">Coca-Cola</span>
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
                      <span className="text-sm font-medium">Johnson & Johnson</span>
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
                      <span className="text-sm font-medium">Procter & Gamble</span>
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
                      <div className="text-sm font-medium">AAPL</div>
                      <div className="text-xs text-slate-500">Dec 15, 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$0.24</div>
                      <div className="text-xs text-slate-500">per share</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">MSFT</div>
                      <div className="text-xs text-slate-500">Dec 18, 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$0.75</div>
                      <div className="text-xs text-slate-500">per share</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">JNJ</div>
                      <div className="text-xs text-slate-500">Dec 22, 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$1.19</div>
                      <div className="text-xs text-slate-500">per share</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* News Feed */}
              <NewsFeed portfolioSymbols={portfolioSymbols} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
