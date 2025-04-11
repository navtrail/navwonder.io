"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWeatherApiKey } from "@/lib/api-keys"
import type { JSX } from "react"

interface WeatherData {
  city: string
  country: string
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  description: string
  icon: string
}

interface WeatherWidgetProps {
  city?: string
  className?: string
}

export function WeatherWidget({ city = "New Delhi", className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
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

        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch weather data")
        }

        const data = await response.json()
        setWeather(data)
      } catch (err) {
        console.error("Weather fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeather icon codes to Lucide icons
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className="h-8 w-8 text-yellow-500" />,
      "01n": <Sun className="h-8 w-8 text-yellow-400" />,
      "02d": <Cloud className="h-8 w-8 text-gray-400" />,
      "02n": <Cloud className="h-8 w-8 text-gray-400" />,
      "03d": <Cloud className="h-8 w-8 text-gray-400" />,
      "03n": <Cloud className="h-8 w-8 text-gray-400" />,
      "04d": <Cloud className="h-8 w-8 text-gray-500" />,
      "04n": <Cloud className="h-8 w-8 text-gray-500" />,
      "09d": <CloudRain className="h-8 w-8 text-blue-400" />,
      "09n": <CloudRain className="h-8 w-8 text-blue-400" />,
      "10d": <CloudRain className="h-8 w-8 text-blue-500" />,
      "10n": <CloudRain className="h-8 w-8 text-blue-500" />,
      "11d": <CloudLightning className="h-8 w-8 text-yellow-600" />,
      "11n": <CloudLightning className="h-8 w-8 text-yellow-600" />,
      "13d": <CloudSnow className="h-8 w-8 text-blue-200" />,
      "13n": <CloudSnow className="h-8 w-8 text-blue-200" />,
      "50d": <Wind className="h-8 w-8 text-gray-300" />,
      "50n": <Wind className="h-8 w-8 text-gray-300" />,
    }

    return iconMap[iconCode] || <Cloud className="h-8 w-8 text-gray-400" />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-12 w-32" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
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
              Add NEXT_PUBLIC_WEATHER_API_KEY to your .env.local file to enable weather data.
            </p>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/api-status")}>
              Check API Status
            </Button>
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {weather.city}, {weather.country}
                </h3>
                <p className="text-3xl font-bold">{weather.temperature}°C</p>
                <p className="text-sm text-muted-foreground">Feels like {weather.feels_like}°C</p>
                <p className="text-sm capitalize">{weather.description}</p>
              </div>
              <div>{getWeatherIcon(weather.icon)}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{weather.wind_speed} m/s</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{weather.humidity}%</span>
              </div>
            </div>
          </div>
        ) : (
          <p>No weather data available</p>
        )}
      </CardContent>
    </Card>
  )
}

