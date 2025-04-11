"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Hotel, Utensils, Compass, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data
const mockRecentSearches = ["Delhi, India", "Mumbai, India", "Jaipur, Rajasthan", "Goa, India", "Bengaluru, India"]

const mockPopularPlaces = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, India",
    type: "attraction",
    rating: 4.9,
    imageUrl: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 2,
    name: "Gateway of India",
    location: "Mumbai, India",
    type: "attraction",
    rating: 4.7,
    imageUrl: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 3,
    name: "Taj Palace Hotel",
    location: "New Delhi, India",
    type: "hotel",
    rating: 4.8,
    imageUrl: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 4,
    name: "Bukhara Restaurant",
    location: "New Delhi, India",
    type: "restaurant",
    rating: 4.9,
    imageUrl: "/placeholder.svg?height=150&width=300",
  },
]

export function SearchScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches)
  const [activeTab, setActiveTab] = useState("all")
  const [popularPlaces, setPopularPlaces] = useState(mockPopularPlaces)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Mock search results - in a real app, this would be an API call
    const results = [
      {
        id: 101,
        name: `${searchQuery} Park`,
        location: "New York, USA",
        type: "attraction",
        rating: 4.3,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: 102,
        name: `${searchQuery} Hotel`,
        location: "Paris, France",
        type: "hotel",
        rating: 4.1,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: 103,
        name: `${searchQuery} Restaurant`,
        location: "Tokyo, Japan",
        type: "restaurant",
        rating: 4.6,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
    ]

    setSearchResults(results)

    // Add to recent searches if not already there
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)])
    }
  }

  const handleClearRecentSearches = () => {
    setRecentSearches([])
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "hotel":
        return <Hotel className="h-4 w-4" />
      case "restaurant":
        return <Utensils className="h-4 w-4" />
      case "attraction":
        return <Compass className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const filteredResults = activeTab === "all" ? searchResults : searchResults.filter((item) => item.type === activeTab)

  const filteredPopular = activeTab === "all" ? popularPlaces : popularPlaces.filter((item) => item.type === activeTab)

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
        Search 🔍
      </motion.h1>
      <motion.p className="text-muted-foreground mb-6" whileHover={{ scale: 1.02 }}>
        Find places, hotels, restaurants, and attractions.
      </motion.p>

      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search for places, hotels, restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Recent Searches</h3>
            <Button variant="ghost" size="sm" onClick={handleClearRecentSearches}>
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  setSearchQuery(search)
                  handleSearch()
                }}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="attraction">Attractions</TabsTrigger>
          <TabsTrigger value="hotel">Hotels</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurants</TabsTrigger>
        </TabsList>
      </Tabs>

      {searchResults.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={result.imageUrl || "/placeholder.svg"}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{result.rating} ★</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {result.location}
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      {getIconForType(result.type)}
                      <span className="ml-1 capitalize">{result.type}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Popular Places</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPopular.map((place) => (
              <Card key={place.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={place.imageUrl || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{place.rating} ★</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{place.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {place.location}
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      {getIconForType(place.type)}
                      <span className="ml-1 capitalize">{place.type}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4">Trending Searches</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>Best time to visit Kerala</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center">
              <Hotel className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>Budget hotels in Goa</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>Top restaurants in Mumbai</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

