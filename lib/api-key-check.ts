/**
 * Utility to check if required API keys are set
 */

export interface ApiKeyStatus {
  name: string
  envVar: string
  isSet: boolean
  purpose: string
}

export function checkApiKeys(): ApiKeyStatus[] {
  return [
    {
      name: "Google Maps API",
      envVar: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
      isSet: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      purpose: "Map rendering, place search, geolocation",
    },
    {
      name: "OpenWeather API",
      envVar: "NEXT_PUBLIC_WEATHER_API_KEY",
      isSet: !!process.env.NEXT_PUBLIC_WEATHER_API_KEY,
      purpose: "Weather data for Indian cities",
    },
    {
      name: "Currency Exchange API",
      envVar: "NEXT_PUBLIC_CURRENCY_API_KEY",
      isSet: !!process.env.NEXT_PUBLIC_CURRENCY_API_KEY,
      purpose: "Currency conversion",
    },
    {
      name: "Authentication API",
      envVar: "NEXT_PUBLIC_AUTH_API_KEY",
      isSet: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      purpose: "User authentication",
    },
    {
      name: "Cesium Ion Token",
      envVar: "NEXT_PUBLIC_CESIUM_ION_TOKEN",
      isSet: !!process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN,
      purpose: "3D globe rendering, terrain visualization, and AR navigation",
    },
  ]
}

export function getMissingApiKeys(): ApiKeyStatus[] {
  return checkApiKeys().filter((key) => !key.isSet)
}

export function getSetApiKeys(): ApiKeyStatus[] {
  return checkApiKeys().filter((key) => key.isSet)
}

