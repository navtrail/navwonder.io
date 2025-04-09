// API utility functions for NavTrail

/**
 * Base URL for API requests
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.navtrail.in"

/**
 * Generic fetch function with error handling
 */
export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

/**
 * Authentication functions
 */
export const auth = {
  login: async (email: string, password: string) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData: any) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  logout: async () => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    })
  },

  getCurrentUser: async () => {
    return fetchAPI("/auth/user")
  },
}

/**
 * Places API functions
 */
export const places = {
  search: async (query: string, filters: any = {}) => {
    const queryParams = new URLSearchParams({
      q: query,
      ...filters,
    }).toString()

    return fetchAPI(`/places/search?${queryParams}`)
  },

  getDetails: async (placeId: string) => {
    return fetchAPI(`/places/${placeId}`)
  },

  getNearby: async (lat: number, lng: number, radius = 5000) => {
    return fetchAPI(`/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
  },
}

/**
 * Routes API functions
 */
export const routes = {
  getDirections: async (origin: string, destination: string, mode = "driving") => {
    return fetchAPI(`/routes/directions?origin=${origin}&destination=${destination}&mode=${mode}`)
  },

  saveRoute: async (routeData: any) => {
    return fetchAPI("/routes", {
      method: "POST",
      body: JSON.stringify(routeData),
    })
  },

  getUserRoutes: async () => {
    return fetchAPI("/routes/user")
  },

  deleteRoute: async (routeId: string) => {
    return fetchAPI(`/routes/${routeId}`, {
      method: "DELETE",
    })
  },
}

/**
 * Weather API functions
 */
export const weather = {
  getWeather: async (location: string) => {
    return fetchAPI(`/weather?location=${location}`)
  },

  getForecast: async (location: string, days = 5) => {
    return fetchAPI(`/weather/forecast?location=${location}&days=${days}`)
  },
}

/**
 * Trip planning API functions
 */
export const trips = {
  createTrip: async (tripData: any) => {
    return fetchAPI("/trips", {
      method: "POST",
      body: JSON.stringify(tripData),
    })
  },

  getUserTrips: async () => {
    return fetchAPI("/trips/user")
  },

  getTripDetails: async (tripId: string) => {
    return fetchAPI(`/trips/${tripId}`)
  },

  updateTrip: async (tripId: string, tripData: any) => {
    return fetchAPI(`/trips/${tripId}`, {
      method: "PUT",
      body: JSON.stringify(tripData),
    })
  },

  deleteTrip: async (tripId: string) => {
    return fetchAPI(`/trips/${tripId}`, {
      method: "DELETE",
    })
  },
}

/**
 * Currency conversion API functions
 */
export const currency = {
  convert: async (amount: number, from: string, to: string) => {
    return fetchAPI(`/currency/convert?amount=${amount}&from=${from}&to=${to}`)
  },

  getRates: async (base = "INR") => {
    return fetchAPI(`/currency/rates?base=${base}`)
  },
}

