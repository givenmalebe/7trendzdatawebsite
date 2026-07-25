import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import { docWithId } from "./firestore-utils"

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  status: "active" | "inactive" | "lead"
  userId?: string
  notes?: string
  created_at: string
}

export async function fetchClients(): Promise<Client[]> {
  const q = query(collection(db, "clients"), orderBy("created_at", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => docWithId<Client>(d.id, d.data() as Record<string, unknown>))
}

export async function fetchClient(id: string): Promise<Client | null> {
  const snapshot = await getDoc(doc(db, "clients", id))
  if (!snapshot.exists()) return null
  return docWithId<Client>(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function createClient(data: Omit<Client, "id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(db, "clients"), {
    ...data,
    email: data.email.toLowerCase(),
    created_at: serverTimestamp(),
  })
  return ref.id
}

export async function updateClient(id: string, data: Partial<Omit<Client, "id" | "created_at">>): Promise<void> {
  const payload = { ...data }
  if (data.email) payload.email = data.email.toLowerCase()
  await updateDoc(doc(db, "clients", id), payload)
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, "clients", id))
}
