import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Plus } from "lucide-react"

export function Qualifications() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [selectedOpp, setSelectedOpp] = useState("")
  const [quals, setQuals] = useState<any[]>([])
  const [form, setForm] = useState({ opportunity_id: "", qualification_meeting_date: "", outcome: "", solution: "", estimated_value: "", next_step: "", sales_rep: "", inside_sales_rep: "" })

  useEffect(() => { api.getOpportunities().then(setOpportunities) }, [])

  useEffect(() => {
    if (!selectedOpp) return
    api.getQualifications(selectedOpp).then(setQuals)
  }, [selectedOpp])

  async function handleCreate() {
    await api.createQualification({ ...form, opportunity_id: selectedOpp })
    setForm({ opportunity_id: "", qualification_meeting_date: "", outcome: "", solution: "", estimated_value: "", next_step: "", sales_rep: "", inside_sales_rep: "" })
    if (selectedOpp) api.getQualifications(selectedOpp).then(setQuals)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Qualifications</h1>
          <p className="text-muted-foreground text-sm">Track qualification meetings and outcomes</p>
        </div>
      </div>

      <div className="flex gap-2 max-w-sm">
        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={selectedOpp} onChange={e => setSelectedOpp(e.target.value)}>
          <option value="">Select opportunity...</option>
          {opportunities.map(o => <option key={o.id} value={o.id}>{o.id} — {o.company_name}</option>)}
        </select>
        <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4" /> Qualify</Button>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Meeting Date</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Solution</TableHead>
              <TableHead>Est. Value</TableHead>
              <TableHead>Next Step</TableHead>
              <TableHead>Sales Rep</TableHead>
              <TableHead>Inside Rep</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quals.map((q, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{q.opportunity_id}</TableCell>
                <TableCell>{q.qualification_meeting_date}</TableCell>
                <TableCell><Badge variant={q.outcome === "Qualified" ? "success" : "warning"}>{q.outcome || "Pending"}</Badge></TableCell>
                <TableCell>{q.solution}</TableCell>
                <TableCell>${Number(q.estimated_value || 0).toLocaleString()}</TableCell>
                <TableCell className="text-xs">{q.next_step}</TableCell>
                <TableCell>{q.sales_rep}</TableCell>
                <TableCell>{q.inside_sales_rep}</TableCell>
              </TableRow>
            ))}
            {quals.length === 0 && selectedOpp && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-4">No qualifications yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      {selectedOpp && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Capture Qualification</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1"><label className="text-xs font-medium">Meeting Date</label><Input type="date" value={form.qualification_meeting_date} onChange={e => setForm({...form, qualification_meeting_date: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Outcome</label><Input placeholder="Qualified/Pending..." value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Solution</label><Input placeholder="Solution" value={form.solution} onChange={e => setForm({...form, solution: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Est. Value ($)</label><Input type="number" placeholder="0" value={form.estimated_value} onChange={e => setForm({...form, estimated_value: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Next Step</label><Input placeholder="Next step..." value={form.next_step} onChange={e => setForm({...form, next_step: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Sales Rep</label><Input placeholder="Rep" value={form.sales_rep} onChange={e => setForm({...form, sales_rep: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Inside Sales Rep</label><Input placeholder="Inside rep" value={form.inside_sales_rep} onChange={e => setForm({...form, inside_sales_rep: e.target.value})} /></div>
            </div>
            <div className="flex justify-end mt-4"><Button size="sm" onClick={handleCreate}>Capture</Button></div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
