"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTravelLog } from "@/lib/travel-log-service"
import { TravelLogEntryForm } from "@/components/travel-log/travel-log-entry-form"
import { Button } from "@/components/ui/button"
import type { TravelLog, TravelLogEntry } from "@/lib/types"
import Link from "next/link"

interface NewEntryPageProps {
  params: {
    id: string
  }
}

export default function NewEntryPage({ params }: NewEntryPageProps) {
  const router = useRouter()
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

  const handleSuccess = (entry: TravelLogEntry) => {
    router.push(`/travel-logs/${params.id}`)
  }

  const handleCancel = () => {
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

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Entry</h1>
        <p className="text-muted-foreground">Document a day from your journey in "{log.title}"</p>
      </div>

      <TravelLogEntryForm logId={params.id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}

