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
  priceImpact?: number  // Price change percentage
  customIcon?: string   // URL for custom image/icon
  priceBefore?: number  // Price before the event
  priceAfter?: number   // Price after the event
  gradientColor?: string // Custom color for the price gradient
}
