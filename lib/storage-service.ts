import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

export async function uploadReportFile(reportId: string, file: File): Promise<{ url: string; fileName: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `reports/${reportId}/${Date.now()}-${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, fileName: file.name }
}
