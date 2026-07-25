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
  where,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import { docWithId } from "./firestore-utils"
import { defaultReportStages, type ReportStageId, type StageStatus } from "./catalog"

export interface ReportStage {
  id: ReportStageId
  label: string
  status: StageStatus
  completedAt: string | null
  notes: string
}

export interface RedTeamReport {
  id: string
  clientId: string
  clientName: string
  title: string
  description?: string
  status: "active" | "completed" | "on_hold"
  currentStage: ReportStageId
  stages: ReportStage[]
  reportFileUrl?: string
  reportFileName?: string
  created_at: string
  updated_at: string
}

export async function fetchReports(): Promise<RedTeamReport[]> {
  const q = query(collection(db, "reports"), orderBy("updated_at", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => docWithId<RedTeamReport>(d.id, d.data() as Record<string, unknown>))
}

export async function fetchReportsByClient(clientId: string): Promise<RedTeamReport[]> {
  const q = query(collection(db, "reports"), where("clientId", "==", clientId), orderBy("updated_at", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => docWithId<RedTeamReport>(d.id, d.data() as Record<string, unknown>))
}

export async function fetchReport(id: string): Promise<RedTeamReport | null> {
  const snapshot = await getDoc(doc(db, "reports", id))
  if (!snapshot.exists()) return null
  return docWithId<RedTeamReport>(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function createReport(
  data: Pick<RedTeamReport, "clientId" | "clientName" | "title" | "description">,
): Promise<string> {
  const stages = defaultReportStages()
  const ref = await addDoc(collection(db, "reports"), {
    ...data,
    status: "active",
    currentStage: "intake",
    stages,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  return ref.id
}

export async function updateReportStage(
  reportId: string,
  stageId: ReportStageId,
  status: StageStatus,
  notes?: string,
): Promise<void> {
  const report = await fetchReport(reportId)
  if (!report) throw new Error("Report not found")

  const stages = report.stages.map((stage, index) => {
    if (stage.id === stageId) {
      return {
        ...stage,
        status,
        notes: notes ?? stage.notes,
        completedAt: status === "completed" ? new Date().toISOString() : stage.completedAt,
      }
    }
    if (status === "completed") {
      const completedIndex = report.stages.findIndex((s) => s.id === stageId)
      if (index === completedIndex + 1 && stage.status === "pending") {
        return { ...stage, status: "in_progress" as StageStatus }
      }
    }
    return stage
  })

  let currentStage = report.currentStage
  if (status === "in_progress") currentStage = stageId
  if (status === "completed") {
    const idx = stages.findIndex((s) => s.id === stageId)
    const next = stages[idx + 1]
    if (next) currentStage = next.id
  }

  await updateDoc(doc(db, "reports", reportId), {
    stages,
    currentStage,
    status: stageId === "delivery" && status === "completed" ? "completed" : report.status,
    updated_at: serverTimestamp(),
  })
}

export async function attachReportFile(reportId: string, fileUrl: string, fileName: string): Promise<void> {
  await updateDoc(doc(db, "reports", reportId), {
    reportFileUrl: fileUrl,
    reportFileName: fileName,
    updated_at: serverTimestamp(),
  })
}

export async function deleteReport(id: string): Promise<void> {
  await deleteDoc(doc(db, "reports", id))
}
