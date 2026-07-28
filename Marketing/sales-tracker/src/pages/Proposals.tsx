import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { Plus } from "lucide-react"

export function Proposals() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [selectedOpp, setSelectedOpp] = useState("")
  const [proposals, setProposals] = useState<any[]>([])
  const [form, setForm] = useState({ opportunity_id: "", proposal_delivery_date: "", proposed_offering: "", proposal_value: "", scheduled_gonogo_date: "", sales_rep: "", inside_sales_rep: "" })

  useEffect(() => { api.getOpportunities().then(setOpportunities) }, [])
  useEffect(() => { if (selectedOpp) api.getProposals(selectedOpp).then(setProposals) }, [selectedOpp])

  async function handleCreate() {
    await api.createProposal({ ...form, opportunity_id: selectedOpp })
    setForm({ opportunity_id: "", proposal_delivery_date: "", proposed_offering: "", proposal_value: "", scheduled_gonogo_date: "", sales_rep: "", inside_sales_rep: "" })
    if (selectedOpp) api.getProposals(selectedOpp).then(setProposals)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground text-sm">Track proposal deliveries and decisions</p>
        </div>
      </div>

      <div className="flex gap-2 max-w-sm">
        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={selectedOpp} onChange={e => setSelectedOpp(e.target.value)}>
          <option value="">Select opportunity...</option>
          {opportunities.map(o => <option key={o.id} value={o.id}>{o.id} — {o.company_name}</option>)}
        </select>
        <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4" /> Propose</Button>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Offering</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Decision Date</TableHead>
              <TableHead>Sales Rep</TableHead>
              <TableHead>Inside Rep</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{p.opportunity_id}</TableCell>
                <TableCell className="font-medium">{p.proposed_offering}</TableCell>
                <TableCell>{p.proposal_delivery_date}</TableCell>
                <TableCell className="font-medium">${Number(p.proposal_value || 0).toLocaleString()}</TableCell>
                <TableCell>{p.scheduled_gonogo_date}</TableCell>
                <TableCell>{p.sales_rep}</TableCell>
                <TableCell>{p.inside_sales_rep}</TableCell>
              </TableRow>
            ))}
            {proposals.length === 0 && selectedOpp && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-4">No proposals yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      {selectedOpp && (
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">New Proposal</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium">Offering</label><Input placeholder="Offering" value={form.proposed_offering} onChange={e => setForm({...form, proposed_offering: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Delivery Date</label><Input type="date" value={form.proposal_delivery_date} onChange={e => setForm({...form, proposal_delivery_date: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Value ($)</label><Input type="number" placeholder="0" value={form.proposal_value} onChange={e => setForm({...form, proposal_value: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Decision Date</label><Input type="date" value={form.scheduled_gonogo_date} onChange={e => setForm({...form, scheduled_gonogo_date: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Sales Rep</label><Input placeholder="Rep" value={form.sales_rep} onChange={e => setForm({...form, sales_rep: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Inside Rep</label><Input placeholder="Inside rep" value={form.inside_sales_rep} onChange={e => setForm({...form, inside_sales_rep: e.target.value})} /></div>
          </div>
          <div className="flex justify-end mt-4"><Button size="sm" onClick={handleCreate}>Capture Proposal</Button></div>
        </CardContent></Card>
      )}
    </div>
  )
}
