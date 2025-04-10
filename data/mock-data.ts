import type { StockDataPoint, StockEvent } from "@/types/stock"

// Define TimeFrame type
export type TimeFrame = "daily" | "weekly" | "monthly"

// Generate mock stock data
export function generateMockStockData(
  symbol: string,
  timeframe: TimeFrame,
  days: number = 30
): StockDataPoint[] {
  const data: StockDataPoint[] = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)

  let currentDate = new Date(startDate)
  let basePrice = 100 + Math.random() * 50
  let volatility = 2

  while (currentDate <= today) {
    const randomChange = (Math.random() - 0.5) * volatility
    basePrice = Math.max(1, basePrice + randomChange)

    data.push({
      date: currentDate.toISOString().split('T')[0],
      price: basePrice,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

// Mock stock data for each stock
export const stockData: Record<string, StockDataPoint[]> = {
  aapl: generateMockStockData("aapl", "daily", 30),
  msft: generateMockStockData("msft", "daily", 30),
  googl: generateMockStockData("googl", "daily", 30),
  amzn: generateMockStockData("amzn", "daily", 30),
  nvda: generateMockStockData("nvda", "daily", 30),
  tsla: generateMockStockData("tsla", "daily", 30),
}

// Mock events for each stock
export const stockEvents: Record<string, StockEvent[]> = {
  aapl: [
    {
      id: "aapl-1",
      timestamp: "2023-09-12",
      title: "iPhone 15 Launch",
      description: "Apple unveils the iPhone 15 with new features and design changes.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "aapl-2",
      timestamp: "2023-11-03",
      title: "Q4 Earnings Beat",
      description: "Apple reports better than expected Q4 earnings, with strong services growth.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "aapl-3",
      timestamp: "2024-01-15",
      title: "Vision Pro Release",
      description: "Apple announces the release date for the Vision Pro headset.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
  ],
  msft: [
    {
      id: "msft-1",
      timestamp: "2023-10-24",
      title: "Strong Cloud Growth",
      description: "Microsoft reports Azure cloud revenue growth of 29% in Q1 FY24.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "msft-2",
      timestamp: "2023-12-07",
      title: "Copilot Launch",
      description: "Microsoft launches Copilot AI assistant for Microsoft 365.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
  ],
  nvda: [
    {
      id: "nvda-1",
      timestamp: "2025-01-15",
      title: "Deepseek",
      description: "Deepseek releases Chatbot",
      icon: "data:image/jpeg;base64,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",
      impact: "negative",
    },
    {
      id: "nvda-2",
      timestamp: "2025-01-20",
      title: "Trump",
      description: "Trump releases Trump coin",
      icon: "data:image/jpeg;base64,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",
      impact: "negative",
    },
    // {
    //   id: "nvda-1",
    //   timestamp: "2023-08-23",
    //   title: "Q2 Earnings Surge",
    //   description: "NVIDIA reports 101% year-over-year revenue increase driven by AI demand.",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   impact: "positive",
    // },
    // {
    //   id: "nvda-2",
    //   timestamp: "2023-11-21",
    //   title: "New AI Chips",
    //   description: "NVIDIA unveils next-generation AI chips with significant performance improvements.",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   impact: "positive",
    // },
    // {
    //   id: "nvda-3",
    //   timestamp: "2024-02-15",
    //   title: "Supply Chain Issues",
    //   description: "Reports emerge of supply chain constraints affecting chip production.",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   impact: "negative",
    // },
  ],
  googl: [
    {
      id: "googl-1",
      timestamp: "2023-10-24",
      title: "Ad Revenue Growth",
      description: "Google reports strong ad revenue growth in Q3 2023.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "googl-2",
      timestamp: "2024-01-16",
      title: "Gemini AI Launch",
      description: "Google launches Gemini, its most capable AI model to date.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
  ],
  amzn: [
    {
      id: "amzn-1",
      timestamp: "2023-11-02",
      title: "AWS Growth Slows",
      description: "Amazon Web Services reports slower growth than expected in Q3 2023.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "negative",
    },
    {
      id: "amzn-2",
      timestamp: "2023-12-26",
      title: "Record Holiday Sales",
      description: "Amazon announces record-breaking holiday shopping season.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
  ],
  tsla: [
    {
      id: "tsla-1",
      timestamp: "2023-10-18",
      title: "Q3 Delivery Miss",
      description: "Tesla reports lower than expected vehicle deliveries for Q3 2023.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "negative",
    },
    {
      id: "tsla-2",
      timestamp: "2023-12-14",
      title: "Cybertruck Deliveries",
      description: "Tesla begins deliveries of the Cybertruck to customers.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "tsla-3",
      timestamp: "2024-03-01",
      title: "Price Cuts",
      description: "Tesla announces price cuts across its vehicle lineup.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "neutral",
    },
  ],
}
