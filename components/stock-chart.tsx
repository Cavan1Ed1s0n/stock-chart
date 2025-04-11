"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"
import { format, parseISO, isWithinInterval, subMonths, subYears } from "date-fns"
import Image from "next/image"
import { Info, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { stockEvents, type StockEvent } from "@/lib/stock-events"

interface StockChartProps {
  symbol?: string
}

interface StockData {
  date: string
  price: number
}

export default function StockChart({ symbol = "TSLA" }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("6M")
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })
  const [eventMarkers, setEventMarkers] = useState<Array<{ x: number; y: number; event: StockEvent }>>([])
  const [stockData, setStockData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stock data
  useEffect(() => {
    async function fetchStockData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/stock-data?symbol=${symbol}`)
        const result = await response.json()

        if (result.success) {
          setStockData(result.data)
          setError(null)
        } else {
          setError("Failed to fetch stock data")
        }
      } catch (err) {
        setError("Error fetching stock data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [symbol])

  // Filter data based on selected time range - using useMemo to prevent recalculations
  const filteredData = useMemo(() => {
    if (stockData.length === 0) return []

    const today = new Date()
    let startDate: Date

    switch (timeRange) {
      case "1M":
        startDate = subMonths(today, 1)
        break
      case "3M":
        startDate = subMonths(today, 3)
        break
      case "6M":
        startDate = subMonths(today, 6)
        break
      case "1Y":
        startDate = subYears(today, 1)
        break
      default:
        return [...stockData]
    }

    return stockData.filter((item) => {
      const itemDate = parseISO(item.date)
      return isWithinInterval(itemDate, { start: startDate, end: today })
    })
  }, [stockData, timeRange])

  // Find min and max values for Y axis - using useMemo to prevent recalculations
  const { minPrice, maxPrice } = useMemo(() => {
    if (filteredData.length === 0) return { minPrice: 0, maxPrice: 100 }

    const min = Math.min(...filteredData.map((item) => item.price)) * 0.95
    const max = Math.max(...filteredData.map((item) => item.price)) * 1.05
    return { minPrice: min, maxPrice: max }
  }, [filteredData])

  // Filter events that fall within the current time range - using useMemo to prevent recalculations
  const visibleEvents = useMemo(() => {
    if (filteredData.length === 0) return []

    const events = stockEvents[symbol] || []
    return events.filter((event) => {
      const eventDate = parseISO(event.date)
      const firstDate = parseISO(filteredData[0].date)
      const lastDate = parseISO(filteredData[filteredData.length - 1].date)
      return eventDate >= firstDate && eventDate <= lastDate
    })
  }, [filteredData, symbol])

  // Track chart dimensions
  useEffect(() => {
    if (!chartRef.current) return

    const updateDimensions = () => {
      if (chartRef.current) {
        const { width, height } = chartRef.current.getBoundingClientRect()
        setChartDimensions({ width, height })
      }
    }

    // Initial measurement
    updateDimensions()

    // Set up resize listener
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, []) // Empty dependency array - only run on mount and unmount

  // Calculate event marker positions - separate effect with stable dependencies
  useEffect(() => {
    // Skip calculation if chart isn't measured yet
    if (chartDimensions.width === 0 || chartDimensions.height === 0 || filteredData.length === 0) return

    const markers = visibleEvents
      .map((event) => {
        // Find the data point for this event date
        const dataPoint = filteredData.find((item) => item.date === event.date)
        if (!dataPoint) {
          // If exact date not found, find closest date
          const eventDate = parseISO(event.date)
          let closestPoint = filteredData[0]
          let smallestDiff = Math.abs(eventDate.getTime() - parseISO(closestPoint.date).getTime())

          for (const point of filteredData) {
            const diff = Math.abs(eventDate.getTime() - parseISO(point.date).getTime())
            if (diff < smallestDiff) {
              smallestDiff = diff
              closestPoint = point
            }
          }

          if (smallestDiff > 7 * 24 * 60 * 60 * 1000) {
            // More than a week difference
            return null // Skip if no close match
          }

          // Use closest point
          const dateIndex = filteredData.findIndex((item) => item.date === closestPoint.date)
          const totalDates = filteredData.length - 1
          if (totalDates === 0) return null // Prevent division by zero

          // Adjust for chart margins
          const chartContentWidth = chartDimensions.width - 60
          const xPos = (dateIndex / totalDates) * chartContentWidth + 40

          // Calculate y position (price)
          const priceRange = maxPrice - minPrice
          if (priceRange === 0) return null // Prevent division by zero

          const chartContentHeight = chartDimensions.height - 60
          // Invert y-coordinate since SVG coordinates start from top
          const yPos = chartContentHeight - ((closestPoint.price - minPrice) / priceRange) * chartContentHeight + 30

          return { x: xPos, y: yPos, event }
        }

        // Calculate x position (date)
        const dateIndex = filteredData.findIndex((item) => item.date === event.date)
        const totalDates = filteredData.length - 1
        if (totalDates === 0) return null // Prevent division by zero

        // Adjust for chart margins
        const chartContentWidth = chartDimensions.width - 60
        const xPos = (dateIndex / totalDates) * chartContentWidth + 40

        // Calculate y position (price)
        const priceRange = maxPrice - minPrice
        if (priceRange === 0) return null // Prevent division by zero

        const chartContentHeight = chartDimensions.height - 60
        // Invert y-coordinate since SVG coordinates start from top
        const yPos = chartContentHeight - ((dataPoint.price - minPrice) / priceRange) * chartContentHeight + 30

        return { x: xPos, y: yPos, event }
      })
      .filter(Boolean) as Array<{ x: number; y: number; event: StockEvent }>

    setEventMarkers(markers)
  }, [chartDimensions, filteredData, visibleEvents, minPrice, maxPrice])

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-black rounded-lg border border-gray-800">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          <p className="text-gray-400">Loading stock data...</p>
        </div>
      </div>
    )
  }

  if (error || filteredData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-black rounded-lg border border-gray-800">
        <div className="text-center max-w-md p-6">
          <p className="text-red-400 mb-2">Error loading stock data</p>
          <p className="text-gray-400 text-sm">{error || "No data available for the selected time range"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-1 bg-gray-900 rounded-md p-1 w-fit ml-auto">
        {(["1M", "3M", "6M", "1Y", "ALL"] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange(range)}
            className={`text-xs h-7 ${timeRange === range ? "bg-gray-800" : "hover:bg-gray-800 text-gray-400"}`}
          >
            {range}
          </Button>
        ))}
      </div>

      <div ref={chartRef} className="w-full h-[400px] relative bg-black rounded-lg border border-gray-800 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), "MMM dd")}
              stroke="#666"
              tick={{ fill: "#999" }}
              axisLine={{ stroke: "#333" }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#666"
              tick={{ fill: "#999" }}
              axisLine={{ stroke: "#333" }}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 border border-gray-800 p-2 rounded shadow-lg">
                      <p className="text-gray-300">{format(parseISO(label), "MMM dd, yyyy")}</p>
                      <p className="text-white font-bold">${payload[0].value?.toFixed(2)}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />

            {/* Event Reference Lines */}
            {visibleEvents.map((event, index) => (
              <ReferenceLine
                key={index}
                x={event.date}
                stroke="#666"
                strokeDasharray="3 3"
                label={{
                  position: "insideTopRight",
                  value: "",
                  fill: "transparent",
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>

        {/* Event Annotations */}
        {eventMarkers.map((marker, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${marker.x}px`,
              top: `${marker.y}px`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-gray-800 border-gray-700 hover:bg-opacity-80 p-0 overflow-hidden"
                >
                  {marker.event.imageUrl ? (
                    <Image
                      src={marker.event.imageUrl || "/placeholder.svg"}
                      alt={marker.event.title}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Info className="h-3 w-3 text-white" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-gray-900 border-gray-800 text-white">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {marker.event.imageUrl ? (
                        <Image
                          src={marker.event.imageUrl || "/placeholder.svg"}
                          alt={marker.event.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Info className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{marker.event.title}</h4>
                      <p className="text-xs text-gray-400">{format(parseISO(marker.event.date), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{marker.event.description}</p>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span>Stock price:</span>
                    <span className="font-medium text-white">
                      $
                      {filteredData
                        .find((item) => {
                          // Find exact date or closest date
                          const eventDate = parseISO(marker.event.date)
                          const itemDate = parseISO(item.date)
                          return Math.abs(eventDate.getTime() - itemDate.getTime()) < 24 * 60 * 60 * 1000 // Within a day
                        })
                        ?.price.toFixed(2) || "N/A"}
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}

        {/* Add connecting lines from markers to the price line for better visibility */}
        {eventMarkers.map((marker, index) => (
          <div
            key={`line-${index}`}
            className="absolute pointer-events-none"
            style={{
              left: `${marker.x}px`,
              top: `${marker.y}px`,
              width: "1px",
              height: "40px",
              backgroundColor: "#666",
              zIndex: 5,
            }}
          />
        ))}
      </div>

      {/* Event Legend */}
      <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h3 className="text-lg font-medium mb-3">Key Events</h3>
        <div className="space-y-3">
          {visibleEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Info className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <span className="text-xs text-gray-400">{format(parseISO(event.date), "MMM dd, yyyy")}</span>
                </div>
                <p className="text-sm text-gray-300">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
