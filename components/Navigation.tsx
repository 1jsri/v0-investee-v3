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
    <nav className="sticky top-0 z-nav border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="font-bold text-xl text-slate-900 hover:text-slate-700 transition-colors">
              Investee
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Trial Badge - only show for authenticated users */}
                    <div className="hidden sm:block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200">
                      Casual Trial: 3d left
                    </div>

                    {/* Notifications */}
                    <button className="hidden sm:block p-2 hover:bg-slate-100 rounded-lg relative transition-colors">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="hidden sm:block p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <User className="w-5 h-5" />
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-dropdown">
                          <div className="p-2">
                            <div className="px-3 py-2 border-b border-slate-100 mb-2">
                              <p className="text-sm font-medium text-slate-900">{user.email?.split("@")[0]}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Settings
                          </Link>
                          <div className="border-t border-slate-100 my-2"></div>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-600 hover:text-red-700 w-full text-left rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center gap-3">
                      <Link href="/login">
                        <Button variant="outline" size="sm" className="btn-sm-secondary">
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button size="sm" className="btn-sm-primary">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-slate-100 rounded-lg h-10 w-10 flex items-center justify-center transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
            <div className="py-4 px-4 space-y-1">
            {user ? (
              <>
                <div className="pb-3 mb-3 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">{user.email?.split("@")[0]}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <div className="mt-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium inline-block">
                    Casual Trial: 3d left
                  </div>
                </div>
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/dashboard/portfolios" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  Portfolios
                </Link>
                <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  Analytics
                </Link>
                <Link href="/dashboard/learn" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  Learn Hub
                </Link>
                <Link href="/dashboard/news" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  News
                </Link>
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    Settings
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-3 hover:bg-red-50 text-red-600 hover:text-red-700 w-full text-left rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                  Sign Out
                  </button>
                </div>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="flex items-center gap-3 px-3 py-3 hover:bg-slate-100 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}