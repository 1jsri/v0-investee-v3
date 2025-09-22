import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, TrendingUp, TrendingDown, Edit, Trash2, Newspaper } from "lucide-react"

interface MobileHoldingCardProps {
  holding: {
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
}

export function MobileHoldingCard({ holding }: MobileHoldingCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold">
            {holding.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{holding.symbol}</h3>
            <p className="text-sm text-slate-600 truncate max-w-32">{holding.company}</p>
          </div>
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">Market Value</p>
          <p className="font-semibold text-slate-900">${holding.marketValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Shares</p>
          <p className="font-semibold text-slate-900">{holding.shares.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Dividend Yield</p>
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
            {holding.dividendYield.toFixed(2)}%
          </Badge>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Annual Income</p>
          <p className="font-semibold text-green-600">${holding.annualIncome.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">24h Change</p>
          <div className={`flex items-center gap-1 ${holding.dayChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {holding.dayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="text-sm font-medium">
              ${Math.abs(holding.dayChange).toFixed(2)} ({holding.dayChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Portfolio %</p>
          <p className="font-semibold text-slate-900">{holding.portfolioPercent.toFixed(1)}%</p>
        </div>
      </div>
    </Card>
  )
}
