"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowRight, Clock, Eye, TrendingUp } from "lucide-react"
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

const CATEGORY_META: Record<string, { icon: string; gradient: string; text: string; bg: string }> = {
  Cybersecurity: { icon: "🛡️", gradient: "from-red-500 to-rose-600", text: "text-red-600", bg: "bg-red-50 border-red-100" },
  "AI Automation": { icon: "🤖", gradient: "from-blue-500 to-indigo-600", text: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  "Agentic AI": { icon: "🧠", gradient: "from-purple-500 to-violet-600", text: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
  "Red Teaming": { icon: "🎯", gradient: "from-orange-500 to-red-600", text: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  "Vulnerability Analysis": { icon: "🔍", gradient: "from-amber-500 to-yellow-600", text: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  "Defender Matching": { icon: "🤝", gradient: "from-cyan-500 to-teal-600", text: "text-cyan-600", bg: "bg-cyan-50 border-cyan-100" },
  Technology: { icon: "💻", gradient: "from-slate-500 to-gray-600", text: "text-slate-600", bg: "bg-slate-50 border-slate-100" },
  Business: { icon: "📊", gradient: "from-emerald-500 to-green-600", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
}

const CATEGORIES = ["All", "Cybersecurity", "AI Automation", "Agentic AI", "Red Teaming", "Vulnerability Analysis", "Defender Matching", "Technology", "Business"]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchPosts() }, [])
  useEffect(() => { filterPosts() }, [posts, searchTerm, selectedCategory])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await fetchBlogPosts({ status: "published" })
      setPosts(data || [])
    } catch (error: any) {
      if (error?.name !== "AbortError") console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts
    if (selectedCategory !== "All") filtered = filtered.filter((p) => p.category === selectedCategory)
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q)))
    }
    setFilteredPosts(filtered)
  }

  const getReadTime = (content: string) => Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length / 200)
  const getCatMeta = (cat: string) => CATEGORY_META[cat] || { icon: "📄", gradient: "from-slate-500 to-gray-600", text: "text-slate-600", bg: "bg-slate-50 border-slate-100" }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/70 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Latest insights & research
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            The <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">7Trendz</span> Blog
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Expert insights on AI automation, cybersecurity red teaming, and vulnerability analysis for South African businesses
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="relative -mt-8 z-10 container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-slate-50 border-slate-200 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl text-base"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-56 h-12 bg-slate-50 border-slate-200 rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((cat) => {
              const meta = getCatMeta(cat)
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {cat !== "All" && <span className="mr-1">{meta.icon}</span>}
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-slate-400 text-sm">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No articles found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => {
              const meta = getCatMeta(post.category)
              return (
                <Link key={post.id} href={`/blog-reader?id=${post.id}`} className="group block">
                  <article className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/10]">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                          <span className="text-5xl opacity-50">{meta.icon}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg backdrop-blur-sm border ${meta.bg} ${meta.text}`}>
                          {meta.icon} {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{post.author?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{getReadTime(post.content)}m</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
