"use client"

import { useState, useRef, useEffect } from "react"
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Locate, AlertTriangle } from "lucide-react"
import { getGoogleMapsApiKey } from "@/lib/api-keys"

// Define the libraries to load
const libraries = ["places"]

export function GoogleMapComponent() {
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [searchLngLat, setSearchLngLat] = useState<any>(null)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const autocompleteRef = useRef<any>(null)
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  // Get API key
  const apiKey = getGoogleMapsApiKey()

  useEffect(() => {
    // Check if API key is a placeholder
    if (apiKey.includes("test-key")) {
      setApiKeyMissing(true)
    }
  }, [apiKey])

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries as any,
  })

  // Default center (New Delhi, India)
  const center = { lat: 28.6139, lng: 77.209 }

  // Handle place change on search
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place?.geometry?.location) {
        setSelectedPlace(place)
        setSearchLngLat({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
        setCurrentLocation(null)
      } else {
        setError("No location data available for this place")
      }
    }
  }

  // Get current location
  const handleGetLocationClick = () => {
    setIsLoading(true)
    setError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setSelectedPlace(null)
          setSearchLngLat(null)
          setCurrentLocation({ lat: latitude, lng: longitude })
          setIsLoading(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setError("Could not get your location. Please check your browser permissions.")
          setIsLoading(false)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }

  // On map load
  const onMapLoad = (map: any) => {
    if (window.google) {
      const controlDiv = document.createElement("div")
      const controlUI = document.createElement("div")
      controlUI.innerHTML = "Get Location"
      controlUI.style.backgroundColor = "white"
      controlUI.style.color = "black"
      controlUI.style.border = "2px solid #ccc"
      controlUI.style.borderRadius = "3px"
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)"
      controlUI.style.cursor = "pointer"
      controlUI.style.marginBottom = "22px"
      controlUI.style.textAlign = "center"
      controlUI.style.width = "100%"
      controlUI.style.padding = "8px 0"
      controlUI.addEventListener("click", handleGetLocationClick)
      controlDiv.appendChild(controlUI)

      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(controlDiv)
    }
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted/20">
        <div className="text-center p-6 max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-lg font-medium mb-2">Failed to load Google Maps</p>
          <p className="text-muted-foreground mb-4">
            There was an error loading the map. This could be due to network issues or an invalid API key.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (apiKeyMissing) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted/20">
        <div className="text-center p-6 max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
          <p className="text-lg font-medium mb-2">Google Maps API Key Missing</p>
          <p className="text-muted-foreground mb-4">
            Please add your Google Maps API key to the environment variables to enable full map functionality. Add
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.
          </p>
          <p className="text-sm text-muted-foreground">
            The map will load in developer mode with limited functionality.
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted/20">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg font-medium">Loading Map...</p>
          <p className="text-muted-foreground">Please wait while the map loads</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete
                }}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  fields: ["address_components", "geometry", "name"],
                  componentRestrictions: { country: "in" }, // Restrict to India
                }}
              >
                <Input
                  type="text"
                  placeholder="Search for a location in India"
                  className="w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Autocomplete>
            </div>
            <Button onClick={handleGetLocationClick} disabled={isLoading} className="md:w-auto w-full">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Locate className="h-4 w-4 mr-2" />
                  Get My Location
                </>
              )}
            </Button>
          </div>

          {error && <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>}
        </CardContent>
      </Card>

      <GoogleMap
        zoom={currentLocation || selectedPlace ? 15 : 5}
        center={currentLocation || searchLngLat || center}
        mapContainerClassName="rounded-lg border"
        mapContainerStyle={{ width: "100%", height: "600px" }}
        onLoad={onMapLoad}
        options={{
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {selectedPlace && <Marker position={searchLngLat} />}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}

