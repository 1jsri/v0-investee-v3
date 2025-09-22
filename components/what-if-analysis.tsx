"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calculator, Plus, Minus, RotateCcw } from "lucide-react"
import { AssetSearch } from "@/components/asset-search"

interface Holding {
  id: string
  asset_ticker: string
  asset_name: string
  investment_amount: number
  shares: number
}

interface WhatIfScenario {
  name: string
  projectedValue: number
  projectedIncome: number
  riskChange: number
  changes: string[]
}

interface WhatIfAnalysisProps {
  holdings: Holding[]
  portfolioValue: number
}

export function WhatIfAnalysis({ holdings, portfolioValue }: WhatIfAnalysisProps) {
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([])
  const [activeTab, setActiveTab] = useState("add-asset")
  const [newAssetAmount, setNewAssetAmount] = useState<number>(1000)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [removeAmount, setRemoveAmount] = useState<number>(1000)
  const [selectedHolding, setSelectedHolding] = useState<string>("")

  const calculateScenario = (type: "add" | "remove", asset?: any, amount?: number, holdingId?: string) => {
    const baseValue = portfolioValue
    const baseIncome = holdings.reduce((sum, h) => sum + h.investment_amount * 0.035, 0) // 3.5% avg yield

    let newValue = baseValue
    let newIncome = baseIncome
    let riskChange = 0
    const changes: string[] = []

    if (type === "add" && asset && amount) {
      newValue += amount
      newIncome += amount * 0.04 // Assume 4% yield for new asset
      riskChange = Math.random() * 0.5 - 0.25 // Random risk change
      changes.push(`Add ${asset.symbol}: +$${amount.toLocaleString()}`)
    } else if (type === "remove" && holdingId && amount) {
      const holding = holdings.find((h) => h.id === holdingId)
      if (holding) {
        newValue -= Math.min(amount, holding.investment_amount)
        newIncome -= Math.min(amount, holding.investment_amount) * 0.035
        riskChange = Math.random() * 0.3 - 0.15
        changes.push(`Reduce ${holding.asset_ticker}: -$${amount.toLocaleString()}`)
      }
    }

    return {
      name: `${type === "add" ? "Add" : "Remove"} ${asset?.symbol || selectedHolding}`,
      projectedValue: newValue,
      projectedIncome: newIncome,
      riskChange,
      changes,
    }
  }

  const addScenario = () => {
    let scenario: WhatIfScenario

    if (activeTab === "add-asset" && selectedAsset) {
      scenario = calculateScenario("add", selectedAsset, newAssetAmount)
    } else if (activeTab === "remove-asset" && selectedHolding) {
      scenario = calculateScenario("remove", null, removeAmount, selectedHolding)
    } else {
      return
    }

    setScenarios([...scenarios, scenario])
  }

  const clearScenarios = () => {
    setScenarios([])
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const generateProjectionData = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() + i)
      return date.toLocaleDateString("en-US", { month: "short" })
    })

    return months.map((month, index) => {
      const baseGrowth = portfolioValue * Math.pow(1.08, index / 12) // 8% annual growth
      const data: any = {
        month,
        current: baseGrowth,
      }

      scenarios.forEach((scenario, scenarioIndex) => {
        const scenarioGrowth = scenario.projectedValue * Math.pow(1.08 + scenario.riskChange / 100, index / 12)
        data[`scenario${scenarioIndex}`] = scenarioGrowth
      })

      return data
    })
  }

  const projectionData = generateProjectionData()

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              What-If Analysis
            </h3>
            <p className="text-slate-600">Simulate portfolio changes and see projected outcomes</p>
          </div>

          {scenarios.length > 0 && (
            <Button variant="outline" onClick={clearScenarios}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-asset">Add Asset</TabsTrigger>
            <TabsTrigger value="remove-asset">Remove Asset</TabsTrigger>
          </TabsList>

          <TabsContent value="add-asset" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Asset</label>
                <AssetSearch
                  onAssetSelect={(asset) => setSelectedAsset(asset)}
                  placeholder="Search for asset to add..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
                <Input
                  type="number"
                  value={newAssetAmount}
                  onChange={(e) => setNewAssetAmount(Number(e.target.value))}
                  placeholder="1000"
                  min="1"
                />
              </div>
            </div>

            <Button onClick={addScenario} disabled={!selectedAsset} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Scenario
            </Button>
          </TabsContent>

          <TabsContent value="remove-asset" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Holding</label>
                <select
                  value={selectedHolding}
                  onChange={(e) => setSelectedHolding(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Choose holding to reduce...</option>
                  {holdings.map((holding) => (
                    <option key={holding.id} value={holding.id}>
                      {holding.asset_ticker} - {formatCurrency(holding.investment_amount)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reduction Amount</label>
                <Input
                  type="number"
                  value={removeAmount}
                  onChange={(e) => setRemoveAmount(Number(e.target.value))}
                  placeholder="1000"
                  min="1"
                />
              </div>
            </div>

            <Button onClick={addScenario} disabled={!selectedHolding} className="w-full">
              <Minus className="h-4 w-4 mr-2" />
              Add Scenario
            </Button>
          </TabsContent>
        </Tabs>
      </Card>

      {scenarios.length > 0 && (
        <>
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Scenario Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {scenarios.map((scenario, index) => (
                <Card key={index} className="p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-slate-900">{scenario.name}</h5>
                    <Badge variant={scenario.riskChange > 0 ? "destructive" : "default"}>
                      Risk {scenario.riskChange > 0 ? "+" : ""}
                      {(scenario.riskChange * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Portfolio Value:</span>
                      <span className="font-semibold">{formatCurrency(scenario.projectedValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Annual Income:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(scenario.projectedIncome)}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {scenario.changes.map((change, i) => (
                        <div key={i}>{change}</div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">12-Month Projection</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "current"
                        ? "Current Portfolio"
                        : `Scenario ${Number.parseInt(name.replace("scenario", "")) + 1}`,
                    ]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="current" stroke="#64748b" strokeWidth={3} dot={false} />
                  {scenarios.map((_, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={`scenario${index}`}
                      stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
