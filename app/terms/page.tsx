import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, Shield, Scale, Gavel, Building, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-black">Terms of Service</h1>
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <Alert className="border-2 border-black bg-gray-50 p-6">
          <AlertTriangle className="h-6 w-6 text-black" />
          <AlertDescription className="text-base font-medium">
            <strong className="text-lg">IMPORTANT LEGAL NOTICE:</strong> By accessing or using Investee, you acknowledge
            and agree that this platform provides educational information only and does not constitute financial,
            investment, tax, or legal advice. You assume full responsibility for all investment decisions and their
            consequences.
          </AlertDescription>
        </Alert>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <FileText className="h-6 w-6" />
              Acceptance and Binding Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or
              "your") and Investee ("Company," "we," "us," or "our"). By accessing, browsing, or using this platform in
              any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and all
              applicable laws and regulations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree with any provision of these Terms, you must immediately discontinue use of this
              platform. Your continued use constitutes acceptance of any modifications to these Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <AlertTriangle className="h-6 w-6" />
              Financial and Investment Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-3 text-black">No Financial Advice</h3>
              <p className="text-gray-700 leading-relaxed">
                Investee is strictly an educational and informational platform. Nothing contained herein constitutes
                financial, investment, tax, legal, or professional advice of any kind. All content is provided for
                general informational purposes only and should not be relied upon for making investment decisions. You
                must consult with qualified financial, tax, and legal professionals before making any investment or
                financial decisions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Investment Risks and No Guarantees</h3>
              <p className="text-gray-700 leading-relaxed">
                All investments involve substantial risk of loss, including the potential loss of principal. Past
                performance does not guarantee future results. Dividend payments are not guaranteed and may be reduced,
                suspended, or eliminated at any time without notice. Market conditions, company performance, and
                economic factors can significantly impact investment returns. You acknowledge and accept full
                responsibility for all investment risks and outcomes.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Data Accuracy and Reliability</h3>
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide accurate and up-to-date information from reputable third-party sources, we
                make no representations or warranties regarding the accuracy, completeness, timeliness, or reliability
                of any data, information, or content provided. Market data may be delayed, and historical information
                may not reflect current market conditions. You must independently verify all information before making
                any investment decisions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Regulatory Compliance</h3>
              <p className="text-gray-700 leading-relaxed">
                This platform is not registered as an investment advisor, broker-dealer, or financial institution with
                any regulatory authority. We do not provide personalized investment recommendations or portfolio
                management services. Users are responsible for ensuring compliance with all applicable securities laws
                and regulations in their jurisdiction.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Shield className="h-6 w-6" />
              Permitted Use and Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Authorized Use</h3>
              <p className="text-gray-700 leading-relaxed">
                You may use Investee solely for personal, non-commercial, educational purposes. This license is
                non-exclusive, non-transferable, and revocable at our sole discretion. You may not use this platform to
                provide financial advice or investment services to third parties.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Prohibited Activities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Attempting to gain unauthorized access to our systems, servers, or networks</li>
                <li>Using automated tools, bots, or scripts to scrape, download, or extract data</li>
                <li>Reproducing, distributing, or commercializing our content without written permission</li>
                <li>Providing financial advice or investment services based on platform information</li>
                <li>Violating any applicable laws, regulations, or third-party rights</li>
                <li>Interfering with or disrupting the platform's functionality or security</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Scale className="h-6 w-6" />
              Limitation of Liability and Indemnification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Complete Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, INVESTEE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND
                AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THIS PLATFORM, INCLUDING BUT NOT LIMITED TO INVESTMENT
                LOSSES, LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, REGARDLESS OF THE THEORY OF LIABILITY.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">User Indemnification</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Investee and its affiliates from any claims, damages,
                losses, costs, or expenses (including reasonable attorneys' fees) arising from your use of the platform,
                violation of these Terms, or infringement of any third-party rights.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Building className="h-6 w-6" />
              Intellectual Property Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              All content, features, functionality, and intellectual property rights in this platform are owned by
              Investee and are protected by copyright, trademark, and other intellectual property laws. You may not
              reproduce, distribute, modify, or create derivative works without our express written consent.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Gavel className="h-6 w-6" />
              Modifications and Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Terms Modifications</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time without prior notice. Changes become effective
                immediately upon posting. Your continued use of the platform constitutes acceptance of modified Terms.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Service Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                We may suspend, restrict, or terminate your access to the platform at any time for any reason, including
                violation of these Terms. We do not guarantee continuous availability of the platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Users className="h-6 w-6" />
              Governing Law and Dispute Resolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the United States and the state
              in which Investee is incorporated, without regard to conflict of law principles. Any disputes arising from
              these Terms or your use of the platform shall be resolved through binding arbitration in accordance with
              the rules of the American Arbitration Association.
            </p>
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <p className="text-gray-600 text-lg font-medium">
            By using Investee, you acknowledge that you have read, understood, and agree to be bound by these Terms of
            Service.
          </p>
        </div>
      </div>
    </div>
  )
}
