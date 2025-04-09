import type { Metadata } from "next"
import { generateSampleTravelLogs } from "@/lib/travel-log-service"
import { TravelLogCard } from "@/components/travel-log/travel-log-card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Travel Logs | NavTrail",
  description: "View and manage your travel logs",
}

export default function TravelLogsPage() {
  // In a real app, this would come from authentication
  const userId = "user123"

  // Generate sample logs for demo purposes
  const travelLogs = generateSampleTravelLogs(userId)

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Logs</h1>
          <p className="text-muted-foreground">Document and share your travel experiences</p>
        </div>
        <Link href="/travel-logs/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Travel Log
          </Button>
        </Link>
      </div>

      {travelLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No travel logs yet</h2>
          <p className="text-muted-foreground mb-6">
            Start documenting your journeys by creating your first travel log
          </p>
          <Link href="/travel-logs/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Log
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelLogs.map((log) => (
            <TravelLogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}

