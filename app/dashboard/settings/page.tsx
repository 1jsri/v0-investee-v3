"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UsageAnalyticsDashboard } from "@/components/usage-analytics-dashboard"
import { SubscriptionUpgradeModal } from "@/components/subscription-upgrade-modal"
import { User, Bell, Shield, Download, Trash2, Crown } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dividendAlerts: true,
    marketUpdates: false,
    weeklyReports: true,
    darkMode: false,
    autoExport: false,
  })

  const [usageData] = useState({
    assetsUsed: 3,
    assetsLimit: 50,
    chatUsed: 12,
    chatLimit: 50,
    monthlyUsage: [
      { month: "Oct", assets: 2, chats: 8 },
      { month: "Nov", assets: 3, chats: 15 },
      { month: "Dec", assets: 3, chats: 12 },
    ],
  })

  useEffect(() => {
    const userEmail = localStorage.getItem("user_email")
    if (userEmail) {
      setUser({ email: userEmail })
      setProfile({
        email: userEmail,
        subscription_tier: "casual",
        trial_ends_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    setIsLoading(false)
  }, [])

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleExportData = () => {
    // Mock data export
    const data = {
      portfolios: [],
      settings: settings,
      usage: usageData,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `investee-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-2">Manage your account preferences and subscription</p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={user?.email || ""} disabled />
                    </div>
                    <div>
                      <Label htmlFor="plan">Current Plan</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {profile?.subscription_tier}
                        </Badge>
                        <Button size="sm" onClick={() => setShowUpgradeModal(true)}>
                          <Crown className="h-4 w-4 mr-1" />
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <Switch
                      id="darkMode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive general updates via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dividendAlerts">Dividend Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about upcoming dividend payments</p>
                      </div>
                      <Switch
                        id="dividendAlerts"
                        checked={settings.dividendAlerts}
                        onCheckedChange={(checked) => handleSettingChange("dividendAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketUpdates">Market Updates</Label>
                        <p className="text-sm text-muted-foreground">Daily market summaries and news</p>
                      </div>
                      <Switch
                        id="marketUpdates"
                        checked={settings.marketUpdates}
                        onCheckedChange={(checked) => handleSettingChange("marketUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Weekly portfolio performance summaries</p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <UsageAnalyticsDashboard
                profile={profile}
                usageData={usageData}
                onUpgrade={() => setShowUpgradeModal(true)}
              />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoExport">Auto Export Data</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup your data monthly</p>
                      </div>
                      <Switch
                        id="autoExport"
                        checked={settings.autoExport}
                        onCheckedChange={(checked) => handleSettingChange("autoExport", checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Data Management</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportData}>
                          <Download className="h-4 w-4 mr-2" />
                          Export My Data
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SubscriptionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={profile?.subscription_tier || "free"}
        usageData={usageData}
        triggerReason="trial_ending"
      />
    </div>
  )
}
