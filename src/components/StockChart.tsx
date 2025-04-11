import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';

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

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Create line series
    const series = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
      crosshairMarker: {
        visible: true,
        width: 1,
        color: '#2962FF',
      },
    });

    // Set data
    series.setData(data.map(item => ({
      time: item.time,
      value: item.value,
    })));

    // Add event markers
    events.forEach(event => {
      const marker = {
        time: event.time,
        position: 'aboveBar',
        color: '#2962FF',
        shape: 'circle',
        text: event.icon,
      };
      series.setMarkers([marker]);
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
        {events.map((event, index) => (
          <div key={index} className="event-item">
            <span className="event-icon">{event.icon}</span>
            <span className="event-time">{event.time}</span>
            <span className="event-description">{event.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockChart; 