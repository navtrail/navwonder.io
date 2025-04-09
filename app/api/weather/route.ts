import { NextResponse } from "next/server"
import { getWeatherApiKey } from "@/lib/api-keys"

// Mock weather data for when API key is missing
const mockWeatherData = {
  city: "New Delhi",
  country: "IN",
  temperature: 28,
  feels_like: 30,
  humidity: 65,
  pressure: 1012,
  wind_speed: 3.5,
  description: "partly cloudy",
  icon: "02d",
  timestamp: new Date().toISOString(),
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "New Delhi"
    const apiKey = getWeatherApiKey()

    if (!apiKey) {
      console.warn("Weather API key is missing. Using mock data.")
      return NextResponse.json({
        ...mockWeatherData,
        city: city,
        timestamp: new Date().toISOString(),
      })
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},in&units=metric&appid=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Format the response
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data. Please try again later." }, { status: 500 })
  }
}

