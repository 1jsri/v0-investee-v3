"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DividendCharts } from "@/components/dividend-charts"
import { DollarSign, PieChart, AlertTriangle, Calendar, Percent, BarChart3 } from "lucide-react"

interface DividendCalculation {
  symbol: string
  companyName: string
  investmentAmount: number
  shares: number
  annualDividend: number
  monthlyDividend: number
  dividendYield: number
  price: number
  hasData: boolean
  error?: string
}

interface DividendResultsProps {
  calculations: DividendCalculation[]
  totalAnnualDividend: number
  totalMonthlyDividend: number
  totalInvestment: number
  averageYield: number
  isLoading: boolean
  error: string | null
}

export function DividendResults({
  calculations,
  totalAnnualDividend,
  totalMonthlyDividend,
  totalInvestment,
  averageYield,
  isLoading,
  error,
}: DividendResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(2)}%`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Calculating Projections...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Calculation Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!calculations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Projected Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter an investment amount and select assets to see projections</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Projected Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalAnnualDividend)}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Calendar className="h-4 w-4" />
                Annual Dividend Income
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-semibold text-foreground">{formatCurrency(totalMonthlyDividend)}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Calendar className="h-4 w-4" />
                Monthly Dividend Income
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Average Yield</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <Percent className="h-3 w-3" />
                {formatPercent(averageYield)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Investment</span>
              <span className="text-sm font-medium">{formatCurrency(totalInvestment)}</span>
            </div>
            {averageYield < 1 && calculations.some((c) => c.hasData) && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-800">
                  <strong>Tip:</strong> Try high-dividend stocks like KO, JNJ, VZ, or T for better dividend income.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DividendCharts
        calculations={calculations}
        totalAnnualDividend={totalAnnualDividend}
        totalInvestment={totalInvestment}
      />

      {/* Asset Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Asset Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculations.map((calc) => (
              <div key={calc.symbol} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">{calc.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-48">{calc.companyName}</div>
                    </div>
                    {!calc.hasData && (
                      <Badge variant="destructive" className="text-xs">
                        No Data
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{formatCurrency(calc.annualDividend)}</div>
                    <div className="text-sm text-muted-foreground">{formatPercent(calc.dividendYield)} yield</div>
                  </div>
                </div>

                {calc.hasData && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Investment</div>
                      <div className="font-medium">{formatCurrency(calc.investmentAmount)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Shares</div>
                      <div className="font-medium">{calc.shares.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">{formatCurrency(calc.price)}</div>
                    </div>
                  </div>
                )}

                {calc.error && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{calc.error}</AlertDescription>
                  </Alert>
                )}

                {calc !== calculations[calculations.length - 1] && <div className="border-b" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Disclaimer:</strong> These projections are based on historical dividend data and current market
          prices. Actual results may vary significantly. Past performance does not guarantee future results.
        </AlertDescription>
      </Alert>
    </div>
  )
}
