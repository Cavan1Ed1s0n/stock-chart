"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStockData } from "@/hooks/use-stock-data"
import { EventAnnotation } from "@/components/event-annotation"

export default function StockChart() {
  const { stockData, events, selectedStock, timeframe, setTimeframe } = useStockData()
  const [chartWidth, setChartWidth] = useState(0)
  const [chartHeight, setChartHeight] = useState(0)
  const [chartRef, setChartRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chartRef) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setChartWidth(entry.contentRect.width)
          setChartHeight(entry.contentRect.height)
        }
      })

      resizeObserver.observe(chartRef)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [chartRef])

  const timeframeOptions = [
    { label: "1D", value: "1d" },
    { label: "1W", value: "1w" },
    { label: "1M", value: "1m" },
    { label: "3M", value: "3m" },
    { label: "1Y", value: "1y" },
    { label: "All", value: "all" },
  ]

  // Filter events based on the visible data range
  const visibleEvents = events.filter((event) => {
    if (!stockData.length) return false
    const eventDate = new Date(event.timestamp).getTime()
    const firstDate = new Date(stockData[0].date).getTime()
    const lastDate = new Date(stockData[stockData.length - 1].date).getTime()
    return eventDate >= firstDate && eventDate <= lastDate
  })

  // Find the corresponding data point for each event
  const eventDataPoints = visibleEvents.map((event) => {
    const closestPoint = stockData.reduce((prev, curr) => {
      const prevDate = new Date(prev.date).getTime()
      const currDate = new Date(curr.date).getTime()
      const eventDate = new Date(event.timestamp).getTime()
      return Math.abs(currDate - eventDate) < Math.abs(prevDate - eventDate) ? curr : prev
    }, stockData[0])

    return {
      event,
      dataPoint: closestPoint,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {selectedStock.name} ({selectedStock.symbol})
        </h2>
        <div className="flex space-x-2">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeframe === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(option.value)}
              className="px-3 py-1 h-8"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative h-[500px]" ref={setChartRef}>
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: "hsl(var(--chart-1))",
                },
                volume: {
                  label: "Volume",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: timeframe === "1y" || timeframe === "all" ? "numeric" : undefined,
                      })
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => `$${Number(value).toFixed(2)}`} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Event Annotations */}
            {eventDataPoints.map(({ event, dataPoint }, index) => (
              <EventAnnotation
                key={index}
                event={event}
                dataPoint={dataPoint}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                stockData={stockData}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Event Timeline</h3>
        <div className="space-y-2">
          {visibleEvents.length > 0 ? (
            visibleEvents.map((event, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md">
                <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-200 rounded-md overflow-hidden">
                  {event.icon && (
                    <img
                      src={event.icon || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm mt-1">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No events in the selected timeframe</p>
          )}
        </div>
      </div>
    </div>
  )
}
