"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  Search,
  PenTool,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ImageIcon,
  Link2,
  Brain,
  Zap,
  Settings,
  Check,
} from "lucide-react"
import {
  researchTopic,
  generateBlog,
  BLOG_CATEGORIES,
  SUGGESTED_TOPICS,
  type ResearchResult,
  type GeneratedBlog,
} from "@/lib/blog-agent"

import { authFetch } from "@/lib/auth-fetch"
import { sanitizeHTML } from "@/lib/sanitize"

interface AIBlogGeneratorProps {
  onUseGeneratedBlog: (postData: {
    title: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    status: "draft" | "published"
    image_url?: string
  }) => void
}

type AgentStep = "topic" | "research" | "generating" | "review"

export function AIBlogGenerator({ onUseGeneratedBlog }: AIBlogGeneratorProps) {
  const [step, setStep] = useState<AgentStep>("topic")
  const [topic, setTopic] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [research, setResearch] = useState<ResearchResult | null>(null)
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [showTopics, setShowTopics] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)
  const [savingKey, setSavingKey] = useState(false)
  const [showKeyConfig, setShowKeyConfig] = useState(false)

  useEffect(() => {
    authFetch("/api/admin-settings")
      .then((r) => r.json())
      .then((data) => {
        const key = data.openrouter_api_key || ""
        setApiKey(key)
        setApiKeyConfigured(!!key)
      })
      .catch(() => setApiKeyConfigured(false))
  }, [])

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return
    setSavingKey(true)
    try {
      await authFetch("/api/admin-settings", {
        method: "POST",
        body: JSON.stringify({ openrouter_api_key: apiKey.trim() }),
      })
      setApiKeyConfigured(true)
      setShowKeyConfig(false)
    } catch {
      setError("Failed to save API key.")
    } finally {
      setSavingKey(false)
    }
  }

  const handleResearch = async () => {
    if (!topic.trim() || !category) {
      setError("Please enter a topic and select a category.")
      return
    }
    setError("")
    setLoading("Agent: researching latest trends...")
    try {
      const result = await researchTopic(topic, category)
      setResearch(result)
      setStep("research")
    } catch (err: any) {
      setError(err.message || "Research failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handleGenerate = async () => {
    if (!research) return
    setError("")
    setLoading("Agent: planning outline...")
    try {
      const blog = await generateBlog(topic, category, research)
      setGeneratedBlog(blog)
      setStep("generating")
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handleUseBlog = () => {
    if (!generatedBlog) return
    onUseGeneratedBlog({
      title: generatedBlog.title,
      excerpt: generatedBlog.excerpt,
      content: generatedBlog.content,
      category: generatedBlog.category,
      tags: generatedBlog.tags,
      status: "published",
      image_url: imageUrl || generatedBlog.image_url,
    })
  }

  const handleReset = () => {
    setStep("topic")
    setTopic("")
    setCategory("")
    setImageUrl("")
    setResearch(null)
    setGeneratedBlog(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Blog Agent</h3>
                <p className="text-cyan-100 text-sm">smolagents — Research → Outline → Write → SEO Review</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" /> New
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Key Config */}
      {apiKeyConfigured === false && !showKeyConfig && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">API key required — uses free model, no charges</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowKeyConfig(true)}>
                <Settings className="h-3.5 w-3.5 mr-1" /> Add Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showKeyConfig && (
        <Card className="border-cyan-200">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div>
              <Label className="font-semibold text-sm">OpenRouter API Key</Label>
              <p className="text-xs text-muted-foreground mt-1">Uses free model — no charges</p>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} disabled={!apiKey.trim() || savingKey} size="sm">
                {savingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your key at{" "}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-cyan-600 underline">
                openrouter.ai/keys
              </a>{" "}
              — key is tested and verified before saving
            </p>
          </CardContent>
        </Card>
      )}

      {apiKeyConfigured === true && (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Check className="h-4 w-4" />
          <span>API key configured — using free model</span>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setShowKeyConfig(!showKeyConfig)}>
            Change
          </Button>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center gap-2 text-sm">
        {[
          { id: "topic", label: "Topic", icon: PenTool },
          { id: "research", label: "Research", icon: Search },
          { id: "generating", label: "Write", icon: Sparkles },
          { id: "review", label: "Review", icon: CheckCircle },
        ].map((s, i) => {
          const active = step === s.id
          const done =
            (step === "research" && i === 0) ||
            (step === "generating" && i <= 1) ||
            (step === "review" && i <= 2)
          return (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className={`w-6 h-px ${done ? "bg-cyan-500" : "bg-slate-300"}`} />}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  active ? "bg-cyan-100 text-cyan-700" : done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                <s.icon className="h-3 w-3" />
                {s.label}
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: Topic Selection */}
      {step === "topic" && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label className="font-semibold">Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { setCategory(cat.value); setShowTopics(false) }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      category === cat.value
                        ? "border-cyan-500 bg-cyan-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <p className="text-sm font-medium mt-1">{cat.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {category && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Topic</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTopics(!showTopics)}
                    className="text-cyan-600"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {showTopics ? "Hide" : "Suggest Topics"}
                  </Button>
                </div>
                {showTopics && (
                  <div className="grid gap-2 p-3 bg-slate-50 rounded-lg">
                    {(SUGGESTED_TOPICS[category] || []).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTopic(t)
                          setShowTopics(false)
                        }}
                        className="text-left p-2.5 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-sm transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  placeholder="e.g., How AI Agents Are Revolutionizing Cybersecurity"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResearch()}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-semibold">Featured Image (optional)</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Paste image URL or upload below"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (ev) => setImageUrl(ev.target?.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4 mr-1" /> Upload
                  </Button>
                </div>
              </div>
              {imageUrl && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden mt-2">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <Button
              onClick={handleResearch}
              disabled={!topic.trim() || !category || !!loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {loading}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" /> Start Research
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Research Results */}
      {step === "research" && research && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-cyan-600" />
                Research Complete
              </CardTitle>
              <CardDescription>Key findings for &quot;{topic}&quot;</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Findings</h4>
                <ul className="space-y-1.5">
                  {research.keyFindings.map((f, i) => (
                    <li key={i} className="text-sm text-slate-600 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-cyan-500 before:font-bold">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {research.trends.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Trends</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {research.trends.map((t, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {research.statistics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Statistics</h4>
                  <ul className="space-y-1.5">
                    {research.statistics.map((s, i) => (
                      <li key={i} className="text-sm text-slate-600">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {research.expertQuotes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Expert Insights</h4>
                  <ul className="space-y-1.5">
                    {research.expertQuotes.map((q, i) => (
                      <li key={i} className="text-sm text-slate-600 italic">&ldquo;{q}&rdquo;</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={!!loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-11"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {loading}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> Generate Blog with SEO Backlinks
              </>
            )}
          </Button>
        </div>
      )}

      {/* Step 3: Generated Blog Review */}
      {step === "generating" && generatedBlog && (
        <div className="space-y-4">
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-5 w-5" />
                Blog Generated Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                  <p className="font-bold text-lg">{generatedBlog.title}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Slug</Label>
                  <p className="text-sm text-muted-foreground font-mono">/blog/{generatedBlog.slug}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Excerpt</Label>
                <p className="text-sm">{generatedBlog.excerpt}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">SEO Meta Description</Label>
                <p className="text-sm text-slate-600">{generatedBlog.meta_description}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {generatedBlog.tags.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Backlinks to 7trendzdata.com</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <Link2 className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-sm text-cyan-600 font-medium">
                    {(generatedBlog.content.match(/7trendzdata\.com/g) || []).length} internal links found
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Content Preview</Label>
                <div
                  className="prose prose-sm max-h-72 overflow-y-auto border rounded-lg p-4 mt-1"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(generatedBlog.content) }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" /> Start Over
            </Button>
            <Button onClick={handleUseBlog} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <ArrowRight className="h-4 w-4 mr-2" /> Use This Blog
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
