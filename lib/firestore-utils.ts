import { Timestamp } from "firebase/firestore"

export function serializeDoc<T extends Record<string, unknown>>(data: Record<string, unknown>): T {
  const serialized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString()
    } else {
      serialized[key] = value
    }
  }
  return serialized as T
}

export function docWithId<T extends Record<string, unknown>>(id: string, data: Record<string, unknown>): T {
  return { id, ...serializeDoc<T>(data) }
}
