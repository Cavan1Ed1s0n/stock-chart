// This file contains the events data for different stocks
// In a real app, this could be fetched from a database or API

export interface StockEvent {
  date: string
  title: string
  description: string
  imageUrl: string
}

export interface StockEvents {
  [symbol: string]: StockEvent[]
}

export const stockEvents: StockEvents = {
  TSLA: [
    {
      date: "2023-04-19",
      title: "Q1 Earnings Miss",
      description:
        "Tesla reports lower than expected earnings for Q1 2023, with automotive gross margins falling to 19% after price cuts.",
      imageUrl: "https://i.imgur.com/JNNRbVA.png", // Example image URL (earnings chart)
    },
    {
      date: "2023-06-20",
      title: "Supercharger Deal",
      description:
        "Tesla announces deals with Ford and other major automakers to open its Supercharger network, boosting investor confidence.",
      imageUrl: "https://i.imgur.com/8BKvGQP.png", // Example image URL (supercharger)
    },
    {
      date: "2023-10-18",
      title: "Cybertruck Production",
      description:
        "Tesla confirms Cybertruck production is starting at Gigafactory Texas, ending years of delays for the highly anticipated vehicle.",
      imageUrl: "https://i.imgur.com/ixVHvry.png", // Example image URL (cybertruck)
    },
    {
      date: "2024-01-24",
      title: "Q4 Earnings Report",
      description: "Tesla reports Q4 earnings with lower margins but promises new affordable models coming soon.",
      imageUrl: "https://i.imgur.com/JNNRbVA.png", // Example image URL (earnings chart)
    },
  ],
  AAPL: [
    {
      date: "2023-06-05",
      title: "Vision Pro Announcement",
      description: "Apple announces its Vision Pro mixed reality headset at WWDC 2023.",
      imageUrl: "https://i.imgur.com/QkIa5tS.png", // Example image URL (Vision Pro)
    },
    {
      date: "2023-09-12",
      title: "iPhone 15 Release",
      description: "Apple releases the iPhone 15 series with USB-C port.",
      imageUrl: "https://i.imgur.com/jK3wDrk.png", // Example image URL (iPhone)
    },
    {
      date: "2024-02-01",
      title: "AI Strategy Announcement",
      description: "Apple announces plans to integrate AI features across its product lineup.",
      imageUrl: "https://i.imgur.com/8BKvGQP.png", // Example image URL (AI concept)
    },
  ],
  MSFT: [
    {
      date: "2023-01-23",
      title: "OpenAI Investment",
      description: "Microsoft announces a multi-billion dollar investment in OpenAI.",
      imageUrl: "https://i.imgur.com/8BKvGQP.png", // Example image URL (AI concept)
    },
    {
      date: "2023-05-23",
      title: "Build Conference",
      description: "Microsoft announces AI-powered Copilot features across its product lineup.",
      imageUrl: "https://i.imgur.com/QkIa5tS.png", // Example image URL (tech conference)
    },
    {
      date: "2023-10-03",
      title: "Surface Event",
      description: "Microsoft unveils new Surface devices with AI capabilities.",
      imageUrl: "https://i.imgur.com/jK3wDrk.png", // Example image URL (Surface device)
    },
  ],
  NVDA: [
    {
      date: "2025-02-25",
      title: "AI Boom Earnings",
      description: "NVIDIA reports record earnings driven by AI chip demand, stock soars.",
      imageUrl: "https://i.imgur.com/JNNRbVA.png", // Example image URL (earnings chart)
    },
    {
      date: "2025-03-28",
      title: "New GPU Announcement",
      description: "NVIDIA announces next-generation AI GPUs with significant performance improvements.",
      imageUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/25228.png", // Example image URL (GPU)
    },
    {
      date: "2025-01-08",
      title: "CES Keynote",
      description: "NVIDIA reveals new AI and gaming technologies at CES 2024.",
      imageUrl: "data:image/png;base64,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", // Example image URL (tech conference)
    },
  ],
  GOOGL: [
    {
      date: "2023-05-10",
      title: "Google I/O",
      description: "Google announces new AI features for search and other products at Google I/O.",
      imageUrl: "https://i.imgur.com/QkIa5tS.png", // Example image URL (tech conference)
    },
    {
      date: "2023-08-16",
      title: "Gemini AI Launch",
      description: "Google launches Gemini, its most capable AI model to compete with GPT-4.",
      imageUrl: "https://i.imgur.com/8BKvGQP.png", // Example image URL (AI concept)
    },
    {
      date: "2023-10-04",
      title: "Pixel 8 Release",
      description: "Google releases Pixel 8 with advanced AI features and longer support.",
      imageUrl: "https://i.imgur.com/jK3wDrk.png", // Example image URL (Pixel phone)
    },
  ],
}
