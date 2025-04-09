"use client"

import { useState } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function ImageWithFallback({ src, alt, width = 40, height = 40, className = "" }: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: width + "px", height: height + "px" }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white"></div>
        </div>
      )}

      <img
        src={error ? `/placeholder.svg?height=${height}&width=${width}` : src}
        alt={alt}
        className={`h-full w-full object-contain transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}
