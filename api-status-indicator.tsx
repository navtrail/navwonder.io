"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { hasApiKey } from "@/lib/api-keys"

export function ApiStatusIndicator() {
  const [missingKeys, setMissingKeys] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for missing API keys
    const missing: string[] = []
    if (!hasApiKey("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")) missing.push("Maps")
    if (!hasApiKey("NEXT_PUBLIC_WEATHER_API_KEY")) missing.push("Weather")
    if (!hasApiKey("NEXT_PUBLIC_CURRENCY_API_KEY")) missing.push("Currency")
    if (!hasApiKey("NEXT_PUBLIC_AUTH_API_KEY")) missing.push("Auth")
    if (!hasApiKey("NEXT_PUBLIC_CESIUM_ION_TOKEN")) missing.push("Cesium")

    setMissingKeys(missing)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null
  }

  if (missingKeys.length === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/api-status">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                All APIs Connected
              </Badge>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>All API keys are properly configured</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/api-status">
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/30"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {missingKeys.length} API{missingKeys.length > 1 ? "s" : ""} Missing
            </Badge>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Missing API keys: {missingKeys.join(", ")}</p>
          <p className="text-xs mt-1">Click to view API status</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

