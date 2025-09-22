import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingDown, Shield, Info, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Full Disclaimer</h1>
          <p className="text-muted-foreground">Important legal and financial disclosures for Investee users</p>
        </div>

        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>IMPORTANT:</strong> This platform is for educational and informational purposes only. Nothing
            contained herein constitutes financial, investment, tax, or legal advice. Always consult with qualified
            professionals before making investment decisions.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Investment Risk Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">General Investment Risks</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>All investments involve risk, including the potential loss of principal</li>
                <li>Past performance does not guarantee future results</li>
                <li>Market conditions can change rapidly and unpredictably</li>
                <li>Economic factors may significantly impact investment returns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dividend-Specific Risks</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Dividend payments are not guaranteed and may be reduced or eliminated</li>
                <li>Companies may change their dividend policies without notice</li>
                <li>High dividend yields may indicate underlying business problems</li>
                <li>Dividend-focused strategies may underperform in certain market conditions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Data and Calculation Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Data Accuracy</h3>
              <p className="text-muted-foreground">
                While we strive to provide accurate market data through reputable sources like Finnhub, we cannot
                guarantee the accuracy, completeness, or timeliness of any information. Market data may be delayed or
                contain errors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Calculation Methodology</h3>
              <p className="text-muted-foreground">
                Our dividend projections are based on historical data and current market prices. These calculations are
                estimates only and should not be relied upon for actual investment decisions. Actual results may vary
                significantly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Market Volatility</h3>
              <p className="text-muted-foreground">
                Stock prices and dividend yields can change rapidly. The information displayed may not reflect current
                market conditions. Always verify current prices and yields before making investment decisions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              No Professional Relationship
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Not a Financial Advisor</h3>
              <p className="text-muted-foreground">
                Investee and its operators are not registered investment advisors, financial planners, or brokers. We do
                not provide personalized investment advice or recommendations tailored to your specific financial
                situation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Seek Professional Advice</h3>
              <p className="text-muted-foreground">
                Before making any investment decisions, consult with qualified professionals including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Licensed financial advisors</li>
                <li>Certified public accountants (CPAs)</li>
                <li>Tax professionals</li>
                <li>Estate planning attorneys</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Third-Party Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">External Data Sources</h3>
              <p className="text-muted-foreground">
                We obtain market data from third-party providers including Finnhub. We are not responsible for the
                accuracy or reliability of third-party data. Terms and conditions of data providers may apply.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Endorsement</h3>
              <p className="text-muted-foreground">
                The inclusion of any company, stock, ETF, or fund in our platform does not constitute an endorsement or
                recommendation. We do not receive compensation from any companies for including their securities.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Educational Resources</h3>
              <p className="text-muted-foreground">For comprehensive investment education, consider resources from:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Securities and Exchange Commission (SEC) - investor.gov</li>
                <li>Financial Industry Regulatory Authority (FINRA) - finra.org</li>
                <li>Your broker's educational materials</li>
                <li>Reputable financial publications and websites</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            By using Investee, you acknowledge that you have read, understood, and agree to this disclaimer. You assume
            full responsibility for any investment decisions made based on information from this platform.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
