"use client"

import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Crosshair, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { logoutUser } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"

const NAV = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "services", label: "My Services", icon: Package },
  { view: "reports", label: "Red Team Reports", icon: Crosshair },
]

export function ClientShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { profile, loading } = useAuth()
  const currentView = searchParams.get("view") || "dashboard"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600" />
      </div>
    )
  }

  if (!profile || profile.role !== "client") {
    router.push("/login")
    return null
  }

  const handleLogout = async () => {
    await logoutUser()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800">
          <Link href="/" className="font-bold text-lg">7Trendz Data</Link>
          <Badge className="mt-2 bg-cyan-600/20 text-cyan-300 border-cyan-500/30">Client Portal</Badge>
          <p className="text-xs text-slate-400 mt-2 truncate">{profile.displayName || profile.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ view, label, icon: Icon }) => (
            <Link
              key={view}
              href={`${pathname}?view=${view}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                currentView === view && !searchParams.get("report")
                  ? "bg-cyan-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 mt-4">
            <Home className="h-4 w-4" /> Back to Website
          </Link>
        </nav>
        <div className="p-3 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
