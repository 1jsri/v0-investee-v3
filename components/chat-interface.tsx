"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Minimize2, Download, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  context?: "portfolio" | "asset" | "general"
  assetSymbol?: string
}

interface ChatInterfaceProps {
  context?: "portfolio" | "asset" | "general"
  assetSymbol?: string
  portfolioId?: string
  className?: string
  isFloating?: boolean
}

const SUGGESTED_QUESTIONS = {
  portfolio: [
    "What's my projected income next month?",
    "Which stocks have the highest yield?",
    "Should I rebalance my portfolio?",
    "How diversified is my portfolio?",
  ],
  asset: [
    "What's the dividend history for this stock?",
    "Is this a good dividend growth stock?",
    "What are the risks with this investment?",
    "How does this compare to sector peers?",
  ],
  general: [
    "Explain dividend growth investing",
    "What makes a good dividend stock?",
    "How do I build a dividend portfolio?",
    "What are dividend aristocrats?",
  ],
}

export function ChatInterface({
  context = "general",
  assetSymbol,
  portfolioId,
  className,
  isFloating = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chatUsage, setChatUsage] = useState({ used: 0, limit: 5, tier: "Free" })
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [assetData, setAssetData] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  useEffect(() => {
    if (context === "portfolio" && portfolioId) {
      fetchPortfolioData()
    }
  }, [context, portfolioId])

  useEffect(() => {
    if (context === "asset" && assetSymbol) {
      fetchAssetData()
    }
  }, [context, assetSymbol])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()
      if (data.profile) {
        const quotaLimits = {
          free: 5,
          casual: 50,
          professional: -1,
        }
        setChatUsage({
          used: data.profile.chat_quota_used || 0,
          limit: quotaLimits[data.profile.subscription_tier as keyof typeof quotaLimits] || 5,
          tier: data.profile.subscription_tier || "free",
        })
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`)
      const data = await response.json()
      setPortfolioData(data.portfolio)
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error)
    }
  }

  const fetchAssetData = async () => {
    try {
      const [quoteResponse, profileResponse] = await Promise.all([
        fetch(`/api/asset-quote?symbol=${assetSymbol}`),
        fetch(`/api/asset-profile?symbol=${assetSymbol}`),
      ])

      const quoteData = await quoteResponse.json()
      const profileData = await profileResponse.json()

      setAssetData({
        symbol: assetSymbol,
        name: profileData.companyName || assetSymbol,
        price: quoteData.price,
        dividendYield: quoteData.dividendYield,
        sector: profileData.sector,
        industry: profileData.industry,
      })
    } catch (error) {
      console.error("Failed to fetch asset data:", error)
    }
  }

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content || isLoading) return

    if (chatUsage.limit !== -1 && chatUsage.used >= chatUsage.limit) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      context,
      assetSymbol,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context,
          assetSymbol,
          portfolioId,
          portfolioData: context === "portfolio" ? portfolioData : undefined,
          assetData: context === "asset" ? assetData : undefined,
          history: messages.slice(-5),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
          context,
          assetSymbol,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setChatUsage((prev) => ({
          ...prev,
          used: data.quotaUsed || prev.used + 1,
        }))
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.error || "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date(),
          context,
          assetSymbol,
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered a connection error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        context,
        assetSymbol,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      handleSendMessage(`I've uploaded a portfolio CSV file: ${file.name}. Please analyze it.`)
    }
  }

  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.role.toUpperCase()} (${msg.timestamp.toLocaleString()}): ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `investee-chat-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getContextDisplay = () => {
    switch (context) {
      case "portfolio":
        return portfolioData ? `${portfolioData.name} Analysis` : "Portfolio Analysis"
      case "asset":
        return assetData ? `${assetData.name} (${assetSymbol}) Analysis` : `${assetSymbol} Analysis`
      default:
        return "Dividend Education"
    }
  }

  const getContextualSuggestions = () => {
    if (context === "portfolio" && portfolioData) {
      return [
        `What's my projected monthly income from ${portfolioData.name}?`,
        `How diversified is my ${portfolioData.name} portfolio?`,
        `Which holdings in ${portfolioData.name} have the highest yield?`,
        `Should I rebalance my ${portfolioData.name} portfolio?`,
      ]
    }

    if (context === "asset" && assetData) {
      return [
        `What's the dividend history for ${assetData.symbol}?`,
        `Is ${assetData.symbol} a good dividend growth stock?`,
        `How does ${assetData.symbol} compare to its sector peers?`,
        `What are the risks with investing in ${assetData.symbol}?`,
      ]
    }

    return SUGGESTED_QUESTIONS[context]
  }

  if (isFloating && isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "flex flex-col",
        isFloating ? "fixed bottom-4 right-4 w-96 h-[600px] shadow-2xl z-50" : "h-full",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{getContextDisplay()}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {chatUsage.used}/{chatUsage.limit} chats used
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {chatUsage.tier} Plan
            </Badge>
          </div>
        </div>
        {isFloating && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Ask me anything about dividend investing!</p>
                <p className="text-xs mt-2">This is educational content, not financial advice.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-muted",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggested questions:</p>
            <div className="grid grid-cols-1 gap-2">
              {getContextualSuggestions().map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto py-2 px-3 text-xs bg-transparent"
                  onClick={() => handleSendMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {chatUsage.limit !== -1 && chatUsage.used >= chatUsage.limit && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">You've reached your chat limit for this month.</p>
              <Button size="sm" className="mt-2">
                Upgrade to continue chatting
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  context === "portfolio"
                    ? "Ask about your portfolio performance, diversification, or projections..."
                    : context === "asset"
                      ? `Ask about ${assetSymbol} dividends, financials, or investment potential...`
                      : "Ask about dividends, your portfolio, or specific stocks..."
                }
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading || (chatUsage.limit !== -1 && chatUsage.used >= chatUsage.limit)}
                className="text-sm"
              />
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading || (chatUsage.limit !== -1 && chatUsage.used >= chatUsage.limit)}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {messages.length > 0 && (
            <div className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={exportChat} className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export Chat
              </Button>
              <p className="text-xs text-muted-foreground self-center">Educational content, not financial advice</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
