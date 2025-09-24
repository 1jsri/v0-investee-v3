import type React from "react"
import { UnifiedNavigation } from "@/components/unified-navigation"
import { FloatingChatButton } from "@/components/floating-chat-button"

interface Profile {
  email: string
  subscription_tier: "free" | "casual" | "professional"
  trial_ends_at?: string
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = { email: "demo@investee.com" }
  const profile: Profile = {
    email: "demo@investee.com",
    subscription_tier: "free",
    trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation user={user} profile={profile} />
      <main className="w-full">{children}</main>
      <FloatingChatButton />
    </div>
  )
}
