"use client"

import * as React from "react"
import type { StockEvent, StockDataPoint } from "@/types/stock"
import { cn } from "@/lib/utils"

interface EventAnnotationProps {
  event: StockEvent
  data: StockDataPoint[]
  width: number
  height: number
  xScale: (value: number) => number
  yScale: (value: number) => number
}

export function EventAnnotation({
  event,
  data,
  width,
  height,
  xScale,
  yScale,
}: EventAnnotationProps): React.JSX.Element {
  const [position, setPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)
  const [gradientWidth, setGradientWidth] = React.useState(0)
  const [gradientPosition, setGradientPosition] = React.useState(0)

  React.useEffect(() => {
    const eventIndex = data.findIndex(point => point.date === event.timestamp)
    if (eventIndex === -1) return

    const x = xScale(new Date(event.timestamp).getTime())
    const y = yScale(data[eventIndex].price)
    setPosition({ x, y })

    // Calculate gradient width based on impact duration
    const impactWidth = Math.min(width * 0.2, 200) // Max width of 200px or 20% of chart width
    setGradientWidth(impactWidth)
    setGradientPosition(x - impactWidth / 2)
  }, [event, data, width, xScale, yScale])

  const priceChange = event.priceImpact || 0
  const priceChangeColor = priceChange >= 0 ? "text-green-500" : "text-red-500"
  const priceChangeIcon = priceChange >= 0 ? "↑" : "↓"

  return (
    <g
      className="event-annotation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Price gradient effect */}
      <rect
        x={gradientPosition}
        y={0}
        width={gradientWidth}
        height={height}
        className="fill-current opacity-5"
      />

      {/* Event icon */}
      <g transform={`translate(${position.x}, ${position.y})`}>
        <circle
          r={6}
          className={cn(
            "fill-current",
            priceChange >= 0 ? "text-green-500" : "text-red-500"
          )}
        />
        {event.icon && (
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-white"
          >
            {event.icon}
          </text>
        )}
      </g>

      {/* Tooltip */}
      {isHovered && (
        <g transform={`translate(${position.x + 10}, ${position.y - 10})`}>
          <rect
            x={0}
            y={0}
            width={200}
            height={80}
            rx={4}
            className="fill-white dark:fill-gray-800 stroke-current"
          />
          <text x={10} y={20} className="text-sm font-medium">
            {event.title}
          </text>
          <text x={10} y={40} className="text-xs text-gray-500 dark:text-gray-400">
            {event.description}
          </text>
          <text
            x={10}
            y={60}
            className={cn("text-xs font-medium", priceChangeColor)}
          >
            {priceChangeIcon} {Math.abs(priceChange)}%
          </text>
        </g>
      )}
    </g>
  )
}
