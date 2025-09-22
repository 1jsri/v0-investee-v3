"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Share2,
  Bookmark,
  Calendar,
  DollarSign,
  BarChart3,
  MessageCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { AssetPriceChart } from "@/components/asset-price-chart"
import { DividendHistoryChart } from "@/components/dividend-history-chart"
import { AssetNewsFeed } from "@/components/asset-news-feed"
import { AssetChatInterface } from "@/components/asset-chat-interface"

interface AssetData {
  symbol: string
  companyName: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  peRatio: number
  eps: number
  dividendYield: number
  annualDividend: number
  payoutRatio: number
  exDividendDate: string
  paymentDate: string
  frequency: string
  week52High: number
  week52Low: number
  beta: number
  volume: number
  dividendSafetyScore: number
  consecutiveYears: number
  dividendGrowthRate: number
  logo?: string
  description?: string
  sector?: string
  industry?: string
}

export default function AssetDetailPage() {
  const params = useParams()
  const ticker = params.ticker as string
  const [assetData, setAssetData] = useState<AssetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [marketStatus, setMarketStatus] = useState<"open" | "closed">("closed")

  useEffect(() => {
    if (ticker) {
      fetchAssetData()
    }
  }, [ticker])

  const fetchAssetData = async () => {
    try {
      // Fetch asset data from multiple APIs
      const [quoteResponse, profileResponse] = await Promise.all([
        fetch(`/api/asset-quote?symbol=${ticker}`),
        fetch(`/api/asset-profile?symbol=${ticker}`),
      ])

      const quoteData = await quoteResponse.json()
      const profileData = await profileResponse.json()

      // Mock data for demonstration - replace with real API data
      setAssetData({
        symbol: ticker.toUpperCase(),
        companyName: profileData.companyName || `${ticker.toUpperCase()} Company`,
        price: quoteData.price || 150.25,
        change: quoteData.change || 2.45,
        changePercent: quoteData.changePercent || 1.66,
        marketCap: profileData.mktCap || 2500000000000,
        peRatio: 28.5,
        eps: 5.27,
        dividendYield: 0.52,
        annualDividend: 0.96,
        payoutRatio: 18.2,
        exDividendDate: "2024-02-09",
        paymentDate: "2024-02-16",
        frequency: "Quarterly",
        week52High: 199.62,
        week52Low: 124.17,
        beta: 1.29,
        volume: 45678900,
        dividendSafetyScore: 85,
        consecutiveYears: 12,
        dividendGrowthRate: 7.8,
        logo: profileData.image,
        description: profileData.description,
        sector: profileData.sector,
        industry: profileData.industry,
      })

      // Determine market status
      const now = new Date()
      const hour = now.getHours()
      setMarketStatus(hour >= 9 && hour < 16 ? "open" : "closed")
    } catch (error) {
      console.error("Failed to fetch asset data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return formatCurrency(value)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!assetData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Asset Not Found</h1>
          <p className="text-slate-600 mb-6">The asset {ticker} could not be found.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {assetData.logo && (
                <img
                  src={assetData.logo || "/placeholder.svg"}
                  alt={`${assetData.companyName} logo`}
                  className="w-16 h-16 rounded-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{assetData.companyName}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold text-slate-600">{assetData.symbol}</span>
                  <Badge variant={marketStatus === "open" ? "default" : "secondary"}>
                    Market {marketStatus === "open" ? "Open" : "Closed"}
                  </Badge>
                  {assetData.sector && <Badge variant="outline">{assetData.sector}</Badge>}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-slate-900">{formatCurrency(assetData.price)}</div>
              <div
                className={`flex items-center gap-2 text-lg font-semibold ${
                  assetData.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {assetData.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {assetData.change >= 0 ? "+" : ""}
                {formatCurrency(assetData.change)} ({assetData.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add to Portfolio
            </Button>
            <Button variant="outline">
              <Bookmark className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-xs text-slate-500 mb-1">Market Cap</div>
            <div className="text-lg font-semibold">{formatLargeNumber(assetData.marketCap)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-slate-500 mb-1">P/E Ratio</div>
            <div className="text-lg font-semibold">{assetData.peRatio}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-slate-500 mb-1">EPS</div>
            <div className="text-lg font-semibold">{formatCurrency(assetData.eps)}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-xs text-green-700 mb-1">Dividend Yield</div>
            <div className="text-lg font-semibold text-green-800">{assetData.dividendYield.toFixed(2)}%</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="text-xs text-blue-700 mb-1">Annual Dividend</div>
            <div className="text-lg font-semibold text-blue-800">{formatCurrency(assetData.annualDividend)}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="text-xs text-purple-700 mb-1">Payout Ratio</div>
            <div className="text-lg font-semibold text-purple-800">{assetData.payoutRatio.toFixed(1)}%</div>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="dividends">Dividends</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="chat">AI Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <AssetPriceChart symbol={assetData.symbol} />

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {assetData.description ||
                      `${assetData.companyName} is a leading company in the ${assetData.sector || "technology"} sector.`}
                  </p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">52-Week High</span>
                        <span className="font-medium">{formatCurrency(assetData.week52High)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">52-Week Low</span>
                        <span className="font-medium">{formatCurrency(assetData.week52Low)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Beta</span>
                        <span className="font-medium">{assetData.beta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Volume</span>
                        <span className="font-medium">{assetData.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Dividend Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ex-Dividend Date</span>
                        <span className="font-medium">{assetData.exDividendDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Payment Date</span>
                        <span className="font-medium">{assetData.paymentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Frequency</span>
                        <span className="font-medium">{assetData.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Consecutive Years</span>
                        <span className="font-medium">{assetData.consecutiveYears} years</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dividends" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Dividend Safety Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Dividend Safety Score</span>
                        <span className="font-semibold">{assetData.dividendSafetyScore}/100</span>
                      </div>
                      <Progress value={assetData.dividendSafetyScore} className="h-3" />
                      <p className="text-sm text-slate-500 mt-1">
                        {assetData.dividendSafetyScore >= 80
                          ? "Very Safe"
                          : assetData.dividendSafetyScore >= 60
                            ? "Moderately Safe"
                            : "At Risk"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-800">{assetData.consecutiveYears}</div>
                        <div className="text-sm text-green-600">Consecutive Years</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-800">
                          {assetData.dividendGrowthRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-blue-600">5-Year Growth Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-800">{assetData.payoutRatio.toFixed(1)}%</div>
                        <div className="text-sm text-purple-600">Payout Ratio</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <DividendHistoryChart symbol={assetData.symbol} />
              </TabsContent>

              <TabsContent value="charts">
                <AssetPriceChart symbol={assetData.symbol} />
              </TabsContent>

              <TabsContent value="news">
                <AssetNewsFeed symbol={assetData.symbol} />
              </TabsContent>

              <TabsContent value="chat">
                <AssetChatInterface symbol={assetData.symbol} companyName={assetData.companyName} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-6">
              {/* Peer Comparison */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Peer Comparison</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded text-xs font-semibold flex items-center justify-center text-blue-700">
                        MSFT
                      </div>
                      <span className="text-sm">Microsoft</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      0.72%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded text-xs font-semibold flex items-center justify-center text-purple-700">
                        GOOGL
                      </div>
                      <span className="text-sm">Alphabet</span>
                    </div>
                    <Badge variant="outline" className="text-slate-600 border-slate-200">
                      0.00%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded text-xs font-semibold flex items-center justify-center text-green-700">
                        NVDA
                      </div>
                      <span className="text-sm">NVIDIA</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      0.03%
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Earnings Report</div>
                      <div className="text-xs text-slate-500">Jan 25, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">Ex-Dividend Date</div>
                      <div className="text-xs text-slate-500">{assetData.exDividendDate}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-3 bg-slate-900 hover:bg-slate-800">
                    <Plus className="h-4 w-4" />
                    Add to Portfolio
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                    <BarChart3 className="h-4 w-4" />
                    Compare Assets
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                    <MessageCircle className="h-4 w-4" />
                    Chat with AI
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
