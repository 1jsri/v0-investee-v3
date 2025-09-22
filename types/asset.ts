export interface Asset {
  symbol: string
  description: string
  displaySymbol: string
  type: string
  currency?: string
  exchange?: string
}

export interface AssetSearchResult {
  count: number
  result: Asset[]
}

export interface DividendData {
  symbol: string
  dividendYield?: number
  price?: number
  currency?: string
  lastUpdated?: string
}
