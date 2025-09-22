"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, Crown, Zap, Star } from "lucide-react"

interface UserEntitlement {
  user_id: string
  plan_id: string
  effective_status: string
  monthly_chat_quota: number | null
  prompts_used: number | null
  prompts_remaining: number | null
  trial_days_remaining: number
  email?: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserEntitlement[]>([])
  const [viewAsMode, setViewAsMode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("v_user_entitlements")
        .select(`
          *,
          auth_users:user_id (
            email
          )
        `)
        .order("plan_id", { ascending: false })

      if (error) throw error

      // Transform data to include email
      const usersWithEmail =
        data?.map((user) => ({
          ...user,
          email: user.auth_users?.email || "No email",
        })) || []

      setUsers(usersWithEmail)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewAs = (planId: string) => {
    setViewAsMode(planId)
    // Store in localStorage for other components to read
    localStorage.setItem("admin_view_as", planId)
    // Redirect to dashboard to see the view
    window.location.href = "/dashboard"
  }

  const clearViewAs = () => {
    setViewAsMode(null)
    localStorage.removeItem("admin_view_as")
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return Star
      case "casual":
        return Zap
      case "pro":
        return Crown
      default:
        return Users
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free":
        return "bg-gray-100 text-gray-800"
      case "casual":
        return "bg-blue-100 text-blue-800"
      case "pro":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-4">Admin Dashboard</h1>

        {viewAsMode && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-800">
                Currently viewing as: <strong>{viewAsMode}</strong> user
              </span>
              <Button onClick={clearViewAs} variant="outline" size="sm">
                Exit View As Mode
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.effective_status === "trialing").length}</p>
                <p className="text-gray-600">Active Trials</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.plan_id === "pro").length}</p>
                <p className="text-gray-600">Pro Users</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Demo View As User Type</h2>
          <div className="flex gap-4">
            <Button onClick={() => handleViewAs("free")} variant="outline">
              <Star className="h-4 w-4 mr-2" />
              View as Free User
            </Button>
            <Button onClick={() => handleViewAs("casual")} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              View as Casual User
            </Button>
            <Button onClick={() => handleViewAs("pro")} variant="outline">
              <Crown className="h-4 w-4 mr-2" />
              View as Pro User
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">User Management</h2>

        {users.map((user) => {
          const PlanIcon = getPlanIcon(user.plan_id)

          return (
            <Card key={user.user_id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <PlanIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-gray-600">ID: {user.user_id.slice(0, 8)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className={getPlanColor(user.plan_id)}>{user.plan_id.toUpperCase()}</Badge>

                  {user.effective_status === "trialing" && (
                    <Badge variant="outline">Trial: {user.trial_days_remaining} days left</Badge>
                  )}

                  {user.monthly_chat_quota && (
                    <div className="text-sm text-gray-600">
                      Chat: {user.prompts_used || 0}/{user.monthly_chat_quota}
                    </div>
                  )}

                  <Button onClick={() => handleViewAs(user.plan_id)} variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View As
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
