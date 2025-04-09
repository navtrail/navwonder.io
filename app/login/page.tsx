"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAuthApiKey } from "@/lib/api-keys"

export default function LoginPage() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  useEffect(() => {
    // Check if API key exists
    const apiKey = getAuthApiKey()
    if (!apiKey) {
      setApiKeyMissing(true)
    }
  }, [])

  const handleAuthSuccess = (user: any) => {
    setIsSuccess(true)

    // Redirect to home page after successful login
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to NavTrail</h1>
        <p className="text-muted-foreground">Login or create an account to access all features</p>
      </div>

      {apiKeyMissing && (
        <Card className="mb-6 border-amber-500/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-300">Demo Mode Active</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Authentication API key is missing. The app is running in demo mode.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  You can use any email and password to log in.
                </p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30"
                    onClick={() => (window.location.href = "/api-status")}
                  >
                    Check API Status
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg text-center"
        >
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Login Successful!</h2>
          <p className="text-green-700 dark:text-green-400">Redirecting you to the dashboard...</p>
        </motion.div>
      ) : (
        <AuthForm onSuccess={handleAuthSuccess} />
      )}
    </div>
  )
}

