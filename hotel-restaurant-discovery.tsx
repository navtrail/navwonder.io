"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Phone, Globe, Clock, Utensils, Building, Search, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock data
const mockHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    description: "Luxury hotel in the heart of the city with spa and pool.",
    address: "123 Main St, New York, NY",
    phone: "+1 (555) 123-4567",
    website: "www.grandplaza.com",
    price: "$$$$",
    rating: 4.8,
    imageUrl: "/placeholder.svg?height=150&width=300",
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar"],
    isFavorite: false,
  },
  {
    id: 2,
    name: "Comfort Inn",
    description: "Affordable comfort with free breakfast and WiFi.",
    address: "456 Park Ave, New York, NY",
    phone: "+1 (555) 987-6543",
    website: "www.comfortinn.com",
    price: "$$",
    rating: 4.2,
    imageUrl: "/placeholder.svg?height=150&width=300",
    amenities: ["Free Breakfast", "WiFi", "Parking"],
    isFavorite: true,
  },
  {
    id: 3,
    name: "Seaside Resort",
    description: "Beachfront resort with stunning ocean views.",
    address: "789 Ocean Dr, Miami, FL",
    phone: "+1 (555) 456-7890",
    website: "www.seasideresort.com",
    price: "$$$",
    rating: 4.5,
    imageUrl: "/placeholder.svg?height=150&width=300",
    amenities: ["Beach Access", "Pool", "Restaurant", "Bar", "Spa"],
    isFavorite: false,
  },
]

const mockRestaurants = [
  {
    id: 1,
    name: "The Italian Place",
    description: "Authentic Italian cuisine with homemade pasta.",
    address: "123 Food St, New York, NY",
    phone: "+1 (555) 111-2222",
    website: "www.italianplace.com",
    price: "$$$",
    rating: 4.7,
    imageUrl: "/placeholder.svg?height=150&width=300",
    cuisine: "Italian",
    hours: "11:00 AM - 10:00 PM",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Sushi Express",
    description: "Fresh sushi and Japanese dishes.",
    address: "456 Sushi Ln, New York, NY",
    phone: "+1 (555) 333-4444",
    website: "www.sushiexpress.com",
    price: "$$",
    rating: 4.5,
    imageUrl: "/placeholder.svg?height=150&width=300",
    cuisine: "Japanese",
    hours: "12:00 PM - 9:30 PM",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Burger Joint",
    description: "Gourmet burgers and craft beers.",
    address: "789 Burger Ave, Chicago, IL",
    phone: "+1 (555) 555-6666",
    website: "www.burgerjoint.com",
    price: "$$",
    rating: 4.3,
    imageUrl: "/placeholder.svg?height=150&width=300",
    cuisine: "American",
    hours: "11:30 AM - 11:00 PM",
    isFavorite: false,
  },
]

const mockReviews = {
  hotels: {
    1: [
      { id: 1, user: "John D.", text: "Excellent service and beautiful rooms.", rating: 5, date: "2023-10-15" },
      { id: 2, user: "Sarah M.", text: "Great location but a bit pricey.", rating: 4, date: "2023-09-22" },
    ],
    2: [{ id: 3, user: "Mike T.", text: "Clean rooms and friendly staff.", rating: 4, date: "2023-11-05" }],
  },
  restaurants: {
    1: [
      { id: 4, user: "Lisa K.", text: "Best pasta I've ever had!", rating: 5, date: "2023-10-10" },
      { id: 5, user: "David R.", text: "Authentic Italian flavors.", rating: 4.5, date: "2023-09-18" },
    ],
    2: [{ id: 6, user: "Emma S.", text: "Fresh sushi and great service.", rating: 4.5, date: "2023-11-02" }],
  },
}

