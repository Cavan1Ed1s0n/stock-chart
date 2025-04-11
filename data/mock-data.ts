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
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
      title: "Deepseek",
      description: "Deepseek releases Chatbot",
      impact: "positive",
      icon: "/placeholder.svg?height=40&width=40",
      priceImpact: 5.2,
      priceBefore: 450.25,
      priceAfter: 473.66,
      gradientColor: "#10B981" // Green
    },
    {
      id: "nvda-2",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
      title: "Trump",
      description: "Trump releases Trump coin",
      impact: "positive",
      icon: "/placeholder.svg?height=40&width=40",
      priceImpact: 3.8,
      priceBefore: 460.75,
      priceAfter: 478.26,
      gradientColor: "#10B981" // Green
    },
    {
      id: "nvda-3",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
      title: "Apple",
      description: "Apple releases Vision Pro",
      impact: "positive",
      icon: "/placeholder.svg?height=40&width=40",
      priceImpact: 4.5,
      priceBefore: 470.50,
      priceAfter: 491.67,
      gradientColor: "#10B981" // Green
    },
    {
      id: "nvda-4",
      timestamp: "2025-02-15",
      title: "Trump Tariff Policy",
      description: "Trump releases new tariff policy affecting tech imports",
      impact: "negative",
      customIcon: "https://imageio.forbes.com/specials-images/imageserve/678bbc074a9bdd52fe2abd09/Coin-depicting-ex-President-Trump/960x0.jpg?format=jpg&width=960",
      priceImpact: -2.5,
      priceBefore: 500.00,
      priceAfter: 487.50,
      gradientColor: "#EF4444" // Red
    }
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
  trump: [
    {
      id: "trump-1",
      timestamp: "2025-02-15",
      title: "Trump",
      description: "Trump release new tariff policy",
      impact: "negative",
      customIcon: "https://imageio.forbes.com/specials-images/imageserve/678bbc074a9bdd52fe2abd09/Coin-depicting-ex-President-Trump/960x0.jpg?format=jpg&width=960",
      priceImpact: -2.5
    }
  ],
}
