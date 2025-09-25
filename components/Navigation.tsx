"use client"

import Link from "next/link"
import { Crown, Bell, User, Menu, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const [isDashboard, setIsDashboard] = useState(false)

  useEffect(() => {
    setIsDashboard(pathname?.startsWith("/dashboard") || false)
  }, [pathname])

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (isDashboard) {
    return null
  }

  return (
    <nav className="border-b bg-white">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black rounded">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="font-bold text-xl">
              Investee
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Trial Badge - only show for authenticated users */}
                    <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      Casual Trial: 3d left
                    </div>

                    {/* Notifications */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <User className="w-5 h-5" />
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          >
                            {/* Settings Icon */}
                            <span className="w-4 h-4"></span>
                            Settings
                          </Link>
                          <hr className="my-1" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Login and Signup buttons for unauthenticated users */}
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Hamburger Menu */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="border-t py-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/dashboard/portfolios" className="block px-4 py-2 hover:bg-gray-100">
                  Portfolios
                </Link>
                <Link href="/dashboard/analytics" className="block px-4 py-2 hover:bg-gray-100">
                  Analytics
                </Link>
                <Link href="/dashboard/learn" className="block px-4 py-2 hover:bg-gray-100">
                  Learn Hub
                </Link>
                <Link href="/dashboard/news" className="block px-4 py-2 hover:bg-gray-100">
                  News
                </Link>
                <button onClick={handleSignOut} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">
                  Log In
                </Link>
                <Link href="/signup" className="block px-4 py-2 hover:bg-gray-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
