import type { Asset } from "./asset"

export interface PortfolioAsset extends Asset {
  allocation: number // Percentage allocation (0-100)
  customAmount?: number // Custom investment amount for this asset
}

export interface Portfolio {
  id: string
  name: string
  totalAmount: number
  assets: PortfolioAsset[]
  createdAt: string
  updatedAt: string
  description?: string
}

export interface PortfolioSummary {
  id: string
  name: string
  totalAmount: number
  assetCount: number
  estimatedAnnualDividend?: number
  estimatedYield?: number
  updatedAt: string
}
