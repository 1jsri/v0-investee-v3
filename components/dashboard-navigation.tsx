"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Crown,
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  Menu,
  Home,
  PieChart,
  TrendingUp,
  BookOpen,
  Newspaper,
} from "lucide-react"
import Link from "next/link"

interface DashboardNavigationProps {
  user: any
  profile: any
}

export function DashboardNavigation({ user, profile }: DashboardNavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasNotifications, setHasNotifications] = useState(true)

  const isOnTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()
  const trialDaysLeft = isOnTrial
    ? Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/portfolios", label: "Portfolios", icon: PieChart },
    { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/dashboard/learn", label: "Learn Hub", icon: BookOpen },
    { href: "/dashboard/news", label: "News", icon: Newspaper },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="h-8 w-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                  Investee
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar - Enhanced with better styling */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                <Input
                  placeholder="Search assets (e.g., AAPL, MSFT)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50/80 border-slate-200 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="p-2 space-y-1">
                      {["AAPL", "MSFT", "GOOGL", "AMZN"]
                        .filter((symbol) => symbol.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((symbol) => (
                          <div key={symbol} className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer text-sm">
                            {symbol} -{" "}
                            {symbol === "AAPL" ? "Apple Inc." : symbol === "MSFT" ? "Microsoft Corp." : "Company Name"}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu and Actions - Enhanced styling */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9 p-0 hover:bg-slate-100 transition-colors">
                <Search className="h-4 w-4" />
              </Button>

              {/* Enhanced Subscription Badge */}
              <Badge
                variant={isOnTrial ? "default" : "outline"}
                className={`capitalize font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-105 ${
                  isOnTrial
                    ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 shadow-sm"
                    : profile?.subscription_tier === "professional"
                      ? "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 shadow-sm"
                      : "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200 shadow-sm"
                }`}
              >
                <span className="hidden sm:inline">{profile?.subscription_tier}</span>
                <span className="sm:hidden">{profile?.subscription_tier?.charAt(0).toUpperCase()}</span>
                {isOnTrial && <span className="hidden sm:inline"> Trial: {trialDaysLeft}d left</span>}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hidden sm:flex h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Enhanced Notification Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200 relative"
              >
                <Bell className="h-4 w-4" />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </Button>

              {/* Enhanced User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200 relative"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-lg border-slate-200">
                  <div className="px-2 py-1.5 bg-gradient-to-r from-slate-50 to-blue-50">
                    <p className="text-sm font-medium text-slate-900">{user?.email?.split("@")[0]}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-slate-50 transition-colors">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-slate-50 transition-colors">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden h-9 w-9 p-0 hover:bg-slate-100 transition-colors"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gradient-to-b from-white to-slate-50">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-8 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg text-white">
                      <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Crown className="h-5 w-5" />
                      </div>
                      <span className="text-xl font-bold">Investee</span>
                    </div>

                    <div className="space-y-2 flex-1 px-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-white hover:shadow-sm transition-all duration-200 group"
                          >
                            <Icon className="h-5 w-5 group-hover:text-slate-900 transition-colors" />
                            <span className="group-hover:text-slate-900 transition-colors">{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="border-t pt-4 space-y-2 px-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-full justify-start gap-3 hover:bg-white transition-colors"
                      >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 hover:bg-white transition-colors relative"
                      >
                        <Bell className="h-4 w-4" />
                        Notifications
                        {hasNotifications && <span className="ml-auto h-2 w-2 bg-red-500 rounded-full"></span>}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200/60 z-40 shadow-lg">
        <div className="grid grid-cols-5 gap-1 px-2 py-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center py-2 px-1 text-slate-600 hover:text-slate-900 transition-all duration-200 rounded-lg hover:bg-slate-50 group"
              >
                <Icon className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
