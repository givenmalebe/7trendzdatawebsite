"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus, Edit, Trash2, Eye, FileText, Users, DollarSign, Crosshair, TrendingUp, Upload, Download, Search as SearchIcon, UserPlus,
} from "lucide-react"
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, type BlogPost } from "@/lib/blog-service"
import { fetchClients, createClient, updateClient, deleteClient, type Client } from "@/lib/client-service"
import { fetchRevenue, createRevenueEntry, deleteRevenueEntry, sumRevenue, type RevenueEntry } from "@/lib/revenue-service"
import {
  fetchReports, createReport, updateReportStage, attachReportFile, deleteReport, type RedTeamReport,
} from "@/lib/report-service"
import { fetchLeads, updateLeadStatus, deleteLead, type Lead } from "@/lib/lead-service"
import { uploadReportFile } from "@/lib/storage-service"
import { SERVICES_PRODUCTS, REPORT_STAGES, DELIVERY_STATUS_LABELS, type ReportStageId, type StageStatus } from "@/lib/catalog"
import { PostEditorForm } from "@/components/post-editor-form"
import { AIBlogGenerator } from "@/components/ai-blog-generator"
import { ReportStageTracker } from "@/components/report-stage-tracker"
import { OrderDeliveryEditor } from "@/components/admin/order-delivery-editor"

const LEAD_STATUSES: Lead["status"][] = ["new", "contacted", "qualified", "converted", "lost"]
const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-emerald-100 text-emerald-800",
  lost: "bg-slate-100 text-slate-600",
}

