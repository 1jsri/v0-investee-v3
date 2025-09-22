"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Target, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Percent, RefreshCw } from "lucide-react"

interface Holding {
  id: string
  asset_ticker: string
  asset_name: string
  investment_amount: number
  shares: number
}

interface RebalancingSuggestion {
  type: "overweight" | "underweight" | "add" | "reduce"
  asset: string
  currentWeight: number
  targetWeight: number
  suggestedAction: string
  amount: number
  priority: "high" | "medium" | "low"
  reason: string
}

interface RebalancingSuggestionsProps {
  holdings: Holding[]
  portfolioId: string
  onRebalance: () => void
}

export function RebalancingSuggestions({ holdings, portfolioId, onRebalance }: RebalancingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<RebalancingSuggestion[]>([])
  const [targetAllocation, setTargetAllocation] = useState<Record<string, number>>({})
  const [showRebalanceDialog, setShowRebalanceDialog] = useState(false)
  const [isRebalancing, setIsRebalancing] = useState(false)

  useEffect(() => {
    generateSuggestions()
  }, [holdings])

  const generateSuggestions = async () => {
    if (holdings.length === 0) return

    const totalValue = holdings.reduce((sum, h) => sum + h.investment_amount, 0)

    // Define target allocations based on portfolio type
    const defaultTargets = {
      "Large Cap": 40,
      "Mid Cap": 20,
      "Small Cap": 10,
      International: 15,
      Bonds: 10,
      REITs: 5,
    }

    // Categorize holdings (mock categorization)
    const categoryMapping: Record<string, string> = {
      AAPL: "Large Cap",
      MSFT: "Large Cap",
      GOOGL: "Large Cap",
      AMZN: "Large Cap",
      TSLA: "Large Cap",
      NVDA: "Large Cap",
      VTI: "Large Cap",
      SPY: "Large Cap",
      QQQ: "Large Cap",
      IWM: "Small Cap",
      VB: "Small Cap",
      VXUS: "International",
      VEA: "International",
      BND: "Bonds",
      AGG: "Bonds",
      VNQ: "REITs",
      SCHH: "REITs",
    }

    const currentAllocation: Record<string, number> = {}

    holdings.forEach((holding) => {
      const category = categoryMapping[holding.asset_ticker] || "Other"
      const weight = (holding.investment_amount / totalValue) * 100
      currentAllocation[category] = (currentAllocation[category] || 0) + weight
    })

    const newSuggestions: RebalancingSuggestion[] = []

    // Generate rebalancing suggestions
    Object.entries(defaultTargets).forEach(([category, target]) => {
      const current = currentAllocation[category] || 0
      const difference = Math.abs(current - target)

      if (difference > 5) {
        // 5% threshold
        const isOverweight = current > target
        const suggestedAmount = totalValue * (difference / 100)

        newSuggestions.push({
          type: isOverweight ? "reduce" : "add",
          asset: category,
          currentWeight: current,
          targetWeight: target,
          suggestedAction: isOverweight
            ? `Reduce ${category} allocation by ${difference.toFixed(1)}%`
            : `Increase ${category} allocation by ${difference.toFixed(1)}%`,
          amount: suggestedAmount,
          priority: difference > 15 ? "high" : difference > 10 ? "medium" : "low",
          reason: isOverweight
            ? `${category} is overweighted and may increase portfolio risk`
            : `${category} is underweighted relative to target allocation`,
        })
      }
    })

    // Add individual asset suggestions
    holdings.forEach((holding) => {
      const weight = (holding.investment_amount / totalValue) * 100
      if (weight > 25) {
        // Individual position too large
        newSuggestions.push({
          type: "overweight",
          asset: holding.asset_ticker,
          currentWeight: weight,
          targetWeight: 20,
          suggestedAction: `Reduce ${holding.asset_ticker} position`,
          amount: totalValue * ((weight - 20) / 100),
          priority: "high",
          reason: "Individual position exceeds 25% of portfolio, increasing concentration risk",
        })
      }
    })

    setSuggestions(
      newSuggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }),
    )
  }

  const executeRebalancing = async () => {
    setIsRebalancing(true)

    try {
      // In a real implementation, this would execute the rebalancing trades
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Update portfolio holdings in database
      // This is a simplified version - real implementation would handle partial sales/purchases

      setShowRebalanceDialog(false)
      onRebalance() // Refresh parent component
    } catch (error) {
      console.error("Rebalancing failed:", error)
    } finally {
      setIsRebalancing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "overweight":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "underweight":
        return <TrendingUp className="h-4 w-4 text-blue-500 rotate-180" />
      case "add":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "reduce":
        return <Percent className="h-4 w-4 text-orange-500" />
      default:
        return <Target className="h-4 w-4" />
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

  if (holdings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Holdings to Rebalance</h3>
        <p className="text-slate-600">Add assets to your portfolio to receive rebalancing suggestions</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Portfolio Rebalancing</h3>
            <p className="text-slate-600">Optimize your allocation for better risk-adjusted returns</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={generateSuggestions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {suggestions.length > 0 && (
              <Button onClick={() => setShowRebalanceDialog(true)}>
                <Target className="h-4 w-4 mr-2" />
                Auto-Rebalance
              </Button>
            )}
          </div>
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Portfolio is Well Balanced</h4>
            <p className="text-slate-600">Your current allocation aligns well with target diversification</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(suggestion.type)}
                    <div>
                      <h4 className="font-semibold text-slate-900">{suggestion.asset}</h4>
                      <p className="text-sm text-slate-600">{suggestion.suggestedAction}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Current Weight:</span>
                    <span className="font-medium">{suggestion.currentWeight.toFixed(1)}%</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Target Weight:</span>
                      <span className="font-medium">{suggestion.targetWeight.toFixed(1)}%</span>
                    </div>
                    <Progress value={suggestion.currentWeight} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Suggested Amount:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(suggestion.amount)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">{suggestion.reason}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={showRebalanceDialog} onOpenChange={setShowRebalanceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Execute Portfolio Rebalancing
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Rebalancing Summary</span>
              </div>
              <p className="text-sm text-blue-800">
                This will execute {suggestions.length} rebalancing actions to optimize your portfolio allocation.
                Estimated cost: $25 in transaction fees.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Planned Actions:</h4>
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium">{suggestion.asset}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(suggestion.amount)}</div>
                    <div className="text-xs text-slate-600">{suggestion.suggestedAction}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={executeRebalancing} disabled={isRebalancing} className="flex-1">
                {isRebalancing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Rebalancing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Execute Rebalancing
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowRebalanceDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
