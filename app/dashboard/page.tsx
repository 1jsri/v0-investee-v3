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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <DollarSign className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="h-6 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="text-xs text-muted-foreground font-medium">📈</div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-slate-900">$29,959</p>
                  <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +$1,247 (4.3%)
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 font-semibold text-xs">
                    +12.5%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                    Monthly Income
                  </p>
                  <p className="text-2xl font-bold text-slate-900">$487</p>
                  <p className="text-xs text-slate-500 mt-1">Next: $156 on Dec 15</p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 font-semibold text-xs">
                    1.94%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                    Annual Income
                  </p>
                  <p className="text-2xl font-bold text-slate-900">$5,844</p>
                  <p className="text-xs text-slate-500 mt-1">Avg yield: 1.94%</p>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50 font-semibold text-xs">
                    3 assets
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                    Diversification
                  </p>
                  <p className="text-2xl font-bold text-slate-900">Good</p>
                  <p className="text-xs text-slate-500 mt-1">3 sectors covered</p>
                </div>
              </Card>
            </div>

            {/* Chart Section */}
            <div className="space-y-6">
              <ProjectedIncomeChart />
            </div>

            {/* Holdings Table */}
            <div className="space-y-6">
              <PortfolioHoldingsTable holdings={demoHoldings} onHoldingUpdate={handleHoldingUpdate} portfolioId="demo" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-3 btn-primary h-12">
                  <Plus className="h-4 w-4" />
                  Add Asset
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
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
            <NewsFeed portfolioSymbols={portfolioSymbols} />
          </div>
        </div>
      </div>
    </div>
  )
}

          </div>
        </div>
      </div>
    </div>
  )
}
