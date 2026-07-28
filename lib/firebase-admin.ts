import { initializeApp, cert, getApps, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let app: App
let _db: Firestore

function initAdmin(): App {
  if (app) return app

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson)
    app = initializeApp({ credential: cert(parsed) })
    return app
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (projectId && clientEmail && privateKey) {
    app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    return app
  }

  const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (creds) {
    app = initializeApp()
    return app
  }

  throw new Error(
    "Firebase Admin SDK credentials missing. Set one of:\n" +
    "  1. FIREBASE_SERVICE_ACCOUNT (full JSON string)\n" +
    "  2. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY\n" +
    "  3. GOOGLE_APPLICATION_CREDENTIALS (path to JSON file)\n\n" +
    "Download your service account key from:\n" +
    "  Firebase Console → Project Settings → Service Accounts → Generate New Private Key"
  )
}

export function getAdminDb(): Firestore {
  if (_db) return _db
  initAdmin()
  _db = getFirestore()
  return _db
}
