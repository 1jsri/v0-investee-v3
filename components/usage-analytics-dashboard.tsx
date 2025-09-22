"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, MessageCircle, PieChart, Calendar, Crown } from "lucide-react"

interface UsageAnalyticsDashboardProps {
  profile: {
    subscription_tier: string
    trial_ends_at?: string
  }
  usageData: {
    assetsUsed: number
    assetsLimit: number
    chatUsed: number
    chatLimit: number
    monthlyUsage: Array<{ month: string; assets: number; chats: number }>
  }
  onUpgrade: () => void
}

export function UsageAnalyticsDashboard({ profile, usageData, onUpgrade }: UsageAnalyticsDashboardProps) {
  const isOnTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()
  const trialDaysLeft = isOnTrial
    ? Math.ceil((new Date(profile.trial_ends_at!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const assetUsagePercent = (usageData.assetsUsed / usageData.assetsLimit) * 100
  const chatUsagePercent = usageData.chatLimit === -1 ? 0 : (usageData.chatUsed / usageData.chatLimit) * 100

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return "text-red-600"
    if (percent >= 75) return "text-amber-600"
    return "text-green-600"
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500"
    if (percent >= 75) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-6">
      {/* Trial Warning */}
      {isOnTrial && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-900">Trial Ending Soon</h3>
                  <p className="text-sm text-amber-700">
                    Your free trial ends in {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Button onClick={onUpgrade} className="bg-amber-600 hover:bg-amber-700">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5" />
              Asset Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assets Used</span>
                <span className={`font-semibold ${getUsageColor(assetUsagePercent)}`}>
                  {usageData.assetsUsed} / {usageData.assetsLimit}
                </span>
              </div>
              <Progress value={assetUsagePercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{assetUsagePercent.toFixed(0)}% used</span>
                <span>{usageData.assetsLimit - usageData.assetsUsed} remaining</span>
              </div>
              {assetUsagePercent >= 80 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    You're approaching your asset limit. Consider upgrading to track more investments.
                  </p>
                  <Button size="sm" variant="outline" onClick={onUpgrade} className="mt-2 bg-transparent">
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-5 w-5" />
              AI Chat Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prompts Used</span>
                <span className={`font-semibold ${getUsageColor(chatUsagePercent)}`}>
                  {usageData.chatUsed} / {usageData.chatLimit === -1 ? "∞" : usageData.chatLimit}
                </span>
              </div>
              {usageData.chatLimit !== -1 && (
                <>
                  <Progress value={chatUsagePercent} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{chatUsagePercent.toFixed(0)}% used</span>
                    <span>{usageData.chatLimit - usageData.chatUsed} remaining</span>
                  </div>
                </>
              )}
              {usageData.chatLimit === -1 && (
                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                  Unlimited
                </Badge>
              )}
              {chatUsagePercent >= 80 && usageData.chatLimit !== -1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    You're running low on chat prompts. Upgrade for unlimited AI conversations.
                  </p>
                  <Button size="sm" variant="outline" onClick={onUpgrade} className="mt-2 bg-transparent">
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData.monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} name="Assets Tracked" />
                <Line type="monotone" dataKey="chats" stroke="#10b981" strokeWidth={2} name="AI Chats" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan: {profile.subscription_tier}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Free</h3>
              <p className="text-2xl font-bold mb-2">$0</p>
              <p className="text-sm text-muted-foreground">2 assets, 5 chats/month</p>
            </div>
            <div className="text-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2">Casual</h3>
              <p className="text-2xl font-bold mb-2">$9</p>
              <p className="text-sm text-muted-foreground">50 assets, 50 chats/month</p>
              <Badge className="mt-2 bg-blue-500">Most Popular</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Professional</h3>
              <p className="text-2xl font-bold mb-2">$19</p>
              <p className="text-sm text-muted-foreground">150 assets, unlimited chats</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button onClick={onUpgrade} className="bg-blue-600 hover:bg-blue-700">
              Compare All Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
