import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"

const ALLOWED_ADMIN_EMAILS = [
  "info@7trendzdata.com",
  "admin@7trendzdata.com",
]

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json({ error: "This email is not authorized to create admin accounts." }, { status: 403 })
    }

    const db = getAdminDb()
    const snap = await db.collection("users").where("email", "==", email.toLowerCase()).limit(1).get()

    if (!snap.empty) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
