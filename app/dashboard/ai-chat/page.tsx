"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

export default function AIChatPage() {
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">AI Chat Assistant</h1>
            <p className="text-xl text-slate-600 mb-8">
              Get personalized dividend investment insights powered by artificial intelligence
            </p>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-left hover:shadow-lg transition-all duration-200">
              <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Portfolio Analysis</h3>
              <p className="text-slate-600 text-sm">
                Get AI-powered insights about your portfolio composition, risk analysis, and optimization suggestions.
              </p>
            </Card>

            <Card className="p-6 text-left hover:shadow-lg transition-all duration-200">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Investment Education</h3>
              <p className="text-slate-600 text-sm">
                Ask questions about dividend investing strategies, market trends, and get educational responses.
              </p>
            </Card>

            <Card className="p-6 text-left hover:shadow-lg transition-all duration-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                <ArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Recommendations</h3>
              <p className="text-slate-600 text-sm">
                Receive personalized asset recommendations based on your investment goals and risk tolerance.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-slate-300 mb-6">
              We're working hard to bring you the most advanced AI-powered dividend investment assistant. Get notified
              when it launches!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/portfolios">
                <Button className="bg-blue-600 hover:bg-blue-700">Manage Portfolios</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
