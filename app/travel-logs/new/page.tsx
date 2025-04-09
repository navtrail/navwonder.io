import type { Metadata } from "next"
import { TravelLogForm } from "@/components/travel-log/travel-log-form"

export const metadata: Metadata = {
  title: "Create Travel Log | NavTrail",
  description: "Create a new travel log to document your journey",
}

export default function NewTravelLogPage() {
  // In a real app, this would come from authentication
  const userId = "user123"

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Travel Log</h1>
        <p className="text-muted-foreground">Start documenting your journey</p>
      </div>

      <TravelLogForm userId={userId} />
    </div>
  )
}

