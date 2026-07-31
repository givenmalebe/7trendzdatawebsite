"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLead } from "@/lib/lead-service"
import { CheckCircle, Crosshair } from "lucide-react"

interface LeadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INTERESTS = [
  "Red Team Assessment",
  "Pentesting Report — Low (R2,500)",
  "Pentesting Report — Medium (R5,000)",
  "Pentesting Report — High (R10,000)",
  "Pentesting Report — Critical (R15,000)",
  "Vulnerability Analysis",
  "Defender Matching",
  "Other",
]

export function LeadForm({ open, onOpenChange }: LeadFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: "Red Team Assessment",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    try {
      await createLead({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        interest: form.interest,
        message: form.message || undefined,
        source: "hero_cta",
        status: "new",
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = (next: boolean) => {
    if (!next) {
      setForm({ name: "", email: "", phone: "", company: "", interest: "Red Team Assessment", message: "" })
      setSubmitted(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
            <DialogTitle className="text-xl">Thank you, {form.name}!</DialogTitle>
            <p className="text-muted-foreground">We&apos;ve received your enquiry and will get back to you within 24 hours.</p>
            <Button onClick={() => handleClose(false)} className="mt-4">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Crosshair className="h-5 w-5 text-red-500" />
                Book a Red Team Assessment
              </DialogTitle>
              <DialogDescription>
                Tell us about your organisation and we&apos;ll schedule a scoping call.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="lead-name">Full Name *</Label>
                <Input id="lead-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="lead-email">Work Email *</Label>
                <Input id="lead-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input id="lead-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27..." />
                </div>
                <div>
                  <Label htmlFor="lead-company">Company</Label>
                  <Input id="lead-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" />
                </div>
              </div>
              <div>
                <Label>Interest</Label>
                <Select value={form.interest} onValueChange={(v) => setForm({ ...form, interest: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INTERESTS.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lead-message">Additional Details</Label>
                <Textarea id="lead-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your environment, scope, or timeline..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting || !form.name || !form.email} className="bg-red-600 hover:bg-red-700">
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
