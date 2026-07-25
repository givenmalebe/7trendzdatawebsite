"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, CheckCircle } from "lucide-react"

interface AIBlogGeneratorProps {
  onUseGeneratedBlog: (postData: {
    title: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    status: "draft" | "published"
  }) => void
}

export function AIBlogGenerator({ onUseGeneratedBlog }: AIBlogGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [generatedBlog, setGeneratedBlog] = useState<{
    title: string
    excerpt: string
    content: string
    category: string
    tags: string[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerateBlog = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for the blog post.")
      return
    }

    setIsLoading(true)
    setError("")
    setGeneratedBlog(null)

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate blog post.")
      }

      const data = await response.json()
      setGeneratedBlog(data.blogPost)
    } catch (err: any) {
      console.error("Error generating blog:", err)
      setError(err.message || "An unexpected error occurred while generating the blog.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseBlog = () => {
    if (generatedBlog) {
      onUseGeneratedBlog({ ...generatedBlog, status: "draft" }) // Default to draft
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>AI Blog Generator</CardTitle>
        <CardDescription>
          Generate blog posts on AI, Microsoft, and data science topics using our intelligent assistant.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="blog-topic" className="block text-sm font-medium text-gray-700 mb-2">
            Blog Topic / Keywords *
          </label>
          <Input
            id="blog-topic"
            placeholder="e.g., Latest trends in Generative AI, Microsoft Fabric updates"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a clear topic for the AI to generate a relevant blog post.
          </p>
        </div>

        <Button
          onClick={handleGenerateBlog}
          disabled={isLoading || !topic.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Blog...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Blog
            </>
          )}
        </Button>

        {generatedBlog && (
          <div className="space-y-4 mt-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Blog Generated!
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Title:</p>
              <p className="text-gray-900 font-bold text-xl">{generatedBlog.title}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Excerpt:</p>
              <p className="text-gray-800">{generatedBlog.excerpt}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Suggested Tags:</p>
              <div className="flex flex-wrap gap-2">
                {generatedBlog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Content (HTML):</p>
              <Textarea value={generatedBlog.content} rows={15} readOnly className="font-mono text-sm bg-white" />
            </div>
            <Button onClick={handleUseBlog} className="w-full bg-green-600 hover:bg-green-700">
              Use This Blog (Pre-fill Create Post Form)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
