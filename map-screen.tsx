"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleMapComponent } from "@/components/google-map"
import { DirectionsMap } from "@/components/directions-map"

export function MapScreen() {
  const [activeTab, setActiveTab] = useState("map")

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Interactive Map</h1>
      <p className="text-muted-foreground mb-6">Explore locations and get directions across India</p>

      <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="directions">Directions</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4">
          <GoogleMapComponent />
        </TabsContent>

        <TabsContent value="directions" className="mt-4">
          <DirectionsMap />
        </TabsContent>
      </Tabs>
    </div>
  )
}

