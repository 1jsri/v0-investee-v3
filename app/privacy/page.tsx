import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Database, Lock, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Local Storage Data</h3>
              <p className="text-muted-foreground">
                We store your portfolio data locally in your browser using localStorage. This includes:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Portfolio names and descriptions</li>
                <li>Selected assets and investment amounts</li>
                <li>User preferences and settings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Personal Information</h3>
              <p className="text-muted-foreground">
                We do not collect, store, or process any personal information such as names, email addresses, or
                financial account details.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              How We Use Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Portfolio Management</h3>
              <p className="text-muted-foreground">
                Your locally stored data is used solely to provide portfolio management functionality and persist your
                preferences across browser sessions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Market Data</h3>
              <p className="text-muted-foreground">
                We fetch real-time market data from third-party APIs (Finnhub) to provide dividend calculations. No
                personal data is shared with these services.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Local Storage</h3>
              <p className="text-muted-foreground">
                All portfolio data is stored locally in your browser and never transmitted to our servers. You have full
                control over this data and can clear it at any time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">API Security</h3>
              <p className="text-muted-foreground">
                All API communications are encrypted using HTTPS. API keys are stored securely on our servers and never
                exposed to client-side code.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Data Control</h3>
              <p className="text-muted-foreground">
                Since all data is stored locally in your browser, you have complete control over your information. You
                can delete portfolios individually or clear all data by clearing your browser's local storage.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Tracking</h3>
              <p className="text-muted-foreground">
                We do not use cookies, analytics, or tracking technologies to monitor your usage of the platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, please contact us through the
              support channels available on our platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
