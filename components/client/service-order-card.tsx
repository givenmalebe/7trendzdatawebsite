"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RevenueEntry } from "@/lib/revenue-service"
import {
  DELIVERY_STATUS_LABELS,
  SERVICE_ICONS,
  type DeliveryStatus,
  type StageStatus,
} from "@/lib/catalog"
import {
  categoryColor,
  formatDate,
  formatDateTime,
  orderProgressColor,
} from "@/lib/client-portal-utils"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceOrderCardProps {
  order: RevenueEntry
  expanded?: boolean
}

export function ServiceOrderCard({ order, expanded = true }: ServiceOrderCardProps) {
  const icon = SERVICE_ICONS[order.serviceId] || "📋"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <CardTitle className="text-lg">{order.serviceName}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={categoryColor(order.category)}>{order.category}</Badge>
                <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-lg">R{order.amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Ordered {formatDate(order.date)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">{DELIVERY_STATUS_LABELS[order.deliveryStatus]}</span>
            <span className="text-muted-foreground">{order.deliveryProgress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", orderProgressColor(order.deliveryStatus))}
              style={{ width: `${Math.min(100, Math.max(0, order.deliveryProgress))}%` }}
            />
          </div>
        </div>

        {order.clientUpdate && (
          <div className="rounded-lg border border-cyan-200 bg-cyan-50/50 p-4">
            <p className="text-xs font-semibold text-cyan-800 uppercase tracking-wide mb-1">Latest update from 7Trendz</p>
            <p className="text-sm text-slate-700">{order.clientUpdate}</p>
            <p className="text-xs text-muted-foreground mt-2">Updated {formatDateTime(order.updated_at)}</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Started</p>
            <p className="font-medium">{formatDate(order.startedAt)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Est. completion</p>
            <p className="font-medium">{order.estimatedCompletion ? formatDate(order.estimatedCompletion) : "To be confirmed"}</p>
          </div>
        </div>

        {expanded && order.milestones?.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-3">Project milestones</p>
            <div className="space-y-2">
              {order.milestones.map((m) => (
                <MilestoneRow key={m.id} label={m.label} status={m.status} completedAt={m.completedAt} notes={m.notes} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MilestoneRow({
  label,
  status,
  completedAt,
  notes,
}: {
  label: string
  status: StageStatus
  completedAt: string | null
  notes: string
}) {
  const Icon = status === "completed" ? CheckCircle2 : status === "in_progress" ? Loader2 : Circle
  return (
    <div className="flex gap-3 items-start p-3 rounded-lg border bg-white">
      <Icon className={cn(
        "h-5 w-5 shrink-0 mt-0.5",
        status === "completed" ? "text-emerald-600" : status === "in_progress" ? "text-cyan-600 animate-spin" : "text-slate-300",
      )} />
      <div className="min-w-0">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground capitalize">{status.replace("_", " ")}</p>
        {completedAt && <p className="text-xs text-emerald-600 mt-1">Completed {formatDateTime(completedAt)}</p>}
        {notes && <p className="text-xs text-slate-600 mt-1">{notes}</p>}
      </div>
    </div>
  )
}

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  return <Badge variant="outline">{DELIVERY_STATUS_LABELS[status]}</Badge>
}
