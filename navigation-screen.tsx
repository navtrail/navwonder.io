"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Volume2, Car, FootprintsIcon as Walk, Bike, AlertTriangle, X, Camera } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data
const mockRecentSearches = ["Times Square, New York", "Golden Gate Bridge, San Francisco", "Disney World, Orlando"]

export function NavigationScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  })
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null)
  const [route, setRoute] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches)
  const [directions, setDirections] = useState<string[]>([])
  const [transportMode, setTransportMode] = useState("driving")
  const [error, setError] = useState<string | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading and getting user location
    const timer = setTimeout(() => {
      setUserLocation({
        latitude: 37.7749,
        longitude: -122.4194,
      })
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    if (!search.trim()) return

    // Mock suggestions - replace with actual API call
    setSuggestions([
      { id: 1, place_name: `${search}, New York, USA`, center: [-74.006, 40.7128] },
      { id: 2, place_name: `${search}, San Francisco, USA`, center: [-122.4194, 37.7749] },
      { id: 3, place_name: `${search}, Chicago, USA`, center: [-87.6298, 41.8781] },
    ])
  }

  const handleSelectSuggestion = (place: any) => {
    setSearch(place.place_name)
    setSuggestions([])

    // Set destination
    setDestination({
      latitude: place.center[1],
      longitude: place.center[0],
    })

    // Add to recent searches if not already there
    if (!recentSearches.includes(place.place_name)) {
      setRecentSearches([place.place_name, ...recentSearches.slice(0, 4)])
    }
  }

  const handleClearRecentSearches = () => {
    setRecentSearches([])
  }

  const handleGetDirections = () => {
    if (!userLocation || !destination) {
      setError("Please select a destination")
      return
    }

    // Mock route data
    setRoute({
      distance: Math.round(Math.random() * 10) + 5,
      duration: Math.round(Math.random() * 60) + 30,
      transportMode,
    })

    // Mock directions based on transport mode
    if (transportMode === "driving") {
      setDirections([
        "Head north on Market St",
        "Turn right onto Geary St",
        "Turn left onto Powell St",
        "Continue onto Columbus Ave",
        "Turn right onto Bay St",
        "Destination will be on your right",
      ])
    } else if (transportMode === "walking") {
      setDirections([
        "Head north on Market St",
        "Turn right onto Geary St",
        "Turn left onto Grant Ave",
        "Continue straight onto Columbus Ave",
        "Turn right onto Filbert St",
        "Destination will be on your right",
      ])
    } else {
      setDirections([
        "Head north on Market St bike lane",
        "Turn right onto Geary St",
        "Turn left onto Polk St bike lane",
        "Continue onto Columbus Ave",
        "Turn right onto Bay St",
        "Destination will be on your right",
      ])
    }

    setShowDirections(true)
  }

  const speakDirections = () => {
    if (directions.length > 0 && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(directions.join(". "))
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleClearRoute = () => {
    setDestination(null)
    setRoute(null)
    setDirections([])
    setShowDirections(false)
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="p-4 border-b">
        <div className="relative mb-4">
          <Input
            placeholder="Enter destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            className="w-full"
          />
          <Button className="absolute right-0 top-0 h-full" onClick={handleSearch}>
            Search
          </Button>

          {suggestions.length > 0 && (
            <Card className="absolute w-full mt-1 z-10">
              <CardContent className="p-0">
                <ul className="py-2">
                  {suggestions.map((place) => (
                    <li
                      key={place.id}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectSuggestion(place)}
                    >
                      {place.place_name}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {recentSearches.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Recent Searches</h3>
              <Button variant="ghost" size="sm" onClick={handleClearRecentSearches}>
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((place, index) => (
                <Badge key={index} className="cursor-pointer" onClick={() => setSearch(place)}>
                  {place}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="driving" value={transportMode} onValueChange={setTransportMode} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="driving" className="flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Driving
            </TabsTrigger>
            <TabsTrigger value="walking" className="flex items-center">
              <Walk className="h-4 w-4 mr-2" />
              Walking
            </TabsTrigger>
            <TabsTrigger value="cycling" className="flex items-center">
              <Bike className="h-4 w-4 mr-2" />
              Cycling
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleGetDirections} disabled={!destination}>
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => (window.location.href = "/ar-navigation")}
            disabled={!destination}
          >
            <Camera className="h-4 w-4 mr-2" />
            AR Navigation
          </Button>
          {route && (
            <Button variant="outline" onClick={handleClearRoute}>
              <X className="h-4 w-4 mr-2" />
              Clear Route
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
            <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative flex-1 bg-muted/20" ref={mapRef}>
        {/* This would be replaced with the actual Mapbox map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Map View</p>
            <p className="text-muted-foreground">{destination ? "Route calculated" : "Please enter a destination"}</p>
          </div>
        </div>

        {/* User location marker */}
        {userLocation && (
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-sm">
            <p className="text-sm font-medium">Your Location</p>
            <p className="text-xs text-muted-foreground">
              {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </p>
          </div>
        )}

        {/* Route information */}
        {route && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-sm">
            <h3 className="text-sm font-medium mb-1">Route Information</h3>
            <p className="text-xs">Distance: {route.distance} km</p>
            <p className="text-xs">Duration: {route.duration} min</p>
            <p className="text-xs">Mode: {route.transportMode}</p>
          </div>
        )}
      </div>

      {showDirections && directions.length > 0 && (
        <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} className="border-t bg-background">
          <div className="p-4 flex items-center justify-between">
            <h3 className="font-medium flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              Directions
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={speakDirections}>
                <Volume2 className="h-4 w-4 mr-2" />
                Voice
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDirections(false)}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
          <div className="px-4 pb-4">
            <ul className="space-y-2">
              {directions.map((direction, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="bg-primary/10 text-primary font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  {direction}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}

