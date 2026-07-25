"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BlogDashboardRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin?tab=blog")
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600" />
    </div>
  )
}
