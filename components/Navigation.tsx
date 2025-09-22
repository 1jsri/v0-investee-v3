"use client"
import Link from "next/link"
import { Crown, Search, Bell, User, Menu, Sun, Moon, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export default function Navigation() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

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
            {/* Search Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {/* Trial Badge */}
            <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              Casual Trial: 3d left
            </div>

            {/* Theme Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 rounded-lg">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Menu */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="border-t py-2">
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
          </div>
        )}
      </div>
    </nav>
  )
}
