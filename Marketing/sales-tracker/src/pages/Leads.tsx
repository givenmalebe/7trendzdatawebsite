import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Users, Search, Mail, Phone, Building2, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react"

interface ContactLead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  message: string
  source: string
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-700",
}

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"]

export function Leads() {
  const [leads, setLeads] = useState<ContactLead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    api.getContactLeads().then(data => {
      setLeads(data)
      setLoading(false)
    })
  }, [])

  async function updateStatus(id: number, newStatus: string) {
    await api.updateContactLeadStatus(id, newStatus)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "New", value: leads.filter(l => l.status === "new").length, icon: AlertCircle, color: "text-amber-600 bg-amber-100" },
    { label: "Contacted", value: leads.filter(l => l.status === "contacted").length, icon: Mail, color: "text-violet-600 bg-violet-100" },
    { label: "Converted", value: leads.filter(l => l.status === "converted").length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
  ]

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading leads...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Contact Leads
          </h1>
          <p className="text-muted-foreground text-sm">Leads from the contact form — track and convert</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length > 0 ? (
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{lead.name}</span>
                        <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[lead.status] || ""}`}>
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3" /> {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3 w-3" /> {lead.company}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageSquare className="h-3 w-3" /> {lead.source}
                    </div>
                  </div>

                  {lead.message && (
                    <p className="text-xs text-muted-foreground mb-2 p-2 bg-muted/30 rounded">{lead.message}</p>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Update status:</span>
                    {STATUS_OPTIONS.map(status => (
                      <Button
                        key={status}
                        size="sm"
                        variant={lead.status === status ? "default" : "outline"}
                        className="h-6 text-[10px] px-2"
                        onClick={() => updateStatus(lead.id, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No leads found</p>
              <p className="text-xs text-muted-foreground mt-1">Submit a contact form on the Dashboard to create leads</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
