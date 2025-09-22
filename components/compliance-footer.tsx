import { AlertTriangle, ExternalLink, FileText, Building, Database, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export function ComplianceFooter() {
  return (
    <footer className="bg-white py-12 sm:py-16 border-t-2 border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-12">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-2 border-black bg-gray-50 p-4 sm:p-6">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
              <AlertDescription className="text-sm sm:text-base font-medium text-black">
                <strong className="text-base sm:text-lg">IMPORTANT:</strong> Investee is an educational platform only.
                This is not financial advice. Dividend payments can change or stop. Always do your own research and
                consult with financial professionals before investing.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black">Investee</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Learn dividend investing the simple way. Built for young adults who want to understand passive income
                and build wealth for their future.
              </p>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>Educational Investment Platform</span>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-bold text-black uppercase tracking-wide text-sm">Legal & Compliance</h4>
              <div className="space-y-3">
                <Link
                  href="/privacy"
                  className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors font-medium text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors font-medium text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </Link>
                <Link
                  href="/disclaimer"
                  className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors font-medium text-sm"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Risk Disclosure
                </Link>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-bold text-black uppercase tracking-wide text-sm">Data Sources</h4>
              <div className="space-y-3">
                <div className="group">
                  <a
                    href="https://financialmodelingprep.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-black transition-all duration-300 font-medium text-sm p-3 rounded-lg hover:bg-gray-50 hover:shadow-md transform hover:scale-105"
                  >
                    <Database className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
                    <span>Financial Modeling Prep</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <div className="group">
                  <a
                    href="https://finnhub.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-black transition-all duration-300 font-medium text-sm p-3 rounded-lg hover:bg-gray-50 hover:shadow-md transform hover:scale-105"
                  >
                    <Shield className="h-4 w-4 group-hover:text-green-600 transition-colors" />
                    <span>Finnhub Market Data</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-3 p-2 bg-gray-50 rounded">
                  Real market data from trusted financial sources. Data accuracy depends on third-party providers.
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-bold text-black uppercase tracking-wide text-sm">Learn More</h4>
              <div className="space-y-3">
                <a
                  href="https://investor.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors font-medium text-sm hover:underline"
                >
                  SEC Investor Education
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://finra.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors font-medium text-sm hover:underline"
                >
                  FINRA Resources
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t-2 border-gray-200 text-center space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg font-semibold text-black">© 2025 Investee. All rights reserved.</p>
            <p className="text-xs sm:text-sm text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Educational platform only. Not financial advice. Always verify information independently before making
              investment decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
