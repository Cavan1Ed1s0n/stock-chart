export interface Stock {
  id: string
  symbol: string
  name: string
}

export interface StockDataPoint {
  date: string
  price: number
  volume: number
}

export interface StockEvent {
  id: string
  timestamp: string
  title: string
  description: string
  icon?: string
  impact: "positive" | "negative" | "neutral"
}
