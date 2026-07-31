export const ADMIN_EMAILS = ["info@7trendzdata.com", "admin@7trendzdata.com"]

export const PENTEST_REPORT_TIERS = [
  {
    id: "pentest-report-low",
    severity: "Low",
    label: "Low Vulnerability",
    description: "Pentesting report covering low-severity findings",
    defaultPrice: 2500,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    id: "pentest-report-medium",
    severity: "Medium",
    label: "Medium Vulnerability",
    description: "Pentesting report covering medium-severity findings",
    defaultPrice: 5000,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    id: "pentest-report-high",
    severity: "High",
    label: "High Vulnerability",
    description: "Pentesting report covering high-severity findings",
    defaultPrice: 10000,
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  {
    id: "pentest-report-critical",
    severity: "Critical",
    label: "Critical Vulnerability",
    description: "Pentesting report covering critical-severity findings",
    defaultPrice: 15000,
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
] as const

export const SERVICES_PRODUCTS = PENTEST_REPORT_TIERS.map((tier) => ({
  id: tier.id,
  name: `Pentesting Report — ${tier.label}`,
  category: "Red Team",
  defaultPrice: tier.defaultPrice,
}))

export const REPORT_STAGES = [
  { id: "intake", label: "Intake & Scoping", description: "Project kickoff and scope definition" },
  { id: "recon", label: "Reconnaissance", description: "Attack surface mapping and asset discovery" },
  { id: "pentest", label: "Penetration Testing", description: "Active testing and exploitation attempts" },
  { id: "analysis", label: "Vulnerability Analysis", description: "Findings triage and risk prioritization" },
  { id: "matching", label: "Defender Matching", description: "Routing issues to the right specialists" },
  { id: "delivery", label: "Report Delivery", description: "Final report available for download" },
] as const

export type ReportStageId = (typeof REPORT_STAGES)[number]["id"]
export type StageStatus = "pending" | "in_progress" | "completed"

export type DeliveryStatus =
  | "ordered"
  | "kickoff"
  | "in_progress"
  | "review"
  | "live"
  | "completed"
  | "on_hold"

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  ordered: "Order Received",
  kickoff: "Kickoff & Planning",
  in_progress: "In Progress",
  review: "Review & QA",
  live: "Live / Deployed",
  completed: "Completed",
  on_hold: "On Hold",
}

export const SERVICE_ICONS: Record<string, string> = {
  "pentest-report-low": "🟢",
  "pentest-report-medium": "🟡",
  "pentest-report-high": "🟠",
  "pentest-report-critical": "🔴",
}

export function defaultMilestonesForCategory(category: string) {
  return [
    { id: "scope", label: "Scoping & Authorization", status: "pending" as StageStatus, completedAt: null, notes: "" },
    { id: "testing", label: "Testing & Analysis", status: "pending" as StageStatus, completedAt: null, notes: "" },
    { id: "report", label: "Report & Recommendations", status: "pending" as StageStatus, completedAt: null, notes: "" },
  ]
}

export function defaultReportStages() {
  return REPORT_STAGES.map((stage) => ({
    id: stage.id,
    label: stage.label,
    status: "pending" as StageStatus,
    completedAt: null as string | null,
    notes: "",
  }))
}
