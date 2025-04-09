import { NextResponse } from "next/server"
import { getWeatherApiKey } from "@/lib/api-keys"

// Mock forecast data for when API key is missing
const mockForecastData = {
  city: "New Delhi",
  country: "IN",
  forecast: [
    { date: "2023-11-20", day: "Mon", temp: 28, icon: "01d", description: "clear sky" },
    { date: "2023-11-21", day: "Tue", temp: 27, icon: "02d", description: "few clouds" },
    { date: "2023-11-22", day: "Wed", temp: 26, icon: "03d", description: "scattered clouds" },
    { date: "2023-11-23", day: "Thu", temp: 25, icon: "10d", description: "light rain" },
    { date: "2023-11-24", day: "Fri", temp: 24, icon: "01d", description: "clear sky" },
  ],
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "New Delhi"
    const days = Number.parseInt(searchParams.get("days") || "5", 10)
    const apiKey = getWeatherApiKey()

    if (!apiKey) {
      console.warn("Weather API key is missing. Using mock data.")
      return NextResponse.json({
        ...mockForecastData,
        city: city,
      })
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},in&units=metric&appid=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Process the forecast data
    // OpenWeather returns forecast in 3-hour intervals, so we need to group by day
    const dailyForecasts = []
    const forecastMap = new Map()

    // Group forecasts by day
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]

      if (!forecastMap.has(date)) {
        forecastMap.set(date, {
          date,
          temperatures: [],
          icons: [],
          descriptions: [],
        })
      }

      const dayData = forecastMap.get(date)
      dayData.temperatures.push(item.main.temp)
      dayData.icons.push(item.weather[0].icon)
      dayData.descriptions.push(item.weather[0].description)
    })

    // Calculate daily averages and most common weather condition
    forecastMap.forEach((value, key) => {
      const avgTemp = value.temperatures.reduce((a: number, b: number) => a + b, 0) / value.temperatures.length

      // Find most common icon and description
      const iconCounts = value.icons.reduce((acc: any, icon: string) => {
        acc[icon] = (acc[icon] || 0) + 1
        return acc
      }, {})

      const descCounts = value.descriptions.reduce((acc: any, desc: string) => {
        acc[desc] = (acc[desc] || 0) + 1
        return acc
      }, {})

      const mostCommonIcon = Object.entries(iconCounts).sort((a: any, b: any) => b[1] - a[1])[0][0]
      const mostCommonDesc = Object.entries(descCounts).sort((a: any, b: any) => b[1] - a[1])[0][0]

      dailyForecasts.push({
        date: key,
        day: new Date(key).toLocaleDateString("en-US", { weekday: "short" }),
        temp: Math.round(avgTemp),
        icon: mostCommonIcon,
        description: mostCommonDesc,
      })
    })

    // Limit to requested number of days
    const limitedForecasts = dailyForecasts.slice(0, days)

    return NextResponse.json({
      city: data.city.name,
      country: data.city.country,
      forecast: limitedForecasts,
    })
  } catch (error) {
    console.error("Weather forecast API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather forecast data. Please try again later." },
      { status: 500 },
    )
  }
}

