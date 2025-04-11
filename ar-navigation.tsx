"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Compass, MapIcon as Map3D, X, Navigation, RotateCcw, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface ARNavigationProps {
  destination?: string
  onSwitchToMap?: () => void
  className?: string
}

export function ARNavigation({ destination, onSwitchToMap, className }: ARNavigationProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [heading, setHeading] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [nextDirection, setNextDirection] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Mock navigation data - in a real app, this would come from a navigation API
  const mockNavigationData = {
    distance: "250m",
    nextDirection: "Turn right in 50m onto Main Street",
    heading: 45, // degrees
  }

  useEffect(() => {
    // Request camera permission
    const setupCamera = async () => {
      try {
        setIsLoading(true)
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasPermission(true)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setHasPermission(false)
        toast({
          title: "Camera access denied",
          description: "AR navigation requires camera access to function properly.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    setupCamera()

    // Set up device orientation for compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // @ts-ignore - alpha exists but TypeScript doesn't recognize it
      const alpha = event.alpha || 0
      setHeading(alpha)
    }

    // Check if DeviceOrientationEvent is available and request permission if needed
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore - requestPermission exists in some browsers
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ requires permission
      // @ts-ignore
      DeviceOrientationEvent.requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation)
          } else {
            toast({
              title: "Orientation access denied",
              description: "AR navigation requires orientation access for compass functionality.",
              variant: "destructive",
            })
          }
        })
        .catch(console.error)
    } else {
      // Non iOS or older iOS
      window.addEventListener("deviceorientation", handleOrientation)
    }

    // Mock navigation data
    setDistance(250)
    setNextDirection("Turn right in 50m onto Main Street")

    // Cleanup
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [toast])

  // Draw AR overlay on canvas
  useEffect(() => {
    if (!canvasRef.current || !hasPermission) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawAROverlay = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas dimensions to match video
      if (videoRef.current) {
        canvas.width = videoRef.current.clientWidth
        canvas.height = videoRef.current.clientHeight
      }

      // Draw direction arrow
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 - 100
      const arrowSize = 50

      ctx.save()
      ctx.translate(centerX, centerY)

      // Rotate based on heading if available
      if (heading !== null) {
        ctx.rotate((heading * Math.PI) / 180)
      }

      // Draw arrow
      ctx.beginPath()
      ctx.moveTo(0, -arrowSize)
      ctx.lineTo(arrowSize / 2, arrowSize)
      ctx.lineTo(-arrowSize / 2, arrowSize)
      ctx.closePath()
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)" // blue-500 with opacity
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // Draw destination info
      if (destination) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(10, 10, canvas.width - 20, 60)
        ctx.fillStyle = "white"
        ctx.font = "bold 16px sans-serif"
        ctx.fillText(`Destination: ${destination}`, 20, 35)

        if (distance !== null) {
          ctx.fillText(`Distance: ${distance}m`, 20, 60)
        }
      }

      // Draw next direction
      if (nextDirection) {
        const y = canvas.height - 80
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(10, y, canvas.width - 20, 60)
        ctx.fillStyle = "white"
        ctx.font = "bold 16px sans-serif"
        ctx.fillText(nextDirection, 20, y + 25)
      }

      // Request next animation frame
      requestAnimationFrame(drawAROverlay)
    }

    // Start animation
    const animationId = requestAnimationFrame(drawAROverlay)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [hasPermission, heading, destination, distance, nextDirection])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-[calc(100vh-3.5rem)] ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (hasPermission === false) {
    return (
      <div className={`container py-8 ${className}`}>
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Camera access required</AlertTitle>
          <AlertDescription>
            AR navigation requires camera access. Please enable camera permissions in your browser settings and reload
            the page.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={onSwitchToMap}>
            <Map3D className="mr-2 h-4 w-4" />
            Switch to Map View
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-[calc(100vh-3.5rem)] ${className}`}>
      {/* Camera feed */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-0" />

      {/* AR overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* UI controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
        <Button variant="secondary" size="sm" onClick={onSwitchToMap}>
          <Map3D className="mr-2 h-4 w-4" />
          Map View
        </Button>

        <Badge variant="secondary" className="flex items-center">
          <Compass className="mr-1 h-4 w-4" />
          {heading !== null ? `${Math.round(heading)}°` : "No compass data"}
        </Badge>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-center z-20">
        <Card>
          <CardContent className="p-4 flex gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Recalibrate
            </Button>
            <Button variant="outline" size="sm">
              <Navigation className="mr-2 h-4 w-4" />
              Directions
            </Button>
            <Button variant="destructive" size="sm" onClick={onSwitchToMap}>
              <X className="mr-2 h-4 w-4" />
              Exit AR
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

