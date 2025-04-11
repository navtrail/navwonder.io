"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TravelLog } from "@/lib/types"
import { Share2Icon, CopyIcon, FacebookIcon, TwitterIcon, LinkedinIcon, MailIcon, CheckIcon } from "lucide-react"
import { updateTravelLog } from "@/lib/travel-log-service"

interface TravelLogShareProps {
  log: TravelLog
  onUpdate?: (log: TravelLog) => void
}

export function TravelLogShare({ log, onUpdate }: TravelLogShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(log.isPublic)
  const [isCopied, setIsCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const shareUrl = `${window.location.origin}/travel-logs/${log.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handlePrivacyChange = async () => {
    setIsUpdating(true)
    try {
      const updatedLog = await updateTravelLog(log.id, {
        isPublic: !isPublic,
      })

      if (updatedLog) {
        setIsPublic(updatedLog.isPublic)
        if (onUpdate) {
          onUpdate(updatedLog)
        }
      }
    } catch (error) {
      console.error("Error updating privacy settings:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out my travel log: ${log.title}`)}`,
      "_blank",
    )
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareByEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(`Check out my travel log: ${log.title}`)}&body=${encodeURIComponent(`I wanted to share my travel log with you: ${shareUrl}`)}`,
      "_blank",
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2Icon className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Travel Log</DialogTitle>
          <DialogDescription>Share your travel experiences with friends and family</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Label htmlFor="public-switch" className="flex-grow">
            Make this travel log public
          </Label>
          <Switch id="public-switch" checked={isPublic} onCheckedChange={handlePrivacyChange} disabled={isUpdating} />
        </div>

        {!isPublic && (
          <div className="text-sm text-amber-600 dark:text-amber-400 mb-4">
            This travel log is private. Make it public to share with others.
          </div>
        )}

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="social" disabled={!isPublic}>
              Social Media
            </TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button size="sm" onClick={handleCopyLink}>
                {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="social" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={shareToFacebook}>
                <FacebookIcon className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" className="w-full" onClick={shareToTwitter}>
                <TwitterIcon className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" className="w-full" onClick={shareToLinkedIn}>
                <LinkedinIcon className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" className="w-full" onClick={shareByEmail}>
                <MailIcon className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

