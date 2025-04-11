import StockChart from "@/components/stock-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Stock Price Analysis</h1>

        <Tabs defaultValue="TSLA" className="w-full">
          <TabsList className="bg-gray-900 mb-4">
            {["TSLA", "AAPL", "MSFT", "NVDA", "GOOGL"].map((stock) => (
              <TabsTrigger key={stock} value={stock} className="data-[state=active]:bg-gray-800">
                {stock}
              </TabsTrigger>
            ))}
          </TabsList>

          {["TSLA", "AAPL", "MSFT", "NVDA", "GOOGL"].map((stock) => (
            <TabsContent key={stock} value={stock} className="mt-0">
              <Card className="bg-gray-900 border border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle>
                    {getStockName(stock)} ({stock})
                  </CardTitle>
                  <CardDescription className="text-gray-400">{getStockDescription(stock)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <StockChart symbol={stock} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 text-gray-400 text-sm">
          <p>
            Note: This chart uses simulated stock data for demonstration purposes. In a production environment, you
            would connect to a real financial data API.
          </p>
          <p className="mt-2">
            To add or modify events, edit the <code>lib/stock-events.ts</code> file with your own event data and image
            URLs.
          </p>
        </div>
      </div>
    </main>
  )
}

function getStockName(symbol: string): string {
  const names: Record<string, string> = {
    TSLA: "Tesla, Inc.",
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    NVDA: "NVIDIA Corporation",
    GOOGL: "Alphabet Inc.",
  }
  return names[symbol] || symbol
}

function getStockDescription(symbol: string): string {
  const descriptions: Record<string, string> = {
    TSLA: "Electric vehicle and clean energy company",
    AAPL: "Consumer electronics, software and services",
    MSFT: "Software, cloud computing, and hardware",
    NVDA: "Graphics processing units and artificial intelligence",
    GOOGL: "Internet services and products",
  }
  return descriptions[symbol] || ""
}
