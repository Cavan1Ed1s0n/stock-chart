import type { StockDataPoint, StockEvent } from "@/types/stock"
import { stockData, stockEvents } from "@/data/mock-data"

// Simulate API calls with mock data
export async function fetchStockData(stockId: string, timeframe: string): Promise<StockDataPoint[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get the stock data for the selected stock
  const data = stockData[stockId] || []

  // Filter data based on timeframe
  const now = new Date()
  const startDate = new Date()

  switch (timeframe) {
    case "1d":
      startDate.setDate(now.getDate() - 1)
      break
    case "1w":
      startDate.setDate(now.getDate() - 7)
      break
    case "1m":
      startDate.setMonth(now.getMonth() - 1)
      break
    case "3m":
      startDate.setMonth(now.getMonth() - 3)
      break
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1)
      break
    case "all":
    default:
      // Return all data
      return data
  }

  return data.filter((point) => new Date(point.date) >= startDate)
}

export async function fetchStockEvents(stockId: string): Promise<StockEvent[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Get the events for the selected stock
  return stockEvents[stockId] || []
}
