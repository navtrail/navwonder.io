"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, MapPin, Sun, Cloud, CloudRain, Wind, Trash2, Edit, Save, X } from "lucide-react"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock data
const mockTripPlans = [
  {
    id: 1,
    destination: "Paris, France",
    startDate: "2023-12-15",
    endDate: "2023-12-22",
    activities: [
      { id: 1, name: "Visit Eiffel Tower", date: "2023-12-16", time: "10:00 AM", notes: "Buy tickets in advance" },
      { id: 2, name: "Louvre Museum", date: "2023-12-17", time: "09:00 AM", notes: "Plan at least 3 hours" },
      { id: 3, name: "Seine River Cruise", date: "2023-12-18", time: "07:00 PM", notes: "Sunset cruise recommended" },
    ],
    notes: "Remember to bring comfortable walking shoes and a travel adapter.",
  },
  {
    id: 2,
    destination: "Tokyo, Japan",
    startDate: "2024-03-10",
    endDate: "2024-03-20",
    activities: [
      { id: 4, name: "Tokyo Skytree", date: "2024-03-11", time: "02:00 PM", notes: "Go on a clear day" },
      {
        id: 5,
        name: "Tsukiji Fish Market",
        date: "2024-03-12",
        time: "07:00 AM",
        notes: "Go early for the best experience",
      },
    ],
    notes: "Learn basic Japanese phrases before the trip.",
  },
]

const mockWeather = {
  "Paris, France": {
    temp: 12,
    condition: "Partly Cloudy",
    icon: <Cloud className="h-8 w-8" />,
    forecast: [
      { day: "Mon", temp: 12, icon: <Cloud className="h-5 w-5" /> },
      { day: "Tue", temp: 14, icon: <Sun className="h-5 w-5" /> },
      { day: "Wed", temp: 13, icon: <Cloud className="h-5 w-5" /> },
      { day: "Thu", temp: 11, icon: <CloudRain className="h-5 w-5" /> },
      { day: "Fri", temp: 10, icon: <Wind className="h-5 w-5" /> },
    ],
  },
  "Tokyo, Japan": {
    temp: 18,
    condition: "Sunny",
    icon: <Sun className="h-8 w-8" />,
    forecast: [
      { day: "Mon", temp: 18, icon: <Sun className="h-5 w-5" /> },
      { day: "Tue", temp: 19, icon: <Sun className="h-5 w-5" /> },
      { day: "Wed", temp: 17, icon: <Cloud className="h-5 w-5" /> },
      { day: "Thu", temp: 16, icon: <Cloud className="h-5 w-5" /> },
      { day: "Fri", temp: 15, icon: <CloudRain className="h-5 w-5" /> },
    ],
  },
}

const mockEvents = {
  "Paris, France": [
    { id: 1, name: "Jazz Festival", date: "2023-12-18", location: "Parc de la Villette" },
    { id: 2, name: "Christmas Market", date: "2023-12-15 - 2023-12-24", location: "Champs-Élysées" },
  ],
  "Tokyo, Japan": [
    { id: 3, name: "Cherry Blossom Festival", date: "2024-03-15 - 2024-03-25", location: "Ueno Park" },
    { id: 4, name: "Anime Expo", date: "2024-03-12", location: "Tokyo Big Sight" },
  ],
}

