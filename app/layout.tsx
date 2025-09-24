import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { ErrorBoundary } from "@/components/error-boundary"
import Navigation from "@/components/Navigation"
import { ComplianceFooter } from "@/components/compliance-footer"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Investee - Dividend Income Calculator",
  description:
    "Track and project your dividend income with real-time data. Calculate potential returns from stocks, ETFs, and funds. Professional-grade analysis tools for dividend investors.",
  keywords: [
    "dividend calculator",
    "dividend income",
    "investment calculator",
    "dividend yield",
    "portfolio tracker",
    "dividend investing",
    "stock analysis",
    "ETF analysis",
  ],
  authors: [{ name: "Investee" }],
  creator: "Investee",
  publisher: "Investee",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://investee.app",
    title: "Investee - Dividend Income Calculator",
    description: "Professional dividend income tracking and projection platform with real-time market data.",
    siteName: "Investee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investee - Dividend Income Calculator",
    description: "Track and project your dividend income with real-time market data.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased min-h-screen bg-background flex flex-col">
        <ErrorBoundary>
          {window.location.pathname !== "/dashboard" && <Navigation />}
          <main className="flex-1">{children}</main>
          <ComplianceFooter />
        </ErrorBoundary>
      </body>
    </html>
  )
}
