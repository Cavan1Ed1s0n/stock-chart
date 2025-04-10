import StockChart from "@/components/stock-chart"
import { StockSelector } from "@/components/stock-selector"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Stock Chart Visualizer</h1>
      <div className="mb-6">
        <StockSelector />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <StockChart />
      </div>
    </main>
  )
}
