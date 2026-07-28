import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Target, Plus, Calendar, Building2 } from "lucide-react"

export function Opportunities() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [form, setForm] = useState({ client_id: "", source_of_opportunity: "", planned_1st_meeting: "", guestimated_value: "", outcome_of_1st_meeting: "", next_step: "", sales_rep: "" })

  useEffect(() => { api.getOpportunities().then(setOpportunities) }, [])

  async function handleCreate() {
    await api.createOpportunity(form)
    setForm({ client_id: "", source_of_opportunity: "", planned_1st_meeting: "", guestimated_value: "", outcome_of_1st_meeting: "", next_step: "", sales_rep: "" })
    api.getOpportunities().then(setOpportunities)
  }

  const totalValue = opportunities.reduce((s, o) => s + (Number(o.guestimated_value) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground text-sm">Track sales opportunities from first meeting onward</p>
        </div>
        <Button onClick={handleCreate}><Plus className="h-4 w-4" /> New Opportunity</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-100"><Target className="h-5 w-5 text-violet-600" /></div>
          <div><p className="text-lg font-bold">${totalValue.toLocaleString()}</p><p className="text-xs text-muted-foreground">Pipeline Value</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-100"><Target className="h-5 w-5 text-violet-600" /></div>
          <div><p className="text-lg font-bold">{opportunities.length}</p><p className="text-xs text-muted-foreground">Total Opportunities</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-100"><Target className="h-5 w-5 text-violet-600" /></div>
          <div><p className="text-lg font-bold">{opportunities.filter(o => o.outcome_of_1st_meeting && o.outcome_of_1st_meeting !== "End").length}</p><p className="text-xs text-muted-foreground">Active</p></div>
        </CardContent></Card>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>1st Meeting</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Next Step</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Rep</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map(opp => (
              <TableRow key={opp.id}>
                <TableCell className="font-mono text-xs">{opp.id}</TableCell>
                <TableCell><Building2 className="h-3 w-3 inline mr-1 text-muted-foreground" />{opp.company_name || opp.client_id}</TableCell>
                <TableCell>{opp.source_of_opportunity}</TableCell>
                <TableCell><Calendar className="h-3 w-3 inline mr-1 text-muted-foreground" />{opp.planned_1st_meeting}</TableCell>
                <TableCell><Badge variant={opp.outcome_of_1st_meeting === "End" ? "destructive" : "info"}>{opp.outcome_of_1st_meeting || "Pending"}</Badge></TableCell>
                <TableCell className="text-xs">{opp.next_step}</TableCell>
                <TableCell className="font-medium">${Number(opp.guestimated_value || 0).toLocaleString()}</TableCell>
                <TableCell>{opp.sales_rep}</TableCell>
              </TableRow>
            ))}
            {opportunities.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No opportunities</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">New Opportunity</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium">Client ID</label><Input placeholder="e.g. C001" value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Source</label><Input placeholder="Referral, Website..." value={form.source_of_opportunity} onChange={e => setForm({...form, source_of_opportunity: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">1st Meeting</label><Input type="date" value={form.planned_1st_meeting} onChange={e => setForm({...form, planned_1st_meeting: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Value ($)</label><Input type="number" placeholder="0" value={form.guestimated_value} onChange={e => setForm({...form, guestimated_value: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Outcome</label><Input placeholder="Positive/Neutral..." value={form.outcome_of_1st_meeting} onChange={e => setForm({...form, outcome_of_1st_meeting: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Next Step</label><Input placeholder="Next step..." value={form.next_step} onChange={e => setForm({...form, next_step: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Sales Rep</label><Input placeholder="Rep name" value={form.sales_rep} onChange={e => setForm({...form, sales_rep: e.target.value})} /></div>
          </div>
          <div className="flex justify-end mt-4"><Button size="sm" onClick={handleCreate}>Capture Opportunity</Button></div>
        </CardContent>
      </Card>
    </div>
  )
}
