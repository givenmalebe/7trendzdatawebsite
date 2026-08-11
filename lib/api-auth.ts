import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getAdminDb } from "./firebase-admin"

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
  if (serviceAccountJson) {
    return initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) })
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (projectId && clientEmail && privateKey) {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  }

  throw new Error("Firebase Admin credentials not configured")
}

export async function requireAdmin(req: Request): Promise<{ uid: string; email: string } | Response> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized — please log in again as admin." }, { status: 401 })
  }

  const idToken = authHeader.split("Bearer ")[1]

  try {
    const app = getAdminApp()
    const decoded = await getAuth(app).verifyIdToken(idToken)

    const db = getAdminDb()
    const userDoc = await db.doc(`users/${decoded.uid}`).get()
    const role = userDoc.data()?.role

    if (role !== "admin") {
      return Response.json({ error: "Forbidden — admin access required." }, { status: 403 })
    }

    return { uid: decoded.uid, email: decoded.email || "" }
  } catch (err) {
    console.error("Auth verification failed:", err)
    return Response.json(
      { error: "Session expired — log out and log back in, then try again." },
      { status: 401 },
    )
  }
}
