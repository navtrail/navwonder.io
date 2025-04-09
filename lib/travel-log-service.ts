import type { TravelLog, TravelLogEntry, TravelPhoto, TravelStats } from "./types"

// Mock database for travel logs (in a real app, this would be a database)
let travelLogs: TravelLog[] = []

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get current date in ISO format
function getCurrentDate(): string {
  return new Date().toISOString()
}

// Calculate travel stats
function calculateStats(log: TravelLog): TravelStats {
  const cities = new Set<string>()
  const countries = new Set<string>()
  const transportModes: { [key: string]: number } = {}
  const totalDistance = 0
  let photosCount = 0

  // Extract unique cities and countries
  log.locations.forEach((location) => {
    if (location.address) {
      const parts = location.address.split(",")
      if (parts.length > 1) {
        cities.add(parts[0].trim())
        countries.add(parts[parts.length - 1].trim())
      }
    }
  })

  // Count photos
  log.entries.forEach((entry) => {
    photosCount += entry.photos.length

    // Count transport modes (simplified)
    entry.activities.forEach((activity) => {
      if (
        activity.toLowerCase().includes("bus") ||
        activity.toLowerCase().includes("train") ||
        activity.toLowerCase().includes("flight") ||
        activity.toLowerCase().includes("car") ||
        activity.toLowerCase().includes("bike")
      ) {
        const mode = activity.split(" ")[0].toLowerCase()
        transportModes[mode] = (transportModes[mode] || 0) + 1
      }
    })
  })

  // Calculate days count
  const startDate = new Date(log.startDate)
  const endDate = log.endDate ? new Date(log.endDate) : new Date()
  const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate activities count
  const activitiesCount = log.entries.reduce((count, entry) => count + entry.activities.length, 0)

  return {
    totalDistance,
    countries: Array.from(countries),
    cities: Array.from(cities),
    daysCount,
    activitiesCount,
    photosCount,
    transportModes,
  }
}

// Create a new travel log
export async function createTravelLog(
  title: string,
  startDate: string,
  userId: string,
  description?: string,
  coverImage?: string,
  isPublic = false,
): Promise<TravelLog> {
  const now = getCurrentDate()

  const newLog: TravelLog = {
    id: generateId(),
    title,
    description,
    coverImage,
    startDate,
    isPublic,
    userId,
    createdAt: now,
    updatedAt: now,
    entries: [],
    locations: [],
    stats: {
      totalDistance: 0,
      countries: [],
      cities: [],
      daysCount: 0,
      activitiesCount: 0,
      photosCount: 0,
      transportModes: {},
    },
    tags: [],
  }

  travelLogs.push(newLog)
  return newLog
}

// Get all travel logs for a user
export async function getUserTravelLogs(userId: string): Promise<TravelLog[]> {
  return travelLogs.filter((log) => log.userId === userId)
}

// Get a specific travel log by ID
export async function getTravelLog(id: string): Promise<TravelLog | null> {
  const log = travelLogs.find((log) => log.id === id)
  return log || null
}

// Update a travel log
export async function updateTravelLog(id: string, updates: Partial<TravelLog>): Promise<TravelLog | null> {
  const index = travelLogs.findIndex((log) => log.id === id)
  if (index === -1) return null

  const updatedLog = {
    ...travelLogs[index],
    ...updates,
    updatedAt: getCurrentDate(),
  }

  travelLogs[index] = updatedLog
  return updatedLog
}

// Delete a travel log
export async function deleteTravelLog(id: string): Promise<boolean> {
  const initialLength = travelLogs.length
  travelLogs = travelLogs.filter((log) => log.id !== id)
  return travelLogs.length < initialLength
}

// Add an entry to a travel log
export async function addLogEntry(
  logId: string,
  entry: Omit<TravelLogEntry, "id" | "logId" | "createdAt" | "updatedAt">,
): Promise<TravelLogEntry | null> {
  const log = travelLogs.find((log) => log.id === logId)
  if (!log) return null

  const now = getCurrentDate()
  const newEntry: TravelLogEntry = {
    id: generateId(),
    logId,
    createdAt: now,
    updatedAt: now,
    ...entry,
  }

  log.entries.push(newEntry)

  // Update locations if entry has a location
  if (entry.location) {
    if (
      !log.locations.some(
        (loc) => loc.latitude === entry.location!.latitude && loc.longitude === entry.location!.longitude,
      )
    ) {
      log.locations.push(entry.location)
    }
  }

  // Recalculate stats
  log.stats = calculateStats(log)
  log.updatedAt = now

  return newEntry
}

