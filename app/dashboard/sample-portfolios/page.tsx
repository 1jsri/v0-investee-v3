"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Target, Clock, Copy, Eye } from "lucide-react"
import Link from "next/link"

export default function SamplePortfoliosPage() {
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

  const samplePortfolios = [
    {
      name: "Conservative Income",
      description: "Low-risk dividend aristocrats for steady income",
      yield: "3.2%",
      risk: "Low",
      assets: 15,
      strategy: "income",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Dividend Growth",
      description: "Companies with strong dividend growth history",
      yield: "2.1%",
      risk: "Medium",
      assets: 20,
      strategy: "growth",
      color: "from-green-500 to-green-600",
    },
    {
      name: "High Yield REIT",
      description: "Real estate investment trusts for maximum yield",
      yield: "5.8%",
      risk: "Medium-High",
      assets: 12,
      strategy: "income",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "International Dividend",
      description: "Global dividend stocks for diversification",
      yield: "3.8%",
      risk: "Medium",
      assets: 25,
      strategy: "balanced",
      color: "from-amber-500 to-amber-600",
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
            <div className="h-24 w-24 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <PieChart className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Sample Portfolios</h1>
            <p className="text-xl text-slate-600 mb-8">
              Professionally curated dividend portfolios to inspire your investment strategy
            </p>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {samplePortfolios.map((portfolio, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 bg-gradient-to-br ${portfolio.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{portfolio.name}</h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {portfolio.strategy}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6">{portfolio.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{portfolio.yield}</div>
                    <div className="text-xs text-slate-500">Avg Yield</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{portfolio.risk}</div>
                    <div className="text-xs text-slate-500">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{portfolio.assets}</div>
                    <div className="text-xs text-slate-500">Assets</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    View Details (Coming Soon)
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Portfolio Features</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Professionally researched and backtested strategies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Detailed asset allocation and rebalancing guidelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Risk analysis and expected return projections</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>One-click portfolio replication to your account</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Portfolio Categories</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Conservative Income</span>
                  <span className="text-sm text-slate-500">- Stable, low-risk dividends</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Dividend Growth</span>
                  <span className="text-sm text-slate-500">- Growing dividend payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">High Yield</span>
                  <span className="text-sm text-slate-500">- Maximum current income</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                  <span className="font-medium">Sector Focused</span>
                  <span className="text-sm text-slate-500">- Specialized strategies</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Professional Portfolio Templates</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Get access to institutional-quality portfolio templates designed by dividend investing experts. Each
              portfolio includes detailed analysis, risk metrics, and implementation guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/portfolios">
                <Button className="bg-purple-600 hover:bg-purple-700">Create Custom Portfolio</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
