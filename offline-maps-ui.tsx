"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, Pause, Play, Trash2, Map, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data
const mockOfflineMaps = [
  {
    id: 1,
    name: "New York City",
    description: "Complete city map with subway stations",
    size: "245 MB",
    previewUrl: "/placeholder.svg?height=150&width=300",
    isDownloaded: true,
    lastUpdated: "2023-10-15",
  },
  {
    id: 2,
    name: "Paris",
    description: "City center with tourist attractions",
    size: "180 MB",
    previewUrl: "/placeholder.svg?height=150&width=300",
    isDownloaded: false,
    lastUpdated: null,
  },
  {
    id: 3,
    name: "Tokyo",
    description: "Full city map with train stations",
    size: "320 MB",
    previewUrl: "/placeholder.svg?height=150&width=300",
    isDownloaded: false,
    lastUpdated: null,
  },
  {
    id: 4,
    name: "London",
    description: "City map with Underground stations",
    size: "210 MB",
    previewUrl: "/placeholder.svg?height=150&width=300",
    isDownloaded: true,
    lastUpdated: "2023-11-05",
  },
  {
    id: 5,
    name: "Rome",
    description: "Historic center with monuments",
    size: "150 MB",
    previewUrl: "/placeholder.svg?height=150&width=300",
    isDownloaded: false,
    lastUpdated: null,
  },
]

export function OfflineMapsUI() {
  const [isLoading, setIsLoading] = useState(true)
  const [offlineMaps, setOfflineMaps] = useState(mockOfflineMaps)
  const [downloading, setDownloading] = useState<number | null>(null)
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [paused, setPaused] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "downloaded" | "available">("all")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleDownload = (mapId: number) => {
    setDownloading(mapId)
    setProgress((prev) => ({ ...prev, [mapId]: 0 }))
    setPaused((prev) => ({ ...prev, [mapId]: false }))

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const currentProgress = prev[mapId] || 0

        if (paused[mapId]) {
          return prev
        }

        if (currentProgress >= 100) {
          clearInterval(interval)
          setDownloading(null)

          // Update map status to downloaded
          setOfflineMaps((maps) =>
            maps.map((map) =>
              map.id === mapId
                ? { ...map, isDownloaded: true, lastUpdated: new Date().toISOString().split("T")[0] }
                : map,
            ),
          )

          return prev
        }

        return { ...prev, [mapId]: currentProgress + 5 }
      })
    }, 300)

    return () => clearInterval(interval)
  }

  const handlePauseResume = (mapId: number) => {
    setPaused((prev) => ({ ...prev, [mapId]: !prev[mapId] }))
  }

  const handleDelete = (mapId: number) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this offline map?")) {
      setOfflineMaps((maps) =>
        maps.map((map) => (map.id === mapId ? { ...map, isDownloaded: false, lastUpdated: null } : map)),
      )
    }
  }

  const filteredMaps = offlineMaps.filter((map) => {
    if (filter === "all") return true
    if (filter === "downloaded") return map.isDownloaded
    if (filter === "available") return !map.isDownloaded
    return true
  })

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 className="text-3xl font-bold mb-2" whileHover={{ scale: 1.02 }}>
        Offline Maps 📍
      </motion.h1>
      <motion.p className="text-muted-foreground mb-6" whileHover={{ scale: 1.02 }}>
        Download and manage maps for offline use.
      </motion.p>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All Maps
        </Button>
        <Button variant={filter === "downloaded" ? "default" : "outline"} onClick={() => setFilter("downloaded")}>
          Downloaded
        </Button>
        <Button variant={filter === "available" ? "default" : "outline"} onClick={() => setFilter("available")}>
          Available
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaps.length > 0 ? (
          filteredMaps.map((map) => (
            <motion.div key={map.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative">
                  <img src={map.previewUrl || "/placeholder.svg"} alt={map.name} className="w-full h-32 object-cover" />
                  <Badge className="absolute top-2 right-2">{map.isDownloaded ? "Downloaded" : "Available"}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    {map.name}
                    {map.isDownloaded && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                  </CardTitle>
                  <CardDescription>{map.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Size: {map.size}</span>
                    {map.lastUpdated && (
                      <span className="text-xs text-muted-foreground">Updated: {map.lastUpdated}</span>
                    )}
                  </div>

                  {downloading === map.id && (
                    <div className="space-y-2">
                      <Progress value={progress[map.id] || 0} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span>{progress[map.id] || 0}% complete</span>
                        <span>{paused[map.id] ? "Paused" : "Downloading..."}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {map.isDownloaded ? (
                    <Button variant="destructive" className="w-full" onClick={() => handleDelete(map.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  ) : downloading === map.id ? (
                    <div className="flex w-full gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handlePauseResume(map.id)}>
                        {paused[map.id] ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        )}
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => setDownloading(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleDownload(map.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No maps found matching your filter.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

