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

export default function StockChartSimple({ data, symbol, events = [] }) {
  const chartRef = useRef(null)
  const [processedEvents, setProcessedEvents] = useState([])

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
        }
      })

      setProcessedEvents(processed)
    } catch (error) {
      console.error("Error processing events:", error)
      // If there's an error, just use empty events
      setProcessedEvents([])
    }
  }, [data, events])

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

  return (
    <div className="w-full">
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 40, right: 30, left: 20, bottom: 60 }} ref={chartRef}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fill: "#ccc" }} tickMargin={10} angle={-45} height={60} />
            <YAxis
              tick={{ fill: "#ccc" }}
              domain={["auto", "auto"]}
              tickFormatter={(value) => `${value.toFixed(2)}`}
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

            {/* Main price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2962FF"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
              name={`${symbol} Price`}
            />

            {/* Event reference lines with labels */}
            {processedEvents.map((event, index) => (
              <ReferenceLine
                key={index}
                x={event.date}
                stroke={event.color}
                strokeDasharray="3 3"
                label={{
                  value: event.description,
                  position: "insideTopRight",
                  fill: "#fff",
                  fontSize: 12,
                  fontWeight: "bold",
                  offset: 10,
                  style: {
                    backgroundColor: event.color,
                    padding: "2px 4px",
                    borderRadius: "4px",
                  },
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
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
