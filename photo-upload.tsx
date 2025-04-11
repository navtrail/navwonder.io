"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, UploadIcon, XIcon } from "lucide-react"
import Image from "next/image"
import type { TravelPhoto } from "@/lib/types"

interface PhotoUploadProps {
  onPhotoAdd: (photo: Omit<TravelPhoto, "id">) => void
}

export function PhotoUpload({ onPhotoAdd }: PhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setPhotoUrl(url)
    setPreviewUrl(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to a storage service
    // For this demo, we'll create a local object URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setPhotoUrl(objectUrl)
  }

  const handleAddPhoto = () => {
    if (!photoUrl) return

    setIsUploading(true)

    // In a real app, you would upload the photo to a storage service
    // For this demo, we'll just use the URL directly
    setTimeout(() => {
      onPhotoAdd({
        url: photoUrl,
        caption: caption || undefined,
      })

      // Reset form
      setPhotoUrl("")
      setCaption("")
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setIsUploading(false)
    }, 1000)
  }

  const handleClearPreview = () => {
    setPreviewUrl(null)
    setPhotoUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="photo-url">Photo URL</Label>
          <div className="flex space-x-2">
            <Input
              id="photo-url"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={handleUrlChange}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadIcon className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo-caption">Caption (Optional)</Label>
          <Input
            id="photo-caption"
            placeholder="Add a caption for this photo"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {previewUrl && (
          <div className="relative">
            <div className="aspect-video relative rounded-md overflow-hidden">
              <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClearPreview}
              disabled={isUploading}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button type="button" onClick={handleAddPhoto} disabled={!photoUrl || isUploading} className="w-full">
          {isUploading ? (
            "Adding Photo..."
          ) : (
            <>
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Photo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

