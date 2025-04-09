"use client"

import { useState, useEffect } from "react"
import { getTravelLog } from "@/lib/travel-log-service"
import { TravelLogEntryCard } from "@/components/travel-log/travel-log-entry"
import { TravelLogStats } from "@/components/travel-log/travel-log-stats"
import { TravelLogMap } from "@/components/travel-log/travel-log-map"
import { TravelLogGallery } from "@/components/travel-log/travel-log-gallery"
import { TravelLogShare } from "@/components/travel-log/travel-log-share"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, PlusIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { TravelLog } from "@/lib/types"

interface TravelLogPageProps {
  params: {
    id: string
  }
}

export default function TravelLogPage({ params }: TravelLogPageProps) {
  const [log, setLog] = useState<TravelLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLog() {
      try {
        const fetchedLog = await getTravelLog(params.id)
        setLog(fetchedLog)
      } catch (error) {
        console.error("Error fetching travel log:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLog()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!log) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Travel Log Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The travel log you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/travel-logs">
          <Button>Back to Travel Logs</Button>
        </Link>
      </div>
    )
  }

  // Collect all photos from entries
  const allPhotos = log.entries.flatMap((entry) => entry.photos)

  // Format dates
  const startDate = new Date(log.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const endDate = log.endDate
    ? new Date(log.endDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Present"

  return (
    <div className="container py-6 space-y-8">
      {/* Header */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={log.coverImage || "/placeholder.svg?height=400&width=1200"}
          alt={log.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{log.title}</h1>
          <div className="flex items-center mt-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          {log.stats.cities.length > 0 && (
            <div className="flex items-center mt-1">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{log.stats.cities.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Link href={`/travel-logs/${log.id}/edit`}>
            <Button variant="outline" size="sm">
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Log
            </Button>
          </Link>
          <TravelLogShare log={log} onUpdate={setLog} />
        </div>
        <Link href={`/travel-logs/${log.id}/entries/new`}>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </Link>
      </div>

      {/* Description */}
      {log.description && (
        <div className="prose dark:prose-invert max-w-none">
          <p>{log.description}</p>
        </div>
      )}

      {/* Stats and Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TravelLogStats stats={log.stats} />
        <TravelLogMap locations={log.locations} />
      </div>

      {/* Photo Gallery */}
      {allPhotos.length > 0 && <TravelLogGallery photos={allPhotos} />}

      {/* Entries */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Journal Entries</h2>
        {log.entries.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-4">Start documenting your journey by adding your first entry</p>
            <Link href={`/travel-logs/${log.id}/entries/new`}>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {log.entries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <TravelLogEntryCard key={entry.id} entry={entry} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

