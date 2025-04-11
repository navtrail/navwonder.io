"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const mockPackages = [
  {
    id: 1,
    name: "Rajasthan Heritage Tour",
    description: "Experience the royal heritage of Rajasthan with this 7-day luxury package.",
    price: 75000,
    imageUrl: "/placeholder.svg?height=200&width=400",
    type: "luxury",
    rating: 4.8,
    date: "2023-12-15",
  },
  {
    id: 2,
    name: "Kerala Backwaters Adventure",
    description: "Immerse yourself in the serene backwaters of Kerala with this 10-day package.",
    price: 65000,
    imageUrl: "/placeholder.svg?height=200&width=400",
    type: "adventure",
    rating: 4.9,
    date: "2023-11-20",
  },
  {
    id: 3,
    name: "Golden Triangle Weekend",
    description: "A quick 3-day getaway to explore Delhi, Agra, and Jaipur.",
    price: 25000,
    imageUrl: "/placeholder.svg?height=200&width=400",
    type: "budget",
    rating: 4.5,
    date: "2023-12-01",
  },
  {
    id: 4,
    name: "Himalayan Retreat",
    description: "Relax and rejuvenate with this 14-day wellness package in the Himalayas.",
    price: 120000,
    imageUrl: "/placeholder.svg?height=200&width=400",
    type: "luxury",
    rating: 4.7,
    date: "2024-01-10",
  },
  {
    id: 5,
    name: "Andaman Island Adventure",
    description: "Explore the pristine beaches and coral reefs of Andaman with this 5-day expedition.",
    price: 55000,
    imageUrl: "/placeholder.svg?height=200&width=400",
    type: "adventure",
    rating: 4.6,
    date: "2023-12-20",
  },
  {
    id: 6,
    name: "Varanasi Spiritual Journey",
    description: "Discover the spiritual heart of India with this 4-day cultural tour.",
    price: 30000,
    imageUrl: "/placeholder.svg?height=200&width=400",
    type: "budget",
    rating: 4.4,
    date: "2023-11-15",
  },
]

const mockPriceComparisons = {
  1: ["MakeMyTrip: ₹78,000", "Booking.com: ₹75,000", "TripAdvisor: ₹76,500"],
  2: ["MakeMyTrip: ₹67,500", "Booking.com: ₹65,000", "TripAdvisor: ₹66,200"],
  3: ["MakeMyTrip: ₹26,000", "Booking.com: ₹25,000", "TripAdvisor: ₹25,500"],
  4: ["MakeMyTrip: ₹125,000", "Booking.com: ₹120,000", "TripAdvisor: ₹122,500"],
  5: ["MakeMyTrip: ₹57,000", "Booking.com: ₹55,000", "TripAdvisor: ₹56,000"],
  6: ["MakeMyTrip: ₹31,500", "Booking.com: ₹30,000", "TripAdvisor: ₹30,800"],
}

const mockReviews = {
  1: [
    { id: 1, user: "John D.", text: "Amazing experience! The Eiffel Tower view was breathtaking.", rating: 5 },
    { id: 2, user: "Sarah M.", text: "Great tour guides and accommodations.", rating: 4.5 },
  ],
  2: [
    { id: 3, user: "Mike T.", text: "Incredible cultural immersion. Loved every minute!", rating: 5 },
    { id: 4, user: "Lisa K.", text: "Well organized trip with excellent food options.", rating: 4.8 },
  ],
  3: [
    { id: 5, user: "David R.", text: "Perfect weekend getaway. Packed with activities.", rating: 4.5 },
    { id: 6, user: "Emma S.", text: "Great value for money in an expensive city.", rating: 4.5 },
  ],
  4: [
    { id: 7, user: "Robert J.", text: "The most relaxing vacation I've ever had.", rating: 5 },
    { id: 8, user: "Jennifer P.", text: "Beautiful resort and amazing spa treatments.", rating: 4.5 },
  ],
}

export function TravelPackages() {
  const [isLoading, setIsLoading] = useState(true)
  const [packages, setPackages] = useState(mockPackages)
  const [filter, setFilter] = useState("all")
  const [sortOption, setSortOption] = useState("highest-rated")
  const [priceComparisons] = useState(mockPriceComparisons)
  const [reviews] = useState(mockReviews)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredPackages = filter === "all" ? packages : packages.filter((pkg) => pkg.type === filter)

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortOption === "highest-rated") {
      return b.rating - a.rating
    } else if (sortOption === "most-recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortOption === "price-lowest") {
      return a.price - b.price
    } else if (sortOption === "price-highest") {
      return b.price - a.price
    }
    return 0
  })

  const handleBookNow = (id: number) => {
    alert(`Booking package ${id}. This would redirect to a booking page in a real application.`)
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
      <motion.h1 className="text-3xl font-bold mb-2" whileHover={{ scale: 1.02 }}>
        Explore Travel Packages ✈️
      </motion.h1>
      <motion.p className="text-muted-foreground mb-6" whileHover={{ scale: 1.02 }}>
        Find the best deals for your next adventure.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort By:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Highest Rated" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
              <SelectItem value="most-recent">Most Recent</SelectItem>
              <SelectItem value="price-lowest">Price: Low to High</SelectItem>
              <SelectItem value="price-highest">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPackages.length > 0 ? (
          sortedPackages.map((pkg) => (
            <motion.div key={pkg.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative">
                  <img src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-2 right-2">
                    {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pb-2">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Available from {pkg.date}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-lg font-bold">₹{pkg.price.toLocaleString("en-IN")}</span>
                  </div>

                  <Tabs defaultValue="prices" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="prices">Price Comparison</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="prices" className="text-xs space-y-1 mt-2">
                      {priceComparisons[pkg.id as keyof typeof priceComparisons] ? (
                        <ul>
                          {priceComparisons[pkg.id as keyof typeof priceComparisons].map((price, i) => (
                            <li key={i}>{price}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No price comparisons available</p>
                      )}
                    </TabsContent>
                    <TabsContent value="reviews" className="text-xs space-y-2 mt-2">
                      {reviews[pkg.id as keyof typeof reviews] ? (
                        <ul>
                          {reviews[pkg.id as keyof typeof reviews].map((review) => (
                            <li key={review.id} className="border-b pb-1">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1">{review.rating}</span>
                                <span className="ml-2 font-medium">{review.user}</span>
                              </div>
                              <p>{review.text}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No reviews available</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookNow(pkg.id)}>
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No travel packages available.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

