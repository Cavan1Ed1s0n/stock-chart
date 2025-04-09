"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Import the chart component dynamically to avoid SSR issues
// Use the simpler chart component that's more reliable
const StockChartSimple = dynamic(() => import("@/components/stock-chart-simple"), { ssr: false })

// Hardcoded chart configuration to avoid loading issues
const DEFAULT_CONFIG = {
  asset: {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    period: "1y",
    interval: "1d",
  },
  events: [
    {
      date: "2023-03-15",
      description: "Product Launch: New MacBook Pro",
      color: "#4CAF50",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    },
    {
      date: "2023-06-05",
      description: "WWDC 2023 Conference",
      color: "#2196F3",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Apple_WWDC_wordmark.svg/2560px-Apple_WWDC_wordmark.svg.png",
    },
    {
      date: "2023-09-12",
      description: "iPhone 15 Announcement",
      color: "#FF9800",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_14_vector.svg/1200px-IPhone_14_vector.svg.png",
    },
    {
      date: "2023-11-02",
      description: "Q4 Earnings Report",
      color: "#E91E63",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Earnings_Report.svg/1200px-Earnings_Report.svg.png",
    },
  ],
}

export default function Home() {
  const [chartData, setChartData] = useState(null)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const chartContainerRef = useRef(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Initialize the chart data
    const initialize = async () => {
      // Prevent multiple initializations
      if (hasInitialized.current) return
      hasInitialized.current = true

      try {
        // Use the default config directly
        console.log("Using default configuration:", config)

        // Fetch stock data based on the configuration
        await fetchStockData(config.asset)
      } catch (err) {
        console.error("Error initializing chart:", err)
        setError(`Failed to initialize chart: ${err.message}`)
        setLoading(false)
      }
    }

    initialize()
  }, []) // Empty dependency array ensures this only runs once

  const fetchStockData = async (asset) => {
    setLoading(true)
    try {
      console.log(`Fetching stock data for ${asset.symbol}...`)
      const response = await fetch(
        `/api/stock-data?symbol=${asset.symbol}&period=${asset.period}&interval=${asset.interval}`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Successfully fetched ${data.length} data points for ${asset.symbol}`)
      setChartData(data)
    } catch (err) {
      console.error("Error fetching stock data:", err)
      setError(`Error fetching data for ${asset.symbol}: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Format events with proper date objects
  const formatEvents = (events) => {
    if (!events) return []
    return events.map((event) => ({
      ...event,
      date: new Date(event.date),
    }))
  }

  // Memoize formatted events to prevent unnecessary re-renders
  const formattedEvents = config?.events ? formatEvents(config.events) : []

  return (
    <main className="container mx-auto p-4 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {config ? `${config.asset.name} (${config.asset.symbol})` : "Stock Chart"}
      </h1>

      {error && <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-6">{error}</div>}

      <Card className="w-full bg-gray-900 border-gray-800 text-white">
        <CardContent className="p-6" ref={chartContainerRef}>
          {chartData ? (
            <StockChartSimple data={chartData} symbol={config?.asset.symbol || "AAPL"} events={formattedEvents} />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500 mb-2"></div>
                  <p>Loading chart data...</p>
                </div>
              ) : (
                "Failed to load chart data"
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
