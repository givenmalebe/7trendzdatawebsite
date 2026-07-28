import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/api-auth"

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  try {
    const db = getAdminDb()
    const snap = await db.collection("blog_posts").where("status", "==", "draft").get()
    const batch = db.batch()
    let count = 0
    snap.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "published", published_at: new Date().toISOString() })
      count++
    })
    if (count > 0) await batch.commit()
    return NextResponse.json({ ok: true, published: count })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
