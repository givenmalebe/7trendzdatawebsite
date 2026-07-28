import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Search, Plus, Building2, Phone, Mail, MapPin } from "lucide-react"

interface Client { id: string; company_name: string; industry: string; contact_person: string; email: string; telephone_w: string; city: string; province: string; }

export function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({ company_name: "", industry: "", contact_person: "", email: "", telephone_w: "", city: "", province: "" })

  useEffect(() => { api.getClients().then(setClients) }, [])

  const filtered = clients.filter(c =>
    c.id?.toLowerCase().includes(search.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_person?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCreate() {
    await api.createClient(form)
    setForm({ company_name: "", industry: "", contact_person: "", email: "", telephone_w: "", city: "", province: "" })
    api.getClients().then(setClients)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Corporate Clients</h1>
          <p className="text-muted-foreground text-sm">Manage client information and contacts</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" /> New Client
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Badge variant="secondary">{clients.length} total</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-mono text-xs">{client.id}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Building2 className="h-3 w-3 text-muted-foreground" /><span className="font-medium">{client.company_name}</span></div></TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>{client.contact_person}</TableCell>
                  <TableCell><div className="flex items-center gap-1 text-xs"><Mail className="h-3 w-3" />{client.email}</div></TableCell>
                  <TableCell><div className="flex items-center gap-1 text-xs"><Phone className="h-3 w-3" />{client.telephone_w}</div></TableCell>
                  <TableCell><div className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />{client.city}{client.province ? `, ${client.province}` : ""}</div></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No clients found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">New Client Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(form).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium capitalize">{key.replace(/_/g, " ")}</label>
                <Input placeholder={`Enter ${key.replace(/_/g, " ")}`} value={val} onChange={e => setForm({...form, [key]: e.target.value})} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={handleCreate}>Register Client</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
