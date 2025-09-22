"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, X, AlertTriangle, Play, Smartphone, Monitor, Globe } from "lucide-react"

interface TestItem {
  id: string
  category: string
  description: string
  status: "pending" | "passed" | "failed"
  priority: "high" | "medium" | "low"
}

export function FinalTestingChecklist() {
  const [testItems, setTestItems] = useState<TestItem[]>([
    // Authentication & User Management
    {
      id: "auth-1",
      category: "Authentication",
      description: "User registration flow",
      status: "passed",
      priority: "high",
    },
    {
      id: "auth-2",
      category: "Authentication",
      description: "Login/logout functionality",
      status: "passed",
      priority: "high",
    },
    {
      id: "auth-3",
      category: "Authentication",
      description: "Password reset flow",
      status: "pending",
      priority: "medium",
    },

    // Portfolio Management
    {
      id: "portfolio-1",
      category: "Portfolio",
      description: "Create new portfolio",
      status: "passed",
      priority: "high",
    },
    { id: "portfolio-2", category: "Portfolio", description: "Add/remove assets", status: "passed", priority: "high" },
    {
      id: "portfolio-3",
      category: "Portfolio",
      description: "Portfolio calculations accuracy",
      status: "passed",
      priority: "high",
    },
    { id: "portfolio-4", category: "Portfolio", description: "Data persistence", status: "passed", priority: "high" },

    // AI Chat System
    {
      id: "chat-1",
      category: "AI Chat",
      description: "Chat interface functionality",
      status: "passed",
      priority: "high",
    },
    { id: "chat-2", category: "AI Chat", description: "Usage quota enforcement", status: "passed", priority: "high" },
    { id: "chat-3", category: "AI Chat", description: "Context-aware responses", status: "passed", priority: "medium" },
    { id: "chat-4", category: "AI Chat", description: "Chat history export", status: "pending", priority: "low" },

    // Subscription Management
    { id: "sub-1", category: "Subscription", description: "Plan upgrade flow", status: "passed", priority: "high" },
    {
      id: "sub-2",
      category: "Subscription",
      description: "Usage tracking accuracy",
      status: "passed",
      priority: "high",
    },
    {
      id: "sub-3",
      category: "Subscription",
      description: "Trial countdown display",
      status: "passed",
      priority: "medium",
    },
    { id: "sub-4", category: "Subscription", description: "Stripe integration", status: "pending", priority: "high" },

    // Mobile Responsiveness
    { id: "mobile-1", category: "Mobile", description: "Navigation on mobile", status: "passed", priority: "high" },
    { id: "mobile-2", category: "Mobile", description: "Table to card conversion", status: "passed", priority: "high" },
    { id: "mobile-3", category: "Mobile", description: "Touch interactions", status: "passed", priority: "medium" },
    { id: "mobile-4", category: "Mobile", description: "Bottom navigation", status: "passed", priority: "medium" },

    // Performance & Loading
    {
      id: "perf-1",
      category: "Performance",
      description: "Loading states display",
      status: "passed",
      priority: "medium",
    },
    { id: "perf-2", category: "Performance", description: "Error handling", status: "pending", priority: "high" },
    { id: "perf-3", category: "Performance", description: "API response times", status: "pending", priority: "medium" },
    { id: "perf-4", category: "Performance", description: "Image optimization", status: "passed", priority: "low" },

    // Data & API Integration
    { id: "api-1", category: "API", description: "Real-time stock data", status: "pending", priority: "high" },
    { id: "api-2", category: "API", description: "News feed updates", status: "pending", priority: "medium" },
    { id: "api-3", category: "API", description: "Database operations", status: "passed", priority: "high" },
    { id: "api-4", category: "API", description: "Error handling & fallbacks", status: "pending", priority: "high" },
  ])

  const toggleTestStatus = (id: string) => {
    setTestItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const statusOrder = ["pending", "passed", "failed"]
          const currentIndex = statusOrder.indexOf(item.status)
          const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length] as TestItem["status"]
          return { ...item, status: nextStatus }
        }
        return item
      }),
    )
  }

  const runAllTests = () => {
    // Simulate running all tests
    setTestItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: Math.random() > 0.2 ? "passed" : "failed",
      })),
    )
  }

  const categories = [...new Set(testItems.map((item) => item.category))]
  const totalTests = testItems.length
  const passedTests = testItems.filter((item) => item.status === "passed").length
  const failedTests = testItems.filter((item) => item.status === "failed").length
  const pendingTests = testItems.filter((item) => item.status === "pending").length

  const getStatusIcon = (status: TestItem["status"]) => {
    switch (status) {
      case "passed":
        return <Check className="h-4 w-4 text-green-600" />
      case "failed":
        return <X className="h-4 w-4 text-red-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
    }
  }

  const getStatusColor = (status: TestItem["status"]) => {
    switch (status) {
      case "passed":
        return "text-green-600 bg-green-50 border-green-200"
      case "failed":
        return "text-red-600 bg-red-50 border-red-200"
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200"
    }
  }

  const getPriorityColor = (priority: TestItem["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-amber-600 bg-amber-50"
      case "low":
        return "text-slate-600 bg-slate-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Testing Overview
            </CardTitle>
            <Button onClick={runAllTests} className="gap-2">
              <Play className="h-4 w-4" />
              Run All Tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{totalTests}</div>
              <div className="text-sm text-slate-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-slate-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-slate-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{pendingTests}</div>
              <div className="text-sm text-slate-600">Pending</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round((passedTests / totalTests) * 100)}%</span>
            </div>
            <Progress value={(passedTests / totalTests) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Test Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => {
          const categoryTests = testItems.filter((item) => item.category === category)
          const categoryPassed = categoryTests.filter((item) => item.status === "passed").length
          const categoryProgress = (categoryPassed / categoryTests.length) * 100

          return (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <Badge variant="outline">
                    {categoryPassed}/{categoryTests.length}
                  </Badge>
                </div>
                <Progress value={categoryProgress} className="h-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoryTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleTestStatus(test.id)}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <span className="text-sm">{test.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(test.priority)}`}>
                          {test.priority}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(test.status)}`}>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Device Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Device & Browser Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <h3 className="font-semibold mb-1">Desktop</h3>
              <p className="text-sm text-slate-600">Chrome, Firefox, Safari</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Tested</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <h3 className="font-semibold mb-1">Mobile</h3>
              <p className="text-sm text-slate-600">iOS Safari, Android Chrome</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Tested</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Globe className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <h3 className="font-semibold mb-1">Cross-Browser</h3>
              <p className="text-sm text-slate-600">Edge, Opera compatibility</p>
              <Badge className="mt-2 bg-amber-100 text-amber-800">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
