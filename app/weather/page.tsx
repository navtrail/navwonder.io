import { WeatherWidget } from "@/components/weather-widget"
import { WeatherForecast } from "@/components/weather-forecast"
import { Card, CardContent } from "@/components/ui/card"

export default function WeatherPage() {
  // List of major Indian cities
  const cities = [
    "New Delhi",
    "Mumbai",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Weather Forecast</h1>
      <p className="text-muted-foreground mb-6">Check the current weather and forecast for major cities across India</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">New Delhi Weather</h2>
        <div className="grid grid-cols-1 gap-6">
          <WeatherWidget city="New Delhi" />
          <WeatherForecast city="New Delhi" />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Major Cities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.slice(1).map((city) => (
          <WeatherWidget key={city} city={city} />
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">About Weather Data</h2>
            <p className="mb-4">
              Weather data is provided by OpenWeather API, offering accurate and up-to-date weather information for
              cities across India.
            </p>
            <p className="text-sm text-muted-foreground">
              Note: Weather data is refreshed every hour. The forecast shows the expected weather conditions for the
              next 5 days.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

