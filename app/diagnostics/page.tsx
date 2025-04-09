"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { testAllApis, checkBrowserCapabilities } from "@/lib/test-utils"
import { hasApiKey } from "@/lib/api-keys"

export default function DiagnosticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [apiResults, setApiResults] = useState<any>(null)
  const [browserCapabilities, setBrowserCapabilities] = useState<any>(null)
  const [missingApiKeys, setMissingApiKeys] = useState<string[]>([])
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    const runDiagnostics = async () => {
      setIsLoading(true)

      // Check for missing API keys
      const missing: string[] = []
      if (!hasApiKey("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")) missing.push("Google Maps API")
      if (!hasApiKey("NEXT_PUBLIC_WEATHER_API_KEY")) missing.push("Weather API")
      if (!hasApiKey("NEXT_PUBLIC_CURRENCY_API_KEY")) missing.push("Currency API")
      if (!hasApiKey("NEXT_PUBLIC_AUTH_API_KEY")) missing.push("Auth API")
      setMissingApiKeys(missing)

      // Check browser capabilities
      const capabilities = checkBrowserCapabilities()
      setBrowserCapabilities(capabilities)

      // Test APIs
      const results = await testAllApis()
      setApiResults(results)

      setIsLoading(false)
    }

    runDiagnostics()
  }, [])

  const handleRunTests = async () => {
    setIsTesting(true)
    const results = await testAllApis()
    setApiResults(results)
    setIsTesting(false)
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">System Diagnostics</h1>
        <p className="text-muted-foreground mb-6">Running system checks...</p>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">System Diagnostics</h1>
      <p className="text-muted-foreground mb-6">Check the status of your system and API connections</p>

      {missingApiKeys.length > 0 && (
        <Card className="mb-6 border-amber-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Missing API Keys
            </CardTitle>
            <CardDescription>Some API keys are missing. The app will use mock data for these services.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {missingApiKeys.map((key) => (
                <li key={key} className="text-amber-700 dark:text-amber-400">
                  {key}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => (window.location.href = "/api-status")}>
              View API Status
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="apis">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="apis">API Status</TabsTrigger>
          <TabsTrigger value="browser">Browser Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Connectivity Tests</CardTitle>
              <CardDescription>Testing connectivity to backend services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiResults &&
                  Object.entries(apiResults).map(([api, result]: [string, any]) => (
                    <div key={api} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{api} API</h3>
                        {result.success ? (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Working
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600 dark:text-red-400">
                            <XCircle className="h-4 w-4 mr-1" />
                            Failed
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.data && (
                        <div className="mt-2 p-2 bg-muted rounded-md text-xs font-mono overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRunTests} disabled={isTesting}>
                {isTesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Tests Again
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="browser" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Browser Capabilities</CardTitle>
              <CardDescription>Checking browser features required by the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {browserCapabilities &&
                  Object.entries(browserCapabilities).map(([capability, supported]: [string, any]) => (
                    <div key={capability} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium capitalize">{capability.replace(/([A-Z])/g, " $1")}</h3>
                        {supported ? (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Supported
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600 dark:text-red-400">
                            <XCircle className="h-4 w-4 mr-1" />
                            Not Supported
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {supported
                          ? `Your browser supports ${capability.replace(/([A-Z])/g, " $1").toLowerCase()}.`
                          : `Your browser does not support ${capability.replace(/([A-Z])/g, " $1").toLowerCase()}. Some features may not work properly.`}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>If APIs are failing, check your API keys in the .env.local file</li>
              <li>For browser capability issues, try updating your browser to the latest version</li>
              <li>Clear your browser cache and cookies if you're experiencing unexpected behavior</li>
              <li>Check your internet connection if multiple APIs are failing</li>
              <li>Disable browser extensions that might be interfering with the application</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => window.location.reload()}>Refresh Diagnostics</Button>
      </div>
    </div>
  )
}

