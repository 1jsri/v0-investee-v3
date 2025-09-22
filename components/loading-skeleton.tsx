import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "card" | "text" | "chart" | "table" | "news"
  count?: number
}

export function LoadingSkeleton({ className, variant = "card", count = 1 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        {skeletons.map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (variant === "chart") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-slate-200 rounded w-16"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </Card>
    )
  }

  if (variant === "table") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {skeletons.map((i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (variant === "news") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          {skeletons.map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-16 w-16 bg-slate-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className={cn("animate-pulse", className)}>
      {skeletons.map((i) => (
        <div key={i} className="h-4 bg-slate-200 rounded mb-2"></div>
      ))}
    </div>
  )
}
