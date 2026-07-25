"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, Shield, Bot, UserCheck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CyberBackground } from "@/components/cyber-background"
import { submitContactMessage } from "@/lib/contact-service"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      await submitContactMessage(formData)

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you within 24 hours.",
      })
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try emailing us directly at info@7trendzdata.com",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="page-shell">
      <Header />

      <section className="hero-dark relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CyberBackground variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="section-label-dark mb-4 mx-auto w-fit">Contact</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Have questions about AI automation, red teaming, or vulnerability analysis? We find the gaps and connect you with the right defender.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll respond within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+27 736 289 188"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us about your project or question..."
                      />
                    </div>

                    {submitStatus.type && (
                      <Alert variant={submitStatus.type === "success" ? "default" : "destructive"}>
                        {submitStatus.type === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>{submitStatus.message}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Reach out to us directly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <a href="mailto:info@7trendzdata.com" className="text-cyan-600 hover:underline">
                        info@7trendzdata.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      <a href="tel:+27736289188" className="text-cyan-600 hover:underline">
                        +27 736 289 188
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Location</p>
                      <p className="text-slate-600">113 2nd Avenue Wynberg, Johannesburg, South Africa</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Business Hours</p>
                      <p className="text-slate-600">Mon-Fri: 9:00 AM - 6:00 PM SAST</p>
                      <p className="text-slate-600">Sat-Sun: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardHeader>
                  <CardTitle>Why Choose 7Trendz Data?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Bot, text: "Expert AI automation for client growth" },
                    { icon: Shield, text: "Red teaming & vulnerability discovery" },
                    { icon: UserCheck, text: "Defender matching for every issue we find" },
                    { icon: CheckCircle, text: "24/7 AI and security monitoring" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      <item.icon className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-700">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="border shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">How quickly will I receive a response?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please
                  call us directly.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Do you offer custom pricing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! We provide custom quotes tailored to your specific business needs and goals. Contact us to
                  discuss your requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">What industries do you serve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We work with businesses across all industries including healthcare, finance, retail, real estate, and
                  more. Our AI solutions are customizable to any sector.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
