"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, BookOpen } from "lucide-react"

export default function ChatPage() {
  const [selectedContext, setSelectedContext] = useState<"portfolio" | "asset" | "general">("general")
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("")
  const [portfolios, setPortfolios] = useState([])
  const [userAssets, setUserAssets] = useState([])

  useEffect(() => {
    fetchPortfolios()
    fetchUserAssets()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      setPortfolios(data.portfolios || [])
      // Auto-select first portfolio if available
      if (data.portfolios?.length > 0) {
        setSelectedPortfolio(data.portfolios[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch portfolios:", error)
    }
  }

  const fetchUserAssets = async () => {
    try {
      // Fetch unique assets from user's portfolios
      const response = await fetch("/api/user/assets")
      const data = await response.json()
      setUserAssets(data.assets || [])
    } catch (error) {
      console.error("Failed to fetch user assets:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Context Selection Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={selectedContext === "general" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedContext("general")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                General Education
              </Button>

              <Button
                variant={selectedContext === "portfolio" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedContext("portfolio")}
                disabled={portfolios.length === 0}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Portfolio Analysis
                {portfolios.length === 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    No portfolios
                  </Badge>
                )}
              </Button>

              <Button
                variant={selectedContext === "asset" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedContext("asset")}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Asset Analysis
              </Button>
            </CardContent>
          </Card>

          {selectedContext === "portfolio" && portfolios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Select Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio: any) => (
                      <SelectItem key={portfolio.id} value={portfolio.id}>
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {selectedContext === "asset" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Select Asset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter ticker (e.g., AAPL)"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
                {userAssets.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Your assets:</p>
                    <div className="flex flex-wrap gap-1">
                      {userAssets.slice(0, 6).map((asset: any) => (
                        <Button
                          key={asset}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2 bg-transparent"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          {asset}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Chat Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                <span>Educational content only</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                <span>Portfolio context aware</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                <span>CSV portfolio import</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                <span>Chat history export</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <ChatInterface
            context={selectedContext}
            assetSymbol={selectedContext === "asset" ? selectedAsset : undefined}
            portfolioId={selectedContext === "portfolio" ? selectedPortfolio : undefined}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
