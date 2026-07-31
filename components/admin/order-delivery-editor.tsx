"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { RevenueEntry } from "@/lib/revenue-service"
import { updateOrderDelivery } from "@/lib/revenue-service"
import { DELIVERY_STATUS_LABELS, type DeliveryStatus, type StageStatus } from "@/lib/catalog"
import { CheckCircle2, Edit } from "lucide-react"

interface OrderDeliveryEditorProps {
  order: RevenueEntry
  onSaved: () => void
}

export function OrderDeliveryEditor({ order, onSaved }: OrderDeliveryEditorProps) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(order.deliveryStatus)
  const [deliveryProgress, setDeliveryProgress] = useState(String(order.deliveryProgress))
  const [clientUpdate, setClientUpdate] = useState(order.clientUpdate)
  const [estimatedCompletion, setEstimatedCompletion] = useState(order.estimatedCompletion?.slice(0, 10) || "")
  const [milestones, setMilestones] = useState(order.milestones)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateOrderDelivery(order.id, {
        deliveryStatus,
        deliveryProgress: parseInt(deliveryProgress, 10) || 0,
        clientUpdate,
        estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : "",
        milestones,
      })
      setOpen(false)
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  const setMilestoneStatus = (id: string, status: StageStatus) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              completedAt: status === "completed" ? new Date().toISOString() : status === "pending" ? null : m.completedAt,
            }
          : m,
      ),
    )
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4 mr-1" /> Update delivery
      </Button>
    )
  }

  return (
    <Card className="mt-3 border-cyan-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Client delivery update — {order.serviceName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Delivery status</Label>
            <Select value={deliveryStatus} onValueChange={(v) => setDeliveryStatus(v as DeliveryStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(DELIVERY_STATUS_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Progress (%)</Label>
            <Input type="number" min={0} max={100} value={deliveryProgress} onChange={(e) => setDeliveryProgress(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Est. completion date</Label>
          <Input type="date" value={estimatedCompletion} onChange={(e) => setEstimatedCompletion(e.target.value)} />
        </div>
        <div>
          <Label>Message to client (visible in portal)</Label>
          <Textarea value={clientUpdate} onChange={(e) => setClientUpdate(e.target.value)} rows={3} placeholder="e.g. Your pentesting report is in progress..." />
        </div>
        <div>
          <Label>Milestones</Label>
          <div className="space-y-2 mt-2">
            {milestones.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-2 p-2 border rounded-lg">
                <span className="text-sm font-medium flex-1">{m.label}</span>
                <Badge variant="outline">{m.status}</Badge>
                <Button size="sm" variant="ghost" onClick={() => setMilestoneStatus(m.id, "in_progress")}>Start</Button>
                <Button size="sm" variant="ghost" onClick={() => setMilestoneStatus(m.id, "completed")}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save & notify client"}</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}
