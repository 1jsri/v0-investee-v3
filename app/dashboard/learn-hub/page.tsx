"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Award,
  ArrowRight,
} from "lucide-react"

const learningModules = [
  {
    id: 1,
    title: "Dividend Basics",
    description: "Learn what dividends are and how they work",
    duration: "15 min",
    progress: 100,
    status: "completed",
    lessons: 5,
  },
  {
    id: 2,
    title: "Finding Quality Dividend Stocks",
    description: "How to identify reliable dividend-paying companies",
    duration: "20 min",
    progress: 60,
    status: "in-progress",
    lessons: 7,
  },
  {
    id: 3,
    title: "Building Your First Portfolio",
    description: "Step-by-step guide to creating a dividend portfolio",
    duration: "25 min",
    progress: 0,
    status: "not-started",
    lessons: 8,
  },
  {
    id: 4,
    title: "Advanced Dividend Strategies",
    description: "DRIP, dividend growth, and tax considerations",
    duration: "30 min",
    progress: 0,
    status: "locked",
    lessons: 10,
  },
]

const quickStats = [
  { label: "Modules Completed", value: "1/4", icon: BookOpen },
  { label: "Total Progress", value: "40%", icon: TrendingUp },
  { label: "Learning Streak", value: "3 days", icon: Award },
  { label: "Time Invested", value: "45 min", icon: Clock },
]

export default function LearnHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Hub</h1>
          <p className="text-muted-foreground text-lg">
            Master dividend investing with our comprehensive learning modules
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Learning Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Learning Modules</h2>

          <div className="grid gap-6">
            {learningModules.map((module) => (
              <Card key={module.id} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                      <Badge
                        variant={
                          module.status === "completed"
                            ? "default"
                            : module.status === "in-progress"
                              ? "secondary"
                              : module.status === "locked"
                                ? "outline"
                                : "outline"
                        }
                        className={
                          module.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : module.status === "in-progress"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : ""
                        }
                      >
                        {module.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {module.status === "in-progress" && <Play className="h-3 w-3 mr-1" />}
                        {module.status === "completed"
                          ? "Completed"
                          : module.status === "in-progress"
                            ? "In Progress"
                            : module.status === "locked"
                              ? "Locked"
                              : "Start"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{module.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {module.lessons} lessons
                      </span>
                    </div>
                  </div>

                  <div className="ml-6 text-right">
                    <Button
                      disabled={module.status === "locked"}
                      className={
                        module.status === "completed"
                          ? "bg-green-600 hover:bg-green-700"
                          : module.status === "in-progress"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : ""
                      }
                    >
                      {module.status === "completed"
                        ? "Review"
                        : module.status === "in-progress"
                          ? "Continue"
                          : module.status === "locked"
                            ? "Locked"
                            : "Start"}
                      {module.status !== "locked" && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </div>

                {module.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Dividend Calculator</h3>
              <p className="text-muted-foreground mb-4">Calculate potential income from dividend investments</p>
              <Button variant="outline" className="w-full bg-transparent">
                Try Calculator
              </Button>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Portfolio Builder</h3>
              <p className="text-muted-foreground mb-4">Build and track your dividend portfolio</p>
              <Button variant="outline" className="w-full bg-transparent">
                Build Portfolio
              </Button>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Goal Tracker</h3>
              <p className="text-muted-foreground mb-4">Set and track your dividend income goals</p>
              <Button variant="outline" className="w-full bg-transparent">
                Set Goals
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
