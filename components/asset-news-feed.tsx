"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AssetNewsFeedProps {
  symbol: string
}

export function AssetNewsFeed({ symbol }: AssetNewsFeedProps) {
  const [news, setNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAssetNews()
  }, [symbol])

  const fetchAssetNews = async () => {
    try {
      const response = await fetch(`/api/news?symbols=${symbol}`)
      const newsData = await response.json()

      if (Array.isArray(newsData)) {
        setNews(newsData.slice(0, 10))
      } else {
        console.error("Asset news API returned non-array data:", newsData)
        setNews([])
      }
    } catch (error) {
      console.error("Failed to fetch asset news:", error)
      setNews([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Latest News for {symbol}</h3>

      <div className="space-y-4">
        {Array.isArray(news) && news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                {article.image && (
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 line-clamp-2 mb-2">{article.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(article.publishedDate), { addSuffix: true })}
                    </span>
                    <span>{article.site}</span>
                    <Badge variant="outline" className="text-xs">
                      {article.sentiment}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{article.text?.substring(0, 150)}...</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Read full article
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No news available for {symbol} at the moment.</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        )}
      </div>
    </Card>
  )
}
