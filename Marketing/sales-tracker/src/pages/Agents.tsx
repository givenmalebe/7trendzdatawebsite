import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import {
  Bot, Play, Search, Building2, Mail, Users,
  FileSearch, CheckCircle2, Clock, Plus, Zap, ChevronDown,
  ChevronRight,
} from "lucide-react"

interface AgentProject {
  id: number; client_id: string; client_name: string; industry: string; website: string;
  status: string; phase: string; week: number; start_date: string;
  phaseName: string; progress: number; completed_tasks: number; total_tasks: number;
  tasks: AgentTask[]; leads: any[]; competitors: any[]; communications: any[]; opportunities: any[];
}
interface AgentTask {
  id: number; project_id: number; phase: string; week: number;
  task_type: string; title: string; description: string;
  status: string; result: string; structured_data: string;
  agent_name: string; completed_at: string;
}

const PHASE_COLORS: Record<string, string> = {
  research: "border-l-blue-500", lead_gen: "border-l-violet-500", outreach: "border-l-emerald-500",
}
const PHASE_ICONS: Record<string, any> = { research: FileSearch, lead_gen: Users, outreach: Mail }

function TaskResult({ task }: { task: AgentTask }) {
  const [open, setOpen] = useState(false)
  let data: any = null
  try { data = task.structured_data ? JSON.parse(task.structured_data) : null } catch {}

  return (
    <div className={`rounded-lg border text-xs ${task.status === "completed" ? "bg-muted/20" : "bg-background"}`}>
      <button
        className="w-full flex items-center gap-2 p-2 text-left"
        onClick={() => setOpen(!open)}
      >
        {task.status === "completed" ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        ) : (
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <span className="flex-1 font-medium">{task.title}</span>
        <span className="text-muted-foreground">{task.agent_name}</span>
        {task.status === "completed" && (open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
      </button>
      {open && task.status === "completed" && (
        <div className="p-2 pt-0 space-y-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded border border-emerald-200 dark:border-emerald-800">
            <p className="text-emerald-700 dark:text-emerald-400">{task.result}</p>
          </div>
          {data && Object.keys(data).length > 0 && (
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(data).map(([k, v]) => (
                <div key={k} className="p-1.5 bg-muted/30 rounded">
                  <span className="text-muted-foreground">{k.replace(/_/g, " ")}: </span>
                  <span className="font-medium">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PhaseTimeline({ project }: { project: AgentProject }) {
  const phases = [
    { key: "research", name: "Research & Analysis", weeks: "1-4" },
    { key: "lead_gen", name: "Lead Generation", weeks: "5-8" },
    { key: "outreach", name: "Outreach & Email", weeks: "9-12" },
  ]
  return (
    <div className="space-y-3">
      {phases.map((phase) => {
        const isActive = project.phase === phase.key
        const isPast = phases.findIndex(p => p.key === phase.key) < phases.findIndex(p => p.key === project.phase)
        const tasks = project.tasks.filter(t => t.phase === phase.key)
        const completed = tasks.filter(t => t.status === "completed").length
        const Icon = PHASE_ICONS[phase.key]
        return (
          <div key={phase.key} className={`border-l-4 pl-4 py-2 ${PHASE_COLORS[phase.key]} ${isActive ? "bg-primary/5" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : isPast ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{phase.name}</span>
                <span className="text-[10px] text-muted-foreground">Week {phase.weeks}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] ${isActive ? "bg-primary/10" : ""}`}>{completed}/{tasks.length}</Badge>
            </div>
            <div className="space-y-1">
              {tasks.map((task) => <TaskResult key={task.id} task={task} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Agents() {
  const [projects, setProjects] = useState<AgentProject[]>([])
  const [selectedProject, setSelectedProject] = useState<AgentProject | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClientId, setNewClientId] = useState("")
  const [activeTab, setActiveTab] = useState<"timeline" | "leads" | "competitors" | "comms" | "pipeline">("timeline")
  const [refreshKey, setRefreshKey] = useState(0)

  const loadProject = useCallback(async (id: number) => {
    const p = await api.getAgentProject(id)
    setSelectedProject(p)
    setProjects(prev => prev.map(pr => pr.id === p.id ? p : pr))
  }, [])

  useEffect(() => {
    Promise.all([api.getAgentProjects(), api.getClients()]).then(([projs, cls]) => {
      setProjects(projs); setClients(cls); setLoading(false)
    })
  }, [])

  useEffect(() => { if (selectedProject) loadProject(selectedProject.id) }, [refreshKey])

  async function createProject() {
    if (!newClientId) return
    const client = clients.find(c => c.id === newClientId)
    const project = await api.createAgentProject({
      client_id: newClientId, client_name: client?.company_name || "Unknown",
      industry: client?.industry || "", website: client?.website || "",
    })
    setProjects(prev => [project, ...prev]); setSelectedProject(project)
    setShowCreateModal(false); setNewClientId("")
    setTimeout(() => loadProject(project.id), 500)
  }

  async function runWeek() {
    if (!selectedProject) return
    await api.runAgentWeek(selectedProject.id)
    setRefreshKey(k => k + 1)
  }

  async function runAll() {
    if (!selectedProject) return
    await api.runAgentAll(selectedProject.id)
    setRefreshKey(k => k + 1)
  }

  const availableClients = clients.filter(c => !projects.find(p => p.client_id === c.id))
  const filteredProjects = projects.filter(p =>
    p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading agents...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> AI Sales Agents
          </h1>
          <p className="text-muted-foreground text-sm">Automated 3-month sales journey — research, leads, outreach, close</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} disabled={availableClients.length === 0}>
          <Plus className="h-4 w-4" /> New Agent Project
        </Button>
      </div>

      {showCreateModal && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Select Client — enter name or URL in Dashboard first</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={newClientId} onChange={e => setNewClientId(e.target.value)}>
                  <option value="">-- Select Client --</option>
                  {availableClients.map(c => <option key={c.id} value={c.id}>{c.id} — {c.company_name} {c.website ? `(${c.website})` : ""}</option>)}
                </select>
              </div>
              <Button size="sm" onClick={createProject} disabled={!newClientId}><Zap className="h-4 w-4" /> Launch</Button>
              <Button size="sm" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredProjects.map(project => (
              <Card key={project.id} className={`cursor-pointer transition-all hover:border-primary/50 ${selectedProject?.id === project.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => loadProject(project.id)}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{project.client_id}</span>
                    <Badge variant="outline" className={`text-[10px] ${project.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{project.status}</Badge>
                  </div>
                  <p className="text-sm font-semibold truncate">{project.client_name}</p>
                  <p className="text-[10px] text-muted-foreground">Phase {project.phase === "research" ? "1" : project.phase === "lead_gen" ? "2" : "3"}: {project.phaseName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{project.progress}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Week {project.week}/4 · {project.completed_tasks || 0}/{project.total_tasks || 24} tasks</p>
                </CardContent>
              </Card>
            ))}
            {filteredProjects.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No agent projects yet.</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" /> {selectedProject.client_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedProject.client_id} · {selectedProject.industry || "—"} · {selectedProject.website || ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedProject.status === "active" && (
                        <>
                          <Button size="sm" variant="outline" onClick={runWeek}><Play className="h-3.5 w-3.5" /> Run Week</Button>
                          <Button size="sm" onClick={runAll}><Zap className="h-3.5 w-3.5" /> Run All</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[
                      { label: "Progress", value: `${selectedProject.progress}%` },
                      { label: "Phase", value: `P${selectedProject.phase === "research" ? "1" : selectedProject.phase === "lead_gen" ? "2" : "3"}` },
                      { label: "Week", value: `${selectedProject.week}/4` },
                      { label: "Tasks", value: `${selectedProject.completed_tasks || 0}/${selectedProject.total_tasks || 24}` },
                      { label: "Leads", value: String(selectedProject.leads?.length || 0) },
                    ].map(s => (
                      <div key={s.label} className="p-2 bg-muted/30 rounded text-center">
                        <p className="text-lg font-bold">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1 mb-3 border-b pb-2">
                    {(["timeline", "leads", "competitors", "comms", "pipeline"] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded text-xs font-medium capitalize ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                        {tab === "comms" ? "Emails" : tab === "pipeline" ? "Pipeline" : tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === "timeline" && <PhaseTimeline project={selectedProject} />}

                  {activeTab === "leads" && (
                    <div className="space-y-2">
                      {selectedProject.leads.length > 0 ? selectedProject.leads.map((lead: any) => (
                        <div key={lead.id} className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${lead.score >= 80 ? "bg-emerald-500" : lead.score >= 60 ? "bg-amber-500" : "bg-muted"}`} />
                            <span className="font-medium">{lead.company_name}</span>
                            <span className="text-muted-foreground">· {lead.contact_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{lead.email}</span>
                            <Badge variant="outline" className={`text-[10px] ${lead.score >= 80 ? "bg-emerald-100 text-emerald-700" : lead.score >= 60 ? "bg-amber-100 text-amber-700" : ""}`}>
                              {lead.score}
                            </Badge>
                          </div>
                        </div>
                      )) : <p className="text-sm text-muted-foreground text-center py-4">No leads yet. Run research or lead gen tasks.</p>}
                    </div>
                  )}

                  {activeTab === "competitors" && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProject.competitors.length > 0 ? selectedProject.competitors.map((comp: any) => (
                        <div key={comp.id} className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-sm font-medium">{comp.name}</p>
                          <p className="text-[10px] text-muted-foreground">{comp.market_position}</p>
                          <p className="text-[10px] text-emerald-600">Strengths: {comp.strengths}</p>
                          <p className="text-[10px] text-red-600">Weaknesses: {comp.weaknesses}</p>
                        </div>
                      )) : <p className="text-sm text-muted-foreground text-center py-4">No competitors yet. Run competitor identification.</p>}
                    </div>
                  )}

                  {activeTab === "comms" && (
                    <div className="space-y-2">
                      {selectedProject.communications.length > 0 ? selectedProject.communications.map((comm: any) => (
                        <div key={comm.id} className="p-2 bg-muted/20 rounded text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{comm.subject}</span>
                            <Badge variant="outline" className={`text-[10px] ${comm.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{comm.status}</Badge>
                          </div>
                          <p className="text-muted-foreground">To: {comm.recipient}</p>
                          <p className="text-muted-foreground line-clamp-2">{comm.type === "email_sequence" ? (() => { try { return JSON.parse(comm.body).subject } catch { return comm.body } })() : comm.body}</p>
                        </div>
                      )) : <p className="text-sm text-muted-foreground text-center py-4">No communications yet. Run outreach tasks.</p>}
                    </div>
                  )}

                  {activeTab === "pipeline" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded text-center">
                          <p className="text-lg font-bold">{selectedProject.opportunities?.length || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Opportunities</p>
                        </div>
                        <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded text-center">
                          <p className="text-lg font-bold">{selectedProject.leads?.length || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Leads</p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded text-center">
                          <p className="text-lg font-bold">{selectedProject.communications?.length || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Emails</p>
                        </div>
                      </div>
                      {selectedProject.opportunities && selectedProject.opportunities.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">Opportunities Created by AI</p>
                          {selectedProject.opportunities.map((opp: any) => (
                            <div key={opp.id} className="p-2 bg-muted/20 rounded text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono font-bold">{opp.id}</span>
                                <Badge variant="outline" className="text-[10px]">${(opp.guestimated_value || 0).toLocaleString()}</Badge>
                              </div>
                              <p className="text-muted-foreground">{opp.problem_opportunity}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Source: {opp.source_of_opportunity} · {opp.next_step || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
              <Bot className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select an Agent Project</p>
              <p className="text-sm">Or register a new client in Dashboard to auto-launch an agent</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
