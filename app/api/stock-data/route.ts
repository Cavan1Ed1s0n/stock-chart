import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const period = searchParams.get("period") || "1y"
  const interval = searchParams.get("interval") || "1d"

  if (!symbol) {
    return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 })
  }

  try {
    console.log(`Fetching data for ${symbol} with period ${period} and interval ${interval}`)

    // For demo purposes, we'll use Yahoo Finance API
    const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${period}&interval=${interval}`

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      console.error(`Yahoo Finance API returned status ${response.status}: ${response.statusText}`)
      throw new Error(`Failed to fetch data from Yahoo Finance: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Check if we have valid data
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      console.error("Yahoo Finance API returned empty or invalid data", data)
      throw new Error("Invalid data received from Yahoo Finance")
    }

    // Extract the relevant data
    const timestamps = data.chart.result[0].timestamp || []
    const quotes = data.chart.result[0].indicators.quote[0] || {}
    const { close, open, high, low, volume } = quotes

    // Format the data
    const formattedData = timestamps
      .map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString(),
        close: close[index],
        open: open[index],
        high: high[index],
        low: low[index],
        volume: volume[index],
      }))
      .filter((item) => item.close !== null)

    console.log(`Successfully processed ${formattedData.length} data points for ${symbol}`)
    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching stock data:", error)

    // If Yahoo Finance API fails, return mock data for demonstration
    if (symbol === "AAPL") {
      console.log("Returning mock data for AAPL")
      return NextResponse.json(generateMockData(symbol))
    }

    return NextResponse.json({ error: `Failed to fetch stock data: ${error.message}` }, { status: 500 })
  }
}

// Generate mock data for demonstration purposes
function generateMockData(symbol) {
  const today = new Date()
  const data = []

  // Generate 365 days of mock data
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Base price with some randomness
    const basePrice = symbol === "AAPL" ? 150 : 100
    const randomFactor = Math.sin(i / 20) * 20 + Math.random() * 10 - 5
    const close = basePrice + randomFactor

    data.push({
      date: date.toISOString(),
      close: close,
      open: close - Math.random() * 2,
      high: close + Math.random() * 2,
      low: close - Math.random() * 2,
      volume: Math.floor(Math.random() * 10000000) + 5000000,
    })
  }

  return data
}
