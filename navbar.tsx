import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { MapIcon, CloudIcon, CurrencyIcon, MessageSquareIcon, BookOpenIcon, MenuIcon, CompassIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isMobile?: boolean
}

function NavItem({ href, icon, label, isMobile = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isMobile ? "w-full" : "hidden md:flex",
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">NavTrail</span>
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          <NavItem href="/map" icon={<MapIcon className="h-4 w-4" />} label="Map" />
          <NavItem href="/weather" icon={<CloudIcon className="h-4 w-4" />} label="Weather" />
          <NavItem href="/currency" icon={<CurrencyIcon className="h-4 w-4" />} label="Currency" />
          <NavItem href="/ai-assistant" icon={<MessageSquareIcon className="h-4 w-4" />} label="AI Assistant" />
          <NavItem href="/travel-logs" icon={<BookOpenIcon className="h-4 w-4" />} label="Travel Logs" />
          <NavItem href="/travel-insights" icon={<CompassIcon className="h-4 w-4" />} label="Insights" />
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <ApiStatusIndicator />
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-2 mt-6">
                <NavItem href="/map" icon={<MapIcon className="h-4 w-4" />} label="Map" isMobile />
                <NavItem href="/weather" icon={<CloudIcon className="h-4 w-4" />} label="Weather" isMobile />
                <NavItem href="/currency" icon={<CurrencyIcon className="h-4 w-4" />} label="Currency" isMobile />
                <NavItem
                  href="/ai-assistant"
                  icon={<MessageSquareIcon className="h-4 w-4" />}
                  label="AI Assistant"
                  isMobile
                />
                <NavItem href="/travel-logs" icon={<BookOpenIcon className="h-4 w-4" />} label="Travel Logs" isMobile />
                <NavItem href="/travel-insights" icon={<CompassIcon className="h-4 w-4" />} label="Insights" isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

