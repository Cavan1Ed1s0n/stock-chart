import React, { useState, useEffect } from 'react';
import StockChart from './components/StockChart';
import stockData from './data/stockData.json';

type StockSymbol = 'AAPL' | 'GOOGL';

interface StockInfo {
  name: string;
  data: { time: string; value: number; }[];
  events: { time: string; description: string; icon: string; }[];
}

interface StockData {
  stocks: {
    [key in StockSymbol]: StockInfo;
  };
}

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<StockSymbol>('AAPL');
  const [stockSymbols, setStockSymbols] = useState<StockSymbol[]>([]);

  useEffect(() => {
    // Get available stock symbols
    const symbols = Object.keys(stockData.stocks) as StockSymbol[];
    setStockSymbols(symbols);
  }, []);

  const handleStockChange = (symbol: string) => {
    setSelectedStock(symbol as StockSymbol);
  };

  const currentStock = stockData.stocks[selectedStock];

  return (
    <div className="app-container">
      <div className="stock-selector">
        <label htmlFor="stock-select">Select Stock: </label>
        <select
          id="stock-select"
          value={selectedStock}
          onChange={(e) => handleStockChange(e.target.value)}
        >
          {stockSymbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol} - {stockData.stocks[symbol].name}
            </option>
          ))}
        </select>
      </div>

      {currentStock && (
        <StockChart
          data={currentStock.data}
          events={currentStock.events}
          symbol={selectedStock}
        />
      )}
    </div>
  );
};

export default App; 