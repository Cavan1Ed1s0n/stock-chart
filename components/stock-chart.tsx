"use client"

import { useRef, useState, useEffect } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function StockChart({ data, symbol, events = [] }) {
  const chartRef = useRef(null)
  const [processedEvents, setProcessedEvents] = useState([])
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })
  const [chartArea, setChartArea] = useState({ top: 0, right: 0, bottom: 0, left: 0 })

  // Format the data for Recharts
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.close,
    volume: item.volume,
    timestamp: new Date(item.date).getTime(),
    rawDate: item.date,
  }))

  // Process events when data or events change
  useEffect(() => {
    if (!data || !events || events.length === 0) {
      setProcessedEvents([])
      return
    }

    try {
      // Find matching data points for events
      const processed = events.map((event) => {
        const eventTimestamp = event.date.getTime()

        // Find closest data point
        let closestPoint = null
        let closestDistance = Number.POSITIVE_INFINITY
        let closestIndex = -1

        formattedData.forEach((point, index) => {
          const distance = Math.abs(point.timestamp - eventTimestamp)
          if (distance < closestDistance) {
            closestDistance = distance
            closestPoint = point
            closestIndex = index
          }
        })

        return {
          ...event,
          date: closestPoint.date,
          price: closestPoint.price,
          dataIndex: closestIndex,
          xPosition: (closestIndex / (formattedData.length - 1)) * 100,
        }
      })

      setProcessedEvents(processed)
    } catch (error) {
      console.error("Error processing events:", error)
      // If there's an error, just use empty events
      setProcessedEvents([])
    }
  }, [data, events])

  // Update chart dimensions on window resize and initial render
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current?.container) {
        const { width, height } = chartRef.current.container.getBoundingClientRect()
        setChartDimensions({ width, height })

        // Get chart area (the actual plotting area excluding axes and margins)
        if (chartRef.current.state && chartRef.current.state.offset) {
          setChartArea({
            top: chartRef.current.state.offset.top,
            right: chartRef.current.state.offset.right,
            bottom: chartRef.current.state.offset.bottom,
            left: chartRef.current.state.offset.left,
          })
        }
      }
    }

    // Initial update
    const timer = setTimeout(updateDimensions, 100)

    // Add resize listener
    window.addEventListener("resize", updateDimensions)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Calculate the Y position for an event based on its price
  const calculateYPosition = (price) => {
    if (!chartRef.current || !chartDimensions.height) return 0

    const { domain } = chartRef.current.state.yAxis[0] || { domain: [0, 0] }
    if (!domain || domain[0] === domain[1]) return 0

    const [min, max] = domain
    const availableHeight = chartDimensions.height - chartArea.top - chartArea.bottom

    // Calculate the percentage position within the domain
    const percentage = (max - price) / (max - min)

    // Convert to pixel position
    return chartArea.top + percentage * availableHeight
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find if there's an event on this date
      const eventOnDate = processedEvents.find((e) => e.date === label)

      return (
        <div className="bg-gray-900 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-gray-300 mb-1">{label}</p>
          <p className="text-white font-bold">${payload[0].value.toFixed(2)}</p>

          {eventOnDate && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="font-medium" style={{ color: eventOnDate.color }}>
                {eventOnDate.description}
              </p>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // Custom dot component for events
  const CustomDot = (props) => {
    const { cx, cy, payload } = props
    const event = processedEvents.find((e) => e.date === payload.date)

    if (!event) return null

    return <circle cx={cx} cy={cy} r={6} fill={event.color} stroke="#000" strokeWidth={1} />
  }

  return (
    <div className="w-full">
      <div className="h-[600px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 40, right: 30, left: 20, bottom: 60 }}
            ref={chartRef}
            onMouseUp={() => {
              // Update chart dimensions after user interaction
              if (chartRef.current?.container) {
                const { width, height } = chartRef.current.container.getBoundingClientRect()
                setChartDimensions({ width, height })

                if (chartRef.current.state && chartRef.current.state.offset) {
                  setChartArea({
                    top: chartRef.current.state.offset.top,
                    right: chartRef.current.state.offset.right,
                    bottom: chartRef.current.state.offset.bottom,
                    left: chartRef.current.state.offset.left,
                  })
                }
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fill: "#ccc" }} tickMargin={10} angle={-45} height={60} />
            <YAxis
              tick={{ fill: "#ccc" }}
              domain={["auto", "auto"]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              width={80}
            >
              <Label
                value="Price (USD)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle", fill: "#ccc", fontSize: 12 }}
                offset={-10}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />

            {/* Event reference lines */}
            {processedEvents.map((event, index) => (
              <ReferenceLine key={index} x={event.date} stroke={event.color} strokeDasharray="3 3" />
            ))}

            <Line
              type="monotone"
              dataKey="price"
              stroke="#2962FF"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
              name={`${symbol} Price`}
            />

            {/* Add a second line just for event dots */}
            <Line
              dataKey="price"
              stroke="transparent"
              dot={<CustomDot />}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Event annotations positioned on the chart */}
        {processedEvents.map((event, index) => {
          // Only render if we have dimensions and the event has a position
          if (!chartDimensions.width || event.xPosition === undefined) return null

          // Calculate the x position in pixels
          const xPixel =
            (chartDimensions.width - chartArea.left - chartArea.right) * (event.xPosition / 100) + chartArea.left

          // Calculate the y position based on the price
          const yPixel = calculateYPosition(event.price)

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${xPixel}px`,
                top: `${yPixel - 10}px`, // Position above the point
                zIndex: 1000,
              }}
            >
              <div
                className="px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg mb-1"
                style={{
                  backgroundColor: `${event.color}CC`, // More opacity for better visibility
                  color: "#fff", // White text for better contrast
                  border: `1px solid ${event.color}`,
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.description}
              </div>
              <div
                className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent mx-auto"
                style={{ borderTopColor: event.color }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* Event images */}
      <div className="flex flex-wrap gap-4 mt-6">
        {processedEvents
          .filter((e) => e.imageUrl)
          .map((event, index) => (
            <Card key={index} className="w-auto bg-gray-900 border-gray-800">
              <CardContent className="p-3 flex items-center gap-3">
                <ImageWithFallback
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.description}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: event.color }}>
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-400">{event.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
