import type { StockDataPoint, StockEvent } from "@/types/stock"

// Generate mock stock data
function generateMockStockData(basePrice: number, volatility: number, days: number): StockDataPoint[] {
  const data: StockDataPoint[] = []
  const endDate = new Date()
  let currentPrice = basePrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(endDate.getDate() - i)

    // Random price movement
    const change = (Math.random() - 0.5) * volatility * currentPrice
    currentPrice = Math.max(0.1, currentPrice + change)

    // Random volume
    const volume = Math.floor(Math.random() * 10000000) + 1000000

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number.parseFloat(currentPrice.toFixed(2)),
      volume,
    })
  }

  return data
}

// Mock stock data for each stock
export const stockData: Record<string, StockDataPoint[]> = {
  aapl: generateMockStockData(180, 0.02, 365),
  msft: generateMockStockData(350, 0.015, 365),
  googl: generateMockStockData(140, 0.025, 365),
  amzn: generateMockStockData(130, 0.03, 365),
  nvda: generateMockStockData(800, 0.04, 365),
  tsla: generateMockStockData(180, 0.05, 365),
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
      id: "nvda-00",
      timestamp: "2025-01-15",
      title: "Deepseek",
      description: "Deepseek releases Chatbot",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "negative",
    },
    {
      id: "nvda-11",
      timestamp: "2025-01-20",
      title: "Trump",
      description: "Trump releases Trump coin",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "nvda-1",
      timestamp: "2023-08-23",
      title: "Q2 Earnings Surge",
      description: "NVIDIA reports 101% year-over-year revenue increase driven by AI demand.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "nvda-2",
      timestamp: "2023-11-21",
      title: "New AI Chips",
      description: "NVIDIA unveils next-generation AI chips with significant performance improvements.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "positive",
    },
    {
      id: "nvda-3",
      timestamp: "2024-02-15",
      title: "Supply Chain Issues",
      description: "Reports emerge of supply chain constraints affecting chip production.",
      icon: "/placeholder.svg?height=40&width=40",
      impact: "negative",
    },
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
