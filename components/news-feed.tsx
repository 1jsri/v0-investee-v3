"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, TrendingUp, TrendingDown, Minus, Clock, Share2, Bookmark } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NewsArticle {
  title: string
  text: string
  url: string
  image?: string
  publishedDate: string
  site: string
  symbol?: string
  sentiment: "bullish" | "bearish" | "neutral"
  category: string
  relevantTickers: string[]
}

interface NewsFeedProps {
  portfolioSymbols?: string[]
}

export function NewsFeed({ portfolioSymbols = [] }: NewsFeedProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNews()
    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [portfolioSymbols])

  useEffect(() => {
    filterNews()
  }, [news, selectedCategory, portfolioSymbols])

  const fetchNews = async () => {
    try {
      const symbols = portfolioSymbols.join(",")
      const response = await fetch(`/api/news?symbols=${symbols}&category=${selectedCategory}`)
      const newsData = await response.json()

      if (Array.isArray(newsData)) {
        setNews(newsData)
      } else {
        console.error("News API returned non-array data:", newsData)
        setNews([])
      }
    } catch (error) {
      console.error("Failed to fetch news:", error)
      setNews([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterNews = () => {
    if (!Array.isArray(news)) {
      setFilteredNews([])
      return
    }

    let filtered = news

    if (selectedCategory === "portfolio" && portfolioSymbols.length > 0) {
      filtered = news.filter((article) =>
        portfolioSymbols.some((symbol) => article.relevantTickers.includes(symbol) || article.title.includes(symbol)),
      )
    } else if (selectedCategory !== "all") {
      filtered = news.filter((article) => article.category === selectedCategory)
    }

    setFilteredNews(filtered)
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-slate-400" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-600 bg-green-50 border-green-200"
      case "bearish":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Market News</h3>
        <Badge variant="outline" className="text-slate-600 border-slate-200">
          Live
        </Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="portfolio">For You</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Array.isArray(filteredNews) && filteredNews.length > 0 ? (
          filteredNews.map((article, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex items-start gap-3">
                {article.image && (
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getSentimentIcon(article.sentiment)}
                    <Badge variant="outline" className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                      {article.sentiment}
                    </Badge>
                    {article.category === "dividends" && (
                      <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 text-xs">
                        Dividend
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-slate-900 line-clamp-2 mb-2">{article.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(article.publishedDate), { addSuffix: true })}
                    </span>
                    <span>{article.site}</span>
                    {article.relevantTickers.length > 0 && (
                      <div className="flex gap-1">
                        {article.relevantTickers.slice(0, 2).map((ticker) => (
                          <Badge key={ticker} variant="outline" className="text-xs">
                            {ticker}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No news articles available at the moment.</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              {selectedArticle.image && (
                <img
                  src={selectedArticle.image || "/placeholder.svg"}
                  alt=""
                  className="w-full h-48 rounded-lg object-cover"
                />
              )}
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>{selectedArticle.site}</span>
                <span>{formatDistanceToNow(new Date(selectedArticle.publishedDate), { addSuffix: true })}</span>
                <Badge variant="outline" className={getSentimentColor(selectedArticle.sentiment)}>
                  {selectedArticle.sentiment}
                </Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">{selectedArticle.text.substring(0, 500)}...</p>
              {selectedArticle.relevantTickers.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Related Assets</h4>
                  <div className="flex gap-2">
                    {selectedArticle.relevantTickers.map((ticker) => (
                      <Badge key={ticker} variant="outline">
                        {ticker}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => window.open(selectedArticle.url, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Full Article
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
