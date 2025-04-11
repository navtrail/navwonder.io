"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Sparkles, Calendar, MapPin, Clock, User, Bot, Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateItinerary, generateResponse } from "@/lib/ai-service"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface Itinerary {
  id: string
  destination: string
  duration: number
  startDate: string
  activities: {
    day: number
    items: {
      time: string
      activity: string
      location: string
      notes?: string
    }[]
  }[]
}

export function AITravelAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI travel assistant. I can help you plan trips, find places to visit, and answer your travel questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [itineraryForm, setItineraryForm] = useState({
    destination: "",
    duration: 3,
    interests: "",
    budget: "medium",
    travelStyle: "balanced",
  })
  const [generatedItineraries, setGeneratedItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get AI response
      const response = await generateResponse(input, messages)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateItinerary = async () => {
    if (!itineraryForm.destination) {
      toast({
        title: "Missing information",
        description: "Please enter a destination",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingItinerary(true)

    try {
      const itinerary = await generateItinerary(
        itineraryForm.destination,
        itineraryForm.duration,
        itineraryForm.interests,
        itineraryForm.budget,
        itineraryForm.travelStyle,
      )

      setGeneratedItineraries((prev) => [itinerary, ...prev])
      setSelectedItinerary(itinerary)
      setActiveTab("itineraries")

      toast({
        title: "Itinerary generated",
        description: `Your ${itineraryForm.duration}-day itinerary for ${itineraryForm.destination} is ready!`,
      })
    } catch (error) {
      console.error("Error generating itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to generate an itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingItinerary(false)
    }
  }

  const handleDeleteItinerary = (id: string) => {
    setGeneratedItineraries((prev) => prev.filter((itinerary) => itinerary.id !== id))
    if (selectedItinerary?.id === id) {
      setSelectedItinerary(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container py-8">
      <motion.h1
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Travel Assistant
      </motion.h1>
      <motion.p
        className="text-muted-foreground mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Get personalized travel recommendations, itineraries, and answers to your travel questions
      </motion.p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            Chat Assistant
          </TabsTrigger>
          <TabsTrigger value="itineraries" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Itineraries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Travel Assistant Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-[450px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                          {message.role === "user" ? (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] flex-row">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-muted">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  placeholder="Ask me anything about travel planning..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-[60px]"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="itineraries" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Create Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium mb-1">
                      Destination
                    </label>
                    <Input
                      id="destination"
                      placeholder="e.g., Tokyo, Japan"
                      value={itineraryForm.destination}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, destination: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">
                      Duration (days)
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      min={1}
                      max={14}
                      value={itineraryForm.duration}
                      onChange={(e) =>
                        setItineraryForm({ ...itineraryForm, duration: Number.parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="interests" className="block text-sm font-medium mb-1">
                      Interests (optional)
                    </label>
                    <Textarea
                      id="interests"
                      placeholder="e.g., history, food, nature, shopping"
                      value={itineraryForm.interests}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, interests: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-1">
                      Budget
                    </label>
                    <select
                      id="budget"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={itineraryForm.budget}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, budget: e.target.value })}
                    >
                      <option value="budget">Budget</option>
                      <option value="medium">Medium</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="travelStyle" className="block text-sm font-medium mb-1">
                      Travel Style
                    </label>
                    <select
                      id="travelStyle"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={itineraryForm.travelStyle}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, travelStyle: e.target.value })}
                    >
                      <option value="relaxed">Relaxed</option>
                      <option value="balanced">Balanced</option>
                      <option value="intensive">Intensive</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleGenerateItinerary}
                    disabled={isGeneratingItinerary || !itineraryForm.destination}
                    className="w-full"
                  >
                    {isGeneratingItinerary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Itinerary
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {generatedItineraries.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Your Itineraries</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="px-4 py-2 space-y-2">
                        {generatedItineraries.map((itinerary) => (
                          <div
                            key={itinerary.id}
                            className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                              selectedItinerary?.id === itinerary.id ? "bg-primary/10" : "hover:bg-muted"
                            }`}
                            onClick={() => setSelectedItinerary(itinerary)}
                          >
                            <div>
                              <div className="font-medium">{itinerary.destination}</div>
                              <div className="text-sm text-muted-foreground">{itinerary.duration} days</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteItinerary(itinerary.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="md:col-span-2">
              {selectedItinerary ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedItinerary.destination}</CardTitle>
                        <p className="text-muted-foreground mt-1">{selectedItinerary.duration}-day itinerary</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Save to My Trips
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-8">
                        {selectedItinerary.activities.map((day) => (
                          <div key={day.day} className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center">
                              <Calendar className="mr-2 h-5 w-5 text-primary" />
                              Day {day.day}
                            </h3>
                            <div className="space-y-4 pl-7">
                              {day.items.map((item, index) => (
                                <div key={index} className="relative pl-6 pb-4 border-l border-muted">
                                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                                  <div className="flex items-start">
                                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                    <span className="text-sm font-medium">{item.time}</span>
                                  </div>
                                  <h4 className="font-medium mt-1">{item.activity}</h4>
                                  <div className="flex items-start mt-1">
                                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{item.location}</span>
                                  </div>
                                  {item.notes && <p className="text-sm mt-2 bg-muted p-2 rounded-md">{item.notes}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Map
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Trip Planner
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Itinerary Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate a new itinerary or select one from your list to view details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

