"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWeatherApiKey } from "@/lib/api-keys"
import type { JSX } from "react"

interface ForecastDay {
  date: string
  day: string
  temp: number
  icon: string
  description: string
}

interface ForecastData {
  city: string
  country: string
  forecast: ForecastDay[]
}

interface WeatherForecastProps {
  city?: string
  days?: number
  className?: string
}

export function WeatherForecast({ city = "New Delhi", days = 5, className }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if API key exists
        const apiKey = getWeatherApiKey()
        if (!apiKey) {
          setApiKeyMissing(true)
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch weather forecast")
        }

        const data = await response.json()
        setForecast(data)
      } catch (err) {
        console.error("Weather forecast fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch weather forecast")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecast()
  }, [city, days])

  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeather icon codes to Lucide icons
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className="h-6 w-6 text-yellow-500" />,
      "01n": <Sun className="h-6 w-6 text-yellow-400" />,
      "02d": <Cloud className="h-6 w-6 text-gray-400" />,
      "02n": <Cloud className="h-6 w-6 text-gray-400" />,
      "03d": <Cloud className="h-6 w-6 text-gray-400" />,
      "03n": <Cloud className="h-6 w-6 text-gray-400" />,
      "04d": <Cloud className="h-6 w-6 text-gray-500" />,
      "04n": <Cloud className="h-6 w-6 text-gray-500" />,
      "09d": <CloudRain className="h-6 w-6 text-blue-400" />,
      "09n": <CloudRain className="h-6 w-6 text-blue-400" />,
      "10d": <CloudRain className="h-6 w-6 text-blue-500" />,
      "10n": <CloudRain className="h-6 w-6 text-blue-500" />,
      "11d": <CloudLightning className="h-6 w-6 text-yellow-600" />,
      "11n": <CloudLightning className="h-6 w-6 text-yellow-600" />,
      "13d": <CloudSnow className="h-6 w-6 text-blue-200" />,
      "13n": <CloudSnow className="h-6 w-6 text-blue-200" />,
      "50d": <Wind className="h-6 w-6 text-gray-300" />,
      "50n": <Wind className="h-6 w-6 text-gray-300" />,
    }

    return iconMap[iconCode] || <Cloud className="h-6 w-6 text-gray-400" />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-5 gap-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-6 rounded-full mb-2" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-destructive">
            <p>{error}</p>
            <p className="text-sm mt-2">Please check your API key in .env.local</p>
          </div>
        ) : apiKeyMissing ? (
          <div className="text-center p-4">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="font-medium mb-1">Weather API Key Missing</p>
            <p className="text-sm text-muted-foreground mb-3">
              Add NEXT_PUBLIC_WEATHER_API_KEY to your .env.local file to enable weather forecast data.
            </p>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/api-status")}>
              Check API Status
            </Button>
          </div>
        ) : forecast ? (
          <div className="grid grid-cols-5 gap-2 text-center">
            {forecast.forecast.map((day) => (
              <div key={day.date} className="flex flex-col items-center">
                <p className="font-medium">{day.day}</p>
                <div className="my-2">{getWeatherIcon(day.icon)}</div>
                <p className="text-sm">{day.temp}°C</p>
                <p className="text-xs text-muted-foreground capitalize truncate w-full">{day.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No forecast data available</p>
        )}
      </CardContent>
    </Card>
  )
}

