"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Phone,
  Search,
  Palette,
  Brain,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  suggestions?: string[]
}

interface QuickAction {
  icon: React.ElementType
  label: string
  message: string
  color: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "👋 Hello! I'm your AI automation assistant from 7Trendz Data. I can help you discover how our AI solutions can transform your business:\n\n🤖 **AI Receptionist** - Never miss a call again ($699/month)\n🔍 **AI SEO** - Boost your search rankings automatically ($499/month)\n💬 **AI Chatbots** - 24/7 customer support ($199/month)\n🧠 **Custom AI Models** - Tailored solutions ($2,999/project)\n🎨 **AI UI/UX Design** - Automated design generation ($799/month)\n⚡ **Process Automation** - Streamline operations ($899/month)\n\n🚀 **SPECIAL COMBO**: Complete Business Growth Package - High-converting website + Google Maps SEO + AI Receptionist for just $999/month (Save $199!)\n\nWhat would you like to know about AI automation for your business?",
      role: "assistant",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Tell me about the Complete Business Growth Package",
        "How does the AI Receptionist work?",
        "What's included in Google Maps SEO?",
        "Show me the high-converting website features",
        "I want the $999 combo deal",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickActions: QuickAction[] = [
    {
      icon: Phone,
      label: "AI Receptionist",
      message: "Tell me about your AI Receptionist service and how it can help my business",
      color: "bg-blue-500",
    },
    {
      icon: Search,
      label: "AI SEO",
      message: "How does your AI SEO optimization work and what results can I expect?",
      color: "bg-green-500",
    },
    {
      icon: Brain,
      label: "Custom AI",
      message: "I need a custom AI solution for my specific business needs",
      color: "bg-orange-500",
    },
    {
      icon: Palette,
      label: "AI Design",
      message: "Tell me about your AI-powered UI/UX design platform",
      color: "bg-pink-500",
    },
    {
      icon: Zap,
      label: "Get Quote",
      message: "I'd like to get a custom quote for AI automation services",
      color: "bg-purple-500",
    },
    {
      icon: Zap,
      label: "Growth Combo",
      message: "Tell me about your Complete Business Growth Package for $999/month",
      color: "bg-gradient-to-r from-green-500 to-blue-500",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
      setIsMinimized(false)
    }, 10000) // Show after 10 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleQuickAction = (action: QuickAction) => {
    setInputMessage(action.message)
    setShowQuickActions(false)
    sendMessage(action.message)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    sendMessage(suggestion)
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setShowQuickActions(false)

    const MAX_RETRIES = 3
    const BASE_DELAY_MS = 1000

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: textToSend,
            conversationHistory: messages.slice(-10),
          }),
        })

        if (response.status === 503 && i < MAX_RETRIES - 1) {
          const delay = BASE_DELAY_MS * Math.pow(2, i)
          console.warn(
            `AI service temporarily overloaded. Retrying in ${delay / 1000} seconds... (Attempt ${i + 1}/${MAX_RETRIES})`,
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to get response")
        }

        const data = await response.json()

        // Generate contextual suggestions based on the response
        const suggestions = generateSuggestions(textToSend, data.response)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: data.timestamp,
          suggestions: suggestions,
        }

        setMessages((prev) => [...prev, assistantMessage])
        break
      } catch (error) {
        console.error("Chat error:", error)
        if (i === MAX_RETRIES - 1) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              "🚨 I'm experiencing high demand right now! While I get back online, you can:\n\n📧 Email us directly: info@7trendzdata.com\n📞 Call us: +27 736 289 188\n💬 Or try asking your question again in a moment\n\nOur AI automation solutions are worth the wait! 🤖✨",
            role: "assistant",
            timestamp: new Date().toISOString(),
            suggestions: ["Contact us directly", "Try again", "View our services"],
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      } finally {
        if (i === MAX_RETRIES - 1 || !isLoading) {
          setIsLoading(false)
        }
      }
    }
  }

  const generateSuggestions = (userMessage: string, aiResponse: string): string[] => {
    const lowerMessage = userMessage.toLowerCase()
    const lowerResponse = aiResponse.toLowerCase()

    if (lowerMessage.includes("combo") || lowerMessage.includes("package") || lowerMessage.includes("growth")) {
      return [
        "What's included in the combo?",
        "How much do I save with the package?",
        "Can I customize the combo?",
        "Schedule combo consultation",
      ]
    }

    if (lowerMessage.includes("receptionist") || lowerMessage.includes("call")) {
      return [
        "What's the setup process?",
        "Can it integrate with my CRM?",
        "Show me pricing details",
        "Schedule a demo",
      ]
    } else if (lowerMessage.includes("seo") || lowerMessage.includes("search")) {
      return ["How long to see results?", "What about local SEO?", "Compare with other tools", "Get SEO audit"]
    } else if (lowerMessage.includes("chatbot") || lowerMessage.includes("chat")) {
      return ["Can it handle complex queries?", "Multi-language support?", "Integration options", "See chatbot demo"]
    } else if (lowerMessage.includes("custom") || lowerMessage.includes("model")) {
      return [
        "What's the development timeline?",
        "Do you provide training?",
        "Ongoing support options",
        "Similar case studies",
      ]
    } else if (lowerMessage.includes("design") || lowerMessage.includes("ui")) {
      return [
        "See design examples",
        "How does AI create designs?",
        "Brand consistency features",
        "A/B testing capabilities",
      ]
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("quote")) {
      return ["Schedule consultation", "Compare service packages", "ROI calculator", "Payment options"]
    } else {
      return ["Tell me about pricing", "Schedule a consultation", "See case studies", "Compare all services"]
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessage = (content: string) => {
    return content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />")
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
        <div className="absolute -top-2 -right-2">
          <div className="w-5 h-5 bg-red-500 rounded-full animate-bounce flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white text-xs px-2 py-1 whitespace-nowrap">AI Automation Help</Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <Card
        className={`w-[calc(100vw-2rem)] max-w-md sm:w-96 shadow-2xl transition-all duration-300 ${
          isMinimized ? "h-16" : "h-[600px] max-h-[85vh]"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Automation Assistant</CardTitle>
              <p className="text-xs text-blue-100">7Trendz Data • Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[calc(100%-64px)] p-0">
            {/* Quick Actions */}
            {showQuickActions && messages.length === 1 && (
              <div className="p-4 border-b bg-gray-50">
                <p className="text-xs text-gray-600 mb-3 font-medium">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs h-8 justify-start"
                    >
                      <action.icon className="h-3 w-3 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-900 border"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {message.role === "user" && <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />}
                      <div className="flex-1">
                        <div
                          className="text-sm whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>

                        {/* Suggestions */}
                        {message.role === "assistant" && message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-7 mr-1 mb-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[85%] border">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">AI thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about AI automation..."
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:border-blue-500"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Press Enter to send • Powered by AI</p>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  ✓ Secure & Private
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
