import type { TravelStats } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapIcon, CalendarIcon, ImageIcon, MapPinIcon, GlobeIcon, ActivityIcon } from "lucide-react"

interface TravelLogStatsProps {
  stats: TravelStats
}

export function TravelLogStats({ stats }: TravelLogStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trip Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <CalendarIcon className="h-5 w-5 mb-1 text-primary" />
          <span className="text-2xl font-bold">{stats.daysCount}</span>
          <span className="text-xs text-muted-foreground">Days</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <GlobeIcon className="h-5 w-5 mb-1 text-primary" />
          <span className="text-2xl font-bold">{stats.countries.length}</span>
          <span className="text-xs text-muted-foreground">Countries</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <MapPinIcon className="h-5 w-5 mb-1 text-primary" />
          <span className="text-2xl font-bold">{stats.cities.length}</span>
          <span className="text-xs text-muted-foreground">Cities</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <ActivityIcon className="h-5 w-5 mb-1 text-primary" />
          <span className="text-2xl font-bold">{stats.activitiesCount}</span>
          <span className="text-xs text-muted-foreground">Activities</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <ImageIcon className="h-5 w-5 mb-1 text-primary" />
          <span className="text-2xl font-bold">{stats.photosCount}</span>
          <span className="text-xs text-muted-foreground">Photos</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <MapIcon className="h-5 w-5 mb-1 text-primary" />
          <span className="text-2xl font-bold">{Math.round(stats.totalDistance)}</span>
          <span className="text-xs text-muted-foreground">Kilometers</span>
        </div>
      </CardContent>
    </Card>
  )
}

