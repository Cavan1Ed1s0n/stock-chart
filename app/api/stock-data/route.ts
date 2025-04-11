import { NextResponse } from "next/server"

// This is a simplified API route that would normally fetch from a real stock API
// In a production app, you would use a real financial API like Alpha Vantage, Yahoo Finance, etc.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "TSLA"

  try {
    // In a real app, you would fetch from an actual API
    // For demo purposes, we'll generate some realistic data
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(endDate.getFullYear() - 1)

    const data = generateStockData(symbol, startDate, endDate)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stock data" }, { status: 500 })
  }
}

// Helper function to generate realistic stock data
function generateStockData(symbol: string, startDate: Date, endDate: Date) {
  const data = []
  const dayMs = 24 * 60 * 60 * 1000

  // Set base prices for different stocks
  let basePrice = 0
  switch (symbol.toUpperCase()) {
    case "AAPL":
      basePrice = 170
      break
    case "MSFT":
      basePrice = 350
      break
    case "TSLA":
      basePrice = 200
      break
    case "NVDA":
      basePrice = 400
      break
    case "GOOGL":
      basePrice = 140
      break
    default:
      basePrice = 100
  }

  // Generate daily prices with realistic volatility
  let currentDate = new Date(startDate)
  let currentPrice = basePrice

  while (currentDate <= endDate) {
    // Skip weekends
    const day = currentDate.getDay()
    if (day !== 0 && day !== 6) {
      // Add some randomness to the price (daily volatility)
      const volatility = basePrice * 0.02 // 2% daily volatility
      const change = volatility * (Math.random() - 0.5)
      currentPrice = Math.max(currentPrice + change, basePrice * 0.5) // Prevent going too low

      data.push({
        date: currentDate.toISOString().split("T")[0],
        price: Number.parseFloat(currentPrice.toFixed(2)),
      })
    }

    // Move to next day
    currentDate = new Date(currentDate.getTime() + dayMs)
  }

  return data
}
