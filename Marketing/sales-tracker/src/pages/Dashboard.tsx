import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Building2, Target, TrendingUp, Calendar, Search, Save, Globe, Bot, Sparkles, ExternalLink, Mail, MessageSquare } from "lucide-react"

interface Client { id: string; company_name: string; industry: string; website: string; contact_person: string; email: string; telephone_w: string; city: string; province: string; notes: string; }
interface Opportunity { id: string; client_id: string; source_of_opportunity: string; guestimated_value: number; planned_1st_meeting: string; outcome_of_1st_meeting: string; next_step: string; sales_rep: string; }

export function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState("")
  const [clientData, setClientData] = useState<Client | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState<any>({})
  const [agentStatus, setAgentStatus] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", company: "", message: "" })
  const [contactStatus, setContactStatus] = useState<string | null>(null)

  useEffect(() => { api.getClients().then(setClients) }, [])

  useEffect(() => {
    if (!selectedClient) return
    api.getClient(selectedClient).then(setClientData)
    api.getOpportunities(selectedClient).then(setOpportunities)
  }, [selectedClient])

  const filteredClients = clients.filter(c =>
    c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { label: "Total Clients", value: clients.length, icon: Building2, color: "text-blue-600 bg-blue-100" },
    { label: "Open Opportunities", value: opportunities.length, icon: Target, color: "text-violet-600 bg-violet-100" },
    { label: "Active Opportunities", value: opportunities.filter(o => o.outcome_of_1st_meeting && o.outcome_of_1st_meeting !== "End").length, icon: TrendingUp, color: "text-emerald-600 bg-emerald-100" },
  ]

  async function saveClient() {
    setAgentStatus(null)
    if (selectedClient) {
      await api.updateClient(selectedClient, form)
      api.getOpportunities(selectedClient).then(setOpportunities)
    } else {
      const res = await api.createClient(form)
      setSelectedClient(res.id)
      if (res.agentStatus === "research_started") {
        setAgentStatus("research_started")
        api.getOpportunities(res.id).then(setOpportunities)
      }
      api.getClient(res.id).then(d => { if (d) setClientData(d) }).catch(() => {})
    }
    api.getClients().then(setClients)
  }

  async function saveOpportunity() {
    if (!selectedClient) return
    await api.createOpportunity({ client_id: selectedClient, ...form })
    api.getOpportunities(selectedClient).then(setOpportunities)
  }

  async function submitContactForm() {
    if (!contactForm.name || !contactForm.email) {
      setContactStatus("error")
      return
    }
    try {
      await api.submitContact(contactForm)
      setContactStatus("success")
      setContactForm({ name: "", email: "", phone: "", company: "", message: "" })
    } catch {
      setContactStatus("error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Sales Tracker — Sales Management System</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color} dark:opacity-80`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Select or Add Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Search by Client ID or Name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedClient}
                  onChange={e => {
                    setSelectedClient(e.target.value)
                    if (e.target.value) {
                      api.getClient(e.target.value).then(c => { setClientData(c); setForm({}) })
                      api.getOpportunities(e.target.value).then(setOpportunities)
                    } else {
                      setClientData(null); setForm({})
                    }
                    setAgentStatus(null)
                  }}
                >
                  <option value="">-- New Client --</option>
                  {filteredClients.map(c => (
                    <option key={c.id} value={c.id}>{c.id} — {c.company_name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="ring-2 ring-primary">
              <CardHeader className="pb-2 py-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> REGISTER CLIENT
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2 text-xs">
                <div>
                  <label className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Building2 className="h-3 w-3" /> Company Name <span className="text-muted-foreground/50">(or URL below)</span>
                  </label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={form.company_name || clientData?.company_name || ""}
                    onChange={e => setForm({...form, company_name: e.target.value})}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Globe className="h-3 w-3" /> Company Website / URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com"
                      value={form.website || clientData?.website || ""}
                      onChange={e => setForm({...form, website: e.target.value})}
                      className="h-8 pl-7 text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Enter a company name, website URL, or both — the AI agent will use it for research
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div><label className="text-muted-foreground">Industry</label>
                    <input placeholder="e.g. Manufacturing" value={form.industry || clientData?.industry || ""} onChange={e => setForm({...form, industry: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Contact Person</label>
                    <input placeholder="Full Name" value={form.contact_person || clientData?.contact_person || ""} onChange={e => setForm({...form, contact_person: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Email</label>
                    <input placeholder="Email" value={form.email || clientData?.email || ""} onChange={e => setForm({...form, email: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Phone</label>
                    <input placeholder="Phone" value={form.telephone_w || clientData?.telephone_w || ""} onChange={e => setForm({...form, telephone_w: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                </div>

                <Button size="sm" className="w-full mt-1 h-8 text-xs gap-1" onClick={saveClient}>
                  {selectedClient ? (
                    <><Save className="h-3 w-3" /> Update Client</>
                  ) : (
                    <><Sparkles className="h-3 w-3" /> Register & Launch AI Agent</>
                  )}
                </Button>

                {agentStatus === "research_started" && (
                  <div className="flex items-center gap-1.5 p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-700 dark:text-emerald-400">
                    <Bot className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[11px]">AI agent launched — Research phase started. <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = "#agents" }} className="underline inline-flex items-center gap-0.5">View in AI Agents <ExternalLink className="h-2.5 w-2.5" /></a></span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 py-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-1">
                  <Target className="h-3 w-3" /> OPPORTUNITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-1.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-muted-foreground">Source</label>
                    <input placeholder="Source" value={form.source_of_opportunity || ""} onChange={e => setForm({...form, source_of_opportunity: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">1st Meeting</label>
                    <input type="date" value={form.planned_1st_meeting || ""} onChange={e => setForm({...form, planned_1st_meeting: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Value ($)</label>
                    <input type="number" placeholder="0" value={form.guestimated_value || ""} onChange={e => setForm({...form, guestimated_value: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Outcome</label>
                    <input placeholder="Outcome" value={form.outcome_of_1st_meeting || ""} onChange={e => setForm({...form, outcome_of_1st_meeting: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Next Step</label>
                    <input placeholder="Next Step" value={form.next_step || ""} onChange={e => setForm({...form, next_step: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                  <div><label className="text-muted-foreground">Sales Rep</label>
                    <input placeholder="Sales Rep" value={form.sales_rep || ""} onChange={e => setForm({...form, sales_rep: e.target.value})} className="flex h-7 w-full rounded border border-input bg-transparent px-2 text-xs" /></div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-1 h-7 text-xs" onClick={saveOpportunity}>
                  <Save className="h-3 w-3" /> Capture Opportunity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 py-3">
              <CardTitle className="text-xs font-semibold">STATUS SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-1.5 bg-muted/50 rounded">
                  <span>Client ID</span>
                  <span className="font-mono font-bold">{selectedClient || "—"}</span>
                </div>
                <div className="flex justify-between p-1.5 bg-muted/50 rounded">
                  <span>Opportunities</span>
                  <Badge variant="outline" className="text-xs">{opportunities.length}</Badge>
                </div>
                <div className="flex justify-between p-1.5 bg-muted/50 rounded">
                  <span>Active</span>
                  <Badge variant="success" className="text-xs">{opportunities.filter(o => o.outcome_of_1st_meeting && o.outcome_of_1st_meeting !== "End").length}</Badge>
                </div>
                {clientData && (
                  <>
                    <div className="flex justify-between p-1.5 bg-muted/50 rounded"><span>Company</span><span>{clientData.company_name || "—"}</span></div>
                    <div className="flex justify-between p-1.5 bg-muted/50 rounded"><span>Website</span><span className="truncate max-w-[120px]">{clientData.website || "—"}</span></div>
                    <div className="flex justify-between p-1.5 bg-muted/50 rounded"><span>Industry</span><span>{clientData.industry || "—"}</span></div>
                    <div className="flex justify-between p-1.5 bg-muted/50 rounded"><span>Contact</span><span>{clientData.contact_person || "—"}</span></div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 py-3">
              <CardTitle className="text-xs font-semibold flex items-center gap-1">
                <Bot className="h-3 w-3" /> AI Agent Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {agentStatus === "research_started" ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 p-2 bg-primary/5 rounded border border-primary/20">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="font-medium text-primary">Research Phase Active</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">AI agent is researching the company. Check AI Agents page for progress.</p>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs gap-1" onClick={() => window.location.hash = "#agents"}>
                    <Bot className="h-3 w-3" /> Go to AI Agents
                  </Button>
                </div>
              ) : selectedClient ? (
                <p className="text-xs text-muted-foreground">Agent project not yet launched for this client. Go to AI Agents to start.</p>
              ) : (
                <p className="text-xs text-muted-foreground">Register a client with a name or URL to launch the AI agent.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 py-3">
              <CardTitle className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                {opportunities.slice(0, 5).map((opp) => (
                  <div key={opp.id} className="text-xs p-1.5 bg-muted/30 rounded">
                    <span className="font-medium">{opp.id}</span>
                    <span className="text-muted-foreground ml-1">{opp.source_of_opportunity}</span>
                  </div>
                ))}
                {opportunities.length === 0 && <p className="text-xs text-muted-foreground">No opportunities yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Form Section */}
      <Card className="ring-2 ring-emerald-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-600" /> CONTACT FORM — Submit a Lead
          </CardTitle>
          <p className="text-xs text-muted-foreground">Fill out this form to create a new lead. Submissions appear in the Leads page.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
              <Input
                placeholder="Full Name"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
              <Input
                placeholder="Phone number"
                value={contactForm.phone}
                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Company</label>
              <Input
                placeholder="Company name"
                value={contactForm.company}
                onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Message</label>
            <textarea
              placeholder="How can we help you?"
              value={contactForm.message}
              onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="h-8 text-xs gap-1" onClick={submitContactForm}>
              <MessageSquare className="h-3 w-3" /> Submit Lead
            </Button>
            {contactStatus === "success" && (
              <span className="text-xs text-emerald-600 font-medium">Lead submitted successfully!</span>
            )}
            {contactStatus === "error" && (
              <span className="text-xs text-red-600 font-medium">Please fill in name and email.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
