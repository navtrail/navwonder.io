"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Route,
  Clock,
  Calendar,
  Car,
  FootprintsIcon as Walk,
  Bike,
  Share2,
  Star,
  Plus,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const mockRoutes = [
  {
    id: 1,
    name: "Morning Commute",
    start: "123 Home St, New York, NY",
    end: "456 Office Ave, New York, NY",
    distance: 5.2,
    duration: 25,
    transportMode: "driving",
    favorite: true,
    lastUsed: "2023-11-15",
  },
  {
    id: 2,
    name: "Weekend Hike",
    start: "Central Park, New York, NY",
    end: "Hudson River Greenway, New York, NY",
    distance: 8.7,
    duration: 110,
    transportMode: "walking",
    favorite: false,
    lastUsed: "2023-11-12",
  },
  {
    id: 3,
    name: "Grocery Run",
    start: "123 Home St, New York, NY",
    end: "Whole Foods Market, New York, NY",
    distance: 1.8,
    duration: 8,
    transportMode: "driving",
    favorite: true,
    lastUsed: "2023-11-14",
  },
  {
    id: 4,
    name: "Bike to Park",
    start: "123 Home St, New York, NY",
    end: "Central Park, New York, NY",
    distance: 3.5,
    duration: 20,
    transportMode: "cycling",
    favorite: false,
    lastUsed: "2023-11-10",
  },
]

