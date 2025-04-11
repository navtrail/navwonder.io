"use client"

import { useState, useRef, useEffect } from "react"
import { GoogleMap, useLoadScript, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, ArrowRight, AlertTriangle } from "lucide-react"
import { getGoogleMapsApiKey } from "@/lib/api-keys"

// Define the libraries to load
const libraries = ["places"]

export function DirectionsMap() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [directions, setDirections] = useState<any>(null)
  const [travelMode, setTravelMode] = useState<string>("DRIVING")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const originAutocompleteRef = useRef<any>(null)
  const destAutocompleteRef = useRef<any>(null)

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

  // Get directions
  const getDirections = () => {
    if (!origin || !destination) {
      setError("Please enter both origin and destination")
      return
    }

    setIsLoading(true)
    setError(null)

    if (window.google) {
      const directionsService = new window.google.maps.DirectionsService()

      directionsService.route(
        {
          origin,
          destination,
          travelMode: travelMode as any,
        },
        (result, status) => {
          setIsLoading(false)

          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirections(result)
          } else {
            setError(`Could not calculate directions: ${status}`)
          }
        },
      )
    } else {
      setError("Google Maps API not loaded")
      setIsLoading(false)
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto] gap-2 items-end">
            <div>
              <Autocomplete
                onLoad={(autocomplete) => {
                  originAutocompleteRef.current = autocomplete
                }}
                onPlaceChanged={() => {
                  if (originAutocompleteRef.current) {
                    const place = originAutocompleteRef.current.getPlace()
                    if (place.formatted_address) {
                      setOrigin(place.formatted_address)
                    }
                  }
                }}
                options={{
                  fields: ["formatted_address", "geometry", "name"],
                  componentRestrictions: { country: "in" }, // Restrict to India
                }}
              >
                <Input placeholder="Enter origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
              </Autocomplete>
            </div>

            <ArrowRight className="hidden md:block h-4 w-4 mx-2" />

            <div>
              <Autocomplete
                onLoad={(autocomplete) => {
                  destAutocompleteRef.current = autocomplete
                }}
                onPlaceChanged={() => {
                  if (destAutocompleteRef.current) {
                    const place = destAutocompleteRef.current.getPlace()
                    if (place.formatted_address) {
                      setDestination(place.formatted_address)
                    }
                  }
                }}
                options={{
                  fields: ["formatted_address", "geometry", "name"],
                  componentRestrictions: { country: "in" }, // Restrict to India
                }}
              >
                <Input
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Autocomplete>
            </div>

            <Button
              onClick={getDirections}
              disabled={isLoading || !origin || !destination}
              className="w-full md:w-auto mt-2 md:mt-0"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </>
              )}
            </Button>
          </div>

          <div className="mt-4">
            <Select value={travelMode} onValueChange={setTravelMode}>
              <SelectTrigger>
                <SelectValue placeholder="Travel Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRIVING">Driving</SelectItem>
                <SelectItem value="WALKING">Walking</SelectItem>
                <SelectItem value="BICYCLING">Cycling</SelectItem>
                <SelectItem value="TRANSIT">Transit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>}
        </CardContent>
      </Card>

      <GoogleMap
        zoom={5}
        center={center}
        mapContainerClassName="rounded-lg border"
        mapContainerStyle={{ width: "100%", height: "600px" }}
        options={{
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#3b82f6",
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>

      {directions && directions.routes && directions.routes.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Route Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Distance:</span> {directions.routes[0].legs[0].distance?.text}
              </p>
              <p>
                <span className="font-medium">Duration:</span> {directions.routes[0].legs[0].duration?.text}
              </p>

              <h4 className="font-medium mt-4 mb-2">Step by Step Directions</h4>
              <ol className="space-y-2 list-decimal list-inside">
                {directions.routes[0].legs[0].steps.map((step: any, index: number) => (
                  <li key={index} className="text-sm">
                    <span dangerouslySetInnerHTML={{ __html: step.instructions }} />
                    <span className="text-muted-foreground ml-2">({step.distance?.text})</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

