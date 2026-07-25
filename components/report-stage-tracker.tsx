"use client"

import { REPORT_STAGES, type ReportStageId, type StageStatus } from "@/lib/catalog"
import type { ReportStage } from "@/lib/report-service"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportStageTrackerProps {
  stages: ReportStage[]
  currentStage: ReportStageId
  compact?: boolean
}

export function ReportStageTracker({ stages, currentStage, compact }: ReportStageTrackerProps) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      {REPORT_STAGES.map((meta, index) => {
        const stage = stages.find((s) => s.id === meta.id)
        const status: StageStatus = stage?.status || "pending"
        const isCurrent = currentStage === meta.id

        return (
          <div key={meta.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StageIcon status={status} isCurrent={isCurrent} />
              {index < REPORT_STAGES.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px] mt-1",
                    status === "completed" ? "bg-emerald-500" : "bg-slate-200",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-4", compact && "pb-2")}>
              <p className={cn("font-medium text-sm", isCurrent && "text-cyan-700")}>{meta.label}</p>
              {!compact && <p className="text-xs text-muted-foreground">{meta.description}</p>}
              {stage?.notes && <p className="text-xs text-slate-600 mt-1">{stage.notes}</p>}
              {stage?.completedAt && (
                <p className="text-xs text-emerald-600 mt-1">
                  Completed {new Date(stage.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StageIcon({ status, isCurrent }: { status: StageStatus; isCurrent: boolean }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
  }
  if (status === "in_progress" || isCurrent) {
    return <Loader2 className="h-5 w-5 text-cyan-600 animate-spin shrink-0" />
  }
  return <Circle className="h-5 w-5 text-slate-300 shrink-0" />
}
