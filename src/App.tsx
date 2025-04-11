import React, { useState, useEffect } from 'react';
import StockChart from './components/StockChart';
import stockData from './data/stockData.json';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockSymbols, setStockSymbols] = useState<string[]>([]);

  useEffect(() => {
    // Get available stock symbols
    const symbols = Object.keys(stockData.stocks);
    setStockSymbols(symbols);
  }, []);

  const handleStockChange = (symbol: string) => {
    setSelectedStock(symbol);
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