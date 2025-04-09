// Utility functions for handling API keys

// Function to check if an API key is available
export function hasApiKey(key: string): boolean {
  return (
    typeof process.env[key] === "string" && process.env[key]!.length > 0 && !process.env[key]!.includes("placeholder")
  )
}

// Function to get an API key with a fallback value
export function getApiKey(key: string, fallback = ""): string {
  return hasApiKey(key) ? (process.env[key] as string) : fallback
}

// Function to get the Google Maps API key
export function getGoogleMapsApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!key || key.includes("placeholder")) {
    console.warn("Google Maps API key is missing. Map functionality will be limited.")
    // Return a placeholder key that will show the developer mode of Google Maps
    return "AIzaSyA-test-key-that-will-show-developer-mode"
  }
  return key
}

// Function to get the Weather API key
export function getWeatherApiKey(): string {
  return getApiKey("NEXT_PUBLIC_WEATHER_API_KEY")
}

// Function to get the Currency API key
export function getCurrencyApiKey(): string {
  return getApiKey("NEXT_PUBLIC_CURRENCY_API_KEY")
}

// Function to get the Auth API key
export function getAuthApiKey(): string {
  return getApiKey("NEXT_PUBLIC_AUTH_API_KEY")
}

// Add the OpenRouteService API key getter
export function getOpenRouteApiKey(): string {
  return getApiKey("NEXT_PUBLIC_OPENROUTE_API_KEY")
}

// Function to get the Cesium Ion token
export function getCesiumIonToken(): string {
  return getApiKey("NEXT_PUBLIC_CESIUM_ION_TOKEN")
}

