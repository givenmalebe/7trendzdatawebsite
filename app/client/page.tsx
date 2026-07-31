"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ClientShell } from "@/components/client-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Crosshair, CheckCircle2, Clock, Bot, Package, Eye } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { fetchReportsByClient, type RedTeamReport } from "@/lib/report-service"
import { fetchRevenueByClient, type RevenueEntry } from "@/lib/revenue-service"
import { fetchClient, type Client } from "@/lib/client-service"
import { ReportStageTracker } from "@/components/report-stage-tracker"
import { ServiceOrderCard } from "@/components/client/service-order-card"
import { ActivityFeed } from "@/components/client/activity-feed"
import { StatCard } from "@/components/client/stat-card"
import { REPORT_STAGES } from "@/lib/catalog"
import { buildActivityFeed, formatDateTime } from "@/lib/client-portal-utils"

function ClientContent() {
  const searchParams = useSearchParams()
  const view = searchParams.get("view") || "dashboard"
  const reportId = searchParams.get("report")
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const [reports, setReports] = useState<RedTeamReport[]>([])
  const [orders, setOrders] = useState<RevenueEntry[]>([])
  const [clientInfo, setClientInfo] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [linking, setLinking] = useState(false)
  const [linkError, setLinkError] = useState("")

  useEffect(() => {
    if (authLoading) return

    async function load() {
      if (!user || profile?.role !== "client") {
        setLoading(false)
        return
      }

      if (!profile.clientId) {
        setLinking(true)
        try {
          await refreshProfile()
        } catch {
          setLinkError("Could not link your account.")
        } finally {
          setLinking(false)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      try {
        const [r, o, c] = await Promise.all([
          fetchReportsByClient(profile.clientId),
          fetchRevenueByClient(profile.clientId),
          fetchClient(profile.clientId),
        ])
        if (r) setReports(r)
        if (o) setOrders(o.filter((x) => x.status !== "cancelled"))
        if (c) setClientInfo(c)
      } catch (e: any) {
        if (e?.name !== "AbortError" && e?.code !== "failed-precondition") {
          setLinkError("Could not load your portal data.")
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [authLoading, user, profile?.role, profile?.clientId, refreshProfile])

  const selectedReport = reportId ? reports.find((r) => r.id === reportId) : null
  const activity = buildActivityFeed(orders, reports)
  const activeOrders = orders.filter((o) => !["completed", "on_hold"].includes(o.deliveryStatus))
  const activeReports = reports.filter((r) => r.status === "active")

  const currentStageLabel = (r: RedTeamReport) =>
    REPORT_STAGES.find((s) => s.id === r.currentStage)?.label ?? r.currentStage

  if (authLoading || loading || linking) {
    return (
      <ClientShell>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600" />
          {linking && <p className="text-sm text-muted-foreground">Setting up your portal...</p>}
        </div>
      </ClientShell>
    )
  }

  if (!profile?.clientId) {
    return (
      <ClientShell>
        <Card>
          <CardHeader>
            <CardTitle>Account Not Linked</CardTitle>
            <CardDescription>{linkError || "We couldn't connect your account yet."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refreshProfile()}>Retry</Button>
          </CardContent>
        </Card>
      </ClientShell>
    )
  }

  if (selectedReport) {
    const canDownload = Boolean(selectedReport.reportFileUrl)

    return (
      <ClientShell>
        <div className="space-y-6">
          <Button variant="outline" asChild>
            <a href="/client?view=reports">← Back to Red Team Reports</a>
          </Button>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">{selectedReport.title}</CardTitle>
                  <CardDescription className="mt-1">{selectedReport.description || "Red team engagement"}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {formatDateTime(selectedReport.created_at)} · Updated {formatDateTime(selectedReport.updated_at)}
                  </p>
                </div>
                <Badge>{selectedReport.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <ReportStageTracker stages={selectedReport.stages} currentStage={selectedReport.currentStage} />
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedReport.stages.map((stage) => {
                  const meta = REPORT_STAGES.find((s) => s.id === stage.id)
                  const Icon = stage.status === "completed" ? CheckCircle2 : stage.status === "in_progress" ? Clock : FileText
                  return (
                    <div key={stage.id} className="flex items-start gap-3 p-3 rounded-lg border bg-white">
                      <Icon className={`h-5 w-5 shrink-0 ${stage.status === "completed" ? "text-emerald-600" : stage.status === "in_progress" ? "text-amber-600" : "text-slate-400"}`} />
                      <div>
                        <p className="font-medium text-sm">{meta?.label ?? stage.id}</p>
                        <p className="text-xs text-muted-foreground capitalize">{stage.status.replace("_", " ")}</p>
                        {stage.completedAt && <p className="text-xs text-muted-foreground mt-1">Completed {formatDateTime(stage.completedAt)}</p>}
                        {stage.notes && <p className="text-xs text-slate-600 mt-1">{stage.notes}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Final Report</h3>
                {canDownload ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        <a href={selectedReport.reportFileUrl!} target="_blank" rel="noopener noreferrer" download>
                          <Download className="h-5 w-5 mr-2" /> Download {selectedReport.reportFileName || "Report"}
                        </a>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <a href={selectedReport.reportFileUrl!} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-5 w-5 mr-2" /> View in Browser
                        </a>
                      </Button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                      <iframe
                        src={selectedReport.reportFileUrl!}
                        className="w-full h-[600px]"
                        title={selectedReport.reportFileName || "Report PDF"}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Report not yet available. Current stage: <strong>{currentStageLabel(selectedReport)}</strong>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ClientShell>
    )
  }

  return (
    <ClientShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {view === "dashboard" && `Welcome, ${profile.displayName || "there"}`}
            {view === "services" && "My Services & Orders"}
            {view === "reports" && "Red Team Reports"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {view === "dashboard" && "Track your red team engagements, pentesting reports, and defender matches."}
            {view === "services" && "Progress, milestones, and updates from 7Trendz Data on your projects."}
            {view === "reports" && "Penetration testing progress and downloadable reports."}
          </p>
          {clientInfo?.company && view === "dashboard" && (
            <p className="text-sm text-muted-foreground mt-1">{clientInfo.company}</p>
          )}
        </div>

        {view === "dashboard" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Active services" value={activeOrders.length} icon={Package} accent="text-cyan-600" />
              <StatCard label="Red team reports" value={reports.length} sub={`${activeReports.length} in progress`} icon={Crosshair} accent="text-red-600" />
              <StatCard label="Total orders" value={orders.length} icon={Bot} accent="text-violet-600" />
              <StatCard
                label="Completed"
                value={orders.filter((o) => o.deliveryStatus === "completed").length + reports.filter((r) => r.status === "completed").length}
                icon={CheckCircle2}
                accent="text-emerald-600"
              />
            </div>

            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">In progress</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  {activeOrders.slice(0, 2).map((o) => (
                    <ServiceOrderCard key={o.id} order={o} expanded={false} />
                  ))}
                </div>
                {activeOrders.length > 2 && (
                  <Button variant="link" className="mt-2 px-0" asChild>
                    <a href="/client?view=services">View all {activeOrders.length} services →</a>
                  </Button>
                )}
              </div>
            )}

            {activeReports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active red team engagements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeReports.map((r) => (
                    <div key={r.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{r.title}</p>
                        <p className="text-sm text-muted-foreground">{currentStageLabel(r)}</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/client?view=reports&report=${r.id}`}>View</a>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <ActivityFeed items={activity} />

            {orders.length === 0 && reports.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No projects assigned yet. Contact 7Trendz Data when you&apos;re ready to get started.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {view === "services" && (
          <>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bot className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-muted-foreground">No services or products on your account yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Pentesting reports, red team engagements, and more will appear here once ordered.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders.map((o) => (
                  <ServiceOrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "reports" && (
          <>
            {reports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Crosshair className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-muted-foreground">No red team reports assigned yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {reports.map((r) => {
                  const hasFile = Boolean(r.reportFileUrl)
                  return (
                    <Card key={r.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{r.title}</h3>
                              <Badge variant="outline">{r.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Stage: {currentStageLabel(r)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Updated {formatDateTime(r.updated_at)}</p>
                            <div className="mt-3">
                              <ReportStageTracker stages={r.stages} currentStage={r.currentStage} compact />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button asChild variant="outline">
                              <a href={`/client?view=reports&report=${r.id}`}>View details</a>
                            </Button>
                            {hasFile && (
                              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                <a href={r.reportFileUrl!} target="_blank" rel="noopener noreferrer" download>
                                  <Download className="h-4 w-4 mr-2" /> Download PDF
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </ClientShell>
  )
}

export default function ClientPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientContent />
    </Suspense>
  )
}
