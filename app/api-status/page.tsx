"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { hasApiKey } from "@/lib/api-keys"

interface ApiKeyStatus {
  name: string
  envVar: string
  isSet: boolean
  purpose: string
}

export default function ApiStatusPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check API keys status
    const keys = [
      {
        name: "Google Maps API",
        envVar: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
        isSet: hasApiKey("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),
        purpose: "Map rendering, place search, geolocation",
      },
      {
        name: "Weather API",
        envVar: "NEXT_PUBLIC_WEATHER_API_KEY",
        isSet: hasApiKey("NEXT_PUBLIC_WEATHER_API_KEY"),
        purpose: "Weather data for Indian cities",
      },
      {
        name: "Currency API",
        envVar: "NEXT_PUBLIC_CURRENCY_API_KEY",
        isSet: hasApiKey("NEXT_PUBLIC_CURRENCY_API_KEY"),
        purpose: "Currency conversion",
      },
      {
        name: "Auth API",
        envVar: "NEXT_PUBLIC_AUTH_API_KEY",
        isSet: hasApiKey("NEXT_PUBLIC_AUTH_API_KEY"),
        purpose: "User authentication",
      },
      {
        name: "Cesium Ion Token",
        envVar: "NEXT_PUBLIC_CESIUM_ION_TOKEN",
        isSet: hasApiKey("NEXT_PUBLIC_CESIUM_ION_TOKEN"),
        purpose: "3D globe rendering, terrain visualization, and AR navigation",
      },
    ]

    setApiKeys(keys)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">API Status</h1>
        <p className="text-muted-foreground mb-6">Checking API key status...</p>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const missingKeys = apiKeys.filter((key) => !key.isSet)
  const workingKeys = apiKeys.filter((key) => key.isSet)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">API Status</h1>
      <p className="text-muted-foreground mb-6">Check the status of required API keys for NavTrail functionality</p>

      {missingKeys.length > 0 && (
        <Card className="mb-6 border-amber-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Missing API Keys
            </CardTitle>
            <CardDescription>Some API keys are missing. The app will use mock data for these services.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To enable full functionality, add the following environment variables to your .env.local file:
            </p>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              {missingKeys.map((key) => (
                <div key={key.envVar} className="mb-2">
                  {key.envVar}=your_api_key_here
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {apiKeys.map((key) => (
          <Card key={key.envVar} className={key.isSet ? "border-green-500/50" : "border-red-500/50"}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {key.name}
                  {key.isSet ? (
                    <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="ml-2 h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{key.envVar}</span>
              </div>
              <CardDescription>{key.purpose}</CardDescription>
            </CardHeader>
            <CardContent>
              {key.isSet ? (
                <p className="text-green-600 dark:text-green-400">✓ API key is properly configured</p>
              ) : (
                <div className="text-red-600 dark:text-red-400 space-y-2">
                  <p>✗ API key is missing</p>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm">
                    <p className="font-medium">How to fix:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>
                        Create or edit the <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your
                        project root
                      </li>
                      <li>
                        Add <code className="bg-muted px-1 py-0.5 rounded">{key.envVar}=YOUR_API_KEY</code>
                      </li>
                      <li>Restart the Next.js server</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
            <p className="mb-4">
              If you're having trouble setting up your API keys, check the documentation for each service:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Google Maps API:{" "}
                <a
                  href="https://console.cloud.google.com/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>
                OpenWeather API:{" "}
                <a
                  href="https://openweathermap.org/api"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenWeather API
                </a>
              </li>
              <li>
                Currency Exchange API:{" "}
                <a
                  href="https://exchangerate-api.com/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ExchangeRate API
                </a>
              </li>
              <li>Authentication: Use Firebase Auth, Auth0, or your preferred auth system</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => window.location.reload()}>Refresh API Status</Button>
      </div>
    </div>
  )
}

