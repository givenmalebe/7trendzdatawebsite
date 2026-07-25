"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Eye } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { fetchBlogPost, incrementViews } from "@/lib/blog-service"

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

export default function BlogReader() {
  const searchParams = useSearchParams()
  const postId = searchParams.get("id")
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (postId) {
      fetchPost(postId)
    }
  }, [postId])

  const fetchPost = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await fetchBlogPost(id)
      if (data) {
        setPost(data)
        await incrementViews(id)
      }
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <article>
                {/* Featured Image */}
                {post.image_url && (
                  <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                {/* Category Badge */}
                <div className="mb-4">
                  <Badge variant="default" className="text-sm">
                    {post.category}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-6 text-gray-900">{post.title}</h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{post.views} views</span>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">{post.excerpt}</p>

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
