"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { Stock, StockDataPoint, StockEvent } from "@/types/stock"
import { stocks } from "@/data/stocks"
import { fetchStockData, fetchStockEvents } from "@/lib/api"

interface StockDataContextType {
  selectedStock: Stock
  setSelectedStock: (stock: Stock) => void
  stockData: StockDataPoint[]
  events: StockEvent[]
  timeframe: string
  setTimeframe: (timeframe: string) => void
  isLoading: boolean
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined)

export function StockDataProvider({ children }: { children: React.ReactNode }) {
  const [selectedStock, setSelectedStock] = useState<Stock>(stocks[0])
  const [stockData, setStockData] = useState<StockDataPoint[]>([])
  const [events, setEvents] = useState<StockEvent[]>([])
  const [timeframe, setTimeframe] = useState<string>("3m")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await fetchStockData(selectedStock.id, timeframe)
        setStockData(data)

        const eventData = await fetchStockEvents(selectedStock.id)
        setEvents(eventData)
      } catch (error) {
        console.error("Error loading stock data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedStock, timeframe])

  return (
    <StockDataContext.Provider
      value={{
        selectedStock,
        setSelectedStock,
        stockData,
        events,
        timeframe,
        setTimeframe,
        isLoading,
      }}
    >
      {children}
    </StockDataContext.Provider>
  )
}

export function useStockData() {
  const context = useContext(StockDataContext)
  if (context === undefined) {
    throw new Error("useStockData must be used within a StockDataProvider")
  }
  return context
}
