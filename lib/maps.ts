// Maps utility functions for NavTrail

/**
 * Google Maps API key
 */
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

/**
 * Initialize Google Maps
 */
export const initializeMap = (elementId: string, options: google.maps.MapOptions = {}) => {
  const defaultOptions: google.maps.MapOptions = {
    center: { lat: 20.5937, lng: 78.9629 }, // Center of India
    zoom: 5,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    ...options,
  }

  const mapElement = document.getElementById(elementId)
  if (!mapElement) {
    console.error(`Element with id "${elementId}" not found`)
    return null
  }

  return new google.maps.Map(mapElement, defaultOptions)
}

/**
 * Add marker to map
 */
export const addMarker = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  options: google.maps.MarkerOptions = {},
) => {
  return new google.maps.Marker({
    position,
    map,
    ...options,
  })
}

/**
 * Geocode address to coordinates
 */
export const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_API_KEY}`,
    )
    const data = await response.json()

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return { lat: location.lat, lng: location.lng }
    }

    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

/**
 * Get directions between two points
 */
export const getDirections = async (
  origin: string | google.maps.LatLngLiteral,
  destination: string | google.maps.LatLngLiteral,
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING,
): Promise<google.maps.DirectionsResult | null> => {
  return new Promise((resolve, reject) => {
    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin,
        destination,
        travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve(result)
        } else {
          console.error(`Directions request failed: ${status}`)
          reject(null)
        }
      },
    )
  })
}

/**
 * Render directions on map
 */
export const renderDirections = (map: google.maps.Map, directions: google.maps.DirectionsResult) => {
  const directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(map)
  directionsRenderer.setDirections(directions)
  return directionsRenderer
}

/**
 * Get places nearby
 */
export const getNearbyPlaces = async (
  location: google.maps.LatLngLiteral,
  radius = 5000,
  type = "tourist_attraction",
): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement("div"))

    service.nearbySearch(
      {
        location,
        radius,
        type,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results)
        } else {
          console.error(`Nearby places request failed: ${status}`)
          reject([])
        }
      },
    )
  })
}

/**
 * Get place details
 */
export const getPlaceDetails = async (placeId: string): Promise<google.maps.places.PlaceResult | null> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement("div"))

    service.getDetails(
      {
        placeId,
        fields: ["name", "formatted_address", "geometry", "photos", "rating", "reviews", "website", "opening_hours"],
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result)
        } else {
          console.error(`Place details request failed: ${status}`)
          reject(null)
        }
      },
    )
  })
}

