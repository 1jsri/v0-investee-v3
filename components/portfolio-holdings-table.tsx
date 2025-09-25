"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, TrendingUp, TrendingDown, Edit, Trash2, Newspaper } from "lucide-react"
import { MobileHoldingCard } from "./mobile-responsive-table"
import { useMediaQuery } from "@/hooks/use-media-query"

interface PortfolioHoldingsTableProps {
  holdings: Array<{
    id: string
    asset_ticker: string
    asset_name: string
    investment_amount: number
    shares: number
    portfolio_id: string
    created_at: string
    updated_at: string
  }>
  onHoldingUpdate: () => void
  portfolioId: string
}

interface Holding {
  symbol: string
  company: string
  shares: number
  currentPrice: number
  marketValue: number
  dividendYield: number
  annualIncome: number
  portfolioPercent: number
  dayChange: number
  dayChangePercent: number
}

export function PortfolioHoldingsTable({ holdings, onHoldingUpdate, portfolioId }: PortfolioHoldingsTableProps) {
  const [sortBy, setSortBy] = useState<keyof Holding>("marketValue")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const processedHoldings = holdings.map((holding) => ({
    symbol: holding.asset_ticker,
    company: holding.asset_name || holding.asset_ticker,
    shares: holding.shares,
    currentPrice: holding.investment_amount / holding.shares, // Calculate price from investment
    marketValue: holding.investment_amount,
    dividendYield: Math.random() * 5 + 1, // Mock yield - would come from API
    annualIncome: holding.investment_amount * 0.035, // Mock 3.5% yield
    portfolioPercent: 0, // Will be calculated below
    dayChange: (Math.random() - 0.5) * 10,
    dayChangePercent: (Math.random() - 0.5) * 5,
  }))

  const totalValue = processedHoldings.reduce((sum, h) => sum + h.marketValue, 0)
  processedHoldings.forEach((holding) => {
    holding.portfolioPercent = (holding.marketValue / totalValue) * 100
  })

  const sortedHoldings = [...processedHoldings].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (sortOrder === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  const handleSort = (column: keyof Holding) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  if (isMobile) {
    return (
      <div className="space-y-4 pb-20">
        {" "}
        {/* Added bottom padding for mobile nav */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Portfolio Holdings</h3>
          <p className="text-sm text-slate-600">{sortedHoldings.length} assets</p>
        </div>
        {sortedHoldings.map((holding) => (
          <MobileHoldingCard key={holding.symbol} holding={holding} />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Portfolio Holdings</h3>
        <p className="text-sm text-slate-600 mt-1">Manage your dividend-paying investments</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("symbol")}>
              Symbol
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("company")}>
              Company
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("shares")}>
              Shares
            </TableHead>
            <TableHead
              className="text-right cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("currentPrice")}
            >
              Price
            </TableHead>
            <TableHead
              className="text-right cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("marketValue")}
            >
              Market Value
            </TableHead>
            <TableHead
              className="text-right cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("dividendYield")}
            >
              Div Yield %
            </TableHead>
            <TableHead
              className="text-right cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("annualIncome")}
            >
              Annual Income
            </TableHead>
            <TableHead
              className="text-right cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("portfolioPercent")}
            >
              % of Portfolio
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("dayChange")}>
              24h Change
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHoldings.map((holding) => (
            <TableRow key={holding.symbol} className="hover:bg-slate-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold">
                    {holding.symbol.slice(0, 2)}
                  </div>
                  {holding.symbol}
                </div>
              </TableCell>
              <TableCell className="text-slate-600">{holding.company}</TableCell>
              <TableCell className="text-right">{holding.shares.toLocaleString()}</TableCell>
              <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right font-medium">${holding.marketValue.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="text-slate-700 border-slate-300 bg-slate-50">
                  {holding.dividendYield.toFixed(2)}%
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium text-slate-900">
                ${holding.annualIncome.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">{holding.portfolioPercent.toFixed(1)}%</TableCell>
              <TableCell className="text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${
                    /* Updated colors to use consistent red/green for gains/losses */
                    holding.dayChange >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {holding.dayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span className="text-sm font-medium">
                    ${Math.abs(holding.dayChange).toFixed(2)} ({holding.dayChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Position
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Newspaper className="mr-2 h-4 w-4" />
                      View News
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
