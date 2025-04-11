import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, SeriesMarkerPosition, SeriesMarkerShape } from 'lightweight-charts';

interface StockData {
  time: string;
  value: number;
}

interface Event {
  time: string;
  description: string;
  icon: string;
}

interface StockChartProps {
  data: StockData[];
  events: Event[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, events, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart with dark theme
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1E222D' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#555',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#555',
          width: 1,
          style: 3,
        },
      },
    });

    // Create line series
    const series = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
      priceLineVisible: false,
    });

    // Set data
    series.setData(data.map(item => ({
      time: item.time,
      value: item.value,
    })));

    // Create markers for events at exact price points
    const markers = events.map(event => {
      // Find the price at the event time
      const eventData = data.find(item => item.time === event.time);
      if (!eventData) return null;

      return {
        time: event.time,
        position: 'inBar' as SeriesMarkerPosition,
        color: '#FF9800',
        shape: 'circle' as SeriesMarkerShape,
        text: event.icon,
        size: 1.5,
      };
    }).filter(marker => marker !== null);

    // Add markers to the series
    if (markers.length > 0) {
      series.setMarkers(markers);
    }

    // Add price labels for events
    events.forEach(event => {
      const eventData = data.find(item => item.time === event.time);
      if (eventData) {
        series.createPriceLine({
          price: eventData.value,
          color: '#FF9800',
          lineWidth: 1,
          lineStyle: 2, // Dashed line
          axisLabelVisible: true,
          title: event.icon,
        });
      }
    });

    // Store references
    chartRef.current = chart;
    seriesRef.current = series;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, events]);

  return (
    <div className="stock-chart-container">
      <div className="chart-header">
        <h2>{symbol}</h2>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
      <div className="events-list">
        {events.map((event, index) => {
          const eventData = data.find(item => item.time === event.time);
          return (
            <div key={index} className="event-item">
              <span className="event-icon">{event.icon}</span>
              <span className="event-time">{event.time}</span>
              <span className="event-price">
                Price: ${eventData?.value.toFixed(2) || 'N/A'}
              </span>
              <span className="event-description">{event.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockChart; 