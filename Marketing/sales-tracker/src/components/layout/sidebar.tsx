import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  Building2,
  Target,
  CheckSquare,
  FileText,
  DollarSign,
  BarChart3,
  CalendarRange,
  Bot,
  Users,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Corporate Clients", icon: Building2 },
  { id: "leads", label: "Leads", icon: Users },
  { id: "opportunities", label: "Opportunities", icon: Target },
  { id: "qualifications", label: "Qualifications", icon: CheckSquare },
  { id: "proposals", label: "Proposals", icon: FileText },
  { id: "sales", label: "Sales", icon: DollarSign },
  { id: "historical", label: "Historical Reports", icon: BarChart3 },
  { id: "planning", label: "Planning Reports", icon: CalendarRange },
  { id: "agents", label: "AI Agents", icon: Bot },
  { id: "configuration", label: "Configuration", icon: Settings },
]

export function Sidebar({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  return (
    <aside className="w-64 border-r border-border bg-card h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">ST</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Sales Tracker</h1>
            <p className="text-[10px] text-muted-foreground">Sales Management System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
              active === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground">Two Global Eyes</p>
        <p className="text-[10px] text-muted-foreground">v1.0 - Sales Tracker</p>
      </div>
    </aside>
  )
}
