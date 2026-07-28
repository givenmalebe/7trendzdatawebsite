/**
 * One-time script to create the default admin account.
 * Usage: node scripts/create-admin.mjs [email] [password]
 * Password is REQUIRED — no default is provided for security.
 */
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCYI_RcdhPOwC9WWAASO5S38MKquVbbZPo",
  authDomain: "web7trendzdata.firebaseapp.com",
  projectId: "web7trendzdata",
  storageBucket: "web7trendzdata.firebasestorage.app",
  messagingSenderId: "297864405914",
  appId: "1:297864405914:web:3f585fdf7bd13c4df69023",
}

const ADMIN_EMAILS = ["info@7trendzdata.com", "admin@7trendzdata.com"]
const email = (process.argv[2] || "").toLowerCase()
const password = process.argv[3] || ""
const displayName = "7Trendz Admin"

if (!email || !ADMIN_EMAILS.includes(email)) {
  console.error(`Usage: node scripts/create-admin.mjs <email> <password>`)
  console.error(`Email must be one of: ${ADMIN_EMAILS.join(", ")}`)
  process.exit(1)
}

if (!password || password.length < 8) {
  console.error("Password is required and must be at least 8 characters.")
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function ensureAdminProfile(uid) {
  const userRef = doc(db, "users", uid)
  const existing = await getDoc(userRef)
  if (existing.exists() && existing.data().role === "admin") {
    console.log("Admin profile already exists in Firestore.")
    return
  }
  await setDoc(userRef, {
    email,
    displayName,
    role: "admin",
    created_at: serverTimestamp(),
  })
  console.log("Admin profile saved to Firestore.")
}

async function main() {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await ensureAdminProfile(credential.user.uid)
    console.log("\nAdmin account created successfully.\n")
    printCredentials(false)
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log("Account already exists — signing in and ensuring admin profile...")
      const credential = await signInWithEmailAndPassword(auth, email, password)
      await ensureAdminProfile(credential.user.uid)
      console.log("\nAdmin account is ready.\n")
      printCredentials(true)
    } else {
      console.error("Failed:", err.code || err.message)
      if (err.code === "auth/operation-not-allowed") {
        console.error("\nEnable Email/Password in Firebase Console → Authentication → Sign-in method.")
      }
      process.exit(1)
    }
  }
  process.exit(0)
}

function printCredentials(alreadyExisted) {
  console.log("Login at: http://localhost:3000/login")
  console.log("────────────────────────────────────")
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log("────────────────────────────────────")
  if (alreadyExisted) {
    console.log("If login fails, the password above may not match — reset it in Firebase Console.")
  } else {
    console.log("Change this password after your first login.")
  }
}

main()
