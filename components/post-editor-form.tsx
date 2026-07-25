"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, X, Upload, Bold, Italic, List, LinkIcon, ImageIcon } from "lucide-react"
import Image from "next/image"

interface BlogPost {
  id?: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  status: "published" | "draft"
  published_at: string
  created_at?: string
  views?: number
  tags: string[]
  image_url?: string
}

interface PostEditorFormProps {
  initialPost?: BlogPost
  onSave: (post: Omit<BlogPost, "id" | "created_at" | "views">) => void
  onCancel: () => void
}

export function PostEditorForm({ initialPost, onSave, onCancel }: PostEditorFormProps) {
  const [title, setTitle] = useState(initialPost?.title || "")
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "")
  const [content, setContent] = useState(initialPost?.content || "")
  const [author, setAuthor] = useState(initialPost?.author || "")
  const [category, setCategory] = useState(initialPost?.category || "")
  const [status, setStatus] = useState<"published" | "draft">(initialPost?.status || "draft")
  const [tags, setTags] = useState<string[]>(initialPost?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [imageUrl, setImageUrl] = useState(initialPost?.image_url || "")
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title)
      setExcerpt(initialPost.excerpt)
      setContent(initialPost.content)
      setAuthor(initialPost.author)
      setCategory(initialPost.category)
      setStatus(initialPost.status)
      setTags(initialPost.tags)
      setImageUrl(initialPost.image_url || "")
    }
  }, [initialPost])

  const categories = [
    "Artificial Intelligence",
    "Data Science",
    "Microsoft Copilot",
    "Microsoft Fabric",
    "Chatbots & AI Agents",
    "Technology",
    "Business",
    "Tutorials",
  ]

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.url)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let newText = content

    switch (format) {
      case "bold":
        newText = content.substring(0, start) + `<strong>${selectedText}</strong>` + content.substring(end)
        break
      case "italic":
        newText = content.substring(0, start) + `<em>${selectedText}</em>` + content.substring(end)
        break
      case "heading":
        newText = content.substring(0, start) + `<h2>${selectedText}</h2>` + content.substring(end)
        break
      case "list":
        newText = content.substring(0, start) + `<ul>\n  <li>${selectedText}</li>\n</ul>` + content.substring(end)
        break
      case "link":
        const url = prompt("Enter URL:")
        if (url) {
          newText =
            content.substring(0, start) + `<a href="${url}">${selectedText || "Link text"}</a>` + content.substring(end)
        }
        break
      case "image":
        const imgUrl = prompt("Enter image URL:")
        if (imgUrl) {
          newText = content.substring(0, start) + `<img src="${imgUrl}" alt="Image" />` + content.substring(end)
        }
        break
    }

    setContent(newText)
  }

  const handleSubmit = () => {
    if (!title || !excerpt || !content || !author || !category) {
      alert("Please fill in all required fields")
      return
    }

    onSave({
      title,
      excerpt,
      content,
      author,
      category,
      status,
      published_at: status === "published" ? new Date().toISOString() : "",
      tags,
      image_url: imageUrl,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="text"
                      placeholder="Enter image URL or upload an image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <Button type="button" variant="outline" disabled={isUploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
                {imageUrl && (
                  <div className="relative w-full h-48 mt-2 rounded-md overflow-hidden">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter blog post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your post (shown in listings)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <div className="border rounded-md">
                  {/* Formatting Toolbar */}
                  <div className="flex gap-1 p-2 border-b bg-gray-50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("bold")}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("italic")}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("heading")}
                      title="Heading"
                    >
                      H2
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("list")}
                      title="List"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("link")}
                      title="Link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("image")}
                      title="Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here. You can use HTML formatting."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="border-0 focus-visible:ring-0 font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Use the toolbar buttons to format text, or write HTML directly. Supports: &lt;strong&gt;, &lt;em&gt;,
                  &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt;
                </p>
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={(value: "published" | "draft") => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  {initialPost?.id ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <article className="prose prose-lg max-w-none">
                {imageUrl && (
                  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                    <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="mb-4">
                  <Badge>{category || "Category"}</Badge>
                </div>
                <h1 className="text-4xl font-bold mb-4">{title || "Post Title"}</h1>
                <p className="text-gray-600 mb-6">{excerpt || "Post excerpt will appear here"}</p>
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: content || "<p>Post content will appear here</p>" }}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </article>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
