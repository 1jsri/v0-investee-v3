"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PieChart, BarChart3, MessageCircle, Settings, BookOpen, Users, Download } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Portfolios",
    href: "/dashboard/portfolios",
    icon: PieChart,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
    badge: "Beta",
  },
  {
    title: "Learn Hub",
    href: "/dashboard/learn",
    icon: BookOpen,
    badge: "Coming Soon",
  },
  {
    title: "Sample Portfolios",
    href: "/dashboard/samples",
    icon: Users,
    badge: "Coming Soon",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: Download,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Investee</h2>
        <p className="text-sm text-slate-600">Dividend Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-slate-100 text-slate-900")}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {item.badge && (
                  <span className="ml-auto text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">{item.badge}</span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
