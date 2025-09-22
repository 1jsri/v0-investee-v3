"use client"

import { useState, useEffect, useCallback } from "react"
import type { Portfolio, PortfolioSummary } from "@/types/portfolio"

const STORAGE_KEY = "investee_portfolios"
const CURRENT_PORTFOLIO_KEY = "investee_current_portfolio"

export function usePortfolioStorage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load portfolios from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const currentStored = localStorage.getItem(CURRENT_PORTFOLIO_KEY)

      if (stored) {
        const parsedPortfolios = JSON.parse(stored) as Portfolio[]
        setPortfolios(parsedPortfolios)

        // Load current portfolio if exists
        if (currentStored) {
          const currentId = JSON.parse(currentStored)
          const current = parsedPortfolios.find((p) => p.id === currentId)
          if (current) {
            setCurrentPortfolio(current)
          }
        }
      }
    } catch (error) {
      console.error("Error loading portfolios from storage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save portfolios to localStorage
  const saveToStorage = useCallback((updatedPortfolios: Portfolio[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPortfolios))
      setPortfolios(updatedPortfolios)
    } catch (error) {
      console.error("Error saving portfolios to storage:", error)
    }
  }, [])

  // Save current portfolio ID
  const saveCurrentPortfolio = useCallback((portfolio: Portfolio | null) => {
    try {
      if (portfolio) {
        localStorage.setItem(CURRENT_PORTFOLIO_KEY, JSON.stringify(portfolio.id))
      } else {
        localStorage.removeItem(CURRENT_PORTFOLIO_KEY)
      }
      setCurrentPortfolio(portfolio)
    } catch (error) {
      console.error("Error saving current portfolio:", error)
    }
  }, [])

  // Create new portfolio
  const createPortfolio = useCallback(
    (name: string, description?: string): Portfolio => {
      const newPortfolio: Portfolio = {
        id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        totalAmount: 0,
        assets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedPortfolios = [...portfolios, newPortfolio]
      saveToStorage(updatedPortfolios)
      saveCurrentPortfolio(newPortfolio)

      return newPortfolio
    },
    [portfolios, saveToStorage, saveCurrentPortfolio],
  )

  // Update portfolio
  const updatePortfolio = useCallback(
    (portfolioId: string, updates: Partial<Portfolio>) => {
      const updatedPortfolios = portfolios.map((portfolio) =>
        portfolio.id === portfolioId ? { ...portfolio, ...updates, updatedAt: new Date().toISOString() } : portfolio,
      )

      saveToStorage(updatedPortfolios)

      // Update current portfolio if it's the one being updated
      if (currentPortfolio?.id === portfolioId) {
        const updatedCurrent = updatedPortfolios.find((p) => p.id === portfolioId)
        if (updatedCurrent) {
          setCurrentPortfolio(updatedCurrent)
        }
      }
    },
    [portfolios, currentPortfolio, saveToStorage],
  )

  // Delete portfolio
  const deletePortfolio = useCallback(
    (portfolioId: string) => {
      const updatedPortfolios = portfolios.filter((portfolio) => portfolio.id !== portfolioId)
      saveToStorage(updatedPortfolios)

      // Clear current portfolio if it's the one being deleted
      if (currentPortfolio?.id === portfolioId) {
        saveCurrentPortfolio(null)
      }
    },
    [portfolios, currentPortfolio, saveToStorage, saveCurrentPortfolio],
  )

  // Load portfolio as current
  const loadPortfolio = useCallback(
    (portfolioId: string) => {
      const portfolio = portfolios.find((p) => p.id === portfolioId)
      if (portfolio) {
        saveCurrentPortfolio(portfolio)
      }
    },
    [portfolios, saveCurrentPortfolio],
  )

  // Get portfolio summaries
  const getPortfolioSummaries = useCallback((): PortfolioSummary[] => {
    return portfolios.map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      totalAmount: portfolio.totalAmount,
      assetCount: portfolio.assets.length,
      updatedAt: portfolio.updatedAt,
    }))
  }, [portfolios])

  // Auto-save current portfolio
  const autoSaveCurrentPortfolio = useCallback(
    (updates: Partial<Portfolio>) => {
      if (currentPortfolio) {
        updatePortfolio(currentPortfolio.id, updates)
      }
    },
    [currentPortfolio, updatePortfolio],
  )

  return {
    portfolios,
    currentPortfolio,
    isLoading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    loadPortfolio,
    getPortfolioSummaries,
    autoSaveCurrentPortfolio,
    setCurrentPortfolio: saveCurrentPortfolio,
  }
}
