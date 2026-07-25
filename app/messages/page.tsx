"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Search, Trash2, ArrowLeft, Reply } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Define the message type
interface ContactMessage {
  id: string
  name: string
  email: string
  company: string
  service: string
  message: string
  timestamp: string
  read: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("isAuthenticated")

    if (!authStatus) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)

      // Load messages from localStorage
      const savedMessages = localStorage.getItem("contactMessages")
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    }
  }, [router])

  const handleMessageClick = (message: ContactMessage) => {
    // Mark as read
    if (!message.read) {
      const updatedMessages = messages.map((msg) => (msg.id === message.id ? { ...msg, read: true } : msg))
      setMessages(updatedMessages)
      localStorage.setItem("contactMessages", JSON.stringify(updatedMessages))
    }

    setSelectedMessage(message)
  }

  const handleDeleteMessage = (id: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id)
    setMessages(updatedMessages)
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages))

    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const handleDeleteAllMessages = () => {
    setMessages([])
    localStorage.setItem("contactMessages", JSON.stringify([]))
    setSelectedMessage(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !message.read
    return matchesSearch
  })

  const unreadCount = messages.filter((msg) => !msg.read).length

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">View and manage contact form submissions</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Inbox</CardTitle>
                  {unreadCount > 0 && <Badge className="bg-blue-600">{unreadCount} new</Badge>}
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2"
                  />
                </div>
              </CardHeader>
              <div className="px-4 pb-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardContent>
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No messages found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg cursor-pointer ${
                          selectedMessage?.id === message.id
                            ? "bg-blue-50 border border-blue-200"
                            : message.read
                              ? "bg-gray-50 hover:bg-gray-100"
                              : "bg-blue-50 hover:bg-blue-100 font-medium"
                        }`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{message.name}</p>
                            <p className="text-sm text-gray-600 truncate">{message.email}</p>
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">{message.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {messages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 w-full"
                      onClick={handleDeleteAllMessages}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Messages
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-full">
              {selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{selectedMessage.name}</CardTitle>
                        <CardDescription>
                          <span className="font-medium">{selectedMessage.email}</span> •{" "}
                          {formatDate(selectedMessage.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${selectedMessage.email}`}>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Company</p>
                          <p className="font-medium">{selectedMessage.company}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Service Interest</p>
                          <p className="font-medium">{selectedMessage.service}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedMessage.message}</div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild>
                            <a href={`mailto:${selectedMessage.email}`}>Reply via Email</a>
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                            Back to Messages
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full py-16">
                  <div className="text-center">
                    <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Message Selected</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Select a message from the list to view its contents. You can reply directly to inquiries from
                      here.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
