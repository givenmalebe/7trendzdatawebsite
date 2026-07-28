import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { CalendarRange, Calendar, Users } from "lucide-react"

export function PlanningReports() {
  const [report, setReport] = useState<any>(null)

  useEffect(() => { api.getPlanningReport().then(setReport) }, [])

  const aboveFunnel = report?.upcomingMeetings || []
  const inFunnel = [
    ...(report?.upcomingQual || []),
    ...(report?.upcomingProp || []),
    ...(report?.upcomingSales || []),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Planning Reports</h1><p className="text-muted-foreground text-sm">Plan upcoming sales activities</p></div>
        <Button variant="outline"><CalendarRange className="h-4 w-4" /> Export Plan</Button>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Planning Parameters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">From Date</label><Input type="date" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">To Date</label><Input type="date" /></div>
          </div>
          <div className="flex justify-end mt-4"><Button size="sm">Generate Plan</Button></div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report?.upcomingMeetings?.length || 0}</p><p className="text-xs text-muted-foreground">1st Meetings</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report?.upcomingQual?.length || 0}</p><p className="text-xs text-muted-foreground">Qualifications</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report?.upcomingProp?.length || 0}</p><p className="text-xs text-muted-foreground">Proposals</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report?.upcomingSales?.length || 0}</p><p className="text-xs text-muted-foreground">Go/No Go</p></CardContent></Card>
      </div>

      <Tabs
        tabs={[
          {
            id: "above",
            label: "Above Funnel",
            content: (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> 1st Meetings Scheduled</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Rep</TableHead><TableHead>Date</TableHead><TableHead>Stage</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {aboveFunnel.map((m: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{m.company_name}</TableCell>
                          <TableCell>{m.sales_rep}</TableCell>
                          <TableCell><Calendar className="h-3 w-3 inline mr-1 text-muted-foreground" />{m.meeting_date}</TableCell>
                          <TableCell><Badge variant="info">{m.stage}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {aboveFunnel.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No upcoming meetings</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ),
          },
          {
            id: "infunnel",
            label: "In Funnel",
            content: (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> In-Funnel Activities</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Rep</TableHead><TableHead>Date</TableHead><TableHead>Detail</TableHead><TableHead>Stage</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {inFunnel.map((m: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{m.company_name}</TableCell>
                          <TableCell>{m.sales_rep}</TableCell>
                          <TableCell><Calendar className="h-3 w-3 inline mr-1 text-muted-foreground" />{m.meeting_date}</TableCell>
                          <TableCell className="text-xs">{m.outcome || m.stage}</TableCell>
                          <TableCell><Badge variant={m.stage === "Sale" ? "destructive" : "warning"}>{m.stage}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {inFunnel.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No in-funnel activities</TableCell></TableRow>}
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
