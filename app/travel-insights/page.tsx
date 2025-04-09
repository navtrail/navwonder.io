"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserTravelLogs } from "@/lib/travel-log-service"
import { generateTravelInsights } from "@/lib/ai-service"
import type { TravelLog } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapIcon, CalendarIcon, ActivityIcon, HeartIcon, CompassIcon } from "lucide-react"
import Link from "next/link"

export default function TravelInsightsPage() {
  // In a real app, this would come from authentication
  const userId = "user123"

  const [travelLogs, setTravelLogs] = useState<TravelLog[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user's travel logs
        const logs = await getUserTravelLogs(userId)
        setTravelLogs(logs)

        if (logs.length > 0) {
          // Generate insights
          const insightsData = await generateTravelInsights(logs)
          setInsights(insightsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Prepare data for charts
  const prepareDestinationData = () => {
    const destinations: Record<string, number> = {}

    travelLogs.forEach((log) => {
      log.stats.cities.forEach((city) => {
        destinations[city] = (destinations[city] || 0) + 1
      })
    })

    return Object.entries(destinations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const prepareActivityData = () => {
    const activities: Record<string, number> = {}

    travelLogs.forEach((log) => {
      log.entries.forEach((entry) => {
        entry.activities.forEach((activity) => {
          activities[activity] = (activities[activity] || 0) + 1
        })
      })
    })

    return Object.entries(activities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Insights</h1>
          <p className="text-muted-foreground">Discover patterns and preferences in your travel history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>

        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (travelLogs.length === 0) {
    return (
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Insights</h1>
          <p className="text-muted-foreground">Discover patterns and preferences in your travel history</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">No travel data yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start documenting your journeys to get personalized insights about your travel preferences and patterns
            </p>
            <Link href="/travel-logs/new">
              <Button>Create Your First Travel Log</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const destinationData = prepareDestinationData()
  const activityData = prepareActivityData()

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Travel Insights</h1>
        <p className="text-muted-foreground">Discover patterns and preferences in your travel history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <MapIcon className="h-8 w-8 mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {travelLogs.reduce((total, log) => total + log.stats.cities.length, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Places Visited</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CalendarIcon className="h-8 w-8 mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {travelLogs.reduce((total, log) => total + log.stats.daysCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Days Traveled</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ActivityIcon className="h-8 w-8 mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {travelLogs.reduce((total, log) => total + log.stats.activitiesCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <HeartIcon className="h-8 w-8 mb-2 text-primary" />
            <div className="text-2xl font-bold">{travelLogs.length}</div>
            <p className="text-sm text-muted-foreground">Travel Logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
            <CardDescription>Places you've visited most frequently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={destinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Activities</CardTitle>
            <CardDescription>Activities you enjoy most during your travels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CompassIcon className="h-5 w-5 mr-2 text-primary" />
              AI-Generated Travel Insights
            </CardTitle>
            <CardDescription>Personalized analysis of your travel preferences and patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Your Travel Style</h3>
              <p>{insights.travelStyle}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Favorite Destinations</h3>
              <ul className="list-disc pl-5">
                {insights.favoriteDestinations.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-1">Favorite Activities</h3>
              <ul className="list-disc pl-5">
                {insights.favoriteActivities.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-1">Travel Patterns</h3>
              <ul className="list-disc pl-5">
                {insights.travelPatterns.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-1">Personalized Recommendations</h3>
              <ul className="list-disc pl-5">
                {insights.recommendations.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

