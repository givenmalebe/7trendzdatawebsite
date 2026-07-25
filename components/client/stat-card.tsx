"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "text-cyan-600",
}: {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  accent?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <Icon className={`h-8 w-8 ${accent} opacity-80`} />
        </div>
      </CardContent>
    </Card>
  )
}
