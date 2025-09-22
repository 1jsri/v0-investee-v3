"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Send, Bot, User, Loader2, AlertTriangle, Crown, Star, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Portfolio {
  id: string
  name: string
  totalValue: number
  holdings: Array<{
    asset_ticker: string
    asset_name?: string
    investment_amount: number
  }>
}

interface AIChatInterfaceProps {
  userTier: "free" | "casual" | "professional"
  portfolio?: Portfolio
  assetContext?: {
    symbol: string
    name: string
  }
  chatQuotaUsed: number
  chatQuotaLimit: number
  className?: string
}

export function AIChatInterface({
  userTier,
  portfolio,
  assetContext,
  chatQuotaUsed: initialQuotaUsed,
  chatQuotaLimit,
  className,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: `Hi! I'm your dividend investing education assistant. I'm here to help you learn about dividend investing concepts, terminology, and strategies.

${assetContext ? `I see you're interested in ${assetContext.symbol}. ` : ""}${portfolio ? `I can see your portfolio "${portfolio.name}" for educational context. ` : ""}

What would you like to learn about dividend investing today?

*Remember: I provide educational information only, not financial advice.*`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [quotaUsed, setQuotaUsed] = useState(initialQuotaUsed)
  const [error, setError] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    if (userTier === "free") {
      setError("Chat feature requires Casual or Professional subscription")
      return
    }

    if (quotaUsed >= chatQuotaLimit) {
      setError("You've reached your monthly chat limit. Upgrade for more conversations!")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          portfolioContext: portfolio,
          assetContext,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setQuotaUsed(data.quotaUsed)
    } catch (error) {
      console.error("Chat error:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quotaPercentage = (quotaUsed / chatQuotaLimit) * 100

  return (
    <Card className={cn("flex flex-col h-[600px] bg-white border border-gray-200 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-black">AI Learning Assistant</h3>
            <p className="text-sm text-gray-600">Educational dividend investing guidance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
            {userTier === "professional" ? (
              <>
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </>
            ) : userTier === "casual" ? (
              <>
                <Star className="h-3 w-3 mr-1" />
                Casual
              </>
            ) : (
              "Free"
            )}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {quotaUsed}/{chatQuotaLimit} chats
          </Badge>
        </div>
      </div>

      {/* Quota Display */}
      {userTier !== "free" && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Monthly Chat Usage</span>
            <span className="font-medium text-black">
              {quotaUsed}/{chatQuotaLimit}
            </span>
          </div>
          <Progress value={quotaPercentage} className="h-1" />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}>
            {message.type === "assistant" && (
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                message.type === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900 border border-gray-200",
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div
                className={cn("text-xs mt-2 opacity-70", message.type === "user" ? "text-gray-300" : "text-gray-500")}
              >
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            {message.type === "user" && (
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Free Tier Upgrade Prompt */}
      {userTier === "free" && (
        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-t border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Chat with AI Assistant</span>
            </div>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
              Upgrade to Chat
            </Button>
          </div>
          <p className="text-xs text-orange-700 mt-1">
            Get personalized dividend investing education with our AI assistant
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              userTier === "free" ? "Upgrade to chat with AI assistant..." : "Ask about dividend investing concepts..."
            }
            disabled={userTier === "free" || isLoading || quotaUsed >= chatQuotaLimit}
            className="flex-1 border-gray-300 focus:border-purple-500"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || userTier === "free" || isLoading || quotaUsed >= chatQuotaLimit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        {/* Educational Disclaimer */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>Educational content only • Not financial advice • Always consult professionals</span>
        </div>

        {/* Quick Suggestions */}
        {userTier !== "free" && messages.length <= 1 && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "What is dividend yield?",
                "How do dividend growth stocks work?",
                "What are REITs?",
                "Explain payout ratios",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
