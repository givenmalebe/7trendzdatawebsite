import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import { docWithId } from "./firestore-utils"
import {
  defaultMilestonesForCategory,
  type DeliveryStatus,
  type StageStatus,
} from "./catalog"

export interface DeliveryMilestone {
  id: string
  label: string
  status: StageStatus
  completedAt: string | null
  notes: string
}

export interface RevenueEntry {
  id: string
  clientId: string
  clientName: string
  serviceId: string
  serviceName: string
  category: string
  amount: number
  currency: string
  status: "pending" | "paid" | "cancelled"
  date: string
  notes?: string
  deliveryStatus: DeliveryStatus
  deliveryProgress: number
  clientUpdate: string
  milestones: DeliveryMilestone[]
  startedAt?: string
  estimatedCompletion?: string
  created_at: string
  updated_at: string
}

function withDeliveryDefaults(
  data: Omit<RevenueEntry, "id" | "created_at" | "updated_at" | "deliveryStatus" | "deliveryProgress" | "clientUpdate" | "milestones">,
): Omit<RevenueEntry, "id" | "created_at" | "updated_at"> {
  const now = new Date().toISOString()
  return {
    ...data,
    deliveryStatus: "ordered",
    deliveryProgress: 0,
    clientUpdate: "Your order has been received. Our team will begin shortly.",
    milestones: defaultMilestonesForCategory(data.category),
    startedAt: now,
    estimatedCompletion: "",
  }
}

export async function fetchRevenue(): Promise<RevenueEntry[]> {
  const q = query(collection(db, "revenue"), orderBy("date", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => normalizeEntry(d.id, d.data() as Record<string, unknown>))
}

export async function fetchRevenueByClient(clientId: string): Promise<RevenueEntry[]> {
  const q = query(collection(db, "revenue"), where("clientId", "==", clientId), orderBy("date", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => normalizeEntry(d.id, d.data() as Record<string, unknown>))
}

function normalizeEntry(id: string, data: Record<string, unknown>): RevenueEntry {
  const entry = docWithId<RevenueEntry>(id, data)
  return {
    ...entry,
    deliveryStatus: (entry.deliveryStatus as DeliveryStatus) || "ordered",
    deliveryProgress: entry.deliveryProgress ?? 0,
    clientUpdate: entry.clientUpdate || "",
    milestones: entry.milestones || defaultMilestonesForCategory(entry.category || "AI Automation"),
    updated_at: entry.updated_at || entry.created_at || new Date().toISOString(),
  }
}

export async function createRevenueEntry(
  data: Omit<RevenueEntry, "id" | "created_at" | "updated_at" | "deliveryStatus" | "deliveryProgress" | "clientUpdate" | "milestones">,
): Promise<string> {
  const ref = await addDoc(collection(db, "revenue"), {
    ...withDeliveryDefaults(data),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  return ref.id
}

export async function updateRevenueEntry(
  id: string,
  data: Partial<Omit<RevenueEntry, "id" | "created_at">>,
): Promise<void> {
  await updateDoc(doc(db, "revenue", id), { ...data, updated_at: serverTimestamp() })
}

export async function updateOrderDelivery(
  id: string,
  data: Pick<Partial<RevenueEntry>, "deliveryStatus" | "deliveryProgress" | "clientUpdate" | "milestones" | "estimatedCompletion" | "startedAt">,
): Promise<void> {
  await updateDoc(doc(db, "revenue", id), { ...data, updated_at: serverTimestamp() })
}

export async function deleteRevenueEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, "revenue", id))
}

export function sumRevenue(entries: RevenueEntry[], status?: RevenueEntry["status"]) {
  return entries
    .filter((e) => (status ? e.status === status : true))
    .reduce((sum, e) => sum + (e.amount || 0), 0)
}
