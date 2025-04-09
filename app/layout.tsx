import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { TabBar } from "@/components/tab-bar"
import { ErrorBoundary } from "@/components/error-boundary"
import { cn } from "@/lib/utils"
import "@/app/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NavTrail - Your Indian Travel Companion",
  description: "AI-powered navigation and trip-planning companion for exploring India",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV = {
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}",
                NEXT_PUBLIC_CURRENCY_API_KEY: "${process.env.NEXT_PUBLIC_CURRENCY_API_KEY || ""}",
                NEXT_PUBLIC_AUTH_API_KEY: "${process.env.NEXT_PUBLIC_AUTH_API_KEY || ""}",
                NEXT_PUBLIC_WEATHER_API_KEY: "${process.env.NEXT_PUBLIC_WEATHER_API_KEY || ""}",
                NEXT_PUBLIC_CESIUM_ION_TOKEN: "${process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || ""}",
                NEXT_PUBLIC_OPENROUTE_API_KEY: "${process.env.NEXT_PUBLIC_OPENROUTE_API_KEY || ""}"
              };
            `,
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <TabBar />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'