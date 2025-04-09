/**
 * Google Places API integration for accessing information on hotels and restaurants
 */

// Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Base URL for Google Places API
const PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place"

/**
 * Fetch nearby places based on location and type
 */
export async function fetchPlacesNearby(location: string, type = "tourist_attraction", radius = 5000): Promise<any[]> {
  try {
    // First, geocode the location to get coordinates
    const coordinates = await geocodeLocation(location)
    if (!coordinates) {
      throw new Error("Could not geocode location")
    }

    // Use client-side approach for browser environments
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      return fetchPlacesWithGoogleMapsJS(coordinates.lat, coordinates.lng, type, radius)
    }

    // Fallback to server-side approach
    return fetchPlacesWithAPI(coordinates.lat, coordinates.lng, type, radius)
  } catch (error) {
    console.error("Error fetching nearby places:", error)
    return []
  }
}

/**
 * Fetch places using Google Maps JavaScript API (client-side)
 */
async function fetchPlacesWithGoogleMapsJS(lat: number, lng: number, type: string, radius: number): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"))

    service.nearbySearch(
      {
        location: { lat, lng },
        radius,
        type,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results)
        } else {
          reject(new Error(`Places API error: ${status}`))
        }
      },
    )
  })
}

/**
 * Fetch places using Google Places API (server-side)
 */
async function fetchPlacesWithAPI(lat: number, lng: number, type: string, radius: number): Promise<any[]> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key is missing")
    return []
  }

  const url = `${PLACES_API_BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Places API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.status !== "OK") {
    throw new Error(`Places API error: ${data.status}`)
  }

  return data.results
}

/**
 * Geocode a location string to coordinates
 */
export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key is missing")
      return null
    }

    // Use client-side approach for browser environments
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      return geocodeWithGoogleMapsJS(location)
    }

    // Fallback to server-side approach
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding API error: ${data.status}`)
    }

    const { lat, lng } = data.results[0].geometry.location
    return { lat, lng }
  } catch (error) {
    console.error("Error geocoding location:", error)
    return null
  }
}

/**
 * Geocode using Google Maps JavaScript API (client-side)
 */
async function geocodeWithGoogleMapsJS(location: string): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ address: location }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location
        resolve({ lat: lat(), lng: lng() })
      } else {
        reject(new Error(`Geocoding API error: ${status}`))
      }
    })
  })
}

/**
 * Get details for a specific place
 */
export async function getPlaceDetails(placeId: string): Promise<any> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key is missing")
      return null
    }

    // Use client-side approach for browser environments
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      return getPlaceDetailsWithGoogleMapsJS(placeId)
    }

    // Fallback to server-side approach
    const url = `${PLACES_API_BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,formatted_phone_number,website,opening_hours,price_level,review,photo,type&key=${GOOGLE_MAPS_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error(`Place Details API error: ${data.status}`)
    }

    return data.result
  } catch (error) {
    console.error("Error getting place details:", error)
    return null
  }
}

/**
 * Get place details using Google Maps JavaScript API (client-side)
 */
async function getPlaceDetailsWithGoogleMapsJS(placeId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"))

    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "rating",
          "formatted_phone_number",
          "website",
          "opening_hours",
          "price_level",
          "review",
          "photo",
          "type",
        ],
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result)
        } else {
          reject(new Error(`Place Details API error: ${status}`))
        }
      },
    )
  })
}

/**
 * Search for places by text query
 */
export async function searchPlaces(query: string, location?: string): Promise<any[]> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key is missing")
      return []
    }

    let locationParam = ""

    if (location) {
      const coordinates = await geocodeLocation(location)
      if (coordinates) {
        locationParam = `&location=${coordinates.lat},${coordinates.lng}&radius=50000`
      }
    }

    const url = `${PLACES_API_BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}${locationParam}&key=${GOOGLE_MAPS_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Places Search API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error(`Places Search API error: ${data.status}`)
    }

    return data.results
  } catch (error) {
    console.error("Error searching places:", error)
    return []
  }
}

