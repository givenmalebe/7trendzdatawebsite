import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc, addDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "./firebase"
import { ADMIN_EMAILS } from "./catalog"
import { docWithId } from "./firestore-utils"

export type UserRole = "admin" | "client"

export interface UserProfile {
  id: string
  email: string
  displayName: string
  role: UserRole
  clientId?: string
  created_at: string
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
): Promise<{ user: User; profile: UserProfile }> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const role: UserRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "client"

  await setDoc(doc(db, "users", credential.user.uid), {
    email: email.toLowerCase(),
    displayName,
    role,
    created_at: serverTimestamp(),
  })

  let clientId: string | null = null
  if (role === "client") {
    clientId = await linkClientAccount(credential.user.uid, email.toLowerCase(), displayName)
  }

  const profile = await getUserProfile(credential.user.uid)
  if (!profile) throw new Error("Failed to create user profile")

  return { user: credential.user, profile: clientId ? { ...profile, clientId } : profile }
}

export async function isAdminSetupComplete(): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "setup", "admin"))
  return snapshot.exists() && snapshot.data()?.created === true
}

export async function registerAdminUser(
  email: string,
  password: string,
  displayName: string,
): Promise<{ user: User; profile: UserProfile }> {
  const normalizedEmail = email.toLowerCase().trim()
  if (!normalizedEmail) throw new Error("Email is required.")

  const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password)

  await setDoc(doc(db, "users", credential.user.uid), {
    email: normalizedEmail,
    displayName: displayName.trim() || "Admin",
    role: "admin" as UserRole,
    created_at: serverTimestamp(),
  })

  const profile = await getUserProfile(credential.user.uid)
  if (!profile) throw new Error("Failed to create user profile")
  if (profile.role !== "admin") throw new Error("Failed to assign admin role.")

  return { user: credential.user, profile }
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile = await getUserProfile(credential.user.uid)
  if (!profile) throw new Error("User profile not found")

  if (profile.role === "client" && !profile.clientId) {
    await linkClientAccount(credential.user.uid, email.toLowerCase(), profile.displayName)
  } else if (profile.role === "client") {
    await linkUserToClientByEmail(credential.user.uid, email.toLowerCase())
  }

  const updatedProfile = await getUserProfile(credential.user.uid)
  if (!updatedProfile) throw new Error("User profile not found")
  return { user: credential.user, profile: updatedProfile }
}

export async function logoutUser() {
  await signOut(auth)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid))
  if (!snapshot.exists()) return null
  return docWithId<UserProfile>(snapshot.id, snapshot.data() as Record<string, unknown>)
}

async function linkUserToClientByEmail(uid: string, email: string): Promise<string | null> {
  try {
    const q = query(collection(db, "clients"), where("email", "==", email.toLowerCase()))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const clientDoc = snapshot.docs[0]
    await updateDoc(doc(db, "users", uid), { clientId: clientDoc.id })
    try {
      await updateDoc(doc(db, "clients", clientDoc.id), { userId: uid })
    } catch {
      /* userId on client doc is optional; clientId on user is what matters */
    }
    return clientDoc.id
  } catch {
    return null
  }
}

export async function linkClientAccount(uid: string, email: string, displayName: string): Promise<string> {
  const normalizedEmail = email.toLowerCase().trim()
  const linked = await linkUserToClientByEmail(uid, normalizedEmail)
  if (linked) return linked
  return ensureClientProfile(uid, normalizedEmail, displayName)
}

async function ensureClientProfile(uid: string, email: string, displayName: string): Promise<string> {
  const profile = await getUserProfile(uid)
  if (profile?.clientId) return profile.clientId

  const ref = await addDoc(collection(db, "clients"), {
    name: displayName || email.split("@")[0],
    company: "",
    email: email.toLowerCase(),
    status: "active",
    userId: uid,
    notes: "Self-registered via client portal",
    created_at: serverTimestamp(),
  })

  await updateDoc(doc(db, "users", uid), { clientId: ref.id })
  return ref.id
}

export function subscribeToAuth(callback: (user: User | null, profile: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null)
      return
    }
    let profile = await getUserProfile(user.uid)
    if (profile?.role === "client" && !profile.clientId && user.email) {
      try {
        await linkClientAccount(user.uid, user.email, profile.displayName || user.displayName || "")
        profile = (await getUserProfile(user.uid)) ?? profile
      } catch (err) {
        console.error("Failed to link client profile:", err)
      }
    } else if (!profile && user.email) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email.toLowerCase(),
        displayName: user.displayName || user.email.split("@")[0],
        role: "client" as UserRole,
        created_at: serverTimestamp(),
      })
      try {
        await linkClientAccount(user.uid, user.email, user.displayName || "")
        profile = await getUserProfile(user.uid)
      } catch (err) {
        console.error("Failed to create client profile:", err)
      }
    }
    callback(user, profile)
  })
}
