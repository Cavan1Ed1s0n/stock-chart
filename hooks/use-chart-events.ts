"use client"

import { useState, useEffect, useRef } from "react"

export function useChartEvents(data, events, chartRef) {
  const [processedEvents, setProcessedEvents] = useState([])
  const dataRef = useRef(data)
  const eventsRef = useRef(events)

  // First effect: Find matching data points for events
  useEffect(() => {
    if (!data || !events || events.length === 0) {
      setProcessedEvents([])
      return
    }

    // Update refs to avoid dependency issues
    dataRef.current = data
    eventsRef.current = events

    // Format the data for processing
    const formattedData = data.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      price: item.close,
      timestamp: new Date(item.date).getTime(),
    }))

    // Process events to find their positions in the data
    const processed = events.map((event) => {
      const eventTimestamp = event.date.getTime()

      // Find the closest data point to the event date
      const closestPoint = formattedData.reduce((prev, curr) => {
        return Math.abs(curr.timestamp - eventTimestamp) < Math.abs(prev.timestamp - eventTimestamp) ? curr : prev
      }, formattedData[0])

      return {
        ...event,
        date: closestPoint.date,
        price: closestPoint.price,
        dataIndex: formattedData.findIndex((d) => d.date === closestPoint.date),
      }
    })

    setProcessedEvents(processed)
  }, [data, events]) // Only depend on data and events

  // Second effect: Calculate positions after render
  // This runs once after the chart is rendered and window is resized
  useEffect(() => {
    const calculatePositions = () => {
      if (!chartRef.current || processedEvents.length === 0 || !dataRef.current) return

      const chartElement = chartRef.current
      if (!chartElement.container) return

      const totalPoints = dataRef.current.length
      if (totalPoints <= 1) return

      // Calculate the position for each event
      const eventsWithPositions = processedEvents.map((event) => {
        // Calculate position as percentage of chart width
        const xPosition = (event.dataIndex / (totalPoints - 1)) * 100

        return {
          ...event,
          xPosition,
        }
      })

      // Only update state if positions have changed
      const positionsChanged = eventsWithPositions.some(
        (event, index) => event.xPosition !== processedEvents[index]?.xPosition,
      )

      if (positionsChanged) {
        setProcessedEvents(eventsWithPositions)
      }
    }

    // Calculate positions after a short delay to ensure chart is rendered
    const timer = setTimeout(calculatePositions, 100)

    // Add resize listener to recalculate positions when window size changes
    window.addEventListener("resize", calculatePositions)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calculatePositions)
    }
  }, [processedEvents.length]) // Only depend on the length of processedEvents

  return processedEvents
}
