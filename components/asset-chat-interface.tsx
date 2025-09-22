"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, Sparkles } from "lucide-react"

interface AssetChatInterfaceProps {
  symbol: string
  companyName: string
}

export function AssetChatInterface({ symbol, companyName }: AssetChatInterfaceProps) {
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant"
      content: string
      timestamp: Date
    }>
  >([
    {
      role: "assistant",
      content: `Hello! I'm here to help you learn about ${companyName} (${symbol}). I can provide educational information about their dividend history, business model, and financial performance. What would you like to know?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const suggestedQuestions = [
    `What is ${symbol}'s dividend history?`,
    `How sustainable are ${symbol}'s dividends?`,
    `What are the main business segments?`,
    `What are the key risks for investors?`,
  ]

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Mock AI response - replace with real AI API call
      setTimeout(() => {
        const aiResponse = {
          role: "assistant" as const,
          content: `Based on my analysis of ${symbol}, here's what I can tell you about ${input.toLowerCase().includes("dividend") ? "their dividend program" : "this topic"}: This is educational information only and should not be considered investment advice. ${symbol} has shown consistent performance in this area, but please conduct your own research and consult with financial professionals.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to get AI response:", error)
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Chat with {symbol}</h3>
          <p className="text-sm text-slate-600">Ask questions about dividends, financials, and business model</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span className="text-sm text-slate-600">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${symbol}...`}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-500">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> This AI provides educational information only and should not be considered
          investment advice. Always conduct your own research and consult with qualified financial professionals before
          making investment decisions.
        </p>
      </div>
    </Card>
  )
}
