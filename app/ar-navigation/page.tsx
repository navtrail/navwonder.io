"use client"

import { useState } from "react"
import { ARNavigation } from "@/components/ar-navigation"
import { CesiumMap } from "@/components/cesium-map"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, MapIcon as Map3D } from "lucide-react"

export default function ARNavigationPage() {
  const [activeView, setActiveView] = useState<"map" | "ar">("map")
  const [destination, setDestination] = useState<string | null>(null)

  const handleSwitchToAR = () => {
    setActiveView("ar")
  }

  const handleSwitchToMap = () => {
    setActiveView("map")
  }

  return (
    <div className="container py-4">
      <h1 className="text-3xl font-bold mb-2">AR Navigation & 360° Maps</h1>
      <p className="text-muted-foreground mb-6">
        Explore your surroundings with augmented reality navigation and interactive 3D maps
      </p>

      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "map" | "ar")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center">
            <Map3D className="h-4 w-4 mr-2" />
            360° Map
          </TabsTrigger>
          <TabsTrigger value="ar" className="flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            AR Navigation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4">
          <CesiumMap onSwitchToAR={handleSwitchToAR} />
        </TabsContent>

        <TabsContent value="ar" className="mt-4">
          <ARNavigation destination={destination || "Selected Destination"} onSwitchToMap={handleSwitchToMap} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

