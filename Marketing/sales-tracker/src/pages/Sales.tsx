import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { DollarSign, Plus, TrendingUp, TrendingDown } from "lucide-react"

export function Sales() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [selectedOpp, setSelectedOpp] = useState("")
  const [sales, setSales] = useState<any[]>([])
  const [form, setForm] = useState({ opportunity_id: "", gonogo_date: "", deliverable: "", gonogo: "Go", sale_value: "", reason_value_variance: "", reason_no_sale: "", sales_rep: "", inside_sales_rep: "" })

  useEffect(() => { api.getOpportunities().then(setOpportunities) }, [])
  useEffect(() => { if (selectedOpp) api.getSales(selectedOpp).then(setSales) }, [selectedOpp])

  async function handleCreate() {
    await api.createSale({ ...form, opportunity_id: selectedOpp })
    if (selectedOpp) api.getSales(selectedOpp).then(setSales)
  }

  const totalSales = sales.reduce((s, x) => s + (x.gonogo === "Go" ? Number(x.sale_value || 0) : 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Sales</h1><p className="text-muted-foreground text-sm">Record client decisions and closed deals</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-lg font-bold">${totalSales.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Sales</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100"><TrendingUp className="h-5 w-5 text-green-600" /></div><div><p className="text-lg font-bold">{sales.filter(s => s.gonogo === "Go").length}</p><p className="text-xs text-muted-foreground">Won</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-red-100"><TrendingDown className="h-5 w-5 text-red-600" /></div><div><p className="text-lg font-bold">{sales.filter(s => s.gonogo === "No Go").length}</p><p className="text-xs text-muted-foreground">Lost</p></div></CardContent></Card>
      </div>

      <div className="flex gap-2 max-w-sm">
        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={selectedOpp} onChange={e => setSelectedOpp(e.target.value)}>
          <option value="">Select opportunity...</option>
          {opportunities.map(o => <option key={o.id} value={o.id}>{o.id} — {o.company_name}</option>)}
        </select>
        <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4" /> Record</Button>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Deliverable</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Go/No Go</TableHead>
              <TableHead>Variance</TableHead>
              <TableHead>Rep</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((s, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{s.opportunity_id}</TableCell>
                <TableCell>{s.deliverable}</TableCell>
                <TableCell>{s.gonogo_date}</TableCell>
                <TableCell className="font-medium">${Number(s.sale_value || 0).toLocaleString()}</TableCell>
                <TableCell><Badge variant={s.gonogo === "Go" ? "success" : "destructive"}>{s.gonogo}</Badge></TableCell>
                <TableCell className="text-xs">{s.reason_value_variance || s.reason_no_sale || "—"}</TableCell>
                <TableCell>{s.sales_rep}</TableCell>
              </TableRow>
            ))}
            {sales.length === 0 && selectedOpp && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-4">No sales recorded</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      {selectedOpp && (
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Record Sale</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium">Deliverable</label><Input placeholder="Deliverable" value={form.deliverable} onChange={e => setForm({...form, deliverable: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Decision Date</label><Input type="date" value={form.gonogo_date} onChange={e => setForm({...form, gonogo_date: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Go/No Go</label><select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={form.gonogo} onChange={e => setForm({...form, gonogo: e.target.value})}><option value="Go">Go</option><option value="No Go">No Go</option></select></div>
            <div className="space-y-1"><label className="text-xs font-medium">Value ($)</label><Input type="number" placeholder="0" value={form.sale_value} onChange={e => setForm({...form, sale_value: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Variance Reason</label><Input placeholder="If applicable" value={form.reason_value_variance} onChange={e => setForm({...form, reason_value_variance: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Reason (No Go)</label><Input placeholder="If No Go" value={form.reason_no_sale} onChange={e => setForm({...form, reason_no_sale: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Sales Rep</label><Input placeholder="Rep" value={form.sales_rep} onChange={e => setForm({...form, sales_rep: e.target.value})} /></div>
          </div>
          <div className="flex justify-end mt-4"><Button size="sm" onClick={handleCreate}>Record Sale</Button></div>
        </CardContent></Card>
      )}
    </div>
  )
}
