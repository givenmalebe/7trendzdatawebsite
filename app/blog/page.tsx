"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User, Eye, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { fetchBlogPosts } from "@/lib/blog-service"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  status: string
  published_at: string
  created_at: string
  views: number
  tags: string[]
  image_url?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    "All Categories",
    "Artificial Intelligence",
    "Data Science",
    "Microsoft Copilot",
    "Microsoft Fabric",
    "Chatbots & AI Agents",
    "Technology",
    "Business",
    "Tutorials",
  ]

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, selectedCategory])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await fetchBlogPosts({ status: "published" })
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredPosts(filtered)
  }

  return (
    <div className="page-shell">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="section-label mb-4 mx-auto w-fit">Blog</div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Blog</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Insights on AI automation, cybersecurity, and technology for modern businesses
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                {post.image_url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                      unoptimized
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2">
                    <Badge variant="default">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                    <Link href={`/blog-reader?id=${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/blog-reader?id=${post.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
