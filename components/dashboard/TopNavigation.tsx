"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, Crown, Star, Users } from "lucide-react"

interface Profile {
  email: string
  subscription_tier: "free" | "casual" | "professional"
  trial_ends_at?: string
}

interface TopNavigationProps {
  user: { email: string }
  profile: Profile
}

export function TopNavigation({ user, profile }: TopNavigationProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Portfolios", href: "/dashboard/portfolios" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Learn Hub", href: "/dashboard/learn" },
    { name: "News", href: "/dashboard/news" },
  ]

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "professional":
        return <Crown className="h-4 w-4" />
      case "casual":
        return <Star className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "professional":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
      case "casual":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="font-bold text-xl text-slate-900">Investee</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and User Info */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search assets..."
                className="pl-10 w-64 h-9 bg-slate-50 border-slate-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Badge className={`${getTierColor(profile.subscription_tier)} border-0 px-3 py-1 text-xs font-medium`}>
              {getTierIcon(profile.subscription_tier)}
              <span className="ml-1 capitalize">Demo Mode</span>
            </Badge>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="px-2">
                    <Input
                      type="search"
                      placeholder="Search assets..."
                      className="w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
