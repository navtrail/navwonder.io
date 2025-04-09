import { getWeatherApiKey } from "./api-keys"

interface WeatherData {
  condition: string
  temperature: number
  icon: string
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
}

// Fetch current weather for a location by coordinates
export async function fetchWeatherForLocation(latitude: number, longitude: number): Promise<WeatherData> {
  const apiKey = getWeatherApiKey()

  if (!apiKey) {
    // Return mock data if no API key is available
    return getMockWeatherData(latitude, longitude)
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      condition: data.weather[0].main,
      temperature: Math.round(data.main.temp),
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    }
  } catch (error) {
    console.error("Error fetching weather:", error)
    return getMockWeatherData(latitude, longitude)
  }
}

// Generate mock weather data for testing
function getMockWeatherData(latitude: number, longitude: number): WeatherData {
  // Determine a mock condition based on latitude (just for variety)
  const conditions = ["Clear", "Clouds", "Rain", "Thunderstorm", "Mist", "Snow"]
  const conditionIndex = Math.floor(Math.abs(latitude) * 10) % conditions.length
  const condition = conditions[conditionIndex]

  // Generate a temperature based on latitude (cooler toward poles, warmer at equator)
  const baseTemp = 30 - Math.abs(latitude) / 2
  const temperature = Math.round(baseTemp + (Math.random() * 10 - 5))

  // Map condition to icon code
  const iconMap: Record<string, string> = {
    Clear: "01d",
    Clouds: "03d",
    Rain: "10d",
    Thunderstorm: "11d",
    Mist: "50d",
    Snow: "13d",
  }

  return {
    condition,
    temperature,
    icon: `https://openweathermap.org/img/wn/${iconMap[condition]}@2x.png`,
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
    visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
    location: {
      name: "Mock Location",
      country: "IN",
      lat: latitude,
      lon: longitude,
    },
  }
}

