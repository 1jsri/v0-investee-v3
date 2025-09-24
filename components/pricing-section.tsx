"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const plans = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "forever",
    yearlyPeriod: "per year",
    description: "Perfect for beginners learning about dividends",
    icon: Star,
    monthlyPriceId: null,
    yearlyPriceId: null,
    features: [
      "Track up to 2 dividend stocks",
      "Basic dividend calculator",
      "Educational resources about passive income",
      "Mobile-friendly interface",
      "5 AI chat prompts per month",
    ],
    limitations: ["Limited to 2 assets", "No portfolio export"],
    cta: "Start Learning Free",
    popular: false,
  },
  {
    name: "Casual",
    monthlyPrice: "$9",
    yearlyPrice: "$90",
    period: "per month",
    yearlyPeriod: "per year",
    description: "For those ready to build their first dividend portfolio",
    icon: Zap,
    monthlyPriceId: "price_casual_monthly",
    yearlyPriceId: "price_casual_yearly",
    features: [
      "Track up to 50 dividend-paying stocks",
      "50 AI chat prompts per month",
      "3-day free trial for new users",
      "Advanced portfolio analytics and insights",
      "Downloadable PDF portfolio reports",
      "Historical dividend performance data",
      "Email alerts for upcoming dividend payments",
      "Priority customer support via chat",
    ],
    limitations: [],
    cta: "Start 3-Day Free Trial",
    popular: true,
    savings: "Save 2 months",
  },
  {
    name: "Professional",
    monthlyPrice: "$19",
    yearlyPrice: "$190",
    period: "per month",
    yearlyPeriod: "per year",
    description: "For serious investors managing multiple portfolios",
    icon: Crown,
    monthlyPriceId: "price_professional_monthly",
    yearlyPriceId: "price_professional_yearly",
    features: [
      "Track up to 150 dividend investments",
      "Create and manage multiple portfolios",
      "Unlimited AI chat prompts",
      "Advanced AI insights with market analysis",
      "Custom dividend projection modeling",
      "API access for advanced data export",
      "Professional-grade PDF reports",
      "Dedicated account manager support",
      "Early access to new investment tools",
    ],
    limitations: [],
    cta: "Go Professional",
    popular: false,
    savings: "Save 2 months",
  },
]

export function PricingSection() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [isYearly, setIsYearly] = useState(false)

  const handlePlanSelect = async (planName: string, priceId: string | null) => {
    router.push(`/auth/signin?plan=${planName.toLowerCase()}`)
    return

    // Original Stripe checkout code commented out
    /* if (!priceId) {
      router.push(`/auth/signin?plan=${planName.toLowerCase()}`)
      return
    }

    setLoading(planName)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planName: planName.toLowerCase(),
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.fallbackUrl) {
        router.push(data.fallbackUrl)
      } else {
        throw new Error(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("[v0] Error creating checkout session:", error)
      alert("Payment system temporarily unavailable. You can still sign up for free!")
      router.push(`/auth/signin?plan=${planName.toLowerCase()}&payment_error=true`)
    } finally {
      setLoading(null)
    } */
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
            Choose Your Learning Path
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start free and upgrade as you build confidence in dividend investing.
            <br className="hidden sm:block" />
            Cancel anytime, no long-term commitments.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isYearly ? "text-black" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? "bg-black" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? "text-black" : "text-gray-500"}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isLoading = loading === plan.name
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const currentPeriod = isYearly ? plan.yearlyPeriod : plan.period
            const currentPriceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId

            return (
              <Card
                key={plan.name}
                className={`relative p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular
                    ? "border-2 border-black shadow-xl scale-[1.02] bg-white ring-2 ring-black ring-opacity-5"
                    : "border border-gray-200 shadow-lg hover:shadow-xl bg-white"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 text-sm font-semibold rounded-full">
                    Most Popular
                  </Badge>
                )}

                {isYearly && plan.savings && (
                  <Badge className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                    {plan.savings}
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      plan.popular ? "bg-black text-white" : "bg-gray-100 text-black"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-black">{currentPrice}</span>
                    {currentPeriod !== "forever" && (
                      <span className="text-gray-500 ml-1 text-base">/{currentPeriod}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      {feature.includes("AI chat") && (
                        <MessageCircle className="h-4 w-4 text-blue-500 ml-1 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePlanSelect(plan.name, currentPriceId)}
                  disabled={isLoading}
                  className={`w-full py-3 text-base font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-white text-black border-2 border-black hover:bg-black hover:text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Processing..." : plan.name === "Free" ? plan.cta : "Start Free"}
                </Button>

                {plan.name === "Free" && (
                  <p className="text-xs text-gray-500 text-center mt-3">No credit card required</p>
                )}
                {plan.name !== "Free" && (
                  <p className="text-xs text-gray-500 text-center mt-3">Currently free access - billing coming soon</p>
                )}
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-base text-gray-600 mb-4">Questions about our plans? We're here to help you get started.</p>
          <Button
            variant="outline"
            className="border-2 border-black text-black hover:bg-black hover:text-white bg-transparent px-6 py-2 text-base font-medium transition-all duration-300"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  )
}
