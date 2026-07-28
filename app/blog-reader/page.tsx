"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, Clock, Share2, ArrowUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { fetchBlogPost, incrementViews } from "@/lib/blog-service"
import { formatBlogContent } from "@/lib/format-content"
import { sanitizeHTML } from "@/lib/sanitize"

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

const CATEGORY_META: Record<string, { icon: string; gradient: string; text: string; bg: string; border: string }> = {
  Cybersecurity: { icon: "🛡️", gradient: "from-red-500 to-rose-600", text: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  "AI Automation": { icon: "🤖", gradient: "from-blue-500 to-indigo-600", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  "Agentic AI": { icon: "🧠", gradient: "from-purple-500 to-violet-600", text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  "Red Teaming": { icon: "🎯", gradient: "from-orange-500 to-red-600", text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  "Vulnerability Analysis": { icon: "🔍", gradient: "from-amber-500 to-yellow-600", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  "Defender Matching": { icon: "🤝", gradient: "from-cyan-500 to-teal-600", text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  Technology: { icon: "💻", gradient: "from-slate-500 to-gray-600", text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100" },
  Business: { icon: "📊", gradient: "from-emerald-500 to-green-600", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
}

export default function BlogReader() {
  const searchParams = useSearchParams()
  const postId = searchParams.get("id")
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (postId) fetchPost(postId)
  }, [postId])

  const fetchPost = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await fetchBlogPost(id)
      if (data) {
        setPost(data)
        try { await incrementViews(id) } catch {}
      }
    } catch (error: any) {
      if (error?.name !== "AbortError" && error?.code !== "failed-precondition") {
        console.error("Error fetching post:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getReadTime = (c: string) => Math.ceil(c.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length / 200)
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: post?.title, url: window.location.href })
    else navigator.clipboard.writeText(window.location.href)
  }

  const meta = post ? (CATEGORY_META[post.category] || { icon: "📄", gradient: "from-slate-500 to-gray-600", text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100" }) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading post...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Post Not Found</h1>
          <p className="text-slate-500 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/blog"><Button className="bg-slate-900 hover:bg-slate-800 rounded-xl"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Button></Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>

          {meta && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border ${meta.bg} ${meta.border} ${meta.text} mb-5`}>
              {meta.icon} {post.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight max-w-3xl">
            {post.title}
          </h1>

          <p className="text-lg text-white/50 mb-8 max-w-2xl leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{post.author?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-white/80 font-medium">{post.author}</p>
                <p className="text-xs text-white/40">Author</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>{new Date(post.created_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</span></div>
            <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /><span>{post.views} views</span></div>
            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{getReadTime(post.content)} min read</span></div>
            <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-white/70 transition-colors ml-auto">
              <Share2 className="h-4 w-4" /><span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image_url && (
        <section className="relative -mt-8 z-10 container mx-auto px-4 max-w-5xl">
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-100">
            <Image src={post.image_url} alt={post.title} fill className="object-cover" unoptimized />
          </div>
        </section>
      )}

      {/* Article Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <article>
            {/* Content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatBlogContent(post.content)) }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 text-sm font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Need a security assessment?</h3>
            <p className="text-white/50 mb-6 text-sm">Get expert red teaming and AI automation consulting for your business.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/contact">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                  View Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Back */}
          <div className="mt-8 text-center">
            <Link href="/blog">
              <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-300/50 flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <Footer />
    </div>
  )
}
