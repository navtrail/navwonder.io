"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPinIcon, Navigation, Search } from "lucide-react"
import { getGoogleMapsApiKey } from "@/lib/api-keys"

interface MapComponentProps {
  height?: string
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
}

// Define types for Google Maps
interface LatLng {
  lat: number
  lng: number
}

interface MapPin {
  position: LatLng
  title?: string
}

declare global {
  interface Window {
    google: any
  }
}

export function MapComponent({
  height = "500px",
  initialCenter = { lat: 20.5937, lng: 78.9629 }, // Center of India
  initialZoom = 5,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(google.maps.TravelMode.DRIVING)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>("")

  // Initialize map
  useEffect(() => {
    // Get API key
    const key = getGoogleMapsApiKey()
    setApiKey(key)

    // Load Google Maps API script if not already loaded
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (mapRef.current && !map && window.google) {
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })
        setMap(newMap)
      }
    }

    loadGoogleMapsAPI()

    return () => {
      // Clean up markers and directions
      markers.forEach((marker) => marker.setMap(null))
      if (directionsRenderer) {
        directionsRenderer.setMap(null)
      }
    }
  }, [initialCenter, initialZoom, map])

  // Handle search
  const handleSearch = async () => {
    if (!map || !searchQuery || !window.google) return

    setIsLoading(true)
    setError(null)

    try {
      const geocoder = new window.google.maps.Geocoder()

      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results.length > 0) {
          // Clear existing markers
          markers.forEach((marker) => marker.setMap(null))

          const location = results[0].geometry.location

          // Add new marker
          const marker = new window.google.maps.Marker({
            position: location,
            map: map,
            title: searchQuery,
            animation: window.google.maps.Animation.DROP,
          })

          setMarkers([marker])

          // Center map on location
          map.setCenter(location)
          map.setZoom(14)

          setIsLoading(false)
        } else {
          setError("Location not found. Please try a different search term.")
          setIsLoading(false)
        }
      })
    } catch (err) {
      setError("An error occurred while searching. Please try again.")
      console.error(err)
      setIsLoading(false)
    }
  }

  // Handle directions
  const handleGetDirections = async () => {
    if (!map || !origin || !destination || !window.google) return

    setIsLoading(true)
    setError(null)

    try {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])

      // Clear existing directions
      if (directionsRenderer) {
        directionsRenderer.setMap(null)
      }

      const directionsService = new window.google.maps.DirectionsService()

      directionsService.route(
        {
          origin,
          destination,
          travelMode,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            const renderer = new window.google.maps.DirectionsRenderer({
              map,
              directions: result,
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#3b82f6",
                strokeWeight: 5,
              },
            })

            setDirectionsRenderer(renderer)
          } else {
            setError("Could not calculate directions. Please check your origin and destination.")
          }

          setIsLoading(false)
        },
      )
    } catch (err) {
      setError("An error occurred while getting directions. Please try again.")
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search Location</Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a location"
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading || !searchQuery} className="ml-2">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Get Directions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                <Input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
              <div className="flex justify-between">
                <Select
                  value={travelMode}
                  onValueChange={(value) => {
                    if (window.google) {
                      setTravelMode(value as google.maps.TravelMode)
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Travel Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={google.maps.TravelMode.DRIVING}>Driving</SelectItem>
                    <SelectItem value={google.maps.TravelMode.WALKING}>Walking</SelectItem>
                    <SelectItem value={google.maps.TravelMode.BICYCLING}>Cycling</SelectItem>
                    <SelectItem value={google.maps.TravelMode.TRANSIT}>Transit</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleGetDirections} disabled={isLoading || !origin || !destination}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>

          {error && <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>}
        </CardContent>
      </Card>

      <div id="map" ref={mapRef} className="w-full rounded-lg border" style={{ height }}>
        {!map && (
          <div className="flex items-center justify-center h-full bg-muted/20">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Loading Map...</p>
              <p className="text-muted-foreground">Please wait while the map loads</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

