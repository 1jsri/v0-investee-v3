"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import debounce from "lodash.debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Building2,
  Coins,
  X,
  Check,
  AlertCircle,
  Plus,
  BarChart3,
  Users,
} from "lucide-react"
import type { Asset } from "@/types/asset"
import { cn } from "@/lib/utils"

interface EnhancedAsset extends Asset {
  price?: number
  change?: number
  changePercent?: number
  marketCap?: number
  dividendYield?: number
  peRatio?: number
  volume?: number
  logo?: string
  sector?: string
  industry?: string
  employees?: number
  founded?: string
  website?: string
  beta?: number
  eps?: number
  revenue?: number
}

interface AssetSearchProps {
  onAssetSelect: (asset: EnhancedAsset, amount?: number) => void
  selectedAssets?: EnhancedAsset[]
  onAssetRemove?: (symbol: string) => void
  placeholder?: string
  className?: string
  showBatchAdd?: boolean
  portfolioId?: string
}

export function AssetSearch({
  onAssetSelect,
  selectedAssets = [],
  onAssetRemove,
  placeholder = "Search dividend stocks, ETFs, REITs...",
  className,
  showBatchAdd = false,
  portfolioId,
}: AssetSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<EnhancedAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>("")
  const [selectedAsset, setSelectedAsset] = useState<EnhancedAsset | null>(null)
  const [showAssetDetail, setShowAssetDetail] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000)
  const [batchSelectedAssets, setBatchSelectedAssets] = useState<EnhancedAsset[]>([])
  const [showBatchDialog, setShowBatchDialog] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const searchAssets = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(`[v0] Searching for: ${searchQuery}`)

      const searchResponse = await fetch(`/api/search-assets?q=${encodeURIComponent(searchQuery)}`)
      if (!searchResponse.ok) throw new Error("Failed to search assets")

      const searchData = await searchResponse.json()
      const basicResults = searchData.result || []

      const enhancedResults = await Promise.all(
        basicResults.slice(0, 8).map(async (asset: Asset) => {
          try {
            const quoteResponse = await fetch(`/api/asset-quote?symbol=${asset.symbol}`)
            const quoteData = quoteResponse.ok ? await quoteResponse.json() : {}

            const profileResponse = await fetch(`/api/asset-profile?symbol=${asset.symbol}`)
            const profileData = profileResponse.ok ? await profileResponse.json() : {}

            return {
              ...asset,
              price: quoteData.price || null,
              change: quoteData.change || null,
              changePercent: quoteData.changesPercentage || null,
              marketCap: profileData.mktCap || null,
              dividendYield: profileData.lastDiv ? (profileData.lastDiv / quoteData.price) * 100 : null,
              peRatio: profileData.pe || null,
              volume: quoteData.volume || null,
              logo: profileData.image || null,
              sector: profileData.sector || null,
              industry: profileData.industry || null,
              employees: profileData.fullTimeEmployees || null,
              founded: profileData.ipoDate || null,
              website: profileData.website || null,
              beta: profileData.beta || null,
              eps: profileData.eps || null,
              revenue: profileData.revenue || null,
            }
          } catch (err) {
            console.warn(`[v0] Failed to enhance data for ${asset.symbol}:`, err)
            return asset as EnhancedAsset
          }
        }),
      )

      console.log(`[v0] Enhanced search results:`, enhancedResults)
      setResults(enhancedResults)
      setIsOpen(enhancedResults.length > 0)
      setSelectedIndex(-1)
      setDataSource(searchData.dataSource || "unknown")
    } catch (err) {
      console.error("[v0] Search error:", err)
      setError("Failed to search assets. Please try again.")
      setResults([])
      setIsOpen(false)
      setDataSource("")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchAssets(searchQuery)
    }, 500),
    [searchAssets],
  )

  useEffect(() => {
    debouncedSearch(query)

    return () => {
      debouncedSearch.cancel()
    }
  }, [query, debouncedSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleAssetSelect(results[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleAssetSelect = (asset: EnhancedAsset) => {
    if (showBatchAdd) {
      setSelectedAsset(asset)
      setShowAssetDetail(true)
    } else {
      onAssetSelect(asset, investmentAmount)
      setQuery("")
      setResults([])
      setIsOpen(false)
      setSelectedIndex(-1)
      inputRef.current?.focus()
    }
  }

  const addToBatch = (asset: EnhancedAsset) => {
    if (!batchSelectedAssets.find((a) => a.symbol === asset.symbol)) {
      setBatchSelectedAssets([...batchSelectedAssets, asset])
    }
  }

  const removeFromBatch = (symbol: string) => {
    setBatchSelectedAssets(batchSelectedAssets.filter((a) => a.symbol !== symbol))
  }

  const addBatchToPortfolio = () => {
    batchSelectedAssets.forEach((asset) => {
      onAssetSelect(asset, investmentAmount)
    })
    setBatchSelectedAssets([])
    setShowBatchDialog(false)
  }

  const formatNumber = (num: number | null | undefined, prefix = "", suffix = "") => {
    if (!num) return "N/A"

    if (num >= 1e12) return `${prefix}${(num / 1e12).toFixed(1)}T${suffix}`
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(1)}B${suffix}`
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(1)}M${suffix}`
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(1)}K${suffix}`

    return `${prefix}${num.toLocaleString()}${suffix}`
  }

  const getPerformanceColor = (change: number | null) => {
    if (!change) return "text-slate-500"
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const isAssetSelected = (asset: EnhancedAsset) => {
    return selectedAssets.some((selected) => selected.symbol === asset.symbol)
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type?.toLowerCase() || "") {
      case "etf":
      case "fund":
        return <TrendingUp className="h-4 w-4" />
      case "crypto":
        return <Coins className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const getAssetTypeColor = (type: string) => {
    switch (type?.toLowerCase() || "") {
      case "etf":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "fund":
        return "bg-green-100 text-green-800 border-green-200"
      case "crypto":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="pl-10 pr-4 h-12 text-base"
          aria-label="Search for assets"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {showBatchAdd && batchSelectedAssets.length > 0 && (
          <Button
            onClick={() => setShowBatchDialog(true)}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 px-3 text-xs"
            size="sm"
          >
            Add {batchSelectedAssets.length}
          </Button>
        )}
      </div>

      {dataSource === "yahoo" && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-blue-50 border border-blue-200 rounded-md p-2">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Using Yahoo Finance backup - Finnhub unavailable</span>
          </div>
        </div>
      )}

      {isOpen && (
        <Card
          ref={resultsRef}
          className={cn(
            "absolute top-full left-0 right-0 z-50 max-h-96 overflow-y-auto shadow-xl border-2 border-primary/20",
            dataSource === "yahoo" ? "mt-16" : "mt-1",
          )}
          role="listbox"
          aria-label="Asset search results"
        >
          {error ? (
            <div className="p-4 text-center text-destructive">
              <p>{error}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => searchAssets(query)}>
                Try Again
              </Button>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No assets found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for dividend stocks like AAPL, MSFT, or SCHD</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((asset, index) => {
                const isSelected = index === selectedIndex
                const isAlreadySelected = isAssetSelected(asset)
                const isInBatch = batchSelectedAssets.find((a) => a.symbol === asset.symbol)

                return (
                  <div
                    key={`${asset.symbol}-${asset.exchange}`}
                    className={cn(
                      "px-4 py-4 hover:bg-muted/50 focus:bg-muted/50 transition-colors border-b border-slate-100 last:border-b-0",
                      isSelected && "bg-primary/10",
                      isAlreadySelected && "opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          {asset.logo ? (
                            <img
                              src={asset.logo || "/placeholder.svg"}
                              alt={`${asset.symbol} logo`}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                                e.currentTarget.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : null}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm",
                              asset.logo ? "hidden" : "",
                            )}
                          >
                            {asset.symbol.slice(0, 2)}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-lg">{asset.displaySymbol}</span>
                            <Badge variant="secondary" className={cn("text-xs", getAssetTypeColor(asset.type))}>
                              {asset.type}
                            </Badge>
                            {asset.dividendYield && asset.dividendYield > 0 && (
                              <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                                {asset.dividendYield.toFixed(2)}% yield
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 truncate font-medium">{asset.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            {asset.exchange && <span>{asset.exchange}</span>}
                            {asset.sector && <span>• {asset.sector}</span>}
                            {asset.marketCap && <span>• {formatNumber(asset.marketCap)} cap</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {asset.price && (
                          <div className="text-right">
                            <div className="font-bold text-slate-900 text-lg">${asset.price.toFixed(2)}</div>
                            {asset.change !== null && asset.changePercent !== null && (
                              <div className={cn("text-sm flex items-center gap-1", getPerformanceColor(asset.change))}>
                                {asset.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {asset.change >= 0 ? "+" : ""}
                                {asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {showBatchAdd && (
                            <Button
                              variant={isInBatch ? "default" : "outline"}
                              size="sm"
                              onClick={() => (isInBatch ? removeFromBatch(asset.symbol) : addToBatch(asset))}
                              className="h-8 px-3"
                            >
                              {isInBatch ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssetSelect(asset)}
                            disabled={isAlreadySelected}
                            className="h-8 px-3"
                          >
                            {isAlreadySelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {(asset.peRatio || asset.volume || asset.beta) && (
                      <div className="flex items-center gap-6 mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        {asset.peRatio && (
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>P/E: {asset.peRatio.toFixed(1)}</span>
                          </div>
                        )}
                        {asset.volume && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Vol: {formatNumber(asset.volume)}</span>
                          </div>
                        )}
                        {asset.beta && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>β: {asset.beta.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      <Dialog open={showAssetDetail} onOpenChange={setShowAssetDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedAsset?.logo && (
                <img
                  src={selectedAsset.logo || "/placeholder.svg"}
                  alt={`${selectedAsset.symbol} logo`}
                  className="w-8 h-8 rounded object-cover"
                />
              )}
              Add {selectedAsset?.displaySymbol} to Portfolio
            </DialogTitle>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600">Current Price</div>
                  <div className="text-xl font-bold">${selectedAsset.price?.toFixed(2) || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Dividend Yield</div>
                  <div className="text-xl font-bold text-green-600">
                    {selectedAsset.dividendYield?.toFixed(2) || "N/A"}%
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="text-lg"
                  min="1"
                  step="100"
                />
                <div className="text-sm text-slate-600 mt-1">
                  Estimated shares: {selectedAsset.price ? (investmentAmount / selectedAsset.price).toFixed(2) : "N/A"}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onAssetSelect(selectedAsset, investmentAmount)
                    setShowAssetDetail(false)
                  }}
                  className="flex-1"
                >
                  Add to Portfolio
                </Button>
                <Button variant="outline" onClick={() => setShowAssetDetail(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Multiple Assets to Portfolio</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batchSelectedAssets.map((asset) => (
                <Card key={asset.symbol} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {asset.logo && (
                        <img src={asset.logo || "/placeholder.svg"} alt={asset.symbol} className="w-8 h-8 rounded" />
                      )}
                      <div>
                        <div className="font-semibold">{asset.displaySymbol}</div>
                        <div className="text-sm text-slate-600">${asset.price?.toFixed(2) || "N/A"}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromBatch(asset.symbol)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount per Asset</label>
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                min="1"
                step="100"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={addBatchToPortfolio} className="flex-1">
                Add All Assets (${(investmentAmount * batchSelectedAssets.length).toLocaleString()})
              </Button>
              <Button variant="outline" onClick={() => setShowBatchDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedAssets.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedAssets.map((asset) => (
            <Badge
              key={asset.symbol}
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
            >
              <span className="flex items-center gap-2">
                {getAssetTypeIcon(asset.type)}
                {asset.displaySymbol}
                {onAssetRemove && (
                  <button
                    onClick={() => onAssetRemove(asset.symbol)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${asset.displaySymbol}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
