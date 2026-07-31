import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Users, Award, ArrowRight, Target, Eye, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CyberBackground } from "@/components/cyber-background"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about 7Trendz Data — South Africa's leading cybersecurity red teaming company. Founded 2024, we find security vulnerabilities and connect clients with the right defenders.",
  openGraph: {
    title: "About 7Trendz Data — Cybersecurity & Red Teaming",
    description:
      "South Africa's leading cybersecurity red teaming company. We find security vulnerabilities and connect clients with the right defenders.",
    url: "https://7trendzdata.com/about",
  },
  alternates: {
    canonical: "https://7trendzdata.com/about",
  },
}

export default function AboutPage() {
  const values = [
    { icon: ShieldCheck, title: "Cybersecurity Only", description: "We focus exclusively on red teaming, pentesting, and vulnerability analysis — no unrelated services." },
    { icon: Users, title: "Client Success", description: "Your security is our priority. Every report is documented, prioritized, and matched to the right defender." },
    { icon: ShieldAlert, title: "Red Team First", description: "We think like attackers. We find vulnerabilities through red teaming — then connect you with the right defender for each issue." },
    { icon: Award, title: "Quality Excellence", description: "Every red team engagement and Pentesting Report meets the highest standards of accuracy and reliability." },
  ]

  const stats = [
    { number: "500+", label: "Clients Served" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "24/7", label: "AI Recon & Security Ops" },
    { number: "4", label: "Report Severity Tiers" },
  ]

  return (
    <div className="page-shell">
      <Header />

      <section className="hero-dark relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CyberBackground variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="section-label-dark mb-4 mx-auto w-fit">About 7Trendz Data</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Leading Cybersecurity <span className="gradient-text-brand">Red Teaming</span> in South Africa
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            We expose security gaps through red teaming, pentesting, and vulnerability analysis — then connect each
            issue to the defender best suited to fix it. Every engagement is delivered as a Pentesting Report, with
            pricing quoted after exploitation and findings.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-600 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-slate-900">
                <Target className="h-6 w-6 text-cyan-600" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-lg leading-relaxed">
                To make red teaming and vulnerability discovery accessible to every business — finding security gaps,
                documenting them in a Pentesting Report, and connecting clients with the right defender
                for each issue we uncover.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-slate-900">
                <Eye className="h-6 w-6 text-blue-600" /> Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-lg leading-relaxed">
                To be the go-to red team partner — where every vulnerability is found, documented, and routed to
                the right defender through a Pentesting Report.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
            <p>Founded in 2024, 7Trendz Data emerged from a clear insight: clients need someone to find their vulnerabilities through red teaming — not another defender selling generic fixes.</p>
            <p>We built a company that red teams your environment, analyzes every gap with AI, and connects you with the right specialist defender based on each specific issue.</p>
            <p>Today we serve clients with pentesting, red teaming, vulnerability analysis, and expert defender matching — every engagement delivered as a Pentesting Report, with pricing quoted after findings.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600">The principles that guide every client engagement</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to work with us?</h2>
          <p className="text-xl text-cyan-100 mb-8">Join hundreds of clients who trust 7Trendz Data.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100">
              <Link href="/contact">Start Your Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact?interest=security"><ShieldCheck className="mr-2 h-4 w-4" />Book Red Team Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
