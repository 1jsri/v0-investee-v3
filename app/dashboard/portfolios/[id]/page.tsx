"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit3,
  Share2,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  Activity,
} from "lucide-react"
import { DividendProjectionCharts } from "@/components/dividend-projection-charts"
import { PortfolioAllocationChart } from "@/components/portfolio-allocation-chart"
import { SectorDiversificationChart } from "@/components/sector-diversification-chart"
import { PortfolioHoldingsTable } from "@/components/portfolio-holdings-table"
import { RebalancingSuggestions } from "@/components/rebalancing-suggestions"
import { PortfolioPerformanceChart } from "@/components/portfolio-performance-chart"

interface Portfolio {
  id: string
  name: string
  description?: string
  user_id: string
  created_at: string
  updated_at: string
}

interface Holding {
  id: string
  asset_ticker: string
  asset_name: string
  investment_amount: number
  shares: number
  portfolio_id: string
  created_at: string
  updated_at: string
}

interface PortfolioMetrics {
  totalValue: number
  totalInvested: number
  totalReturn: number
  totalReturnPercent: number
  dividendYield: number
  monthlyIncome: number
  annualIncome: number
  expenseRatio: number
  beta: number
  sharpeRatio: number
}

export default function PortfolioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const portfolioId = params.id as string

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (portfolioId) {
      loadPortfolioData()
    }
  }, [portfolioId])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)

      const mockPortfolio: Portfolio = {
        id: portfolioId,
        name: "Dividend Growth Portfolio",
        description: "Focus on dividend aristocrats with consistent growth",
        user_id: "demo",
        created_at: "2024-01-15",
        updated_at: "2024-12-10",
      }

      const mockHoldings: Holding[] = [
        {
          id: "1",
          asset_ticker: "AAPL",
          asset_name: "Apple Inc.",
          investment_amount: 12500,
          shares: 65,
          portfolio_id: portfolioId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          asset_ticker: "MSFT",
          asset_name: "Microsoft Corporation",
          investment_amount: 8750,
          shares: 25,
          portfolio_id: portfolioId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          asset_ticker: "JNJ",
          asset_name: "Johnson & Johnson",
          investment_amount: 5200,
          shares: 32,
          portfolio_id: portfolioId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      setPortfolio(mockPortfolio)
      setHoldings(mockHoldings)
      await calculateMetrics(mockHoldings)
    } catch (error) {
      console.error("Error loading portfolio:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = async (holdingsData: Holding[]) => {
    if (holdingsData.length === 0) {
      setMetrics({
        totalValue: 0,
        totalInvested: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        dividendYield: 0,
        monthlyIncome: 0,
        annualIncome: 0,
        expenseRatio: 0,
        beta: 0,
        sharpeRatio: 0,
      })
      return
    }

    try {
      const totalInvested = holdingsData.reduce((sum, holding) => sum + holding.investment_amount, 0)

      // Mock metrics calculation
      const totalValue = totalInvested * 1.15 // 15% gain
      const totalReturn = totalValue - totalInvested
      const annualDividend = totalValue * 0.025 // 2.5% yield

      setMetrics({
        totalValue,
        totalInvested,
        totalReturn,
        totalReturnPercent: (totalReturn / totalInvested) * 100,
        dividendYield: 2.5,
        monthlyIncome: annualDividend / 12,
        annualIncome: annualDividend,
        expenseRatio: 0.15,
        beta: 1.05,
        sharpeRatio: 1.2,
      })
    } catch (error) {
      console.error("Error calculating metrics:", error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Portfolio Not Found</h1>
        <Button onClick={() => router.push("/dashboard/portfolios")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolios
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/portfolios")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">{portfolio.name}</h1>
            {portfolio.description && <p className="text-slate-600 mt-1">{portfolio.description}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span>{holdings.length} assets</span>
              <span>•</span>
              <span>Updated {new Date(portfolio.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <Badge variant={metrics && metrics.totalReturn >= 0 ? "default" : "destructive"}>
              {metrics ? formatPercent(metrics.totalReturnPercent) : "0%"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Portfolio Value</p>
            <p className="text-2xl font-bold text-green-900">
              {metrics ? formatCurrency(metrics.totalValue) : formatCurrency(0)}
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              {metrics && metrics.totalReturn >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {metrics ? formatCurrency(Math.abs(metrics.totalReturn)) : "$0"} total return
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Percent className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Yield
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Dividend Yield</p>
            <p className="text-2xl font-bold text-blue-900">{metrics ? metrics.dividendYield.toFixed(2) : "0.00"}%</p>
            <p className="text-xs text-blue-600">{metrics ? formatCurrency(metrics.annualIncome) : "$0"} annually</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              Monthly
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">Monthly Income</p>
            <p className="text-2xl font-bold text-purple-900">
              {metrics ? formatCurrency(metrics.monthlyIncome) : formatCurrency(0)}
            </p>
            <p className="text-xs text-purple-600">Estimated dividend income</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              Risk
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-orange-700 uppercase tracking-wide">Portfolio Beta</p>
            <p className="text-2xl font-bold text-orange-900">{metrics ? metrics.beta.toFixed(2) : "1.00"}</p>
            <p className="text-xs text-orange-600">Market correlation</p>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="rebalancing">Rebalancing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioAllocationChart holdings={holdings} />
            <SectorDiversificationChart holdings={holdings} />
          </div>

          <PortfolioPerformanceChart portfolioId={portfolioId} holdings={holdings} metrics={metrics} />
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <PortfolioHoldingsTable holdings={holdings} onHoldingUpdate={loadPortfolioData} portfolioId={portfolioId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Risk Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Beta</span>
                  <span className="font-semibold">{metrics?.beta.toFixed(2) || "1.00"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Sharpe Ratio</span>
                  <span className="font-semibold">{metrics?.sharpeRatio.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Expense Ratio</span>
                  <span className="font-semibold">{metrics?.expenseRatio.toFixed(2) || "0.00"}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Allocation Health
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Well diversified</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">High tech concentration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Good dividend coverage</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Portfolio Score
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">8.2</div>
                <div className="text-sm text-slate-600 mb-4">Out of 10</div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Strong Portfolio
                </Badge>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <DividendProjectionCharts holdings={holdings} portfolioName={portfolio.name} />
        </TabsContent>

        <TabsContent value="rebalancing" className="space-y-6">
          <RebalancingSuggestions holdings={holdings} portfolioId={portfolioId} onRebalance={loadPortfolioData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
