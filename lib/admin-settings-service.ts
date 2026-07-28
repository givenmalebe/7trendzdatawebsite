import { db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export interface AdminSettings {
  openrouter_api_key: string
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const snap = await getDoc(doc(db, "admin_settings", "config"))
  if (!snap.exists()) return { openrouter_api_key: "" }
  return snap.data() as AdminSettings
}

export async function saveAdminSettings(settings: AdminSettings): Promise<void> {
  await setDoc(doc(db, "admin_settings", "config"), settings)
}