function LeadsTab({ leads, onRefresh }: { leads: Lead[]; onRefresh: () => Promise<void> }) {
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false
    if (search) {
      const s = search.toLowerCase()
      if (!l.name?.toLowerCase().includes(s) && !l.email?.toLowerCase().includes(s) && !l.company?.toLowerCase().includes(s)) return false
    }
    return true
  })

  const handleStatusChange = async (id: string, status: Lead["status"]) => {
    await updateLeadStatus(id, status)
    await onRefresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return
    await deleteLead(id)
    await onRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">{leads.length} total · {leads.filter((l) => l.status === "new").length} new</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...LEAD_STATUSES].map((s) => (
            <Badge
              key={s}
              variant={filter === s ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setFilter(s)}
            >
              {s === "all" ? `All (${leads.length})` : `${s} (${leads.filter((l) => l.status === s).length})`}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.length === 0 && <p className="text-muted-foreground">No leads found.</p>}
        {filtered.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{lead.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_COLORS[lead.status] || ""}`}>{lead.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}{lead.company ? ` · ${lead.company}` : ""}</p>
                  <p className="text-sm mt-1"><span className="font-medium">Interest:</span> {lead.interest}</p>
                  {lead.message && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{lead.message}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Source: {lead.source} · {new Date(lead.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v as Lead["status"])}>
                    <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(lead.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AdminContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "overview"

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [revenue, setRevenue] = useState<RevenueEntry[]>([])
  const [reports, setReports] = useState<RedTeamReport[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [blogTab, setBlogTab] = useState("ai-agent")

  const [newClient, setNewClient] = useState({ name: "", company: "", email: "", phone: "", status: "active" as Client["status"] })
  const [newRevenue, setNewRevenue] = useState({ clientId: "", serviceId: "", amount: "", status: "pending" as RevenueEntry["status"], notes: "" })
  const [newReport, setNewReport] = useState({ clientId: "", title: "", description: "" })
  const [selectedReport, setSelectedReport] = useState<RedTeamReport | null>(null)
  const [uploadingReport, setUploadingReport] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const loadAll = async () => {
    setLoading(true)
    try {
      const safe = <T,>(p: Promise<T>): Promise<T | null> => p.catch(() => null)
      const [p, c, r, rep, l] = await Promise.all([
        safe(fetchBlogPosts()),
        safe(fetchClients()),
        safe(fetchRevenue()),
        safe(fetchReports()),
        safe(fetchLeads()),
      ])
      if (p) setPosts(p)
      if (c) setClients(c)
      if (r) setRevenue(r)
      if (rep) setReports(rep)
      if (l) setLeads(l)
    } catch (e) {
      console.error("Load error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const stats = {
    clients: clients.length,
    activeClients: clients.filter((c) => c.status === "active").length,
    posts: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    revenueTotal: sumRevenue(revenue, "paid"),
    revenuePending: sumRevenue(revenue, "pending"),
    reports: reports.length,
    activeReports: reports.filter((r) => r.status === "active").length,
  }

  const handleSavePost = async (post: Omit<BlogPost, "id" | "created_at" | "views">) => {
    if (editingPost?.id) await updateBlogPost(editingPost.id, post)
    else await createBlogPost(post)
    setIsEditing(false)
    setEditingPost(null)
    await loadAll()
  }

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) return
    await createClient(newClient)
    setNewClient({ name: "", company: "", email: "", phone: "", status: "active" })
    await loadAll()
  }

  const handleAddRevenue = async () => {
    const client = clients.find((c) => c.id === newRevenue.clientId)
    const service = SERVICES_PRODUCTS.find((s) => s.id === newRevenue.serviceId)
    if (!client || !service || !newRevenue.amount) return
    await createRevenueEntry({
      clientId: client.id,
      clientName: client.name,
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      amount: parseFloat(newRevenue.amount),
      currency: "ZAR",
      status: newRevenue.status,
      date: new Date().toISOString(),
      notes: newRevenue.notes,
    })
    setNewRevenue({ clientId: "", serviceId: "", amount: "", status: "pending", notes: "" })
    await loadAll()
  }

  const handleAddReport = async () => {
    const client = clients.find((c) => c.id === newReport.clientId)
    if (!client || !newReport.title) return
    await createReport({ clientId: client.id, clientName: client.name, title: newReport.title, description: newReport.description })
    setNewReport({ clientId: "", title: "", description: "" })
    await loadAll()
  }

  const handleStageUpdate = async (reportId: string, stageId: ReportStageId, status: StageStatus) => {
    await updateReportStage(reportId, stageId, status)
    await loadAll()
    if (selectedReport?.id === reportId) {
      const updated = (await fetchReports()).find((r) => r.id === reportId)
      if (updated) setSelectedReport(updated)
    }
  }

  const handleUploadReport = async (reportId: string, file: File) => {
    setUploadingReport(true)
    setUploadError("")
    try {
      const { url, fileName } = await uploadReportFile(reportId, file)
      await attachReportFile(reportId, url, fileName)
      await updateReportStage(reportId, "delivery", "completed")
      await loadAll()
      const updated = (await fetchReports()).find((r) => r.id === reportId)
      if (updated) setSelectedReport(updated)
    } catch (err: any) {
      console.error("Upload failed:", err)
      setUploadError(err.message || "Upload failed. Check your connection and try again.")
    } finally {
      setUploadingReport(false)
    }
  }

  if (isEditing) {
    return (
      <AdminShell>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{editingPost ? "Edit Post" : "New Blog Post"}</h1>
            <Button variant="outline" onClick={() => { setIsEditing(false); setEditingPost(null) }}>Cancel</Button>
          </div>
          <PostEditorForm initialPost={editingPost || undefined} onSave={handleSavePost} onCancel={() => { setIsEditing(false); setEditingPost(null) }} />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      {tab === "overview" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Overview</h1>
            <p className="text-muted-foreground">Clients, revenue, blogs, and red team reports</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Clients", value: stats.activeClients, icon: Users, color: "text-cyan-600" },
              { label: "Revenue (Paid)", value: `R${stats.revenueTotal.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
              { label: "Published Posts", value: stats.published, icon: FileText, color: "text-blue-600" },
              { label: "Active Reports", value: stats.activeReports, icon: Crosshair, color: "text-red-600" },
            ].map((s) => (
              <Card key={s.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Recent Revenue</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {revenue.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex justify-between text-sm border-b pb-2">
                    <span>{r.clientName} — {r.serviceName}</span>
                    <span className="font-medium">R{r.amount.toLocaleString()}</span>
                  </div>
                ))}
                {revenue.length === 0 && <p className="text-muted-foreground text-sm">No revenue entries yet</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Active Red Team Reports</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {reports.filter((r) => r.status === "active").slice(0, 5).map((r) => (
                  <div key={r.id} className="flex justify-between text-sm border-b pb-2">
                    <span>{r.title}</span>
                    <Badge variant="outline">{r.currentStage}</Badge>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-muted-foreground text-sm">No reports yet</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "leads" && (
        <LeadsTab leads={leads} onRefresh={loadAll} />
      )}

      {tab === "blog" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <Button onClick={() => setIsEditing(true)} variant="outline"><Plus className="h-4 w-4 mr-2" /> Write Manually</Button>
          </div>
          <Tabs value={blogTab} onValueChange={setBlogTab}>
            <TabsList>
              <TabsTrigger value="ai-agent">🤖 AI Agent</TabsTrigger>
              <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            {blogTab === "ai-agent" && (
              <div className="mt-4">
                <AIBlogGenerator
                  onUseGeneratedBlog={(data) => {
                    setEditingPost({
                      id: "",
                      title: data.title,
                      excerpt: data.excerpt,
                      content: data.content,
                      category: data.category,
                      tags: data.tags,
                      status: data.status,
                      author: "7Trendz AI Agent",
                      published_at: "",
                      created_at: "",
                      views: 0,
                      image_url: data.image_url,
                    })
                    setIsEditing(true)
                    setBlogTab("all")
                  }}
                />
              </div>
            )}
            {blogTab !== "ai-agent" && (
              <TabsContent value={blogTab} className="space-y-3 mt-4">
                {posts.filter((p) => blogTab === "all" || p.status === blogTab).map((post) => {
                  const catMeta = ({ Cybersecurity: { icon: "🛡️", color: "bg-red-50 text-red-700 border-red-200" }, "Red Teaming": { icon: "🎯", color: "bg-orange-50 text-orange-700 border-orange-200" }, "Vulnerability Analysis": { icon: "🔍", color: "bg-amber-50 text-amber-700 border-amber-200" }, "Defender Matching": { icon: "🤝", color: "bg-cyan-50 text-cyan-700 border-cyan-200" } } as any)[post.category] || { icon: "📄", color: "bg-slate-50 text-slate-700 border-slate-200" }
                  return (
                    <Card key={post.id} className="group hover:shadow-md transition-all duration-300 border-slate-200/60">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {post.image_url && (
                            <div className="hidden sm:block relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                              <Image src={post.image_url} alt="" fill className="object-cover" unoptimized />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${catMeta.color}`}>
                                {catMeta.icon} {post.category}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${post.status === "published" ? "bg-emerald-500" : "bg-amber-400"}`} />
                                {post.status}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-800 truncate group-hover:text-cyan-700 transition-colors">{post.title}</h3>
                            <p className="text-sm text-slate-400 truncate mt-0.5">{post.excerpt}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                              <span>{post.author}</span>
                              <span>{post.views || 0} views</span>
                              {post.tags?.length > 0 && <span>{post.tags.length} tags</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-cyan-600" onClick={() => { setEditingPost(post); setIsEditing(true) }}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={async () => { await deleteBlogPost(post.id); loadAll() }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-700" asChild>
                              <a href={`/blog-reader?id=${post.id}`} target="_blank"><Eye className="h-3.5 w-3.5" /></a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {posts.filter((p) => blogTab === "all" || p.status === blogTab).length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No posts yet. Create your first one!</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}

      {tab === "clients" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Card>
            <CardHeader><CardTitle>Add Client</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div><Label>Name</Label><Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} /></div>
              <div><Label>Company</Label><Input value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} /></div>
              <Button onClick={handleAddClient} className="md:col-span-2 w-fit"><Plus className="h-4 w-4 mr-2" /> Add Client</Button>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            {clients.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-6 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{c.name} — {c.company}</p>
                    <p className="text-sm text-muted-foreground">{c.email} {c.phone && `· ${c.phone}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => deleteClient(c.id).then(loadAll)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "revenue" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Revenue & Services</h1>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Paid</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-emerald-600">R{stats.revenueTotal.toLocaleString()}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">R{stats.revenuePending.toLocaleString()}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Entries</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{revenue.length}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Record Sale</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Client</Label>
                <Select value={newRevenue.clientId} onValueChange={(v) => setNewRevenue({ ...newRevenue, clientId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Service / Product</Label>
                <Select value={newRevenue.serviceId} onValueChange={(v) => {
                  const s = SERVICES_PRODUCTS.find((x) => x.id === v)
                  setNewRevenue({ ...newRevenue, serviceId: v, amount: s ? String(s.defaultPrice) : "" })
                }}>
                  <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>{SERVICES_PRODUCTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} (R{s.defaultPrice})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Amount (ZAR)</Label><Input type="number" value={newRevenue.amount} onChange={(e) => setNewRevenue({ ...newRevenue, amount: e.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <Select value={newRevenue.status} onValueChange={(v) => setNewRevenue({ ...newRevenue, status: v as RevenueEntry["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddRevenue} className="md:col-span-2 w-fit"><Plus className="h-4 w-4 mr-2" /> Add Revenue</Button>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {revenue.map((r) => (
              <Card key={r.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{r.clientName} — {r.serviceName}</p>
                      <p className="text-sm text-muted-foreground">{new Date(r.date).toLocaleDateString()} · {r.category}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{DELIVERY_STATUS_LABELS[r.deliveryStatus] || r.deliveryStatus}</Badge>
                        <Badge variant="secondary">{r.deliveryProgress}%</Badge>
                      </div>
                      {r.clientUpdate && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{r.clientUpdate}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold">R{r.amount.toLocaleString()}</span>
                      <Badge variant={r.status === "paid" ? "default" : "secondary"}>{r.status}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => deleteRevenueEntry(r.id).then(loadAll)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </div>
                  <OrderDeliveryEditor order={r} onSaved={loadAll} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Red Team Reports</h1>
          {!selectedReport ? (
            <>
              <Card>
                <CardHeader><CardTitle>Create Report</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Client</Label>
                    <Select value={newReport.clientId} onValueChange={(v) => setNewReport({ ...newReport, clientId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Title</Label><Input value={newReport.title} onChange={(e) => setNewReport({ ...newReport, title: e.target.value })} placeholder="Q1 Red Team Assessment" /></div>
                  <div className="md:col-span-2"><Label>Description</Label><Textarea value={newReport.description} onChange={(e) => setNewReport({ ...newReport, description: e.target.value })} /></div>
                  <Button onClick={handleAddReport} className="w-fit"><Plus className="h-4 w-4 mr-2" /> Create Report</Button>
                </CardContent>
              </Card>
              <div className="grid gap-4">
                {reports.map((r) => (
                  <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReport(r)}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{r.title}</p>
                        <p className="text-sm text-muted-foreground">{r.clientName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{r.status}</Badge>
                        <Badge variant="outline">{REPORT_STAGES.find((s) => s.id === r.currentStage)?.label}</Badge>
                        {r.reportFileUrl && <Download className="h-4 w-4 text-emerald-600" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Button variant="outline" onClick={() => setSelectedReport(null)}>← Back to Reports</Button>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedReport.title}</CardTitle>
                  <CardDescription>{selectedReport.clientName} · {selectedReport.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ReportStageTracker stages={selectedReport.stages} currentStage={selectedReport.currentStage} />
                  <div className="grid gap-3 md:grid-cols-2">
                    {REPORT_STAGES.map((stage) => {
                      const s = selectedReport.stages.find((x) => x.id === stage.id)
                      return (
                        <div key={stage.id} className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => handleStageUpdate(selectedReport.id, stage.id, "in_progress")}>Start {stage.label}</Button>
                          <Button size="sm" onClick={() => handleStageUpdate(selectedReport.id, stage.id, "completed")}>Complete</Button>
                          {s?.status && <Badge variant="secondary">{s.status}</Badge>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t pt-4 space-y-3">
                    <Label>Upload Final Report (PDF)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept=".pdf"
                        className="mt-1"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadReport(selectedReport.id, file)
                          e.target.value = ""
                        }}
                        disabled={uploadingReport}
                      />
                    </div>
                    {uploadingReport && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600" />
                        Uploading PDF to client portal...
                      </div>
                    )}
                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    {selectedReport.reportFileUrl && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-emerald-800 truncate">{selectedReport.reportFileName || "Report file"}</p>
                          <p className="text-xs text-emerald-600">Uploaded and visible to client</p>
                        </div>
                        <Button asChild size="sm" variant="outline" className="border-emerald-300 hover:bg-emerald-100">
                          <a href={selectedReport.reportFileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" /> View
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button variant="destructive" onClick={() => { deleteReport(selectedReport.id).then(() => { setSelectedReport(null); loadAll() }) }}>Delete Report</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {loading && tab === "overview" && <p className="text-muted-foreground">Loading...</p>}
    </AdminShell>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminContent />
    </Suspense>
  )
}
