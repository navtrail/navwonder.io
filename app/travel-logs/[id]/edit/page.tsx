"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTravelLog } from "@/lib/travel-log-service"
import { TravelLogForm } from "@/components/travel-log/travel-log-form"
import { Button } from "@/components/ui/button"
import type { TravelLog } from "@/lib/types"
import Link from "next/link"

interface EditTravelLogPageProps {
  params: {
    id: string
  }
}

export default function EditTravelLogPage({ params }: EditTravelLogPageProps) {
  const router = useRouter()
  const [log, setLog] = useState<TravelLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // In a real app, this would come from authentication
  const userId = "user123"

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

  const handleSuccess = (updatedLog: TravelLog) => {
    router.push(`/travel-logs/${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded"></div>
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

  // Check if the user is the owner of the log
  if (log.userId !== userId) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to edit this travel log.</p>
        <Link href={`/travel-logs/${params.id}`}>
          <Button>Back to Travel Log</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Travel Log</h1>
        <p className="text-muted-foreground">Update the details of your travel log</p>
      </div>

      <TravelLogForm userId={userId} existingLog={log} onSuccess={handleSuccess} />
    </div>
  )
}

