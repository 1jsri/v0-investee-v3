"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, User, Settings, LogOut, Bell, Menu } from "lucide-react"

interface Profile {
  email: string
  subscription_tier: "free" | "casual" | "professional"
  trial_ends_at?: string
}

interface UnifiedNavigationProps {
  user: { email: string }
  profile: Profile
}

export function UnifiedNavigation({ user, profile }: UnifiedNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const supabase = createClient()

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Portfolios", href: "/dashboard/portfolios" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Learn Hub", href: "/dashboard/learn" },
    { name: "News", href: "/dashboard/news" },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isOnTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()
  const trialDaysLeft = isOnTrial
    ? Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <nav className="sticky top-0 z-nav w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors">Investee</span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-slate-100 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Actions and User Menu */}
          <div className="flex items-center gap-3">
            {/* Trial Badge */}
            <Badge className="hidden sm:flex bg-amber-100 text-amber-800 border-amber-200 px-3 py-1 text-xs font-medium">
              Casual Trial: {trialDaysLeft}d left
            </Badge>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="hidden sm:flex h-10 w-10 p-0 hover:bg-slate-100 relative transition-colors rounded-lg">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100">
                  <User className="h-4 w-4" />
                </Button>
                  className="hidden sm:flex h-10 w-10 p-0 hover:bg-slate-100 transition-colors rounded-lg"
              <DropdownMenuContent align="end" className="w-56 shadow-xl border-slate-200 bg-white">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{user.email.split("@")[0]}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                <DropdownMenuItem className="hover:bg-slate-50 transition-colors px-3 py-2">
                    className="lg:hidden h-10 w-10 p-0 hover:bg-slate-100 transition-colors rounded-lg"
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                <DropdownMenuItem className="hover:bg-slate-50 transition-colors px-3 py-2">
                    Settings
                <SheetContent side="right" className="w-80 bg-white">
                  <div className="flex flex-col h-full pt-6">
                    <div className="flex items-center gap-3 mb-8 p-4 bg-slate-900 rounded-xl text-white">
                      <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                      <div>
                        <div className="text-lg font-bold">Investee</div>
                        <div className="text-xs text-slate-300">{user?.email}</div>
                      </div>
              </DropdownMenuContent>
            </DropdownMenu>
                    <div className="space-y-2 flex-1">
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-sm font-medium text-amber-800">Casual Trial: {trialDaysLeft}d left</div>
                      </div>
                      
            {/* Mobile Menu */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                              pathname === item.href 
                                ? "bg-slate-100 text-slate-900 shadow-sm" 
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                <div className="flex flex-col space-y-4 mt-4">
                            <Icon className="h-5 w-5 transition-colors" />
                            <span className="font-medium">{item.label}</span>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setShowMobileMenu(false)}
                    <div className="border-t border-slate-200 pt-4 space-y-2">
                          pathname === item.href
                            ? "bg-slate-100 text-slate-900"
                        className="w-full justify-start gap-3 hover:bg-slate-50 transition-colors text-slate-700"
                        asChild
                      >
                        {item.name}
                      </Link>
                    ))}
                        <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}>
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                  {/* Mobile Actions */}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        onClick={handleSignOut}
                        className="w-full justify-start gap-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                      Notifications
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
