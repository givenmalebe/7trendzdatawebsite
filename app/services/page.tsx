import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ShieldAlert,
  Crosshair,
  Bug,
  Radar,
  UserCheck,
  CheckCircle,
  Star,
  Mail,
  FileText,
  Repeat,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CyberBackground } from "@/components/cyber-background"
import { PENTEST_REPORT_TIERS } from "@/lib/catalog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cybersecurity red teaming, penetration testing, and vulnerability analysis. All engagements are delivered as a Pentesting Report priced by the severity of the vulnerabilities found.",
  openGraph: {
    title: "Our Services — 7Trendz Data",
    description:
      "Cybersecurity red teaming, penetration testing, and vulnerability analysis. Pentesting reports priced by severity.",
    url: "https://7trendzdata.com/services",
  },
  alternates: {
    canonical: "https://7trendzdata.com/services",
  },
}

export default function ServicesPage() {
  const services = [
    {
      icon: Shield,
      title: "Vulnerability Advisory",
      description: "Red team-led assessments that uncover security gaps — we connect you with the right defender for each issue, we don't remediate ourselves",
      color: "bg-red-500",
      features: [
        "Red Team Gap Assessment",
        "Vulnerability Documentation",
        "Issue-Based Defender Routing",
        "Risk Prioritization Reports",
        "Compliance Gap Analysis",
        "Attack Surface Review",
        "Specialist Referral Network",
        "Remediation Tracking Support",
      ],
      benefits: [
        "Know exactly where you're exposed",
        "Get matched to the right expert per issue",
        "Avoid generic one-size-fits-all fixes",
        "Clear path from finding to fix",
      ],
    },
    {
      icon: Crosshair,
      title: "Penetration Testing",
      description: "Simulated real-world attacks that uncover exploitable weaknesses before attackers find them — delivered as a severity-priced Pentesting Report",
      color: "bg-red-600",
      features: [
        "Web Application Pentesting",
        "API Security Testing",
        "Network Penetration Testing",
        "Cloud Configuration Review",
        "Wireless Security Testing",
        "Manual Exploitation & Chaining",
        "OWASP Top 10 Coverage",
        "Detailed Remediation Reports",
      ],
      benefits: [
        "Find vulnerabilities before hackers do",
        "Prioritized, actionable findings",
        "Meet compliance & audit needs",
        "Clear documentation for defender handoff",
      ],
    },
    {
      icon: ShieldAlert,
      title: "Red Teaming",
      description: "Full-scope adversary simulation that tests your people, processes, and technology end to end",
      color: "bg-orange-600",
      features: [
        "Advanced Adversary Simulation",
        "Social Engineering Campaigns",
        "Phishing & Pretexting",
        "Physical & Digital Recon",
        "Lateral Movement Testing",
        "Detection & Response Evaluation",
        "Purple Team Collaboration",
        "Executive Debrief & Reporting",
      ],
      benefits: [
        "Uncover real-world attack paths",
        "Measure detection and response gaps",
        "Expose weaknesses across the org",
        "Findings routed to matched defenders",
      ],
    },
    {
      icon: Radar,
      title: "AI Recon Agents",
      description: "Autonomous AI agents that perform fast reconnaissance and continuous attack-surface mapping",
      color: "bg-cyan-600",
      features: [
        "Automated Asset Discovery",
        "Attack Surface Mapping",
        "OSINT & Threat Intelligence",
        "Subdomain & Port Enumeration",
        "Exposed Credential Detection",
        "Continuous 24/7 Monitoring",
        "Shadow IT Discovery",
        "Real-time Alerting",
      ],
      benefits: [
        "Recon at machine speed",
        "Know your full attack surface",
        "Catch new exposures instantly",
        "Reduce manual analyst effort",
      ],
    },
    {
      icon: Bug,
      title: "AI Vulnerability Analysis",
      description: "AI-driven vulnerability triage that scans, prioritizes, and explains the risks that matter most",
      color: "bg-purple-600",
      features: [
        "Automated Vulnerability Scanning",
        "Risk-Based Prioritization",
        "Exploit Likelihood Scoring",
        "False-Positive Reduction",
        "CVE & Threat Correlation",
        "Actionable Fix Guidance",
        "Trend & Posture Reporting",
        "Integration with Dev Workflows",
      ],
      benefits: [
        "Fix what actually matters first",
        "Cut through scanner noise",
        "Documented issues ready for defender matching",
        "Clear severity and exploit context",
      ],
    },
    {
      icon: UserCheck,
      title: "Defender Matching",
      description: "We connect you with the right defender for each vulnerability and red team finding — matched by issue type, severity, and required expertise",
      color: "bg-rose-600",
      features: [
        "Expert Referral Network",
        "Issue-Type Specialist Routing",
        "Cloud, App, Network & Physical Matching",
        "Severity-Based Prioritization",
        "Vendor-Neutral Recommendations",
        "Remediation Scope Guidance",
        "Multi-Issue Coordination",
        "Follow-Up Verification Support",
      ],
      benefits: [
        "Right expert for every specific issue",
        "No generic security vendor upsells",
        "Faster path from finding to fix",
        "Trusted specialist network",
      ],
    },
  ]

  return (
    <div className="page-shell">
      <Header />

      <section className="hero-dark relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CyberBackground variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="section-label-dark mb-4 mx-auto w-fit">Services</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Cybersecurity & <span className="gradient-text-security">Red Teaming</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Every engagement is delivered as a Pentesting Report, priced by the highest severity of vulnerability we
            find. We expose the gaps — then connect you with the right defender for each issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
              <Link href="/contact#pricing"><FileText className="mr-2 h-5 w-5" />See Pentesting Report Pricing</Link>
            </Button>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/contact?interest=security">Book Red Team Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pentesting Report Pricing */}
      <section id="pricing" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label mb-4 mx-auto w-fit">Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Pentesting Report Pricing</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We only offer cybersecurity. Every engagement is delivered as a Pentesting Report, priced by the highest
              severity of vulnerability found.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PENTEST_REPORT_TIERS.map((tier) => (
              <Card key={tier.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-3 w-3 rounded-full ${tier.dot}`} />
                    <Badge variant="outline" className={`border ${tier.badge}`}>{tier.severity}</Badge>
                  </div>
                  <CardTitle className="text-xl">{tier.label}</CardTitle>
                  <CardDescription className="text-slate-600">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-4xl font-bold text-slate-900">
                    R{tier.defaultPrice.toLocaleString()}
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                    <Link href="/contact?interest=security">
                      <Mail className="mr-2 h-4 w-4" />
                      Get This Report
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            Price reflects the highest severity vulnerability documented in your Pentesting Report. No hidden fees.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center shadow-md`}>
                        <service.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                        <CardDescription className="text-slate-600 mt-1 text-lg">{service.description}</CardDescription>
                        <div className="mt-3">
                          <Button asChild variant="outline" size="sm" className="border-border">
                            <Link href="/contact">
                              <Mail className="mr-2 h-4 w-4" />
                              Request Quote
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Features Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Key Benefits:</h4>
                      <ul className="space-y-2 mb-6">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-slate-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                        <Link href="/contact">
                          <Mail className="mr-2 h-4 w-4" />
                          Get {service.title} Quote
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Additional Cybersecurity Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enhance your security posture around every Pentesting Report
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ClipboardCheck, title: "Compliance & Audit Support", description: "PCI-DSS, POPIA, and ISO 27001 readiness guidance based on your findings" },
              { icon: Repeat, title: "Retesting & Verification", description: "We verify that each fixed finding is genuinely resolved before sign-off" },
              { icon: UserCheck, title: "Defender Matching", description: "We connect you with the right specialist to fix every issue we find" },
            ].map((addon, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                    <addon.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">{addon.title}</CardTitle>
                  <CardDescription>{addon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Request Quote
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to find your gaps?</h2>
          <p className="text-xl text-red-100 mb-8">
            Book a red team assessment today. Your Pentesting Report is priced by severity — from R2,500 for low
            findings to R15,000 for critical ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-700 hover:bg-slate-100">
              <Link href="/contact"><Mail className="mr-2 h-5 w-5" />Book a Pentesting Report</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="mailto:info@7trendzdata.com"><Mail className="mr-2 h-5 w-5" />info@7trendzdata.com</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
