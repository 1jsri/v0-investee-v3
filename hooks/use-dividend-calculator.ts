"use client"

import { useState, useCallback } from "react"
import type { Asset } from "@/types/asset"

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

interface CalculatorState {
  calculations: DividendCalculation[]
  totalAnnualDividend: number
  totalMonthlyDividend: number
  totalInvestment: number
  averageYield: number
  isLoading: boolean
  error: string | null
}

export function useDividendCalculator() {
  const [state, setState] = useState<CalculatorState>({
    calculations: [],
    totalAnnualDividend: 0,
    totalMonthlyDividend: 0,
    totalInvestment: 0,
    averageYield: 0,
    isLoading: false,
    error: null,
  })

  const calculateDividends = useCallback(async (assets: Asset[], investmentAmount: number) => {
    console.log("[v0] calculateDividends called:", { assetsCount: assets.length, investmentAmount })

    if (!assets.length || !investmentAmount) {
      console.log("[v0] Clearing calculations - no assets or amount")
      setState((prev) => ({
        ...prev,
        calculations: [],
        totalAnnualDividend: 0,
        totalMonthlyDividend: 0,
        totalInvestment: 0,
        averageYield: 0,
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const symbols = assets.map((asset) => asset.symbol).join(",")
      console.log("[v0] Fetching dividend data for symbols:", symbols)
      const response = await fetch(`/api/dividend-data?symbols=${symbols}`)

      if (!response.ok) {
        throw new Error("Failed to fetch dividend data")
      }

      const { data } = await response.json()
      console.log("[v0] Received dividend data:", data)

      // Calculate investment per asset (equal allocation)
      const investmentPerAsset = investmentAmount / assets.length

      const calculations: DividendCalculation[] = data.map((item: any) => {
        const shares = item.price > 0 ? investmentPerAsset / item.price : 0
        const annualDividend = shares * item.annualDividend
        const monthlyDividend = annualDividend / 12

        console.log("[v0] Calculation for", item.symbol, {
          price: item.price,
          annualDividend: item.annualDividend,
          shares,
          calculatedAnnualDividend: annualDividend,
        })

        return {
          symbol: item.symbol,
          companyName: item.companyName,
          investmentAmount: investmentPerAsset,
          shares,
          annualDividend,
          monthlyDividend,
          dividendYield: item.dividendYield,
          price: item.price,
          hasData: item.hasData,
          error: item.error,
        }
      })

      const totalAnnualDividend = calculations.reduce((sum, calc) => sum + calc.annualDividend, 0)
      const totalMonthlyDividend = totalAnnualDividend / 12
      const averageYield = investmentAmount > 0 ? (totalAnnualDividend / investmentAmount) * 100 : 0

      console.log("[v0] Final calculations:", {
        totalAnnualDividend,
        totalMonthlyDividend,
        averageYield,
      })

      setState({
        calculations,
        totalAnnualDividend,
        totalMonthlyDividend,
        totalInvestment: investmentAmount,
        averageYield,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.log("[v0] Error in calculateDividends:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to calculate dividends",
      }))
    }
  }, [])

  return {
    ...state,
    calculateDividends,
  }
}
