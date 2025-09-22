import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Calculator, Shield, TrendingUp, Users, Lightbulb } from "lucide-react"

const benefits = [
  {
    icon: BookOpen,
    title: "Learn at Your Own Pace",
    description:
      "Start with the basics of dividend investing. No confusing jargon - just clear explanations of how companies pay you to own their stock.",
  },
  {
    icon: Calculator,
    title: "See Real Numbers",
    description:
      "Use our calculator to see exactly how much monthly income you could earn from different dividend stocks. Make informed decisions with real data.",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description:
      "Your portfolio data stays on your device. No account required to start learning. We don't sell your information or track your investments.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Watch your potential passive income grow as you learn about different dividend-paying stocks and build your investment knowledge.",
  },
  {
    icon: Users,
    title: "Built for Beginners",
    description:
      "Designed specifically for people in their 20s and 30s who want to understand how passive income works. No finance degree required.",
  },
  {
    icon: Lightbulb,
    title: "Simple & Practical",
    description:
      "Focus on what matters: understanding dividends, calculating potential income, and making smart investment choices for your future.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">Why Choose Investee?</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We make dividend investing simple and accessible. Perfect for young adults who want to understand how
            passive income really works.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-lg flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
