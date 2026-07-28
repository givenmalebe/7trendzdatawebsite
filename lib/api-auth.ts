import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "./firebase-admin"

export async function requireAdmin(req: NextRequest): Promise<{ uid: string; email: string } | NextResponse> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const idToken = authHeader.split("Bearer ")[1]

  try {
    const { initializeApp, cert, getApps } = await import("firebase-admin/app")
    const { getAuth } = await import("firebase-admin/auth")

    let app
    if (getApps().length === 0) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
      if (serviceAccountJson) {
        app = initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) })
      } else {
        app = initializeApp()
      }
    } else {
      app = getApps()[0]
    }

    const decoded = await getAuth(app).verifyIdToken(idToken)

    const db = getAdminDb()
    const userDoc = await db.doc(`users/${decoded.uid}`).get()
    const role = userDoc.data()?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return { uid: decoded.uid, email: decoded.email || "" }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
