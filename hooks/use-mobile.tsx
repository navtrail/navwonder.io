"use client"

import { useState, useEffect } from "react"

// Export both as named export and default export to support both import styles
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if viewport width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the standard md breakpoint in Tailwind
    }

    // Check on initial load
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Default export for import statements like: import useMobile from "@/hooks/use-mobile"
export default useMobile