// Update a log entry
export async function updateLogEntry(
  logId: string,
  entryId: string,
  updates: Partial<TravelLogEntry>,
): Promise<TravelLogEntry | null> {
  const log = travelLogs.find((log) => log.id === logId)
  if (!log) return null

  const entryIndex = log.entries.findIndex((entry) => entry.id === entryId)
  if (entryIndex === -1) return null

  const updatedEntry = {
    ...log.entries[entryIndex],
    ...updates,
    updatedAt: getCurrentDate(),
  }

  log.entries[entryIndex] = updatedEntry

  // Update locations if entry has a location
  if (updatedEntry.location) {
    if (
      !log.locations.some(
        (loc) => loc.latitude === updatedEntry.location!.latitude && loc.longitude === updatedEntry.location!.longitude,
      )
    ) {
      log.locations.push(updatedEntry.location)
    }
  }

  // Recalculate stats
  log.stats = calculateStats(log)
  log.updatedAt = getCurrentDate()

  return updatedEntry
}

// Delete a log entry
export async function deleteLogEntry(logId: string, entryId: string): Promise<boolean> {
  const log = travelLogs.find((log) => log.id === logId)
  if (!log) return false

  const initialLength = log.entries.length
  log.entries = log.entries.filter((entry) => entry.id !== entryId)

  if (log.entries.length < initialLength) {
    // Recalculate locations
    const locationSet = new Set<string>()
    log.entries.forEach((entry) => {
      if (entry.location) {
        const locKey = `${entry.location.latitude},${entry.location.longitude}`
        locationSet.add(locKey)
      }
    })

    log.locations = log.locations.filter((loc) => locationSet.has(`${loc.latitude},${loc.longitude}`))

    // Recalculate stats
    log.stats = calculateStats(log)
    log.updatedAt = getCurrentDate()

    return true
  }

  return false
}

// Add a photo to a log entry
export async function addPhoto(
  logId: string,
  entryId: string,
  photo: Omit<TravelPhoto, "id">,
): Promise<TravelPhoto | null> {
  const log = travelLogs.find((log) => log.id === logId)
  if (!log) return null

  const entry = log.entries.find((entry) => entry.id === entryId)
  if (!entry) return null

  const newPhoto: TravelPhoto = {
    id: generateId(),
    ...photo,
  }

  entry.photos.push(newPhoto)

  // Update locations if photo has a location
  if (photo.location) {
    if (
      !log.locations.some(
        (loc) => loc.latitude === photo.location!.latitude && loc.longitude === photo.location!.longitude,
      )
    ) {
      log.locations.push(photo.location)
    }
  }

  // Recalculate stats
  log.stats = calculateStats(log)
  log.updatedAt = getCurrentDate()
  entry.updatedAt = getCurrentDate()

  return newPhoto
}

// Get public travel logs
export async function getPublicTravelLogs(limit = 10): Promise<TravelLog[]> {
  return travelLogs
    .filter((log) => log.isPublic)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

// Search travel logs
export async function searchTravelLogs(query: string, userId?: string): Promise<TravelLog[]> {
  const searchTerms = query.toLowerCase().split(" ")

  return travelLogs
    .filter((log) => {
      // Filter by user if userId is provided
      if (userId && log.userId !== userId) return false

      // If not the user's log, it must be public
      if (userId !== log.userId && !log.isPublic) return false

      // Search in title, description, and tags
      const searchText = `${log.title} ${log.description || ""} ${log.tags.join(" ")}`.toLowerCase()

      // Check if all search terms are found
      return searchTerms.every((term) => searchText.includes(term))
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

// Generate sample travel logs for testing
export function generateSampleTravelLogs(userId: string): TravelLog[] {
  // Clear existing logs
  travelLogs = []

  // Create sample logs
  const log1 = createTravelLog(
    "Backpacking through Kerala",
    "2023-10-15",
    userId,
    "My amazing journey through God's own country",
    "/placeholder.svg?height=400&width=600",
    true,
  )

  const log2 = createTravelLog(
    "Weekend in Goa",
    "2023-12-01",
    userId,
    "Beach vibes and relaxation",
    "/placeholder.svg?height=400&width=600",
    true,
  )

  const log3 = createTravelLog(
    "Exploring the Himalayas",
    "2024-01-10",
    userId,
    "Trekking and adventure in the mountains",
    "/placeholder.svg?height=400&width=600",
    false,
  )

  return [log1, log2, log3] as TravelLog[]
}

