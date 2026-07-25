import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import { docWithId } from "./firestore-utils"

export interface ContactMessage {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  subject?: string
  message: string
  read: boolean
  created_at: string
}

export async function submitContactMessage(data: Omit<ContactMessage, "id" | "read" | "created_at">): Promise<void> {
  await addDoc(collection(db, "contact_messages"), {
    ...data,
    read: false,
    created_at: serverTimestamp(),
  })
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, "contact_messages"), orderBy("created_at", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => docWithId<ContactMessage>(d.id, d.data() as Record<string, unknown>))
}

export async function markMessageRead(id: string): Promise<void> {
  await updateDoc(doc(db, "contact_messages", id), { read: true })
}
