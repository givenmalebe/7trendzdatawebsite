import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/api-auth"

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions"
const SITE_URL = "https://7trendzdata.com"
const SITE_NAME = "7Trendz Data"

const MODEL_CHAIN = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openrouter/free",
]

async function getApiKey(): Promise<string> {
  const envKey = process.env.OPENROUTER_API_KEY
  if (envKey) return envKey
  const db = getAdminDb()
  const snap = await db.doc("admin_settings/config").get()
  if (snap.exists) return snap.data()?.openrouter_api_key || ""
  return ""
}

function extractJSON(text: string): any {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "")
  try { return JSON.parse(cleaned) } catch {}
  const fence = cleaned.match(/```[\s\S]*?```/)
  if (fence) {
    const inner = fence[0].replace(/```\w*\n?/g, "").replace(/```/g, "").trim()
    try { return JSON.parse(inner) } catch {}
  }
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) } catch {}
  }
  return null
}

async function callLLM(systemPrompt: string, userPrompt: string, retries = 2, maxTokens = 4096): Promise<string> {
  const apiKey = await getApiKey()
  if (!apiKey) throw new Error("No API key configured. Add your OpenRouter API key in Admin → Blog → AI Agent.")

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
          lastError = err.error?.message || `HTTP ${res.status}`
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
      } catch (e: any) {
        lastError = e.message
      }
    }
  }

  throw new Error(`All models failed. Last error: ${lastError}`)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  try {
    const { action, topic, category, research } = await req.json()

    if (action === "research") {
      if (!topic || !category) {
        return NextResponse.json({ error: "Topic and category are required." }, { status: 400 })
      }

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
      if (parsed && parsed.keyFindings) {
        return NextResponse.json(parsed)
      }

      return NextResponse.json({
        keyFindings: [result.slice(0, 500)],
        trends: [],
        statistics: [],
        expertQuotes: [],
        sourceTopics: [],
      })
    }

    if (action === "generate") {
      if (!topic || !category || !research) {
        return NextResponse.json({ error: "Topic, category, and research are required." }, { status: 400 })
      }

      const researchData = typeof research === "string" ? research : JSON.stringify(research)

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

CONTENT STRUCTURE:
1. Hook introduction (problem statement + why this matters)
2. Current landscape / state of the industry
3. Key challenges businesses face
4. Solutions and best practices (where you naturally link to services)
5. Expert insights or case study angle
6. Future outlook
7. Strong conclusion with CTA (link to contact/services)

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
        return NextResponse.json({
          title: parsed.title || topic,
          excerpt: parsed.excerpt || "",
          content: parsed.content,
          category,
          tags: parsed.tags || [],
          meta_description: parsed.metaDescription || parsed.excerpt || "",
          slug: (parsed.title || topic).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          agentSteps: [
            { tool: "research", input: topic },
            { tool: "generate", input: topic },
          ],
        })
      }

      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 })
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 })
  } catch (err: any) {
    console.error("Blog agent error:", err)
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 })
  }
}
