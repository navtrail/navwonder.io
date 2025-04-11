"use client"

import { useState } from "react"
import type { TravelPhoto } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import Image from "next/image"

interface TravelLogGalleryProps {
  photos: TravelPhoto[]
}

export function TravelLogGallery({ photos }: TravelLogGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePrevious = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photo Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
            <p className="text-muted-foreground">No photos to display</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <Dialog
              key={photo.id}
              open={isDialogOpen && currentPhotoIndex === index}
              onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (open) setCurrentPhotoIndex(index)
              }}
            >
              <DialogTrigger asChild>
                <div className="relative aspect-square cursor-pointer overflow-hidden rounded-md">
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.caption || `Photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0">
                <div className="relative h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 rounded-full bg-black/20 hover:bg-black/40"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <XIcon className="h-4 w-4 text-white" />
                  </Button>

                  <div className="relative h-[80vh]">
                    <Image
                      src={photos[currentPhotoIndex].url || "/placeholder.svg"}
                      alt={photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/20 hover:bg-black/40 ml-2"
                      onClick={handlePrevious}
                    >
                      <ChevronLeftIcon className="h-6 w-6 text-white" />
                    </Button>
                  </div>

                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/20 hover:bg-black/40 mr-2"
                      onClick={handleNext}
                    >
                      <ChevronRightIcon className="h-6 w-6 text-white" />
                    </Button>
                  </div>

                  {photos[currentPhotoIndex].caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-4">
                      <p>{photos[currentPhotoIndex].caption}</p>
                      {photos[currentPhotoIndex].location && (
                        <p className="text-sm text-gray-300 mt-1">{photos[currentPhotoIndex].location.name}</p>
                      )}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

