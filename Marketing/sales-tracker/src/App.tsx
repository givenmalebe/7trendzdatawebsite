import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Dashboard } from "@/pages/Dashboard"
import { Clients } from "@/pages/Clients"
import { Opportunities } from "@/pages/Opportunities"
import { Qualifications } from "@/pages/Qualifications"
import { Proposals } from "@/pages/Proposals"
import { Sales } from "@/pages/Sales"
import { HistoricalReports } from "@/pages/HistoricalReports"
import { PlanningReports } from "@/pages/PlanningReports"
import { Configuration } from "@/pages/Configuration"
import { Agents } from "@/pages/Agents"
import { Leads } from "@/pages/Leads"

const pages: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  clients: <Clients />,
  leads: <Leads />,
  opportunities: <Opportunities />,
  qualifications: <Qualifications />,
  proposals: <Proposals />,
  sales: <Sales />,
  historical: <HistoricalReports />,
  planning: <PlanningReports />,
  configuration: <Configuration />,
  agents: <Agents />,
}

function App() {
  const [activePage, setActivePage] = useState("dashboard")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {pages[activePage]}
      </main>
    </div>
  )
}

export default App
