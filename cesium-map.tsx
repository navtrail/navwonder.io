"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Camera, Search, Navigation, Map } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Import Cesium components
// Note: These imports will be handled by Next.js in the v0 environment
// In a real app, you would need to install and import from cesium directly
declare global {
  interface Window {
    Cesium: any
  }
}

interface CesiumMapProps {
  onSwitchToAR?: () => void
  className?: string
}

export function CesiumMap({ onSwitchToAR, className }: CesiumMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [destination, setDestination] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if Cesium Ion token is available
    const cesiumIonToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN
    if (!cesiumIonToken) {
      setApiKeyMissing(true)
      setError("Cesium Ion token is missing. Please add NEXT_PUBLIC_CESIUM_ION_TOKEN to your .env.local file.")
      setIsLoading(false)
      return
    }

    // Load Cesium script dynamically
    const loadCesium = async () => {
      try {
        // In a real app, you would import Cesium directly
        // For this demo, we'll load it from a CDN
        if (!window.Cesium) {
          const script = document.createElement("script")
          script.src = "https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Cesium.js"
          script.async = true

          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Widgets/widgets.css"

          document.head.appendChild(link)

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        // Initialize Cesium
        window.Cesium.Ion.defaultAccessToken = cesiumIonToken

        // Create Cesium viewer
        if (cesiumContainerRef.current && !viewerRef.current) {
          const viewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
            terrainProvider: window.Cesium.createWorldTerrain(),
            timeline: false,
            animation: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,
          })

          // Enable terrain and 3D buildings
          viewer.scene.primitives.add(window.Cesium.createOsmBuildings())

          // Set default view to India
          viewer.camera.flyTo({
            destination: window.Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 8000000),
            orientation: {
              heading: window.Cesium.Math.toRadians(0),
              pitch: window.Cesium.Math.toRadians(-90),
              roll: 0.0,
            },
          })

          viewerRef.current = viewer
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing Cesium:", err)
        setError("Failed to initialize 3D map. Please try again later.")
        setIsLoading(false)
      }
    }

    loadCesium()

    // Cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [toast])

  const handleSearch = async () => {
    if (!searchQuery || !viewerRef.current) return

    try {
      // In a real app, you would use a geocoding service
      // For this demo, we'll use a mock location for Delhi
      const position = window.Cesium.Cartesian3.fromDegrees(77.209, 28.6139, 500)

      // Add a pin at the location
      viewerRef.current.entities.add({
        position,
        billboard: {
          image: window.Cesium.buildModuleUrl("Assets/Textures/pin.png"),
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: searchQuery,
          font: "14pt sans-serif",
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: window.Cesium.VerticalOrigin.TOP,
          pixelOffset: new window.Cesium.Cartesian2(0, -30),
        },
      })

      // Fly to the location
      viewerRef.current.camera.flyTo({
        destination: position,
        orientation: {
          heading: window.Cesium.Math.toRadians(0),
          pitch: window.Cesium.Math.toRadians(-45),
          roll: 0.0,
        },
      })

      setDestination(searchQuery)
      toast({
        title: "Location found",
        description: `Navigating to ${searchQuery}`,
      })
    } catch (err) {
      console.error("Search error:", err)
      toast({
        title: "Search failed",
        description: "Could not find the specified location",
        variant: "destructive",
      })
    }
  }

  const handleStartNavigation = () => {
    if (!destination) return

    if (onSwitchToAR) {
      onSwitchToAR()
    } else {
      toast({
        title: "AR Navigation",
        description: "AR navigation is not available in this view",
      })
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-[calc(100vh-3.5rem)] ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (apiKeyMissing || error) {
    return (
      <div className={`container py-8 ${className}`}>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Cesium Ion Token Missing</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {error || "Please add NEXT_PUBLIC_CESIUM_ION_TOKEN to your .env.local file to enable 3D maps."}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                You can get a free token by signing up at{" "}
                <a href="https://cesium.com/ion/signup" target="_blank" rel="noopener noreferrer" className="underline">
                  cesium.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted p-8 rounded-md flex flex-col items-center justify-center">
          <Map className="h-16 w-16 mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">3D Map Unavailable</h2>
          <p className="text-muted-foreground text-center mb-4">
            The 3D interactive map requires a Cesium Ion token to function properly.
          </p>
          <Button onClick={() => (window.location.href = "/api-status")}>Check API Status</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-[calc(100vh-3.5rem)] ${className}`}>
      {/* Cesium container */}
      <div ref={cesiumContainerRef} className="absolute inset-0 w-full h-full" />

      {/* UI controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search-location" className="sr-only">
                  Search Location
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="search-location"
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => viewerRef.current?.camera.flyHome()}>
                  <Map className="h-4 w-4 mr-2" />
                  Reset View
                </Button>

                {destination && (
                  <Button onClick={handleStartNavigation}>
                    <Camera className="h-4 w-4 mr-2" />
                    AR Navigation
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation info */}
      {destination && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Destination: {destination}</h3>
                  <p className="text-sm text-muted-foreground">Ready for navigation</p>
                </div>
                <Button onClick={handleStartNavigation}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

