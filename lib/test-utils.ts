/**
 * Utility functions for testing the application
 */

// Function to test if an API is working
export async function testApi(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await fetch(endpoint, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: `API request failed with status ${response.status}: ${errorData.error || response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      message: "API request successful",
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: `API request failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Function to test if the Weather API is working
export async function testWeatherApi(city = "New Delhi"): Promise<{ success: boolean; message: string; data?: any }> {
  return testApi(`/api/weather?city=${encodeURIComponent(city)}`)
}

// Function to test if the Currency API is working
export async function testCurrencyApi(
  from = "INR",
  to = "USD",
  amount = 1000,
): Promise<{ success: boolean; message: string; data?: any }> {
  return testApi(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`)
}

// Function to test if the Auth API is working
export async function testAuthApi(
  email = "test@example.com",
  password = "password",
): Promise<{ success: boolean; message: string; data?: any }> {
  return testApi("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
}

// Function to test if all APIs are working
export async function testAllApis(): Promise<{ [key: string]: { success: boolean; message: string; data?: any } }> {
  const results = {
    weather: await testWeatherApi(),
    currency: await testCurrencyApi(),
    auth: await testAuthApi(),
  }

  return results
}

// Function to check if the browser supports geolocation
export function supportsGeolocation(): boolean {
  return "geolocation" in navigator
}

// Function to check if the browser supports offline storage
export function supportsOfflineStorage(): boolean {
  return "localStorage" in window && "serviceWorker" in navigator
}

// Function to check if the browser supports speech synthesis
export function supportsSpeechSynthesis(): boolean {
  return "speechSynthesis" in window
}

// Function to check browser capabilities
export function checkBrowserCapabilities(): { [key: string]: boolean } {
  return {
    geolocation: supportsGeolocation(),
    offlineStorage: supportsOfflineStorage(),
    speechSynthesis: supportsSpeechSynthesis(),
  }
}

