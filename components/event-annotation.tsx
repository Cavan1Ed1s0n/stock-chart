"use client"

import { useEffect, useState } from "react"
import type { StockEvent, StockDataPoint } from "@/types/stock"

interface EventAnnotationProps {
  event: StockEvent
  dataPoint: StockDataPoint
  chartWidth: number
  chartHeight: number
  stockData: StockDataPoint[]
}

export function EventAnnotation({ event, dataPoint, chartWidth, chartHeight, stockData }: EventAnnotationProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (chartWidth === 0 || chartHeight === 0 || !stockData.length) return

    // Calculate x position based on date
    const firstDate = new Date(stockData[0].date).getTime()
    const lastDate = new Date(stockData[stockData.length - 1].date).getTime()
    const eventDate = new Date(event.timestamp).getTime()

    const dateRange = lastDate - firstDate
    const xPosition = ((eventDate - firstDate) / dateRange) * chartWidth

    // Calculate y position based on price
    const prices = stockData.map((d) => d.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Adjust for chart margins (top: 20, bottom: 50)
    const adjustedHeight = chartHeight - 70
    const yPosition = adjustedHeight - ((dataPoint.price - minPrice) / priceRange) * adjustedHeight + 20

    setPosition({
      x: Math.max(30, Math.min(chartWidth - 30, xPosition)),
      y: Math.max(30, Math.min(chartHeight - 80, yPosition)),
    })
  }, [chartWidth, chartHeight, event, dataPoint, stockData])

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center cursor-pointer shadow-md">
          {event.icon ? (
            <img src={event.icon || "/placeholder.svg"} alt="" className="w-4 h-4 object-cover" />
          ) : (
            <span className="text-xs">!</span>
          )}
        </div>

        {/* Vertical line to price point */}
        <div className="absolute w-[1px] bg-primary/50 left-1/2 top-full" style={{ height: "20px" }} />

        {/* Annotation tooltip */}
        {isHovered && (
          <div
            className="absolute bottom-full mb-2 bg-white shadow-lg rounded-md p-3 w-64 z-10 border border-gray-200"
            style={{
              left: position.x < chartWidth / 2 ? "0" : "auto",
              right: position.x >= chartWidth / 2 ? "0" : "auto",
              transform: position.x < chartWidth / 2 ? "translateX(-20%)" : "translateX(20%)",
            }}
          >
            <div className="flex items-start gap-2">
              {event.icon && (
                <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                  <img src={event.icon || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-sm">{event.title}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs mt-1">{event.description}</p>
              </div>
            </div>
            <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -bottom-1.5 -ml-1.5"></div>
          </div>
        )}
      </div>
    </div>
  )
}
