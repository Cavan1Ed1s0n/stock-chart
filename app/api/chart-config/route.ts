import { NextResponse } from "next/server"

// Hardcoded chart configuration
const chartConfig = {
  asset: {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    period: "1y",
    interval: "1d",
  },
  events: [
    {
      date: "2023-03-15",
      description: "Product Launch: New MacBook Pro",
      color: "#4CAF50",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    },
    {
      date: "2023-06-05",
      description: "WWDC 2023 Conference",
      color: "#2196F3",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Apple_WWDC_wordmark.svg/2560px-Apple_WWDC_wordmark.svg.png",
    },
    {
      date: "2023-09-12",
      description: "iPhone 15 Announcement",
      color: "#FF9800",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_14_vector.svg/1200px-IPhone_14_vector.svg.png",
    },
    {
      date: "2023-11-02",
      description: "Q4 Earnings Report",
      color: "#E91E63",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Earnings_Report.svg/1200px-Earnings_Report.svg.png",
    },
  ],
}

export async function GET() {
  return NextResponse.json(chartConfig)
}
