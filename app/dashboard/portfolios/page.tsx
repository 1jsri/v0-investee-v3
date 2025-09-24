"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Edit3,
  Trash2,
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  Copy,
  BarChart3,
  Target,
  Search,
  X,
} from "lucide-react"

interface Portfolio {
  id: string
  name: string
  description?: string
  strategy: "growth" | "income" | "balanced"
  user_id: string
  created_at: string
  updated_at: string
  holdings: Holding[]
  totalValue: number
  monthlyIncome: number
  ytdPerformance: number
  holdingsCount: number
  averageYield: number
}

interface Holding {
  id: string
  asset_ticker: string
  asset_name: string
  investment_amount: number
  shares: number
  portfolio_id: string
  currentPrice?: number
  change?: number
  changePercent?: number
  marketValue?: number
}

interface QuickStats {
  totalPortfolioValue: number
  combinedMonthlyIncome: number
  averageYield: number
  totalHoldings: number
}

export default function PortfoliosPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [portfolioName, setPortfolioName] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [portfolioStrategy, setPortfolioStrategy] = useState<"growth" | "income" | "balanced">("income")
  const [startingAmount, setStartingAmount] = useState("10000")
  const [showAddAssets, setShowAddAssets] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    setUser({ email: "demo@investee.com" })
    setProfile({
      email: "demo@investee.com",
      subscription_tier: "casual",
      trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    })
    loadPortfolios()
  }, [])

  const loadPortfolios = async () => {
    try {
      const mockPortfolios: Portfolio[] = [
        {
          id: "1",
          name: "Dividend Growth Portfolio",
          description: "Focus on dividend aristocrats with consistent growth",
          strategy: "growth",
          user_id: "user1",
          created_at: "2024-01-15",
          updated_at: "2024-12-10",
          holdings: [
            {
              id: "h1",
              asset_ticker: "AAPL",
              asset_name: "Apple Inc.",
              investment_amount: 15000,
              shares: 77,
              portfolio_id: "1",
            },
            {
              id: "h2",
              asset_ticker: "MSFT",
              asset_name: "Microsoft Corporation",
              investment_amount: 12000,
              shares: 28,
              portfolio_id: "1",
            },
            {
              id: "h3",
              asset_ticker: "JNJ",
              asset_name: "Johnson & Johnson",
              investment_amount: 10000,
              shares: 62,
              portfolio_id: "1",
            },
          ],
          totalValue: 45250,
          monthlyIncome: 187.5,
          ytdPerformance: 8.3,
          holdingsCount: 3,
          averageYield: 2.8,
        },
        {
          id: "2",
          name: "High Yield Income",
          description: "REITs and high-dividend stocks for maximum income",
          strategy: "income",
          user_id: "user1",
          created_at: "2024-02-20",
          updated_at: "2024-12-08",
          holdings: [
            {
              id: "h4",
              asset_ticker: "SCHD",
              asset_name: "Schwab US Dividend Equity ETF",
              investment_amount: 20000,
              shares: 250,
              portfolio_id: "2",
            },
            {
              id: "h5",
              asset_ticker: "VYM",
              asset_name: "Vanguard High Dividend Yield ETF",
              investment_amount: 8900,
              shares: 75,
              portfolio_id: "2",
            },
          ],
          totalValue: 28900,
          monthlyIncome: 245.8,
          ytdPerformance: 5.7,
          holdingsCount: 2,
          averageYield: 4.2,
        },
        {
          id: "3",
          name: "Balanced Core Holdings",
          description: "Mix of growth and income for stability",
          strategy: "balanced",
          user_id: "user1",
          created_at: "2024-03-10",
          updated_at: "2024-12-05",
          holdings: [],
          totalValue: 67800,
          monthlyIncome: 298.4,
          ytdPerformance: 12.1,
          holdingsCount: 0,
          averageYield: 3.1,
        },
      ]

      const portfoliosWithRealData = await Promise.all(
        mockPortfolios.map(async (portfolio) => {
          if (portfolio.holdings.length > 0) {
            console.log(`[v0] Fetching real data for ${portfolio.name}`)
            return await fetchPortfolioRealData(portfolio)
          }
          return portfolio
        }),
      )

      setPortfolios(portfoliosWithRealData)
      console.log("[v0] Loaded portfolios with real data:", portfoliosWithRealData)
    } catch (error) {
      console.error("Error loading portfolios:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPortfolio = async () => {
    try {
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        name: portfolioName,
        description: portfolioDescription,
        strategy: portfolioStrategy,
        user_id: "user1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        holdings: [],
        totalValue: Number.parseInt(startingAmount) || 0,
        monthlyIncome: 0,
        ytdPerformance: 0,
        holdingsCount: 0,
        averageYield: 0,
      }

      setPortfolios([newPortfolio, ...portfolios])
      setPortfolioName("")
      setPortfolioDescription("")
      setPortfolioStrategy("income")
      setStartingAmount("10000")
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Error creating portfolio:", error)
    }
  }

  const deletePortfolio = (id: string) => {
    setPortfolios(portfolios.filter((p) => p.id !== id))
  }

  const duplicatePortfolio = (portfolio: Portfolio) => {
    const duplicated: Portfolio = {
      ...portfolio,
      id: Date.now().toString(),
      name: `${portfolio.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setPortfolios([duplicated, ...portfolios])
  }

  const quickStats: QuickStats = {
    totalPortfolioValue: portfolios.reduce((sum, p) => sum + p.totalValue, 0),
    combinedMonthlyIncome: portfolios.reduce((sum, p) => sum + p.monthlyIncome, 0),
    averageYield:
      portfolios.length > 0 ? portfolios.reduce((sum, p) => sum + p.averageYield, 0) / portfolios.length : 0,
    totalHoldings: portfolios.reduce((sum, p) => sum + p.holdingsCount, 0),
  }

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case "growth":
        return "from-green-500 to-emerald-600"
      case "income":
        return "from-blue-500 to-indigo-600"
      case "balanced":
        return "from-purple-500 to-violet-600"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getStrategyBadge = (strategy: string) => {
    switch (strategy) {
      case "growth":
        return "bg-green-100 text-green-800 border-green-200"
      case "income":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "balanced":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const handleAddAssets = (portfolio: Portfolio) => {
    const currentAssets = portfolio.holdingsCount || 0

    if (currentAssets >= limits.maxAssets) {
      alert(`Upgrade to add more than ${limits.maxAssets} assets`)
      return
    }

    setSelectedPortfolio(portfolio)
    setShowAddAssets(true)
  }

  const handleViewDetails = (portfolio: Portfolio) => {
    if (!limits.canViewDetails) {
      alert("Upgrade to Casual or Professional to view detailed analytics")
      return
    }

    setSelectedPortfolio(portfolio)
    setShowDetails(true)
  }

  const searchAssets = async () => {
    if (!searchQuery) return

    try {
      const res = await fetch(`/api/search-assets?q=${searchQuery}`)
      const data = await res.json()

      // Handle both old and new API response formats
      const results = data.result || data || []
      setSearchResults(results)

      console.log("[v0] Search results:", results)
    } catch (error) {
      console.error("Error searching assets:", error)
      setSearchResults([])
    }
  }

  const fetchPortfolioRealData = async (portfolio: Portfolio) => {
    if (!portfolio.holdings || portfolio.holdings.length === 0) {
      return portfolio
    }

    try {
      // Get real quotes for all holdings
      const holdingsWithRealData = await Promise.all(
        portfolio.holdings.map(async (holding) => {
          try {
            const res = await fetch(`/api/asset-quote?symbol=${holding.asset_ticker}`)
            const quoteData = await res.json()

            return {
              ...holding,
              currentPrice: quoteData.price || 0,
              change: quoteData.change || 0,
              changePercent: quoteData.changesPercentage || 0,
              marketValue: (quoteData.price || 0) * holding.shares,
            }
          } catch (error) {
            console.error(`Error fetching quote for ${holding.asset_ticker}:`, error)
            return holding
          }
        }),
      )

      // Calculate real portfolio metrics
      const totalValue = holdingsWithRealData.reduce((sum, h) => sum + (h.marketValue || h.investment_amount), 0)

      // Get dividend data for yield calculation
      const symbols = portfolio.holdings.map((h) => h.asset_ticker).join(",")
      const divRes = await fetch(`/api/dividend-data?symbols=${symbols}`)
      const divData = await divRes.json()

      let monthlyIncome = 0
      let totalYield = 0

      if (divData.data) {
        divData.data.forEach((div: any) => {
          const holding = holdingsWithRealData.find((h) => h.asset_ticker === div.symbol)
          if (holding && div.annualDividend > 0) {
            const annualIncome = div.annualDividend * holding.shares
            monthlyIncome += annualIncome / 12
            totalYield += div.dividendYield || 0
          }
        })
      }

      const averageYield = divData.data?.length > 0 ? totalYield / divData.data.length : 0

      return {
        ...portfolio,
        holdings: holdingsWithRealData,
        totalValue,
        monthlyIncome,
        averageYield,
        holdingsCount: holdingsWithRealData.length,
      }
    } catch (error) {
      console.error("Error fetching real portfolio data:", error)
      return portfolio
    }
  }

  const userTier = profile?.subscription_tier || "free"

  const tierLimits = {
    free: { maxAssets: 3, canViewDetails: false, canChat: false },
    casual: { maxAssets: 25, canViewDetails: true, canChat: false },
    professional: { maxAssets: 999, canViewDetails: true, canChat: true },
  }

  const limits = tierLimits[userTier as keyof typeof tierLimits] || tierLimits.free

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Portfolios</h2>
          <p className="text-slate-600">Preparing your investment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-white to-blue-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Value</p>
                <p className="text-lg font-bold text-slate-900">${quickStats.totalPortfolioValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-green-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly Income</p>
                <p className="text-lg font-bold text-slate-900">${quickStats.combinedMonthlyIncome.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-purple-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Average Yield</p>
                <p className="text-lg font-bold text-slate-900">{quickStats.averageYield.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-amber-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Holdings</p>
                <p className="text-lg font-bold text-slate-900">{quickStats.totalHoldings}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Portfolios</h1>
            <p className="text-slate-600">Manage your dividend-focused investment portfolios</p>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Portfolio Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Dividend Growth Portfolio"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="strategy">Investment Strategy</Label>
                  <Select value={portfolioStrategy} onValueChange={(value: any) => setPortfolioStrategy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growth">Growth - Focus on dividend growth</SelectItem>
                      <SelectItem value="income">Income - Maximize current yield</SelectItem>
                      <SelectItem value="balanced">Balanced - Mix of growth and income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Starting Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10000"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of your strategy"
                    value={portfolioDescription}
                    onChange={(e) => setPortfolioDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={createPortfolio} disabled={!portfolioName.trim()} className="flex-1">
                    Create Portfolio
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {portfolios.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card
                key={portfolio.id}
                className="p-6 hover:shadow-lg transition-all duration-200 border border-slate-200 bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`h-12 w-12 bg-gradient-to-br ${getStrategyColor(portfolio.strategy)} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate text-lg">{portfolio.name}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium capitalize ${getStrategyBadge(portfolio.strategy)}`}
                      >
                        {portfolio.strategy}
                      </Badge>
                      {portfolio.description && (
                        <p className="text-xs text-slate-500 truncate mt-1">{portfolio.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/dashboard/portfolios/${portfolio.id}`, "_blank")}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicatePortfolio(portfolio)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePortfolio(portfolio.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Total Value
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-slate-900">${portfolio.totalValue.toLocaleString()}</span>
                      <div className="h-4 w-16 bg-blue-50 rounded mt-1 flex items-center justify-center">
                        <div className="text-xs text-blue-600">📈</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Monthly Income
                    </span>
                    <span className="font-semibold text-green-600">${portfolio.monthlyIncome.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      YTD Return
                    </span>
                    <Badge variant={portfolio.ytdPerformance >= 0 ? "default" : "destructive"} className="text-xs">
                      {portfolio.ytdPerformance >= 0 ? "+" : ""}
                      {portfolio.ytdPerformance.toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Holdings</span>
                    <span className="font-medium text-slate-900">{portfolio.holdingsCount} assets</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Asset Allocation</span>
                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <PieChart className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs bg-transparent"
                      onClick={() => handleViewDetails(portfolio)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs bg-transparent"
                      onClick={() => handleAddAssets(portfolio)}
                    >
                      Add Assets
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-slate-300">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <PieChart className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Start Building Your Portfolio</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first dividend-focused portfolio to track income, analyze performance, and optimize your
              investments.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Portfolio
            </Button>
          </Card>
        )}

        {showAddAssets && selectedPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add Assets to {selectedPortfolio.name}</h2>
                <button onClick={() => setShowAddAssets(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchAssets()}
                  placeholder="Search stocks, ETFs (e.g., AAPL, VTI)"
                  className="flex-1"
                />
                <Button onClick={searchAssets}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="border rounded p-4 max-h-60 overflow-y-auto">
                  {searchResults.map((result: any) => (
                    <div key={result.symbol} className="flex justify-between items-center p-2 hover:bg-gray-50">
                      <div>
                        <span className="font-semibold">{result.symbol}</span>
                        <span className="ml-2 text-gray-600">{result.description || result.name}</span>
                        <div className="text-xs text-gray-500">
                          {result.exchange} • {result.currency || "USD"}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          console.log(`[v0] Adding ${result.symbol} to ${selectedPortfolio.name}`)
                          alert(
                            `Added ${result.symbol} (${result.description || result.name}) to ${selectedPortfolio.name}`,
                          )
                          setShowAddAssets(false)
                          setSearchQuery("")
                          setSearchResults([])
                        }}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                {limits.maxAssets - (selectedPortfolio.holdingsCount || 0)} assets remaining in your {userTier} plan
              </p>
            </div>
          </div>
        )}

        {showDetails && selectedPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedPortfolio.name} Details</h2>
                <button onClick={() => setShowDetails(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded">
                  <h3 className="text-sm text-gray-600">Total Value</h3>
                  <p className="text-2xl font-bold">${selectedPortfolio.totalValue.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="text-sm text-gray-600">Monthly Income</h3>
                  <p className="text-2xl font-bold">${selectedPortfolio.monthlyIncome.toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="text-sm text-gray-600">YTD Performance</h3>
                  <p className="text-2xl font-bold">{selectedPortfolio.ytdPerformance.toFixed(1)}%</p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="text-sm text-gray-600">Average Yield</h3>
                  <p className="text-2xl font-bold">{selectedPortfolio.averageYield.toFixed(1)}%</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Holdings ({selectedPortfolio.holdingsCount} assets)</h3>
                <div className="border rounded p-4 text-center text-gray-500">
                  Holdings data will be displayed here when assets are added
                </div>
              </div>

              {limits.canChat ? (
                <Button className="w-full py-3 bg-purple-500 hover:bg-purple-600">
                  Chat with Portfolio (Professional Feature)
                </Button>
              ) : (
                <div className="p-4 bg-gray-100 rounded text-center">
                  <p className="text-gray-600">Upgrade to Professional to unlock AI Portfolio Chat</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
