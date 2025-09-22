"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, TrendingUp, Clock, Play, FileText } from "lucide-react"
import Link from "next/link"

export default function LearnHubPage() {
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
            <div className="h-24 w-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Learn Hub</h1>
            <p className="text-xl text-slate-600 mb-8">
              Master dividend investing with our comprehensive educational resources
            </p>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Beginner's Guide</h3>
              <p className="text-slate-600 text-sm mb-4">
                Start your dividend investing journey with our step-by-step beginner's course covering all the
                fundamentals.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Play className="h-3 w-3" />
                <span>12 video lessons</span>
                <span>•</span>
                <span>2 hours</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Advanced Strategies</h3>
              <p className="text-slate-600 text-sm mb-4">
                Learn sophisticated dividend investing strategies including DRIP, covered calls, and sector rotation.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FileText className="h-3 w-3" />
                <span>15 articles</span>
                <span>•</span>
                <span>Advanced</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Market Analysis</h3>
              <p className="text-slate-600 text-sm mb-4">
                Understand how to analyze dividend stocks, read financial statements, and evaluate company health.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Play className="h-3 w-3" />
                <span>8 video lessons</span>
                <span>•</span>
                <span>Intermediate</span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What You'll Learn</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>How to identify high-quality dividend-paying stocks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Portfolio construction and diversification strategies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Tax implications and optimization techniques</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Risk management and position sizing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Market timing and economic cycle analysis</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Learning Paths</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Foundation Course</div>
                    <div className="text-sm text-slate-600">Basic concepts and terminology</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Stock Analysis</div>
                    <div className="text-sm text-slate-600">Evaluate dividend sustainability</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Portfolio Building</div>
                    <div className="text-sm text-slate-600">Construct your dividend portfolio</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Get Early Access</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Be among the first to access our comprehensive dividend investing curriculum. Join our waitlist and get
              notified when the Learn Hub launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/portfolios">
                <Button className="bg-green-600 hover:bg-green-700">Start Building Portfolio</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