export function TripPlanningScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [tripPlans, setTripPlans] = useState(mockTripPlans)
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null)
  const [newTrip, setNewTrip] = useState({
    destination: "",
    startDate: "",
    endDate: "",
  })
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [showNewTripForm, setShowNewTripForm] = useState(false)
  const [weather, setWeather] = useState(mockWeather)
  const [events, setEvents] = useState(mockEvents)
  const [newActivity, setNewActivity] = useState({
    name: "",
    date: "",
    time: "",
    notes: "",
  })
  const [showNewActivityForm, setShowNewActivityForm] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [tripNotes, setTripNotes] = useState("")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleCreateTrip = () => {
    if (!newTrip.destination || !startDate || !endDate) {
      alert("Please fill in all required fields")
      return
    }

    const newTripData = {
      id: Date.now(),
      destination: newTrip.destination,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      activities: [],
      notes: "",
    }

    setTripPlans([...tripPlans, newTripData])
    setNewTrip({ destination: "", startDate: "", endDate: "" })
    setStartDate(undefined)
    setEndDate(undefined)
    setShowNewTripForm(false)
    setSelectedTrip(newTripData.id)
  }

  const handleDeleteTrip = (id: number) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      setTripPlans(tripPlans.filter((trip) => trip.id !== id))
      if (selectedTrip === id) {
        setSelectedTrip(null)
      }
    }
  }

  const handleAddActivity = () => {
    if (!selectedTrip || !newActivity.name || !newActivity.date) {
      alert("Please fill in all required fields")
      return
    }

    const updatedTrips = tripPlans.map((trip) => {
      if (trip.id === selectedTrip) {
        return {
          ...trip,
          activities: [
            ...trip.activities,
            {
              id: Date.now(),
              ...newActivity,
            },
          ],
        }
      }
      return trip
    })

    setTripPlans(updatedTrips)
    setNewActivity({ name: "", date: "", time: "", notes: "" })
    setShowNewActivityForm(false)
  }

  const handleDeleteActivity = (tripId: number, activityId: number) => {
    const updatedTrips = tripPlans.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          activities: trip.activities.filter((activity) => activity.id !== activityId),
        }
      }
      return trip
    })

    setTripPlans(updatedTrips)
  }

  const handleSaveNotes = () => {
    if (!selectedTrip) return

    const updatedTrips = tripPlans.map((trip) => {
      if (trip.id === selectedTrip) {
        return {
          ...trip,
          notes: tripNotes,
        }
      }
      return trip
    })

    setTripPlans(updatedTrips)
    setEditingNotes(false)
  }

  const selectedTripData = tripPlans.find((trip) => trip.id === selectedTrip)

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
        Plan Your Trip ✈️
      </motion.h1>
      <motion.p className="text-muted-foreground mb-6" whileHover={{ scale: 1.02 }}>
        Create and manage your travel itineraries.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                My Trips
                <Button size="sm" onClick={() => setShowNewTripForm(!showNewTripForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Trip
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showNewTripForm && (
                <motion.div
                  className="mb-4 p-4 border rounded-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-sm font-medium mb-2">New Trip</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Paris, France"
                        value={newTrip.destination}
                        onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              disabled={(date) => (startDate ? date < startDate : false)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewTripForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTrip}>Create Trip</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {tripPlans.length > 0 ? (
                <ul className="space-y-2">
                  {tripPlans.map((trip) => (
                    <li
                      key={trip.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedTrip === trip.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => {
                        setSelectedTrip(trip.id)
                        setTripNotes(trip.notes)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{trip.destination}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={selectedTrip === trip.id ? "hover:bg-primary/90" : ""}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTrip(trip.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs mt-1 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {trip.startDate} to {trip.endDate}
                      </div>
                      <div className="text-xs mt-1">{trip.activities.length} activities planned</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No trips planned yet.</p>
                  <Button variant="outline" className="mt-2" onClick={() => setShowNewTripForm(true)}>
                    Create Your First Trip
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedTripData ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedTripData.destination}</CardTitle>
                  <CardDescription>
                    {selectedTripData.startDate} to {selectedTripData.endDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {weather[selectedTripData.destination as keyof typeof weather] && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Weather Forecast</h3>
                      <div className="bg-muted/30 p-4 rounded-md">
                        <div className="flex items-center mb-4">
                          {weather[selectedTripData.destination as keyof typeof weather].icon}
                          <div className="ml-4">
                            <div className="text-2xl font-bold">
                              {weather[selectedTripData.destination as keyof typeof weather].temp}°C
                            </div>
                            <div className="text-muted-foreground">
                              {weather[selectedTripData.destination as keyof typeof weather].condition}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {weather[selectedTripData.destination as keyof typeof weather].forecast.map((day, index) => (
                            <div key={index} className="p-2">
                              <div className="text-sm font-medium">{day.day}</div>
                              <div className="my-1">{day.icon}</div>
                              <div className="text-sm">{day.temp}°C</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {events[selectedTripData.destination as keyof typeof events] && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Local Events</h3>
                      <div className="space-y-2">
                        {events[selectedTripData.destination as keyof typeof events].map((event) => (
                          <Card key={event.id}>
                            <CardContent className="p-4">
                              <div className="font-medium">{event.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {event.date}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Itinerary</h3>
                      <Button size="sm" onClick={() => setShowNewActivityForm(!showNewActivityForm)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>

                    {showNewActivityForm && (
                      <motion.div
                        className="mb-4 p-4 border rounded-md"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <h3 className="text-sm font-medium mb-2">New Activity</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="activity-name">Activity Name</Label>
                            <Input
                              id="activity-name"
                              placeholder="e.g., Visit Eiffel Tower"
                              value={newActivity.name}
                              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="activity-date">Date</Label>
                              <Input
                                id="activity-date"
                                type="date"
                                value={newActivity.date}
                                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                                min={selectedTripData.startDate}
                                max={selectedTripData.endDate}
                              />
                            </div>
                            <div>
                              <Label htmlFor="activity-time">Time (Optional)</Label>
                              <Input
                                id="activity-time"
                                type="time"
                                value={newActivity.time}
                                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="activity-notes">Notes (Optional)</Label>
                            <Textarea
                              id="activity-notes"
                              placeholder="Any additional information..."
                              value={newActivity.notes}
                              onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowNewActivityForm(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddActivity}>Add Activity</Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {selectedTripData.activities.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTripData.activities.map((activity) => (
                          <Card key={activity.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{activity.name}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteActivity(selectedTripData.id, activity.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {activity.date} {activity.time && `at ${activity.time}`}
                              </div>
                              {activity.notes && (
                                <div className="text-sm mt-2 bg-muted/30 p-2 rounded">{activity.notes}</div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border rounded-md">
                        <p className="text-muted-foreground">No activities planned yet.</p>
                        <Button variant="outline" className="mt-2" onClick={() => setShowNewActivityForm(true)}>
                          Add Your First Activity
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Trip Notes
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingNotes(!editingNotes)
                        if (!editingNotes) {
                          setTripNotes(selectedTripData.notes)
                        }
                      }}
                    >
                      {editingNotes ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingNotes ? (
                    <Textarea
                      value={tripNotes}
                      onChange={(e) => setTripNotes(e.target.value)}
                      placeholder="Add notes about your trip..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <div className="min-h-[150px]">
                      {selectedTripData.notes ? (
                        <p className="whitespace-pre-line">{selectedTripData.notes}</p>
                      ) : (
                        <p className="text-muted-foreground text-center py-6">
                          No notes yet. Click edit to add some notes about your trip.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {editingNotes && (
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingNotes(false)
                          setTripNotes(selectedTripData.notes)
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleSaveNotes}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Trip Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a trip from the list or create a new one to get started.
                </p>
                <Button onClick={() => setShowNewTripForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Trip
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

