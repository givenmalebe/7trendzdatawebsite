"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ActivityItem } from "@/lib/client-portal-utils"
import { formatDateTime, categoryColor } from "@/lib/client-portal-utils"
import { Bot, Crosshair, Flag } from "lucide-react"

export function ActivityFeed({ items, limit = 8 }: { items: ActivityItem[]; limit?: number }) {
  const shown = items.slice(0, limit)

  if (shown.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          No activity yet. Updates from your projects will appear here.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {shown.map((item, i) => (
          <div key={item.id} className={`flex gap-4 py-4 ${i < shown.length - 1 ? "border-b" : ""}`}>
            <div className="shrink-0 mt-1">
              {item.type === "report" ? (
                <Crosshair className="h-5 w-5 text-red-500" />
              ) : item.type === "milestone" ? (
                <Flag className="h-5 w-5 text-emerald-500" />
              ) : (
                <Bot className="h-5 w-5 text-cyan-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-sm">{item.title}</p>
                {item.category && (
                  <Badge variant="outline" className={`text-xs ${categoryColor(item.category)}`}>{item.category}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDateTime(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
