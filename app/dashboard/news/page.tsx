"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Filter, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
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

  const mockNews = [
    {
      title: "Apple Announces Quarterly Dividend Increase",
      summary: "Apple Inc. raises its quarterly dividend by 4% to $0.25 per share",
      category: "Dividend",
      sentiment: "positive",
      time: "2 hours ago",
      source: "MarketWatch",
    },
    {
      title: "Microsoft Reports Strong Q4 Earnings",
      summary: "Microsoft beats earnings expectations with cloud growth driving results",
      category: "Earnings",
      sentiment: "positive",
      time: "4 hours ago",
      source: "CNBC",
    },
    {
      title: "Johnson & Johnson Maintains Dividend Aristocrat Status",
      summary: "J&J continues 62-year streak of consecutive dividend increases",
      category: "Analysis",
      sentiment: "neutral",
      time: "6 hours ago",
      source: "Seeking Alpha",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-24 w-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Newspaper className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Market News</h1>
            <p className="text-xl text-slate-600 mb-8">
              Stay informed with the latest dividend and market news tailored to your portfolio
            </p>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Latest Headlines</h2>
                <Button variant="outline" size="sm" disabled>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {mockNews.map((article, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          article.category === "Dividend"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : article.category === "Earnings"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {article.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          article.sentiment === "positive"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : article.sentiment === "negative"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {article.sentiment === "positive" ? "📈" : article.sentiment === "negative" ? "📉" : "📊"}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500">{article.time}</div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{article.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{article.summary}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Source: {article.source}</span>
                    <Button variant="ghost" size="sm" disabled>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">News Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Dividend Announcements</span>
                    <Badge variant="outline" className="text-xs">
                      12
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Earnings Reports</span>
                    <Badge variant="outline" className="text-xs">
                      8
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Market Analysis</span>
                    <Badge variant="outline" className="text-xs">
                      15
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Portfolio Holdings</span>
                    <Badge variant="outline" className="text-xs">
                      5
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Market Movers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-blue-100 rounded text-xs font-semibold flex items-center justify-center text-blue-700">
                        AAPL
                      </div>
                      <span className="text-sm font-medium">Apple</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">+2.4%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-green-100 rounded text-xs font-semibold flex items-center justify-center text-green-700">
                        MSFT
                      </div>
                      <span className="text-sm font-medium">Microsoft</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">+1.8%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-purple-100 rounded text-xs font-semibold flex items-center justify-center text-purple-700">
                        JNJ
                      </div>
                      <span className="text-sm font-medium">J&J</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">-0.5%</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Alerts</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get personalized news alerts for your portfolio holdings and watchlist.
                </p>
                <Button size="sm" disabled className="w-full">
                  Setup Alerts (Coming Soon)
                </Button>
              </Card>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Personalized News Feed</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Get real-time news and analysis tailored to your portfolio holdings. Stay ahead of market movements with
              AI-powered insights and sentiment analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button className="bg-red-600 hover:bg-red-700">View Analytics</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
