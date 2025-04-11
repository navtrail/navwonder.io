"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  Search,
  User,
  Route,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Map,
  Compass,
  Hotel,
  Package,
  Download,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import useMobile from "@/hooks/use-mobile"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(3)
  const isMobile = useMobile()

  const handleLogout = () => {
    alert("Logging out...")
    // Implement actual logout logic
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  }

  const menuItems = [
    { href: "/map", icon: <Map className="h-5 w-5" />, label: "Map" },
    { href: "/search", icon: <Search className="h-5 w-5" />, label: "Search" },
    { href: "/routes", icon: <Route className="h-5 w-5" />, label: "Routes" },
    { href: "/navigation", icon: <Compass className="h-5 w-5" />, label: "Navigation" },
    { href: "/hotel-restaurant-discovery", icon: <Hotel className="h-5 w-5" />, label: "Discover" },
    { href: "/travel-packages", icon: <Package className="h-5 w-5" />, label: "Packages" },
    { href: "/offline-maps", icon: <Download className="h-5 w-5" />, label: "Offline Maps" },
    { href: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
  ]

  return (
    <>
      <AnimatePresence>
        {isMobile && (
          <motion.button
            className="fixed left-4 top-20 z-50 md:hidden rounded-full p-2 bg-primary text-primary-foreground shadow-md"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-col items-center space-y-2 py-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User Profile" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">Sattu</h3>
            <p className="text-sm text-muted-foreground">Traveler | Explorer</p>
          </div>

          <nav className="flex-1 space-y-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href ? "bg-muted" : "hover:bg-muted"
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="space-y-2 py-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              {notifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Link href="/settings" passHref>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

