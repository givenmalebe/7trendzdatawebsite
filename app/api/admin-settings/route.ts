import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/api-auth"

const FREE_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  try {
    const db = getAdminDb()
    const snap = await db.doc("admin_settings/config").get()
    const data = snap.exists ? snap.data() : { openrouter_api_key: "", model: "free" }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()

    const allowedKeys = ["openrouter_api_key"]
    const sanitized: Record<string, any> = { model: "free" }
    for (const key of allowedKeys) {
      if (body[key] !== undefined) sanitized[key] = body[key]
    }

    if (sanitized.openrouter_api_key) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sanitized.openrouter_api_key}`,
          "HTTP-Referer": "https://7trendzdata.com",
          "X-Title": "7Trendz Data",
        },
        body: JSON.stringify({
          model: FREE_MODEL,
          messages: [{ role: "user", content: "Say OK" }],
          max_tokens: 10,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return NextResponse.json({ error: err.error?.message || "API key is invalid or model unavailable." }, { status: 400 })
      }
    }

    const db = getAdminDb()
    await db.doc("admin_settings/config").set(sanitized, { merge: true })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