export function HotelRestaurantDiscovery() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("hotels")
  const [hotels, setHotels] = useState(mockHotels)
  const [restaurants, setRestaurants] = useState(mockRestaurants)
  const [reviews] = useState(mockReviews)
  const [searchLocation, setSearchLocation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [newReview, setNewReview] = useState({ place: "", placeType: "hotels", text: "", rating: 5 })
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    // In a real app, this would filter based on the API response
    console.log(`Searching for ${searchQuery} in ${searchLocation || "all locations"}`)
  }

  const handleToggleFavorite = (id: number, type: "hotels" | "restaurants") => {
    if (type === "hotels") {
      setHotels(hotels.map((hotel) => (hotel.id === id ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel)))
    } else {
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant.id === id ? { ...restaurant, isFavorite: !restaurant.isFavorite } : restaurant,
        ),
      )
    }
  }

  const handleSubmitReview = () => {
    if (!newReview.place || !newReview.text) {
      alert("Please fill in all required fields")
      return
    }

    // In a real app, this would send the review to an API
    console.log("Submitting review:", newReview)

    // Reset form
    setNewReview({ place: "", placeType: "hotels", text: "", rating: 5 })
    setShowReviewForm(false)
  }

  const filteredHotels = hotels.filter((hotel) =>
    searchQuery ? hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) : true,
  )

  const filteredRestaurants = restaurants.filter((restaurant) =>
    searchQuery ? restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) : true,
  )

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
        Discover Hotels & Restaurants 🍽️🏨
      </motion.h1>
      <motion.p className="text-muted-foreground mb-6" whileHover={{ scale: 1.02 }}>
        Find the best places to stay and dine in your selected location.
      </motion.p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Enter location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search hotels, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="hotels" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hotels" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center">
            <Utensils className="h-4 w-4 mr-2" />
            Restaurants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="mt-6">
          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <motion.div key={hotel.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Card className="h-full flex flex-col overflow-hidden">
                    <div className="relative">
                      <img
                        src={hotel.imageUrl || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
                        onClick={() => handleToggleFavorite(hotel.id, "hotels")}
                      >
                        <Heart className={`h-5 w-5 ${hotel.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Badge className="absolute top-2 left-2">{hotel.price}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{hotel.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{hotel.rating}</span>
                        </div>
                      </div>
                      <CardDescription>{hotel.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{hotel.address}</span>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{hotel.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <Globe className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{hotel.website}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {reviews.hotels[hotel.id as keyof typeof reviews.hotels] && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Reviews</h4>
                          <div className="space-y-2">
                            {reviews.hotels[hotel.id as keyof typeof reviews.hotels].map((review) => (
                              <div key={review.id} className="text-xs border-l-2 border-primary pl-2">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="font-medium">{review.rating}</span>
                                  <span className="mx-1">•</span>
                                  <span>{review.user}</span>
                                  <span className="ml-auto text-muted-foreground">{review.date}</span>
                                </div>
                                <p className="mt-1">{review.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setNewReview({ ...newReview, place: hotel.id.toString(), placeType: "hotels" })
                          setShowReviewForm(true)
                        }}
                      >
                        Write a Review
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hotels found matching your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="restaurants" className="mt-6">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <motion.div key={restaurant.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Card className="h-full flex flex-col overflow-hidden">
                    <div className="relative">
                      <img
                        src={restaurant.imageUrl || "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
                        onClick={() => handleToggleFavorite(restaurant.id, "restaurants")}
                      >
                        <Heart className={`h-5 w-5 ${restaurant.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Badge className="absolute top-2 left-2">{restaurant.price}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{restaurant.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                      <CardDescription>{restaurant.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{restaurant.hours}</span>
                        </div>
                        <div className="flex items-start">
                          <Utensils className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>Cuisine: {restaurant.cuisine}</span>
                        </div>
                      </div>

                      {reviews.restaurants[restaurant.id as keyof typeof reviews.restaurants] && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Reviews</h4>
                          <div className="space-y-2">
                            {reviews.restaurants[restaurant.id as keyof typeof reviews.restaurants].map((review) => (
                              <div key={review.id} className="text-xs border-l-2 border-primary pl-2">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="font-medium">{review.rating}</span>
                                  <span className="mx-1">•</span>
                                  <span>{review.user}</span>
                                  <span className="ml-auto text-muted-foreground">{review.date}</span>
                                </div>
                                <p className="mt-1">{review.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setNewReview({ ...newReview, place: restaurant.id.toString(), placeType: "restaurants" })
                          setShowReviewForm(true)
                        }}
                      >
                        Write a Review
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No restaurants found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>Share your experience with others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Write your review here..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview}>Submit Review</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

