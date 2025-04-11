import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapIcon, CloudIcon, CurrencyIcon, MessageSquareIcon, BookOpenIcon, CompassIcon } from "lucide-react"
import Link from "next/link"
import { ApiStatusIndicator } from "./api-status-indicator"
import { getPublicTravelLogs } from "@/lib/travel-log-service"
import { TravelLogCard } from "@/components/travel-log/travel-log-card"

export function HomeScreen() {
  // Generate sample logs for demo purposes
  const featuredLogs = getPublicTravelLogs(3)

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to NavTrail</h1>
          <p className="text-muted-foreground">Your AI-powered travel companion for exploring India</p>
        </div>
        <ApiStatusIndicator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/map">
          <Card className="h-full hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapIcon className="h-5 w-5 mr-2 text-primary" />
                Interactive Map
              </CardTitle>
              <CardDescription>Explore locations and plan routes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Navigate through India with our interactive map. Find places, get directions, and discover new
                destinations.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                Open Map
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/weather">
          <Card className="h-full hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudIcon className="h-5 w-5 mr-2 text-primary" />
                Weather
              </CardTitle>
              <CardDescription>Check weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Get current weather and forecasts for any location in India. Plan your trips with accurate weather
                information.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                Check Weather
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/currency">
          <Card className="h-full hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrencyIcon className="h-5 w-5 mr-2 text-primary" />
                Currency
              </CardTitle>
              <CardDescription>Convert currencies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Convert between Indian Rupees and other currencies. Get the latest exchange rates for your travel
                budget.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                Convert Currency
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/ai-assistant">
          <Card className="h-full hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquareIcon className="h-5 w-5 mr-2 text-primary" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get personalized travel advice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Chat with our AI travel assistant to get personalized recommendations, itineraries, and answers to your
                travel questions.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                Chat Now
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/travel-logs">
          <Card className="h-full hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2 text-primary" />
                Travel Logs
              </CardTitle>
              <CardDescription>Document your journeys</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Create beautiful travel logs to document your adventures. Add photos, journal entries, and track your
                journey across India.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View Logs
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/explore">
          <Card className="h-full hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CompassIcon className="h-5 w-5 mr-2 text-primary" />
                Explore
              </CardTitle>
              <CardDescription>Discover new destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Explore popular destinations, hidden gems, and curated travel guides for your next adventure in India.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                Start Exploring
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>

      {/* Featured Travel Logs */}
      {featuredLogs.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Featured Travel Logs</h2>
            <Link href="/travel-logs">
              <Button variant="link">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLogs.map((log) => (
              <TravelLogCard key={log.id} log={log} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

