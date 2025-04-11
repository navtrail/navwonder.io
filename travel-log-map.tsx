"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Location } from "@/lib/types"
import { getGoogleMapsApiKey } from "@/lib/api-keys"
import { Skeleton } from "@/components/ui/skeleton"

interface TravelLogMapProps {
  locations: Location[]
  height?: string
}

export function TravelLogMap({ locations, height = "400px" }: TravelLogMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [path, setPath] = useState<google.maps.Polyline | null>(null)

  useEffect(() => {
    // Load Google Maps API
    const apiKey = getGoogleMapsApiKey()
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      // Clean up
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || locations.length === 0) return

    // Initialize map
    const mapElement = document.getElementById("travel-log-map")
    if (!mapElement) return

    // Check if google is defined
    if (typeof window.google === "undefined" || typeof window.google.maps === "undefined") {
      console.error("Google Maps API not loaded properly.")
      return
    }

    const newMap = new window.google.maps.Map(mapElement, {
      center: { lat: locations[0].latitude, lng: locations[0].longitude },
      zoom: 8,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    })

    setMap(newMap)

    // Add markers for each location
    const newMarkers = locations.map((location) => {
      return new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: newMap,
        title: location.name,
      })
    })

    setMarkers(newMarkers)

    // Create a path between locations if there are multiple
    if (locations.length > 1) {
      const pathCoordinates = locations.map((location) => ({
        lat: location.latitude,
        lng: location.longitude,
      }))

      const newPath = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: newMap,
      })

      setPath(newPath)
    }

    // Fit bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds()
    locations.forEach((location) => {
      bounds.extend({ lat: location.latitude, lng: location.longitude })
    })
    newMap.fitBounds(bounds)

    return () => {
      // Clean up
      newMarkers.forEach((marker) => marker.setMap(null))
      path?.setMap(null)
    }
  }, [isLoaded, locations])

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
            <p className="text-muted-foreground">No locations to display</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trip Map</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
          <Skeleton className="w-full h-[300px] rounded-md" />
        ) : (
          <div id="travel-log-map" className="w-full rounded-md" style={{ height }} />
        )}
      </CardContent>
    </Card>
  )
}

