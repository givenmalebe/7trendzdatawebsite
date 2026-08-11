import { getAdminSettings } from "./admin-settings-service"

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions"
const SITE_URL = "https://7trendzdata.com"
const SITE_NAME = "7Trendz Data"

const MODEL_CHAIN = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openrouter/free",
]

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

function extractJSON(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "")
  try {
    return JSON.parse(cleaned) as Record<string, unknown>
  } catch {
    /* continue */
  }
  const fence = cleaned.match(/```[\s\S]*?```/)
  if (fence) {
    const inner = fence[0].replace(/```\w*\n?/g, "").replace(/```/g, "").trim()
    try {
      return JSON.parse(inner) as Record<string, unknown>
    } catch {
      /* continue */
    }
  }
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]) as Record<string, unknown>
    } catch {
      /* continue */
    }
  }
  return null
}

async function callLLM(systemPrompt: string, userPrompt: string, retries = 2, maxTokens = 4096): Promise<string> {
  const settings = await getAdminSettings()
  const apiKey = settings.openrouter_api_key?.trim()
  if (!apiKey) {
    throw new Error("No API key saved. Add your OpenRouter API key in Admin → Blog → AI Agent and click Save.")
  }

  let lastError = ""
  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(OPENROUTER_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.5,
            max_tokens: maxTokens,
          }),
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          const message = (err as { error?: { message?: string } }).error?.message || `HTTP ${res.status}`
          lastError = message
          if (res.status === 401) {
            throw new Error("OpenRouter rejected your API key. Check the key at openrouter.ai/keys and save it again.")
          }
          if (res.status === 429) {
            await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)))
            continue
          }
          break
        }

        const data = await res.json()
        const content = data.choices?.[0]?.message?.content || ""
        if (content) return content
        lastError = "Empty response from model"
      } catch (e) {
        if (e instanceof Error && e.message.includes("OpenRouter rejected")) throw e
        lastError = e instanceof Error ? e.message : "Request failed"
      }
    }
  }

  throw new Error(`AI request failed. Last error: ${lastError}`)
}

export async function researchTopic(topic: string, category: string): Promise<ResearchResult> {
  const result = await callLLM(
    `You are a senior cybersecurity and AI research analyst for ${SITE_NAME}. Return ONLY a valid JSON object.`,
    `Research the latest developments for: "${topic}" in ${category}.

Return this exact JSON structure (no markdown, no extra text):
{
  "keyFindings": ["finding 1 with specific data", "finding 2", "finding 3", "finding 4", "finding 5"],
  "trends": ["trend 1", "trend 2", "trend 3"],
  "statistics": ["statistic 1 with source context", "statistic 2", "statistic 3"],
  "expertQuotes": ["expert insight 1", "expert insight 2", "expert insight 3"],
  "sourceTopics": ["related topic 1", "related topic 2", "related topic 3"]
}

Be specific with numbers, dates, and real developments from 2024-2026.`,
    2,
    1500,
  )

  const parsed = extractJSON(result)
  if (parsed && Array.isArray(parsed.keyFindings)) {
    return parsed as unknown as ResearchResult
  }

  return {
    keyFindings: [result.slice(0, 500)],
    trends: [],
    statistics: [],
    expertQuotes: [],
    sourceTopics: [],
  }
}

export async function generateBlog(
  topic: string,
  category: string,
  research: ResearchResult,
): Promise<GeneratedBlog> {
  const researchData = JSON.stringify(research)

  const result = await callLLM(
    `You are an expert content writer for ${SITE_NAME} (${SITE_URL}), a cybersecurity red teaming and AI automation company based in Johannesburg, South Africa.

YOUR TASK: Write a complete, publication-ready blog post. Return ONLY a valid JSON object.

WRITING RULES:
- Write 1200-1600 words of high-quality, human-readable content
- Every single paragraph MUST be wrapped in <p> tags — never leave bare text
- Each <p> should be 2-4 sentences with clear, meaningful sentences
- Use <h2> for main sections (5-7 sections), <h3> for sub-sections
- Use <ul><li> for bullet points where appropriate
- Use <strong> for key terms and <em> for emphasis
- Use <blockquote> for expert quotes or statistics
- Write in a professional but accessible tone — like a knowledgeable colleague explaining things
- Target audience: South African business owners and IT decision-makers
- Include a compelling introduction that hooks the reader
- End with a clear call-to-action for red teaming or AI automation services

SMART BACKLINKING (integrate naturally, not forced):
- In the introduction or early sections, naturally mention our services: <a href="${SITE_URL}/services">explore our cybersecurity red teaming services</a>
- When discussing solutions or expertise, link to: <a href="${SITE_URL}/contact">speak with our red team specialists</a>
- When discussing company background or approach: <a href="${SITE_URL}/about">learn about our approach to security</a>
- In the conclusion or CTA: <a href="${SITE_URL}/services">book a red team assessment</a>
- Do NOT repeat the same link text twice — vary the anchor text naturally
- Backlinks should feel like helpful references, not advertisements

Return this JSON:
{
  "title": "Compelling SEO title under 60 characters",
  "excerpt": "Engaging excerpt under 160 characters that makes people want to read",
  "content": "Full HTML blog content with proper <p> tags on every paragraph, <h2> and <h3> headings, smart backlinks, and a strong CTA",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "metaDescription": "SEO meta description under 155 characters with focus keyword"
}`,
    `Write a blog post about: "${topic}"

Category: ${category}

RESEARCH DATA:
${researchData}

Write the full blog now as HTML with proper paragraph structure, smart backlinks to ${SITE_URL}, and a strong call-to-action for red teaming services.`,
    2,
    6000,
  )

  const parsed = extractJSON(result)
  if (parsed && parsed.content) {
    const title = String(parsed.title || topic)
    return {
      title,
      excerpt: String(parsed.excerpt || ""),
      content: String(parsed.content),
      category,
      tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : [],
      meta_description: String(parsed.metaDescription || parsed.excerpt || ""),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }
  }

  throw new Error("Failed to parse AI response. Try again.")
}

export const BLOG_CATEGORIES = [
  { value: "Cybersecurity", label: "Cybersecurity", icon: "🛡️", color: "red" },
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
