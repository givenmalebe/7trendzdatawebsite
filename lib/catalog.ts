export const ADMIN_EMAILS = ["info@7trendzdata.com", "admin@7trendzdata.com"]

export const SERVICES_PRODUCTS = [
  { id: "ai-receptionist", name: "AI Receptionist", category: "AI Automation", defaultPrice: 699 },
  { id: "ai-chatbots", name: "AI Chatbots", category: "AI Automation", defaultPrice: 499 },
  { id: "custom-ai-models", name: "Custom AI Models", category: "AI Automation", defaultPrice: 2500 },
  { id: "process-automation", name: "Process Automation", category: "AI Automation", defaultPrice: 1500 },
  { id: "ai-seo", name: "AI SEO", category: "AI Automation", defaultPrice: 399 },
  { id: "pentest", name: "Penetration Testing", category: "Red Team", defaultPrice: 3500 },
  { id: "red-team", name: "Red Team Assessment", category: "Red Team", defaultPrice: 5000 },
  { id: "ai-recon", name: "AI Recon Agents", category: "Red Team", defaultPrice: 1200 },
  { id: "vuln-analysis", name: "AI Vulnerability Analysis", category: "Red Team", defaultPrice: 1800 },
  { id: "defender-matching", name: "Defender Matching", category: "Red Team", defaultPrice: 800 },
  { id: "bundle", name: "AI + Red Team Bundle", category: "Bundle", defaultPrice: 4500 },
] as const

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
  "ai-receptionist": "🤖",
  "ai-chatbots": "💬",
  "custom-ai-models": "🧠",
  "process-automation": "⚙️",
  "ai-seo": "📈",
  pentest: "🎯",
  "red-team": "🔴",
  "ai-recon": "🔍",
  "vuln-analysis": "🛡️",
  "defender-matching": "🤝",
  bundle: "📦",
}

export function defaultMilestonesForCategory(category: string) {
  if (category === "Red Team") {
    return [
      { id: "scope", label: "Scoping & Authorization", status: "pending" as StageStatus, completedAt: null, notes: "" },
      { id: "testing", label: "Testing & Analysis", status: "pending" as StageStatus, completedAt: null, notes: "" },
      { id: "report", label: "Report & Recommendations", status: "pending" as StageStatus, completedAt: null, notes: "" },
    ]
  }
  return [
    { id: "discovery", label: "Discovery & Requirements", status: "pending" as StageStatus, completedAt: null, notes: "" },
    { id: "build", label: "Build & Configuration", status: "pending" as StageStatus, completedAt: null, notes: "" },
    { id: "integration", label: "Integration & Testing", status: "pending" as StageStatus, completedAt: null, notes: "" },
    { id: "golive", label: "Go Live & Handover", status: "pending" as StageStatus, completedAt: null, notes: "" },
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
