"use client"

import { useState } from "react"
import { ChatInterface } from "./chat-interface"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:inset-auto lg:bottom-4 lg:right-4 lg:w-96 lg:h-[600px]">
        {/* Mobile overlay */}
        <div className="lg:hidden fixed inset-0 bg-background">
          <ChatInterface context="general" isFloating={true} className="h-full w-full rounded-none" />
          <Button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-10" variant="ghost" size="sm">
            ✕
          </Button>
        </div>

        {/* Desktop floating */}
        <div className="hidden lg:block">
          <ChatInterface context="general" isFloating={true} className="shadow-2xl" />
          <Button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 z-10" variant="ghost" size="sm">
            ✕
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40 lg:z-50"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
