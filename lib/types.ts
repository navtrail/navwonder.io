// Core types for the application

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system"
  currency?: string
  distanceUnit?: "km" | "mi"
  temperatureUnit?: "celsius" | "fahrenheit"
}

export interface Location {
  id?: string
  name: string
  address?: string
  latitude: number
  longitude: number
  placeId?: string
  category?: string
  photos?: string[]
}

export interface TravelLog {
  id: string
  title: string
  description?: string
  coverImage?: string
  startDate: string
  endDate?: string
  isPublic: boolean
  userId: string
  createdAt: string
  updatedAt: string
  entries: TravelLogEntry[]
  locations: Location[]
  stats: TravelStats
  tags: string[]
}

export interface TravelLogEntry {
  id: string
  logId: string
  date: string
  title: string
  content: string
  mood?: "amazing" | "good" | "okay" | "bad"
  weather?: {
    condition: string
    temperature: number
    icon: string
  }
  location?: Location
  photos: TravelPhoto[]
  activities: string[]
  createdAt: string
  updatedAt: string
}

export interface TravelPhoto {
  id: string
  url: string
  caption?: string
  location?: Location
  takenAt?: string
  width?: number
  height?: number
}

export interface TravelStats {
  totalDistance: number
  countries: string[]
  cities: string[]
  daysCount: number
  activitiesCount: number
  photosCount: number
  transportModes: {
    [key: string]: number
  }
}

export interface Itinerary {
  id: string
  title: string
  destination: string
  duration: number
  startDate: string
  endDate?: string
  userId?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  activities: ItineraryDay[]
  notes?: string
  budget?: {
    currency: string
    amount: number
    breakdown?: {
      [category: string]: number
    }
  }
}

export interface ItineraryDay {
  day: number
  date?: string
  items: ItineraryItem[]
}

export interface ItineraryItem {
  id: string
  time: string
  activity: string
  location: string
  notes?: string
  duration?: number
  category?: "food" | "attraction" | "transport" | "accommodation" | "other"
  cost?: {
    currency: string
    amount: number
  }
  completed?: boolean
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export interface Recommendation {
  id?: string
  name: string
  description: string
  category: string
  rating: number
  priceLevel: string
  placeId?: string
  address?: string
  realRating?: number
  location?: {
    lat: number
    lng: number
  }
  photos?: string[]
}

