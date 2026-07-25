"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Bot,
  Search,
  MessageSquare,
  Brain,
  Palette,
  Phone,
  TrendingUp,
  Zap,
  Users,
  CheckCircle,
  Star,
  Clock,
  Sparkles,
  Mail,
  Shield,
  ShieldAlert,
  Crosshair,
  Bug,
  Terminal,
  Radar,
  Lock,
  Globe,
  UserCheck,
} from "lucide-react"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CyberBackground } from "@/components/cyber-background"
import { HeroVideoBackground } from "@/components/hero-video-background"
import { LeadForm } from "@/components/lead-form"

export default function HomePage() {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const services = [
    {
      icon: Phone,
      title: "AI Receptionist",
      description: "24/7 intelligent virtual receptionist that handles calls, schedules appointments, and manages customer inquiries.",
      color: "bg-blue-500",
      features: ["Call Handling", "Appointment Scheduling", "Customer Support", "Multi-language Support"],
    },
    {
      icon: Search,
      title: "AI SEO",
      description: "Advanced AI-powered SEO optimization that boosts your search rankings and drives organic traffic.",
      color: "bg-green-500",
      features: ["Keyword Research", "Content Optimization", "Technical SEO", "Performance Analytics"],
    },
    {
      icon: MessageSquare,
      title: "AI Chatbots",
      description: "Intelligent conversational AI that engages customers and provides instant support across all platforms.",
      color: "bg-purple-500",
      features: ["Live Chat Support", "Lead Generation", "E-commerce Integration", "Custom Workflows"],
    },
    {
      icon: Brain,
      title: "Custom AI Models",
      description: "Tailored machine learning models built specifically for your business needs and industry requirements.",
      color: "bg-orange-500",
      features: ["Predictive Analytics", "Computer Vision", "NLP", "Custom Training"],
    },
    {
      icon: Palette,
      title: "AI-Powered UI/UX",
      description: "Revolutionary design platforms that use AI to create stunning, user-friendly interfaces automatically.",
      color: "bg-pink-500",
      features: ["Automated Design", "User Behavior Analysis", "A/B Testing", "Responsive Layouts"],
    },
    {
      icon: Zap,
      title: "Process Automation",
      description: "End-to-end business process automation using AI to streamline operations and increase efficiency.",
      color: "bg-indigo-500",
      features: ["Workflow Automation", "Document Processing", "Data Integration", "Task Scheduling"],
    },
    {
      icon: Shield,
      title: "Vulnerability Advisory",
      description: "Red team-led assessments that uncover security gaps — we don't fix them ourselves, we connect you with the right defender.",
      color: "bg-red-500",
      features: ["Gap Identification", "Risk Prioritization", "Defender Referrals", "Issue-Specific Matching"],
    },
  ]

  const securityServices = [
    {
      icon: Crosshair,
      title: "Penetration Testing",
      description: "Simulated real-world attacks against your web apps, networks, and cloud to uncover exploitable weaknesses.",
      color: "bg-red-600",
      features: ["Web & API Pentesting", "Network Penetration", "Cloud Security Testing", "Remediation Reports"],
    },
    {
      icon: ShieldAlert,
      title: "Red Teaming",
      description: "Full-scope adversary simulation that tests your people, processes, and technology under pressure.",
      color: "bg-orange-600",
      features: ["Adversary Simulation", "Social Engineering", "Physical & Digital Recon", "Defender Handoff Reports"],
    },
    {
      icon: Radar,
      title: "AI Recon Agents",
      description: "Autonomous AI agents for fast reconnaissance, asset discovery, and continuous attack-surface mapping.",
      color: "bg-cyan-600",
      features: ["Automated Asset Discovery", "Attack Surface Mapping", "OSINT Gathering", "24/7 Continuous Recon"],
    },
    {
      icon: Bug,
      title: "AI Vulnerability Analysis",
      description: "AI-driven triage that scans, prioritizes, and explains vulnerabilities — so you know exactly what needs fixing and who should fix it.",
      color: "bg-purple-600",
      features: ["Automated Vuln Scanning", "Risk Prioritization", "Exploit Scoring", "Issue Documentation"],
    },
    {
      icon: UserCheck,
      title: "Defender Matching",
      description: "Based on the vulnerabilities and red team findings we uncover, we connect you with the right defender for each specific issue.",
      color: "bg-rose-600",
      features: ["Expert Referral Network", "Issue-Based Matching", "Specialist Routing", "Remediation Guidance"],
    },
  ]

  const benefits = [
    { icon: Clock, title: "24/7 Availability", description: "AI systems and security agents work around the clock without breaks." },
    { icon: TrendingUp, title: "Increased Efficiency", description: "Automate repetitive tasks and boost productivity across your business." },
    { icon: Users, title: "Expert Defender Matching", description: "Every vulnerability gets routed to the right specialist — not a one-size-fits-all fix." },
    { icon: Star, title: "Cost Reduction", description: "Reduce operational costs while improving service quality and security." },
  ]

  return (
    <div className="page-shell">
      <Header />

      {/* Hero — video background */}
      <section className="relative min-h-[88vh] flex items-center py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        <HeroVideoBackground />
        <div className="pointer-events-none absolute inset-0 z-[1] cyber-grid cyber-grid-fade opacity-30" aria-hidden />
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <div className="section-label-dark mb-6 mx-auto w-fit">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            AI Automation & Red Teaming
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 text-balance drop-shadow-lg">
            <span className="text-red-500">Red Team.</span> Find Vulnerabilities.{" "}
            <span className="gradient-text-brand">Connect the Right Defender.</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            We&apos;re not defenders — we&apos;re red teamers. We expose security gaps through AI-powered recon,
            pentesting, and vulnerability analysis, then connect you with the right defender based on each issue we find.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 h-12 px-8">
              <Link href="/contact">
                Start Automating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 h-12 px-8" onClick={() => setLeadFormOpen(true)}>
              <Crosshair className="mr-2 h-4 w-4" />
              Book Red Team Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Featured package */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-400 text-yellow-900 text-base px-4 py-1.5 font-semibold">
              Complete Client Solution
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">AI Automation + Red Team Bundle</h2>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              Grow with AI automation — and know exactly where you&apos;re exposed, with a path to the right defender for every issue
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              {[
                { icon: Bot, title: "AI Receptionist 24/7", desc: "Never miss a call — qualifies leads and books appointments automatically.", color: "bg-white/20" },
                { icon: Crosshair, title: "Red Team Assessment", desc: "We simulate attacks, map your attack surface, and document every vulnerability we find.", color: "bg-white/20" },
                { icon: UserCheck, title: "Defender Matching", desc: "We connect you with the right defender for each issue — based on what we uncover, not generic referrals.", color: "bg-white/20" },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Card className="border-0 shadow-2xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-3xl font-bold text-slate-900">Custom Pricing</CardTitle>
                <CardDescription className="text-base">Tailored to your business needs</CardDescription>
              </CardHeader>
              <CardHeader className="pt-0">
                <div className="space-y-3">
                  {[
                    "24/7 AI Receptionist & Chatbots",
                    "Process Automation Setup",
                    "Red Team Assessment & Pentest",
                    "Vulnerability Analysis Report",
                    "Defender Matching per Issue",
                    "Priority Client Support",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mt-8">
                  <Button asChild size="lg" className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white">
                    <Link href="/contact">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Your Custom Quote
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <a href="mailto:info@7trendzdata.com">
                      <Mail className="mr-2 h-5 w-5" />
                      info@7trendzdata.com
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label mb-4 mx-auto w-fit">AI Automation</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Intelligent Solutions for Clients</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              AI solutions designed to automate and optimize every aspect of your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 shadow-md`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{service.title}</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">{service.description}</CardDescription>
                  <ul className="space-y-1.5 pt-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
              <Link href="/services">
                Explore All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Security section — dark */}
      <section className="hero-dark relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CyberBackground variant="security" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label-security-dark mb-4 mx-auto w-fit">
              <Lock className="h-3.5 w-3.5" />
              Red Teaming & Vulnerability Analysis
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              We Find the Gaps. We Connect You to the Right Defender.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our red team and AI agents think like attackers — exposing vulnerabilities through recon, pentesting,
              and analysis. We don&apos;t remediate ourselves; we match each issue to the defender best suited to fix it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {securityServices.map((service) => (
              <div
                key={service.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/40 transition-colors hover:shadow-lg hover:shadow-red-500/10"
              >
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 shadow-md`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-1">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="h-3 w-3 text-red-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Terminal mockup */}
          <div className="max-w-2xl mx-auto mb-10 rounded-xl border border-red-500/20 overflow-hidden shadow-2xl shadow-red-900/30">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 font-mono text-xs text-slate-400">7trendz-redteam — live recon</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2 bg-slate-950/90">
              <p><span className="text-red-400">[AGENT]</span> <span className="text-slate-400">Starting attack surface scan...</span></p>
              <p><span className="text-cyan-400">[RECON]</span> <span className="text-green-400">47 assets discovered</span></p>
              <p><span className="text-cyan-400">[MATCH]</span> <span className="text-slate-400">Routing to specialist defender →</span> <span className="text-green-400">cloud-security-expert</span></p>
              <p className="text-slate-500 animate-pulse">█</p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 h-12 px-8">
              <Link href="/contact?interest=security">
                <Crosshair className="mr-2 h-5 w-5" />
                Book a Red Team Assessment
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Clients Choose 7Trendz Data</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              One partner for AI automation and red team vulnerability discovery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How We Help Clients</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our process: automate your business, red team your environment, and connect you with defenders for every issue
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Recon & Assess", description: "Red team recon and AI agents map your attack surface and automation opportunities." },
              { step: "02", title: "Find Vulnerabilities", description: "Pentesting and AI analysis expose gaps with prioritized, documented findings." },
              { step: "03", title: "Match Defenders", description: "Each issue is routed to the right defender based on type, severity, and expertise needed." },
              { step: "04", title: "Automate & Optimize", description: "Deploy AI automation while tracking remediation progress on every finding." },
            ].map((item) => (
              <div key={item.step} className="text-center bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Find Your Vulnerabilities?</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Join clients who trust 7Trendz Data for AI automation, red teaming, and defender matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100 shadow-lg h-12 px-8">
              <Link href="/contact">
                Get Your Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
              <a href="mailto:info@7trendzdata.com">
                <Mail className="mr-2 h-4 w-4" />
                info@7trendzdata.com
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LeadForm open={leadFormOpen} onOpenChange={setLeadFormOpen} />
    </div>
  )
}
