"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, LogOut, MapPin, Calendar, Clock, Star, Route, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getAuthApiKey } from "@/lib/api-keys"

// Mock user data
const mockUserData = {
  name: "Sattu",
  email: "sattu@example.com",
  bio: "Travel enthusiast | Explorer | Photographer",
  location: "New Delhi, India",
  joinedDate: "January 2023",
  profileImage: "/placeholder.svg?height=128&width=128",
  stats: {
    trips: 12,
    reviews: 24,
    photos: 87,
    followers: 156,
    following: 98,
  },
}

// Mock recent activities
const mockActivities = [
  {
    id: 1,
    type: "trip",
    title: "Trip to Goa",
    date: "2 days ago",
    icon: <Route className="h-4 w-4" />,
  },
  {
    id: 2,
    type: "review",
    title: "Reviewed Taj Palace Hotel",
    date: "1 week ago",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: 3,
    type: "place",
    title: "Visited Jaipur",
    date: "2 weeks ago",
    icon: <MapPin className="h-4 w-4" />,
  },
]

// Mock saved places
const mockSavedPlaces = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, India",
    imageUrl: "/placeholder.svg?height=100&width=200",
    savedDate: "3 weeks ago",
  },
  {
    id: 2,
    name: "Gateway of India",
    location: "Mumbai, India",
    imageUrl: "/placeholder.svg?height=100&width=200",
    savedDate: "1 month ago",
  },
  {
    id: 3,
    name: "Hawa Mahal",
    location: "Jaipur, India",
    imageUrl: "/placeholder.svg?height=100&width=200",
    savedDate: "2 months ago",
  },
]

// Mock upcoming trips
const mockUpcomingTrips = [
  {
    id: 1,
    destination: "Kerala Backwaters",
    startDate: "Dec 15, 2023",
    endDate: "Dec 22, 2023",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    destination: "Darjeeling",
    startDate: "Jan 10, 2024",
    endDate: "Jan 15, 2024",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
]

export function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(mockUserData)
  const [activities, setActivities] = useState(mockActivities)
  const [savedPlaces, setSavedPlaces] = useState(mockSavedPlaces)
  const [upcomingTrips, setUpcomingTrips] = useState(mockUpcomingTrips)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  useEffect(() => {
    // Check if API key exists
    const apiKey = getAuthApiKey()
    if (!apiKey) {
      setApiKeyMissing(true)
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    // In a real app, this would call an API to log the user out
    setIsLoggedIn(false)
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Not Logged In</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your profile</p>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (apiKeyMissing) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <h2 className="text-xl font-semibold mb-2">Authentication API Key Missing</h2>
              <p className="text-muted-foreground mb-6">
                The authentication API key is missing. Add NEXT_PUBLIC_AUTH_API_KEY to your .env.local file to enable
                authentication.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                For now, you're viewing a demo profile with mock data.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => (window.location.href = "/api-status")}>
                  Check API Status
                </Button>
                <Button onClick={() => setApiKeyMissing(false)}>View Demo Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userData.profileImage} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-muted-foreground mb-2">{userData.bio}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userData.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {userData.joinedDate}
                </div>

                <div className="grid grid-cols-3 gap-4 w-full mb-6">
                  <div className="text-center">
                    <p className="text-xl font-bold">{userData.stats.trips}</p>
                    <p className="text-xs text-muted-foreground">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{userData.stats.reviews}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{userData.stats.photos}</p>
                    <p className="text-xs text-muted-foreground">Photos</p>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/profile-settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="activity">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="saved">Saved Places</TabsTrigger>
              <TabsTrigger value="trips">Upcoming Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-4">{activity.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-6">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Places</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedPlaces.map((place) => (
                        <div key={place.id} className="flex items-start">
                          <img
                            src={place.imageUrl || "/placeholder.svg"}
                            alt={place.name}
                            className="w-16 h-16 object-cover rounded-md mr-3"
                          />
                          <div>
                            <p className="font-medium">{place.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {place.location}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              Saved {place.savedDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-6">No saved places</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trips" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTrips.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTrips.map((trip) => (
                        <div key={trip.id} className="flex items-start">
                          <img
                            src={trip.imageUrl || "/placeholder.svg"}
                            alt={trip.destination}
                            className="w-20 h-16 object-cover rounded-md mr-3"
                          />
                          <div>
                            <p className="font-medium">{trip.destination}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {trip.startDate} - {trip.endDate}
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">Upcoming</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-6">No upcoming trips</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  )
}

