"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Calculator, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Full Disclaimer", href: "/disclaimer" },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">Investee</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              >
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-black">Investee</span>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => {
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 text-sm font-medium transition-colors hover:text-black p-2 rounded-md",
                          pathname === item.href
                            ? "text-black bg-gray-100 font-semibold"
                            : "text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-black mb-3">Legal</h4>
                  <div className="flex flex-col space-y-2">
                    {legalLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-gray-600 hover:text-black transition-colors p-2 rounded-md hover:bg-gray-50"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600 p-2">
                    <Shield className="h-3 w-3" />
                    <span>For informational purposes only</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
