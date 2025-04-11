import type { TravelLog } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, ImageIcon, GlobeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TravelLogCardProps {
  log: TravelLog
  compact?: boolean
}

export function TravelLogCard({ log, compact = false }: TravelLogCardProps) {
  const startDate = new Date(log.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const endDate = log.endDate
    ? new Date(log.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Present"

  return (
    <Link href={`/travel-logs/${log.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative w-full h-48">
          <Image
            src={log.coverImage || "/placeholder.svg?height=400&width=600"}
            alt={log.title}
            fill
            className="object-cover"
          />
          {log.isPublic && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-white/80 dark:bg-black/50">
              <GlobeIcon className="h-3 w-3 mr-1" />
              Public
            </Badge>
          )}
        </div>
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1">{log.title}</CardTitle>
          {!compact && (
            <CardDescription className="line-clamp-2">{log.description || "No description"}</CardDescription>
          )}
        </CardHeader>
        {!compact && (
          <CardContent className="p-4 pt-0">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {startDate} - {endDate}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>
                {log.stats.cities.length} cities in {log.stats.countries.length} countries
              </span>
            </div>
          </CardContent>
        )}
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center text-sm">
            <ImageIcon className="h-4 w-4 mr-1" />
            <span>{log.stats.photosCount} photos</span>
          </div>
          <div className="text-sm">{log.stats.daysCount} days</div>
        </CardFooter>
      </Card>
    </Link>
  )
}

