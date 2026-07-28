import { authFetch } from "./auth-fetch"

export interface ResearchResult {
  keyFindings: string[]
  trends: string[]
  statistics: string[]
  expertQuotes: string[]
  sourceTopics: string[]
}

export interface GeneratedBlog {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  image_url?: string
  meta_description: string
  slug: string
}

async function apiCall(action: string, body: Record<string, any>): Promise<any> {
  const res = await authFetch("/api/generate-blog", {
    method: "POST",
    body: JSON.stringify({ action, ...body }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "API request failed.")
  return data
}

export async function researchTopic(topic: string, category: string): Promise<ResearchResult> {
  return apiCall("research", { topic, category })
}

export async function generateBlog(
  topic: string,
  category: string,
  research: ResearchResult,
): Promise<GeneratedBlog> {
  return apiCall("generate", { topic, category, research })
}

export const BLOG_CATEGORIES = [
  { value: "Cybersecurity", label: "Cybersecurity", icon: "🛡️", color: "red" },
  { value: "AI Automation", label: "AI Automation", icon: "🤖", color: "blue" },
  { value: "Agentic AI", label: "Agentic AI", icon: "🧠", color: "purple" },
  { value: "Red Teaming", label: "Red Teaming", icon: "🎯", color: "red" },
  { value: "Vulnerability Analysis", label: "Vulnerability Analysis", icon: "🔍", color: "amber" },
  { value: "Defender Matching", label: "Defender Matching", icon: "🤝", color: "cyan" },
] as const

export const SUGGESTED_TOPICS: Record<string, string[]> = {
  Cybersecurity: [
    "Zero Trust Architecture: Why Every Business Needs It in 2026",
    "Ransomware Evolution: New Attack Vectors and How to Defend",
    "SOC-as-a-Service: When to Outsource Your Security Operations",
    "Cloud Security Posture Management Best Practices",
    "The Rise of AI-Powered Phishing Attacks",
  ],
  "AI Automation": [
    "How AI Receptionists Are Transforming Customer Service",
    "Process Automation ROI: Real Numbers from Real Businesses",
    "AI Chatbots vs Human Support: Finding the Right Balance",
    "Building Intelligent Document Processing Pipelines",
    "AI-Powered SEO: Automating Your Way to Page One",
  ],
  "Agentic AI": [
    "What Are AI Agents and Why They Matter for Business",
    "Multi-Agent Systems: Orchestrating AI Teams for Complex Tasks",
    "Agentic RAG: Beyond Simple Retrieval-Augmented Generation",
    "Autonomous AI Agents for Cybersecurity Reconnaissance",
    "Building Goal-Driven AI Workflows with Agent Frameworks",
  ],
  "Red Teaming": [
    "Red Team vs Penetration Testing: What is the Difference",
    "How to Prepare Your Business for a Red Team Engagement",
    "Social Engineering Red Flags Every Employee Should Know",
    "Physical Security Testing: Often Overlooked Attack Surface",
    "Purple Team Exercises: Combining Offense and Defense",
  ],
  "Vulnerability Analysis": [
    "Top 10 Vulnerabilities Found in South African Businesses",
    "Automated Vulnerability Scanning: Tools and Best Practices",
    "From Discovery to Remediation: Streamlining Your Vulnerability Workflow",
    "CVE Prioritization: Focusing on What Actually Matters",
    "Vulnerability Disclosure Policies: A Complete Guide",
  ],
  "Defender Matching": [
    "Why Generic Security Fixes Do Not Work",
    "How Issue-Specific Defender Matching Saves Time and Money",
    "Building a Security Remediation Pipeline",
    "Choosing the Right Security Specialist for Your Industry",
    "The Future of Managed Detection and Response",
  ],
}
