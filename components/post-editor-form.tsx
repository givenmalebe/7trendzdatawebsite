"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, X, Upload, Bold, Italic, List, LinkIcon, ImageIcon, Eye, Code, Type, Quote, Minus, ArrowLeft, Sparkles, FileText, Hash } from "lucide-react"
import Image from "next/image"
import { formatBlogContent } from "@/lib/format-content"
import { sanitizeHTML } from "@/lib/sanitize"

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

const CATEGORY_META: Record<string, { icon: string; gradient: string; color: string }> = {
  Cybersecurity: { icon: "🛡️", gradient: "from-red-500 to-rose-600", color: "bg-red-50 text-red-700 border-red-200" },
  "AI Automation": { icon: "🤖", gradient: "from-blue-500 to-indigo-600", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Agentic AI": { icon: "🧠", gradient: "from-purple-500 to-violet-600", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "Red Teaming": { icon: "🎯", gradient: "from-orange-500 to-red-600", color: "bg-orange-50 text-orange-700 border-orange-200" },
  "Vulnerability Analysis": { icon: "🔍", gradient: "from-amber-500 to-yellow-600", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "Defender Matching": { icon: "🤝", gradient: "from-cyan-500 to-teal-600", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  Technology: { icon: "💻", gradient: "from-slate-500 to-gray-600", color: "bg-slate-50 text-slate-700 border-slate-200" },
  Business: { icon: "📊", gradient: "from-emerald-500 to-green-600", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

const CATEGORIES = Object.keys(CATEGORY_META)

export function PostEditorForm({ initialPost, onSave, onCancel }: PostEditorFormProps) {
  const [title, setTitle] = useState(initialPost?.title || "")
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "")
  const [content, setContent] = useState(initialPost?.content || "")
  const [author, setAuthor] = useState(initialPost?.author || "")
  const [category, setCategory] = useState(initialPost?.category || "")
  const [status, setStatus] = useState<"published" | "draft">(initialPost?.status || "published")
  const [tags, setTags] = useState<string[]>(initialPost?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [imageUrl, setImageUrl] = useState(initialPost?.image_url || "")
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

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

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
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
      const response = await fetch("/api/upload-image", { method: "POST", body: formData })
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
    const textarea = contentRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let newText = content

    switch (format) {
      case "bold": newText = content.substring(0, start) + `<strong>${selectedText || "bold text"}</strong>` + content.substring(end); break
      case "italic": newText = content.substring(0, start) + `<em>${selectedText || "italic text"}</em>` + content.substring(end); break
      case "heading": newText = content.substring(0, start) + `<h2>${selectedText || "Heading"}</h2>` + content.substring(end); break
      case "h3": newText = content.substring(0, start) + `<h3>${selectedText || "Subheading"}</h3>` + content.substring(end); break
      case "list": newText = content.substring(0, start) + `<ul>\n  <li>${selectedText || "List item"}</li>\n</ul>` + content.substring(end); break
      case "quote": newText = content.substring(0, start) + `<blockquote class="border-l-4 border-cyan-500 pl-4 italic text-gray-600">${selectedText || "Quote"}</blockquote>` + content.substring(end); break
      case "hr": newText = content.substring(0, start) + `\n<hr class="my-8 border-gray-200" />\n` + content.substring(end); break
      case "link": {
        const url = prompt("Enter URL:")
        if (url) newText = content.substring(0, start) + `<a href="${url}" class="text-cyan-600 hover:underline">${selectedText || "Link text"}</a>` + content.substring(end)
        break
      }
      case "image": {
        const imgUrl = prompt("Enter image URL:")
        if (imgUrl) newText = content.substring(0, start) + `<img src="${imgUrl}" alt="Image" class="w-full rounded-lg my-4" />` + content.substring(end)
        break
      }
    }
    setContent(newText)
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + 10, start + 10) }, 0)
  }

  const handleSubmit = () => {
    if (!title || !excerpt || !content || !author || !category) {
      alert("Please fill in all required fields")
      return
    }
    onSave({
      title, excerpt, content, author, category, status,
      published_at: status === "published" ? new Date().toISOString() : "",
      tags, image_url: imageUrl,
    })
  }

  const charCount = content.replace(/<[^>]*>/g, "").length
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
  const catMeta = CATEGORY_META[category]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-500 hover:text-slate-700">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-600" />
              <span className="text-sm font-medium text-slate-700">
                {initialPost?.id ? "Editing Post" : "New Post"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 mr-4">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
              <span>{tags.length} tags</span>
            </div>
            <Select value={status} onValueChange={(value: "published" | "draft") => setStatus(value)}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status === "published" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> Draft</div>
                </SelectItem>
                <SelectItem value="published">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Published</div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={onCancel} className="hidden sm:flex">
              Cancel
            </Button>
            <Button onClick={handleSubmit} size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25">
              <Save className="h-4 w-4 mr-1.5" />
              {initialPost?.id ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Editor */}
          <div className="space-y-5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white border border-slate-200 shadow-sm h-11 p-1 w-full justify-start gap-1">
                <TabsTrigger value="edit" className="flex items-center gap-2 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4">
                  <Code className="h-3.5 w-3.5" /> Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-5 mt-5">
                {/* Title */}
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter your blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full text-3xl md:text-4xl font-bold text-slate-900 placeholder:text-slate-300 bg-transparent border-none outline-none py-2 transition-all duration-300 focus:ring-0"
                  />
                  <div className={`h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 ${focusedField === "title" || title ? "w-full opacity-100" : "w-0 opacity-0"}`} />
                </div>

                {/* Excerpt */}
                <div className="relative">
                  <Textarea
                    placeholder="Write a compelling excerpt that will appear in blog listings..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    onFocus={() => setFocusedField("excerpt")}
                    onBlur={() => setFocusedField(null)}
                    rows={2}
                    className="text-base text-slate-600 placeholder:text-slate-300 bg-slate-50/80 border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20 resize-none rounded-xl transition-all duration-300"
                  />
                </div>

                {/* Featured Image */}
                <Card className="overflow-hidden border-slate-200/60 shadow-sm">
                  <CardContent className="p-0">
                    {imageUrl ? (
                      <div className="relative group">
                        <div className="relative w-full h-64 bg-slate-100">
                          <Image src={imageUrl} alt="Featured" fill className="object-cover" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white/90 text-sm font-medium">Featured Image</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => setImageUrl("")} className="h-8 bg-white/90 hover:bg-white text-slate-700">
                                <X className="h-3.5 w-3.5 mr-1" /> Remove
                              </Button>
                              <label className="cursor-pointer">
                                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} className="hidden" />
                                <div className="h-8 px-3 flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-md text-sm font-medium transition-colors">
                                  <Upload className="h-3.5 w-3.5" /> Replace
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} className="hidden" />
                        <div className="h-48 border-2 border-dashed border-slate-200 hover:border-cyan-400 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-cyan-50/50 hover:to-blue-50/50 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 group">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-cyan-100 flex items-center justify-center transition-colors duration-300">
                            <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-500 group-hover:text-cyan-600 transition-colors">
                              {isUploading ? "Uploading..." : "Click to upload featured image"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      </label>
                    )}
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
                      {[
                        { icon: Bold, format: "bold", tip: "Bold" },
                        { icon: Italic, format: "italic", tip: "Italic" },
                        { icon: Type, format: "heading", tip: "Heading H2" },
                        { icon: Hash, format: "h3", tip: "Subheading H3" },
                        null,
                        { icon: List, format: "list", tip: "Bullet List" },
                        { icon: Quote, format: "quote", tip: "Blockquote" },
                        { icon: Minus, format: "hr", tip: "Divider" },
                        null,
                        { icon: LinkIcon, format: "link", tip: "Insert Link" },
                        { icon: ImageIcon, format: "image", tip: "Insert Image" },
                      ].map((item, i) =>
                        item === null ? (
                          <div key={i} className="w-px h-5 bg-slate-200 mx-1" />
                        ) : (
                          <button
                            key={i}
                            type="button"
                            title={item.tip}
                            onClick={() => insertFormatting(item.format)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 active:scale-95"
                          >
                            <item.icon className="h-4 w-4" />
                          </button>
                        )
                      )}
                      <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                        <span>HTML</span>
                      </div>
                    </div>
                    <textarea
                      ref={contentRef}
                      placeholder="Start writing your blog post..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onFocus={() => setFocusedField("content")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full min-h-[400px] p-5 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-300 bg-white font-mono border-none outline-none resize-y focus:ring-0"
                    />
                  </CardContent>
                </Card>
                <p className="text-xs text-slate-400 px-1">
                  Supports HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt;, &lt;blockquote&gt;
                </p>
              </TabsContent>

              <TabsContent value="preview" className="mt-5">
                <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    {imageUrl && (
                      <div className="relative w-full h-72 bg-slate-100">
                        <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="p-8 md:p-12 max-w-3xl mx-auto">
                      {category && (
                        <Badge className={`mb-4 ${catMeta?.color || "bg-slate-100 text-slate-700"} border text-xs font-medium px-3 py-1`}>
                          {catMeta?.icon} {category}
                        </Badge>
                      )}
                      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                        {title || "Your post title"}
                      </h1>
                      <p className="text-lg text-slate-500 mb-6 leading-relaxed">
                        {excerpt || "Your excerpt will appear here..."}
                      </p>
                      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {(author || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{author || "Author"}</p>
                          <p className="text-xs text-slate-400">{status === "published" ? "Published now" : "Draft"}</p>
                        </div>
                      </div>
                      <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatBlogContent(content) || "<p class='text-slate-300 italic'>Start writing to see a preview...</p>") }}
                      />
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
                          {tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Category */}
            <Card className="border-slate-200/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat]
                    const isActive = category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all duration-200 border ${
                          isActive
                            ? `bg-gradient-to-r ${meta.gradient} text-white border-transparent shadow-lg scale-[1.02]`
                            : "bg-white text-slate-600 border-slate-200/60 hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <span className="text-base mr-1">{meta.icon}</span>
                        <span className="leading-tight">{cat}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Author */}
            <Card className="border-slate-200/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Author</Label>
                <Input
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20 h-10"
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-slate-200/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag() } }}
                    className="border-slate-200/60 focus:border-cyan-400 focus:ring-cyan-400/20 h-9 text-sm"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" size="sm" className="h-9 px-3">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors group"
                      >
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-red-500 transition-colors ml-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-slate-50 to-white">
              <CardContent className="p-4">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Post Stats</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                    <p className="text-lg font-bold text-slate-800">{wordCount}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Words</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                    <p className="text-lg font-bold text-slate-800">{Math.ceil(wordCount / 200) || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Min Read</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                    <p className="text-lg font-bold text-slate-800">{tags.length}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tags</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                    <p className="text-lg font-bold text-slate-800">{content.split("<a ").length - 1}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Links</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
