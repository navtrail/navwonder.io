import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { fetchPlacesNearby } from "./places-api"
import type { TravelLog } from "./types"
import { getUserTravelLogs } from "./travel-log-service"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface Itinerary {
  id?: string
  destination: string
  duration: number
  startDate?: string
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

// Generate a response from the AI assistant
export async function generateResponse(userInput: string, messageHistory: Message[], userId?: string): Promise<string> {
  try {
    // Format message history for the AI
    const formattedHistory = messageHistory
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

    // System message to guide the AI
    let systemMessage = `
      You are an AI travel assistant for NavTrail, a travel planning application focused on India.
      Your goal is to help users plan their trips, find interesting places to visit, and answer travel-related questions.
      Provide helpful, concise, and accurate information about destinations, attractions, local customs, and travel tips.
      If you don't know something, admit it rather than making up information.
      Format your responses in a conversational, friendly manner.
      For recommendations, focus on providing specific, actionable advice.
    `

    // Check if we need to fetch additional data
    let enhancedPrompt = userInput

    // Check if the user is asking about places or attractions
    if (
      userInput.toLowerCase().includes("place") ||
      userInput.toLowerCase().includes("attraction") ||
      userInput.toLowerCase().includes("visit") ||
      userInput.toLowerCase().includes("restaurant") ||
      userInput.toLowerCase().includes("hotel")
    ) {
      // Extract location from the query
      // This is a simplified approach - in a real app, you'd use NLP
      const locationMatch =
        userInput.match(/in\s+([A-Za-z\s,]+)/) ||
        userInput.match(/at\s+([A-Za-z\s,]+)/) ||
        userInput.match(/near\s+([A-Za-z\s,]+)/)

      if (locationMatch && locationMatch[1]) {
        const location = locationMatch[1].trim()
        try {
          // Fetch nearby places
          const places = await fetchPlacesNearby(location)
          if (places && places.length > 0) {
            enhancedPrompt += `\n\nHere are some places in ${location} that might be relevant: ${places
              .slice(0, 5)
              .map((p: any) => p.name)
              .join(", ")}`
          }
        } catch (error) {
          console.error("Error fetching places:", error)
        }
      }
    }

    // Check if the user is asking about their travel logs
    if (
      userId &&
      (userInput.toLowerCase().includes("my travel") ||
        userInput.toLowerCase().includes("my trip") ||
        userInput.toLowerCase().includes("my journey") ||
        userInput.toLowerCase().includes("my log") ||
        userInput.toLowerCase().includes("my itinerary"))
    ) {
      try {
        // Fetch user's travel logs
        const logs = await getUserTravelLogs(userId)
        if (logs && logs.length > 0) {
          const logsInfo = logs.map((log) => ({
            id: log.id,
            title: log.title,
            startDate: log.startDate,
            endDate: log.endDate || "ongoing",
            destinations: log.stats.cities.join(", "),
            entriesCount: log.entries.length,
          }))

          enhancedPrompt += `\n\nHere are your travel logs: ${JSON.stringify(logsInfo, null, 2)}`

          systemMessage += `\nThe user has ${logs.length} travel logs. You can reference them in your responses.`
        }
      } catch (error) {
        console.error("Error fetching user travel logs:", error)
      }
    }

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemMessage,
      prompt: enhancedPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate a response. Please try again.")
  }
}

// Generate a travel itinerary
export async function generateItinerary(
  destination: string,
  duration: number,
  interests = "",
  budget = "medium",
  travelStyle = "balanced",
  userLogs?: TravelLog[],
): Promise<Itinerary> {
  try {
    // Create a prompt for the itinerary generation
    let prompt = `
      Create a detailed ${duration}-day travel itinerary for ${destination}.
      ${interests ? `The traveler is interested in: ${interests}.` : ""}
      Budget level: ${budget}.
      Travel style: ${travelStyle}.
      
      Format the response as a JSON object with the following structure:
      {
        "destination": "${destination}",
        "duration": ${duration},
        "startDate": "YYYY-MM-DD", // Use today's date
        "activities": [
          {
            "day": 1,
            "items": [
              {
                "time": "09:00 AM",
                "activity": "Visit [Place Name]",
                "location": "Address or area",
                "notes": "Optional tips or information"
              },
              // More activities for day 1
            ]
          },
          // More days
        ]
      }
      
      Include 4-6 activities per day with a good mix of attractions, meals, and experiences.
      Make sure the itinerary is realistic in terms of travel time between locations.
      For each day, include breakfast, lunch, and dinner recommendations.
      Add specific location names and brief notes for each activity.
    `

    // Try to fetch real places for the destination
    try {
      const places = await fetchPlacesNearby(destination)
      if (places && places.length > 0) {
        const placesList = places
          .slice(0, 10)
          .map((p: any) => `- ${p.name}: ${p.vicinity || "No address available"}`)
          .join("\n")
        prompt += `\n\nHere are some real places you can include in the itinerary:\n${placesList}`
      }
    } catch (error) {
      console.error("Error fetching places for itinerary:", error)
    }

    // If user has travel logs, include relevant information
    if (userLogs && userLogs.length > 0) {
      // Find logs that might be relevant to the destination
      const relevantLogs = userLogs.filter((log) =>
        log.stats.cities.some(
          (city) =>
            destination.toLowerCase().includes(city.toLowerCase()) ||
            city.toLowerCase().includes(destination.toLowerCase()),
        ),
      )

      if (relevantLogs.length > 0) {
        prompt += "\n\nThe user has previously visited similar destinations. Here are some activities they enjoyed:"

        relevantLogs.forEach((log) => {
          const activities = log.entries.flatMap((entry) => entry.activities).slice(0, 5)

          if (activities.length > 0) {
            prompt += `\nFrom their trip to ${log.title}: ${activities.join(", ")}`
          }
        })

        prompt += "\nConsider incorporating similar activities that align with their interests."
      }
    }

    // Generate itinerary using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case the AI includes extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from the response")
      }

      const jsonStr = jsonMatch[0]
      const itinerary = JSON.parse(jsonStr) as Itinerary

      // Add an ID to the itinerary
      itinerary.id = Date.now().toString()

      // Set start date if not provided
      if (!itinerary.startDate) {
        itinerary.startDate = new Date().toISOString().split("T")[0]
      }

      return itinerary
    } catch (error) {
      console.error("Error parsing itinerary JSON:", error)
      throw new Error("Failed to parse the generated itinerary")
    }
  } catch (error) {
    console.error("Error generating itinerary:", error)
    throw new Error("Failed to generate an itinerary. Please try again.")
  }
}

