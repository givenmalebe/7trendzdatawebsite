export function isAbortError(error: any): boolean {
  return (
    error?.name === "AbortError" ||
    error?.code === "aborted" ||
    (typeof error?.message === "string" && error.message.includes("signal is aborted"))
  )
}

export async function safeFirestoreCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    if (isAbortError(error)) return null
    throw error
  }
}
