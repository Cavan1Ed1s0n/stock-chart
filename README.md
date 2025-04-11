# Stock Chart with Event Annotations

A modern stock chart application with event annotations and custom icons, built with React, TypeScript, and TradingView's lightweight charts library.

## Features

- Dark-themed stock chart with TradingView-like design
- Event annotations with custom icons/emojis
- Interactive crosshair for precise data reading
- Responsive design that works on all screen sizes
- Easy stock selection via dropdown
- Customizable events and annotations via JSON file

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Customizing Stock Data

To add or modify stocks and events, edit the `src/data/stockData.json` file. The structure is as follows:

```json
{
  "stocks": {
    "SYMBOL": {
      "name": "Company Name",
      "data": [
        { "time": "YYYY-MM-DD", "value": price },
        ...
      ],
      "events": [
        {
          "time": "YYYY-MM-DD",
          "description": "Event Description",
          "icon": "emoji_or_icon"
        },
        ...
      ]
    }
  }
}
```

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration and deploy your application

## Technologies Used

- React
- TypeScript
- Vite
- TradingView Lightweight Charts
- Vercel (for deployment) 