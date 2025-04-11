import type { TravelLogEntry } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, CloudIcon, SmileIcon } from "lucide-react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface TravelLogEntryProps {
  entry: TravelLogEntry
}

export function TravelLogEntryCard({ entry }: TravelLogEntryProps) {
  const date = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Mood emoji mapping
  const moodEmoji = {
    amazing: "😄",
    good: "🙂",
    okay: "😐",
    bad: "😞",
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{entry.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {date}
            </Badge>
            {entry.mood && (
              <Badge variant="outline" className="flex items-center">
                <SmileIcon className="h-3 w-3 mr-1" />
                {entry.mood} {moodEmoji[entry.mood as keyof typeof moodEmoji]}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entry.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{entry.location.name}</span>
            {entry.location.address && <span className="ml-1 text-xs">({entry.location.address})</span>}
          </div>
        )}

        {entry.weather && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <CloudIcon className="h-4 w-4 mr-1" />
            <span>
              {entry.weather.condition}, {entry.weather.temperature}°C
            </span>
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mb-4">
          <p>{entry.content}</p>
        </div>

        {entry.activities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Activities</h4>
            <div className="flex flex-wrap gap-2">
              {entry.activities.map((activity, index) => (
                <Badge key={index} variant="secondary">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {entry.photos.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Photos</h4>
            <Carousel className="w-full">
              <CarouselContent>
                {entry.photos.map((photo, index) => (
                  <CarouselItem key={index} className="basis-1/3 md:basis-1/4">
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption || `Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {photo.caption && <p className="text-xs text-center mt-1 text-muted-foreground">{photo.caption}</p>}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

