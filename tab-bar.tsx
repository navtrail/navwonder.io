"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapIcon, CloudIcon, CurrencyIcon, MessageSquareIcon, BookOpenIcon, HomeIcon, CompassIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function TabItem({ href, icon, label, isActive }: TabItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center h-full w-full text-xs font-medium",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  )
}

export function TabBar() {
  const pathname = usePathname()

  const tabs = [
    {
      href: "/",
      icon: <HomeIcon className="h-5 w-5" />,
      label: "Home",
      pattern: /^\/$/, // Exact match for home
    },
    {
      href: "/map",
      icon: <MapIcon className="h-5 w-5" />,
      label: "Map",
      pattern: /^\/map/,
    },
    {
      href: "/weather",
      icon: <CloudIcon className="h-5 w-5" />,
      label: "Weather",
      pattern: /^\/weather/,
    },
    {
      href: "/currency",
      icon: <CurrencyIcon className="h-5 w-5" />,
      label: "Currency",
      pattern: /^\/currency/,
    },
    {
      href: "/ai-assistant",
      icon: <MessageSquareIcon className="h-5 w-5" />,
      label: "Assistant",
      pattern: /^\/ai-assistant/,
    },
    {
      href: "/travel-logs",
      icon: <BookOpenIcon className="h-5 w-5" />,
      label: "Logs",
      pattern: /^\/travel-logs/,
    },
    {
      href: "/travel-insights",
      icon: <CompassIcon className="h-5 w-5" />,
      label: "Insights",
      pattern: /^\/travel-insights/,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background md:hidden">
      <div className="grid h-full grid-cols-7">
        {tabs.map((tab) => (
          <TabItem
            key={tab.href}
            href={tab.href}
            icon={tab.icon}
            label={tab.label}
            isActive={tab.pattern.test(pathname)}
          />
        ))}
      </div>
    </div>
  )
}