// Get travel recommendations based on user preferences and travel history
export async function getRecommendations(
  location: string,
  category = "attractions",
  count = 5,
  userLogs?: TravelLog[],
): Promise<any[]> {
  try {
    // Create a prompt for recommendations
    let prompt = `
      Recommend ${count} ${category} in or near ${location}.
      Format the response as a JSON array with the following structure:
      [
        {
          "name": "Name of the place",
          "description": "Brief description",
          "category": "Type of place (museum, park, restaurant, etc.)",
          "rating": 4.5, // Estimated rating out of 5
          "priceLevel": "$$" // $ to $$$$ indicating price level
        },
        // More recommendations
      ]
    `

    // If user has travel logs, include relevant information
    if (userLogs && userLogs.length > 0) {
      // Extract user preferences from their travel logs
      const activities = userLogs.flatMap((log) => log.entries).flatMap((entry) => entry.activities)

      // Count activity frequencies
      const activityCounts: Record<string, number> = {}
      activities.forEach((activity) => {
        const lowerActivity = activity.toLowerCase()
        activityCounts[lowerActivity] = (activityCounts[lowerActivity] || 0) + 1
      })

      // Get top activities
      const topActivities = Object.entries(activityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([activity]) => activity)

      if (topActivities.length > 0) {
        prompt += `\n\nBased on the user's travel history, they enjoy: ${topActivities.join(", ")}. Consider these preferences when making recommendations.`
      }
    }

    // Generate recommendations using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from the response")
      }

      const jsonStr = jsonMatch[0]
      const recommendations = JSON.parse(jsonStr)

      // Try to enhance with real data
      const enhancedRecommendations = await enhanceWithRealData(recommendations, location)

      return enhancedRecommendations
    } catch (error) {
      console.error("Error parsing recommendations JSON:", error)
      throw new Error("Failed to parse the generated recommendations")
    }
  } catch (error) {
    console.error("Error generating recommendations:", error)
    throw new Error("Failed to generate recommendations. Please try again.")
  }
}

// Enhance recommendations with real data from APIs
async function enhanceWithRealData(recommendations: any[], location: string): Promise<any[]> {
  try {
    // Fetch real places data
    const places = await fetchPlacesNearby(location)

    if (!places || places.length === 0) {
      return recommendations
    }

    // Match AI recommendations with real places where possible
    return recommendations.map((rec) => {
      const matchingPlace = places.find(
        (place: any) =>
          place.name.toLowerCase().includes(rec.name.toLowerCase()) ||
          rec.name.toLowerCase().includes(place.name.toLowerCase()),
      )

      if (matchingPlace) {
        return {
          ...rec,
          placeId: matchingPlace.place_id,
          address: matchingPlace.vicinity,
          realRating: matchingPlace.rating,
          location: matchingPlace.geometry?.location,
        }
      }

      return rec
    })
  } catch (error) {
    console.error("Error enhancing recommendations:", error)
    return recommendations
  }
}

// Generate travel insights based on user's travel logs
export async function generateTravelInsights(userLogs: TravelLog[]): Promise<any> {
  if (!userLogs || userLogs.length === 0) {
    return {
      message: "No travel data available to generate insights.",
      insights: [],
    }
  }

  try {
    // Prepare data for the AI
    const logsData = userLogs.map((log) => ({
      title: log.title,
      startDate: log.startDate,
      endDate: log.endDate,
      destinations: log.stats.cities,
      countries: log.stats.countries,
      daysCount: log.stats.daysCount,
      activitiesCount: log.stats.activitiesCount,
      activities: log.entries.flatMap((entry) => entry.activities),
      moods: log.entries.map((entry) => entry.mood).filter(Boolean),
    }))

    const prompt = `
      Analyze the following travel data and generate insights about the user's travel preferences and patterns:
      ${JSON.stringify(logsData, null, 2)}
      
      Generate insights in the following JSON format:
      {
        "travelStyle": "Brief description of their travel style",
        "favoriteDestinations": ["List of destinations they seem to prefer"],
        "favoriteActivities": ["List of activities they enjoy most"],
        "travelPatterns": ["Observations about their travel patterns"],
        "recommendations": ["Personalized recommendations based on their history"]
      }
    `

    // Generate insights using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from the response")
      }

      const jsonStr = jsonMatch[0]
      return JSON.parse(jsonStr)
    } catch (error) {
      console.error("Error parsing insights JSON:", error)
      throw new Error("Failed to parse the generated insights")
    }
  } catch (error) {
    console.error("Error generating travel insights:", error)
    throw new Error("Failed to generate travel insights. Please try again.")
  }
}

