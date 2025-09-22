"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, Crown, Zap, X, TrendingUp, MessageCircle, PieChart } from "lucide-react"

interface SubscriptionUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentTier: "free" | "casual" | "professional"
  usageData: {
    assetsUsed: number
    assetsLimit: number
    chatUsed: number
    chatLimit: number
  }
  triggerReason: "asset_limit" | "chat_limit" | "feature_locked" | "trial_ending"
}

export function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  currentTier,
  usageData,
  triggerReason,
}: SubscriptionUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getUpgradeMessage = () => {
    switch (triggerReason) {
      case "asset_limit":
        return {
          title: "Asset Limit Reached",
          message: "You've reached your asset tracking limit. Upgrade to track more dividend investments.",
          icon: PieChart,
        }
      case "chat_limit":
        return {
          title: "Chat Limit Reached",
          message: "You've used all your AI chat prompts this month. Upgrade for more conversations.",
          icon: MessageCircle,
        }
      case "feature_locked":
        return {
          title: "Premium Feature",
          message: "This feature is available with a paid subscription. Upgrade to unlock advanced tools.",
          icon: Crown,
        }
      case "trial_ending":
        return {
          title: "Trial Ending Soon",
          message: "Your free trial ends in 2 days. Continue with full access by upgrading now.",
          icon: TrendingUp,
        }
    }
  }

  const upgradeInfo = getUpgradeMessage()
  const Icon = upgradeInfo.icon

  const plans = [
    {
      name: "Casual",
      price: "$9",
      period: "per month",
      description: "Perfect for building your first portfolio",
      icon: Zap,
      priceId: "price_casual_monthly",
      features: [
        "Track up to 50 assets",
        "50 AI chat prompts/month",
        "Portfolio analytics",
        "PDF reports",
        "Email alerts",
      ],
      highlight: currentTier === "free",
    },
    {
      name: "Professional",
      price: "$19",
      period: "per month",
      description: "For serious dividend investors",
      icon: Crown,
      priceId: "price_professional_monthly",
      features: [
        "Track up to 150 assets",
        "Unlimited AI chat",
        "Multiple portfolios",
        "API access",
        "Dedicated support",
      ],
      highlight: currentTier === "casual",
    },
  ]

  const handleUpgrade = async (priceId: string, planName: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planName: planName.toLowerCase() }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Upgrade error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">{upgradeInfo.title}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{upgradeInfo.message}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Current Usage */}
        <Card className="p-4 bg-slate-50">
          <h3 className="font-semibold mb-3">Current Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Assets Tracked</span>
                <span>
                  {usageData.assetsUsed}/{usageData.assetsLimit}
                </span>
              </div>
              <Progress value={(usageData.assetsUsed / usageData.assetsLimit) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>AI Chat Prompts</span>
                <span>
                  {usageData.chatUsed}/{usageData.chatLimit === -1 ? "∞" : usageData.chatLimit}
                </span>
              </div>
              <Progress
                value={usageData.chatLimit === -1 ? 0 : (usageData.chatUsed / usageData.chatLimit) * 100}
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* Plan Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const PlanIcon = plan.icon
            return (
              <Card
                key={plan.name}
                className={`p-6 relative ${
                  plan.highlight ? "border-2 border-blue-500 bg-blue-50" : "border border-slate-200"
                }`}
              >
                {plan.highlight && <Badge className="absolute -top-2 left-4 bg-blue-500 text-white">Recommended</Badge>}

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <PlanIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleUpgrade(plan.priceId, plan.name)}
                  disabled={isLoading}
                  className={`w-full ${
                    plan.highlight ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {isLoading ? "Processing..." : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            )
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Cancel anytime • 30-day money-back guarantee • Secure payment via Stripe</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