export function RoutesScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [routes, setRoutes] = useState(mockRoutes)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewRouteDialog, setShowNewRouteDialog] = useState(false)
  const [newRoute, setNewRoute] = useState({
    name: "",
    start: "",
    end: "",
    transportMode: "driving",
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    // Filter routes based on search query
    // This is a client-side search for the mock data
    if (!searchQuery.trim()) {
      setRoutes(mockRoutes)
      return
    }

    const filtered = mockRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.start.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.end.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setRoutes(filtered)
  }

  const handleToggleFavorite = (id: number) => {
    setRoutes(routes.map((route) => (route.id === id ? { ...route, favorite: !route.favorite } : route)))
  }

  const handleDeleteRoute = (id: number) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      setRoutes(routes.filter((route) => route.id !== id))
    }
  }

  const handleCreateRoute = () => {
    if (!newRoute.name || !newRoute.start || !newRoute.end) {
      alert("Please fill in all required fields")
      return
    }

    const newRouteData = {
      id: Date.now(),
      name: newRoute.name,
      start: newRoute.start,
      end: newRoute.end,
      distance: Math.round((Math.random() * 10 + 1) * 10) / 10,
      duration: Math.round(Math.random() * 60 + 10),
      transportMode: newRoute.transportMode,
      favorite: false,
      lastUsed: new Date().toISOString().split("T")[0],
    }

    setRoutes([newRouteData, ...routes])
    setNewRoute({
      name: "",
      start: "",
      end: "",
      transportMode: "driving",
    })
    setShowNewRouteDialog(false)
  }

  const getFilteredRoutes = () => {
    if (activeTab === "all") return routes
    if (activeTab === "favorites") return routes.filter((route) => route.favorite)
    if (activeTab === "recent")
      return [...routes].sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())

    return routes.filter((route) => route.transportMode === activeTab)
  }

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case "driving":
        return <Car className="h-5 w-5" />
      case "walking":
        return <Walk className="h-5 w-5" />
      case "cycling":
        return <Bike className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

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
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">My Routes</h1>
          <p className="text-muted-foreground">Manage and access your saved routes.</p>
        </div>
        <Dialog open={showNewRouteDialog} onOpenChange={setShowNewRouteDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Route</DialogTitle>
              <DialogDescription>Create a new route to save and access later.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Start
                </Label>
                <Input
                  id="start"
                  value={newRoute.start}
                  onChange={(e) => setNewRoute({ ...newRoute, start: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">
                  End
                </Label>
                <Input
                  id="end"
                  value={newRoute.end}
                  onChange={(e) => setNewRoute({ ...newRoute, end: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mode" className="text-right">
                  Mode
                </Label>
                <Select onValueChange={(value) => setNewRoute({ ...newRoute, transportMode: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driving">Driving</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateRoute}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="all" className="w-full mt-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="driving">Driving</TabsTrigger>
            <TabsTrigger value="walking">Walking</TabsTrigger>
            <TabsTrigger value="cycling">Cycling</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid gap-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 rounded-l-none h-full"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
              {getFilteredRoutes().length === 0 ? (
                <div className="text-center py-4">No routes found.</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredRoutes().map((route) => (
                    <Card key={route.id} className="bg-card text-card-foreground">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{route.name}</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(route.id)}>
                            <Star
                              className={`h-4 w-4 ${route.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                        <CardDescription>
                          <Badge variant="secondary">{route.transportMode}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {route.start}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Route className="h-4 w-4" />
                          {route.end}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          {route.duration} minutes
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          Last used: {route.lastUsed}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {getTransportIcon(route.transportMode)}
                          {route.distance} km
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            {getFilteredRoutes().length === 0 ? (
              <div className="text-center py-4">No favorite routes found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredRoutes().map((route) => (
                  <Card key={route.id} className="bg-card text-card-foreground">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{route.name}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(route.id)}>
                          <Star
                            className={`h-4 w-4 ${route.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <CardDescription>
                        <Badge variant="secondary">{route.transportMode}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {route.start}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Route className="h-4 w-4" />
                        {route.end}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {route.duration} minutes
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Last used: {route.lastUsed}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getTransportIcon(route.transportMode)}
                        {route.distance} km
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent">
            {getFilteredRoutes().length === 0 ? (
              <div className="text-center py-4">No recent routes found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredRoutes().map((route) => (
                  <Card key={route.id} className="bg-card text-card-foreground">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{route.name}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(route.id)}>
                          <Star
                            className={`h-4 w-4 ${route.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <CardDescription>
                        <Badge variant="secondary">{route.transportMode}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {route.start}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Route className="h-4 w-4" />
                        {route.end}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {route.duration} minutes
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Last used: {route.lastUsed}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getTransportIcon(route.transportMode)}
                        {route.distance} km
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="driving">
            {getFilteredRoutes().length === 0 ? (
              <div className="text-center py-4">No driving routes found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredRoutes().map((route) => (
                  <Card key={route.id} className="bg-card text-card-foreground">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{route.name}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(route.id)}>
                          <Star
                            className={`h-4 w-4 ${route.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <CardDescription>
                        <Badge variant="secondary">{route.transportMode}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {route.start}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Route className="h-4 w-4" />
                        {route.end}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {route.duration} minutes
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Last used: {route.lastUsed}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getTransportIcon(route.transportMode)}
                        {route.distance} km
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="walking">
            {getFilteredRoutes().length === 0 ? (
              <div className="text-center py-4">No walking routes found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredRoutes().map((route) => (
                  <Card key={route.id} className="bg-card text-card-foreground">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{route.name}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(route.id)}>
                          <Star
                            className={`h-4 w-4 ${route.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <CardDescription>
                        <Badge variant="secondary">{route.transportMode}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {route.start}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Route className="h-4 w-4" />
                        {route.end}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {route.duration} minutes
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Last used: {route.lastUsed}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getTransportIcon(route.transportMode)}
                        {route.distance} km
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="cycling">
            {getFilteredRoutes().length === 0 ? (
              <div className="text-center py-4">No cycling routes found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredRoutes().map((route) => (
                  <Card key={route.id} className="bg-card text-card-foreground">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{route.name}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(route.id)}>
                          <Star
                            className={`h-4 w-4 ${route.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <CardDescription>
                        <Badge variant="secondary">{route.transportMode}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {route.start}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Route className="h-4 w-4" />
                        {route.end}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {route.duration} minutes
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Last used: {route.lastUsed}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getTransportIcon(route.transportMode)}
                        {route.distance} km
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  }

