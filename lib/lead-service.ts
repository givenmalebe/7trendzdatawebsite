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
  where,
} from "firebase/firestore"
import { db } from "./firebase"
import { docWithId } from "./firestore-utils"

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  interest: string
  message?: string
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  notes?: string
  created_at: string
}

export async function fetchLeads(filters?: { status?: string; search?: string }): Promise<Lead[]> {
  const constraints: any[] = []
  if (filters?.status && filters.status !== "all") {
    constraints.push(where("status", "==", filters.status))
  }
  constraints.push(orderBy("created_at", "desc"))
  const q = query(collection(db, "leads"), ...constraints)
  const snapshot = await getDocs(q)
  let leads = snapshot.docs.map((d) => docWithId<Lead>(d.id, d.data() as Record<string, unknown>))
  if (filters?.search) {
    const lower = filters.search.toLowerCase()
    leads = leads.filter(
      (l) =>
        l.name?.toLowerCase().includes(lower) ||
        l.email?.toLowerCase().includes(lower) ||
        l.company?.toLowerCase().includes(lower),
    )
  }
  return leads
}

export async function fetchLead(id: string): Promise<Lead | null> {
  const snapshot = await getDoc(doc(db, "leads", id))
  if (!snapshot.exists()) return null
  return docWithId<Lead>(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function createLead(data: Omit<Lead, "id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(db, "leads"), {
    ...data,
    email: data.email.toLowerCase(),
    status: data.status || "new",
    created_at: serverTimestamp(),
  })
  return ref.id
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<void> {
  await updateDoc(doc(db, "leads", id), { status })
}

export async function updateLead(id: string, data: Partial<Omit<Lead, "id" | "created_at">>): Promise<void> {
  await updateDoc(doc(db, "leads", id), data)
}

export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(doc(db, "leads", id))
}
