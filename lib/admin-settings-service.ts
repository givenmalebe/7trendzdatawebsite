import { db } from "./firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export interface AdminSettings {
  openrouter_api_key: string
  model?: string
  updated_at?: string
}

const SETTINGS_DOC = doc(db, "admin_settings", "config")

export async function getAdminSettings(): Promise<AdminSettings> {
  const snap = await getDoc(SETTINGS_DOC)
  if (!snap.exists()) return { openrouter_api_key: "" }
  const data = snap.data()
  return {
    openrouter_api_key: (data.openrouter_api_key as string) || "",
    model: (data.model as string) || "free",
    updated_at: data.updated_at as string | undefined,
  }
}

export async function saveAdminSettings(settings: Partial<AdminSettings>): Promise<void> {
  await setDoc(
    SETTINGS_DOC,
    {
      ...settings,
      updated_at: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function deleteAdminApiKey(): Promise<void> {
  await setDoc(
    SETTINGS_DOC,
    {
      openrouter_api_key: "",
      updated_at: serverTimestamp(),
    },
    { merge: true },
  )
}

export function maskApiKey(key: string): string {
  if (!key) return ""
  if (key.length <= 8) return "••••••••"
  return `${key.slice(0, 7)}••••••••${key.slice(-4)}`
}
