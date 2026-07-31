import type { RevenueEntry } from "@/lib/revenue-service"
import type { RedTeamReport } from "@/lib/report-service"
import { DELIVERY_STATUS_LABELS, REPORT_STAGES } from "@/lib/catalog"

export interface ActivityItem {
  id: string
  type: "order" | "report" | "milestone"
  title: string
  description: string
  timestamp: string
  category?: string
}

export function formatDateTime(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
}

export function buildActivityFeed(orders: RevenueEntry[], reports: RedTeamReport[]): ActivityItem[] {
  const items: ActivityItem[] = []

  for (const order of orders) {
    items.push({
      id: `order-${order.id}`,
      type: "order",
      title: order.serviceName,
      description: `${DELIVERY_STATUS_LABELS[order.deliveryStatus]} · ${order.deliveryProgress}% complete`,
      timestamp: order.updated_at || order.created_at || order.date,
      category: order.category,
    })
    if (order.clientUpdate) {
      items.push({
        id: `update-${order.id}-${order.updated_at}`,
        type: "order",
        title: `Update: ${order.serviceName}`,
        description: order.clientUpdate,
        timestamp: order.updated_at || order.date,
        category: order.category,
      })
    }
    for (const m of order.milestones || []) {
      if (m.completedAt) {
        items.push({
          id: `ms-${order.id}-${m.id}`,
          type: "milestone",
          title: m.label,
          description: `Completed for ${order.serviceName}`,
          timestamp: m.completedAt,
          category: order.category,
        })
      }
    }
  }

  for (const report of reports) {
    items.push({
      id: `report-${report.id}`,
      type: "report",
      title: report.title,
      description: `Red team · ${REPORT_STAGES.find((s) => s.id === report.currentStage)?.label ?? report.currentStage}`,
      timestamp: report.updated_at || report.created_at,
      category: "Red Team",
    })
    for (const stage of report.stages) {
      if (stage.completedAt) {
        items.push({
          id: `rs-${report.id}-${stage.id}`,
          type: "report",
          title: stage.label,
          description: `Stage completed · ${report.title}`,
          timestamp: stage.completedAt,
          category: "Red Team",
        })
      }
    }
  }

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function orderProgressColor(status: RevenueEntry["deliveryStatus"]) {
  switch (status) {
    case "completed":
    case "live":
      return "bg-emerald-500"
    case "on_hold":
      return "bg-slate-400"
    case "review":
      return "bg-violet-500"
    default:
      return "bg-cyan-500"
  }
}

export function categoryColor(category: string) {
  switch (category) {
    case "Red Team":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-slate-100 text-slate-800 border-slate-200"
  }
}
