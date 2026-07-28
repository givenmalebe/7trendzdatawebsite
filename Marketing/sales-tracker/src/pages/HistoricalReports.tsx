import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { BarChart3, Download, Trophy } from "lucide-react"

export function HistoricalReports() {
  const [report, setReport] = useState<any>(null)
  const [params, setParams] = useState({ from: "2026-01-01", to: "2026-12-31", frequency: "Monthly" })

  useEffect(() => {
    api.getHistoricalReport(params).then(setReport)
  }, [])

  async function generate() {
    api.getHistoricalReport(params).then(setReport)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Historical Reports</h1><p className="text-muted-foreground text-sm">Analyze past sales performance and trends</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Report Parameters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">From Date</label><Input type="date" value={params.from} onChange={e => setParams({...params, from: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">To Date</label><Input type="date" value={params.to} onChange={e => setParams({...params, to: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Frequency</label><select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={params.frequency} onChange={e => setParams({...params, frequency: e.target.value})}><option>Day</option><option>Week</option><option>Month</option><option>Quarter</option><option>Year</option></select></div>
          </div>
          <div className="flex justify-end mt-4"><Button size="sm" onClick={generate}>Generate Report</Button></div>
        </CardContent>
      </Card>

      {report && (
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">${report.totalValue.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Sales</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report.saleCount}</p><p className="text-xs text-muted-foreground">Closed Sales</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report.proposalCount}</p><p className="text-xs text-muted-foreground">Proposals</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report.conversionRate}%</p><p className="text-xs text-muted-foreground">Conv. Rate</p></CardContent></Card>
        </div>
      )}

      <Tabs
        tabs={[
          {
            id: "allsales",
            label: "All Sales",
            content: (
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Sales Performance</CardTitle>
                  <Badge variant="secondary">{report?.allSales?.length || 0} sales</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Deliverable</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Rep</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report?.allSales?.map((s: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{s.company_name}</TableCell>
                          <TableCell>{s.deliverable}</TableCell>
                          <TableCell className="font-medium">${Number(s.sale_value || 0).toLocaleString()}</TableCell>
                          <TableCell>{s.sales_rep}</TableCell>
                        </TableRow>
                      ))}
                      {report?.allSales?.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No sales data</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ),
          },
          {
            id: "top20",
            label: "Top Sales",
            content: (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" /> Top Sales</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Deliverable</TableHead>
                        <TableHead>Rep</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report?.allSales?.slice(0, 20).map((s: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-bold">{i + 1}</TableCell>
                          <TableCell className="font-medium">{s.company_name}</TableCell>
                          <TableCell className="font-medium">${Number(s.sale_value || 0).toLocaleString()}</TableCell>
                          <TableCell>{s.deliverable}</TableCell>
                          <TableCell>{s.sales_rep}</TableCell>
                        </TableRow>
                      ))}
                      {report?.allSales?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No sales data</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}
