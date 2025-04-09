/**
 * OpenRouteService API integration for route planning
 */

// OpenRouteService API key
const OPENROUTE_API_KEY = process.env.NEXT_PUBLIC_OPENROUTE_API_KEY

// Base URL for OpenRouteService API
const OPENROUTE_API_BASE_URL = "https://api.openrouteservice.org/v2"

/**
 * Fetch a route between two points
 */
export async function fetchRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  transportMode = "driving-car",
): Promise<any> {
  try {
    if (!OPENROUTE_API_KEY) {
      console.warn("OpenRouteService API key is missing")
      throw new Error("API key is required")
    }

    // Convert transport mode to OpenRouteService format
    const orsTransportMode = convertTransportMode(transportMode)

    // Prepare the request body
    const requestBody = {
      coordinates: [
        [startLng, startLat],
        [endLng, endLat],
      ],
      instructions: true,
      preference: "recommended",
      units: "km",
      language: "en",
    }

    // Make the API request
    const response = await fetch(`${OPENROUTE_API_BASE_URL}/directions/${orsTransportMode}/json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: OPENROUTE_API_KEY,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching route:", error)
    throw error
  }
}

/**
 * Convert common transport mode names to OpenRouteService format
 */
function convertTransportMode(mode: string): string {
  const modeMap: Record<string, string> = {
    driving: "driving-car",
    walking: "foot-walking",
    cycling: "cycling-regular",
    hiking: "foot-hiking",
    wheelchair: "wheelchair",
  }

  return modeMap[mode.toLowerCase()] || "driving-car"
}

/**
 * Calculate the estimated travel time between two points
 */
export async function calculateTravelTime(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  transportMode = "driving-car",
): Promise<{ duration: number; distance: number }> {
  try {
    const routeData = await fetchRoute(startLat, startLng, endLat, endLng, transportMode)

    if (routeData && routeData.routes && routeData.routes.length > 0) {
      const route = routeData.routes[0]
      return {
        duration: route.summary.duration, // in seconds
        distance: route.summary.distance, // in meters
      }
    }

    throw new Error("No route found")
  } catch (error) {
    console.error("Error calculating travel time:", error)
    throw error
  }
}

/**
 * Get directions between two points with step-by-step instructions
 */
export async function getDirections(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  transportMode = "driving-car",
): Promise<any[]> {
  try {
    const routeData = await fetchRoute(startLat, startLng, endLat, endLng, transportMode)

    if (routeData && routeData.routes && routeData.routes.length > 0) {
      const route = routeData.routes[0]
      return route.segments.flatMap((segment: any) => segment.steps)
    }

    return []
  } catch (error) {
    console.error("Error getting directions:", error)
    return []
  }
}

/**
 * Find places along a route
 */
export async function findPlacesAlongRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  category = "tourism",
  buffer = 500, // buffer in meters
): Promise<any> {
  try {
    if (!OPENROUTE_API_KEY) {
      console.warn("OpenRouteService API key is missing")
      throw new Error("API key is required")
    }

    // First get the route
    const routeData = await fetchRoute(startLat, startLng, endLat, endLng)

    if (!routeData || !routeData.routes || routeData.routes.length === 0) {
      throw new Error("No route found")
    }

    // Extract the route geometry
    const routeGeometry = routeData.routes[0].geometry

    // Prepare the request body for places along the route
    const requestBody = {
      request: "pois",
      geometry: routeGeometry,
      filters: {
        category_ids: [convertCategoryToId(category)],
      },
      buffer: buffer,
      limit: 20,
    }

    // Make the API request
    const response = await fetch(`${OPENROUTE_API_BASE_URL}/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: OPENROUTE_API_KEY,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`OpenRouteService Places API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.features
  } catch (error) {
    console.error("Error finding places along route:", error)
    throw error
  }
}

/**
 * Convert category name to OpenRouteService category ID
 */
function convertCategoryToId(category: string): number {
  const categoryMap: Record<string, number> = {
    tourism: 260,
    accommodation: 280,
    food: 560,
    shopping: 580,
    leisure: 440,
  }

  return categoryMap[category.toLowerCase()] || 260 // Default to tourism
}

