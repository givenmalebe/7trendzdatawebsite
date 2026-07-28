import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Search,
  MessageSquare,
  Brain,
  Palette,
  Zap,
  CheckCircle,
  Star,
  Globe,
  MapPin,
  Bot,
  Mail,
  Shield,
  ShieldAlert,
  Crosshair,
  Bug,
  Radar,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CyberBackground } from "@/components/cyber-background"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cybersecurity red teaming, AI automation, penetration testing, vulnerability analysis, and defender matching services. Expert security consulting for South African businesses.",
  openGraph: {
    title: "Our Services — 7Trendz Data",
    description:
      "Cybersecurity red teaming, AI automation, penetration testing, vulnerability analysis, and defender matching services.",
    url: "https://7trendzdata.com/services",
  },
  alternates: {
    canonical: "https://7trendzdata.com/services",
  },
}

export default function ServicesPage() {
  const services = [
    {
      icon: Phone,
      title: "AI Receptionist",
      description: "24/7 intelligent virtual receptionist that never misses a call",
      color: "bg-blue-500",
      features: [
        "24/7 Call Handling",
        "Appointment Scheduling",
        "Customer Information Collection",
        "Multi-language Support",
        "CRM Integration",
        "Call Analytics & Reporting",
        "Custom Greeting Messages",
        "Voicemail Transcription",
      ],
      benefits: [
        "Never miss important calls",
        "Reduce staffing costs",
        "Improve customer satisfaction",
        "Professional image 24/7",
      ],
    },
    {
      icon: Search,
      title: "AI SEO Optimization",
      description: "Advanced AI-powered SEO that boosts your search rankings automatically",
      color: "bg-green-500",
      features: [
        "Automated Keyword Research",
        "Content Optimization",
        "Technical SEO Audits",
        "Competitor Analysis",
        "Local SEO Enhancement",
        "Performance Tracking",
        "Content Generation",
        "Link Building Strategies",
      ],
      benefits: [
        "Higher search rankings",
        "Increased organic traffic",
        "Better ROI on content",
        "Automated optimization",
      ],
    },
    {
      icon: MessageSquare,
      title: "AI Chatbots",
      description: "Intelligent conversational AI for customer support and lead generation",
      color: "bg-purple-500",
      features: [
        "Natural Language Processing",
        "Multi-platform Integration",
        "Lead Qualification",
        "Customer Support Automation",
        "E-commerce Integration",
        "Appointment Booking",
        "FAQ Automation",
        "Sentiment Analysis",
      ],
      benefits: [
        "Instant customer responses",
        "24/7 availability",
        "Increased lead conversion",
        "Reduced support costs",
      ],
    },
    {
      icon: Brain,
      title: "Custom AI Models",
      description: "Tailored machine learning models built for your specific business needs",
      color: "bg-orange-500",
      features: [
        "Predictive Analytics",
        "Computer Vision Solutions",
        "Natural Language Processing",
        "Recommendation Systems",
        "Fraud Detection",
        "Demand Forecasting",
        "Custom Training Data",
        "Model Deployment & Monitoring",
      ],
      benefits: [
        "Solve unique business problems",
        "Competitive advantage",
        "Data-driven decisions",
        "Scalable solutions",
      ],
    },
    {
      icon: Palette,
      title: "AI-Powered UI/UX Design",
      description: "Revolutionary design platforms that create stunning interfaces automatically",
      color: "bg-pink-500",
      features: [
        "Automated Design Generation",
        "User Behavior Analysis",
        "A/B Testing Automation",
        "Responsive Design Creation",
        "Brand Consistency Checks",
        "Accessibility Optimization",
        "Performance Optimization",
        "Design System Management",
      ],
      benefits: [
        "Faster design process",
        "Data-driven design decisions",
        "Improved user experience",
        "Consistent branding",
      ],
    },
    {
      icon: Zap,
      title: "Business Process Automation",
      description: "End-to-end automation of your business workflows and operations",
      color: "bg-indigo-500",
      features: [
        "Workflow Automation",
        "Document Processing",
        "Data Entry Automation",
        "Email Marketing Automation",
        "Inventory Management",
        "Financial Process Automation",
        "Customer Onboarding",
        "Reporting Automation",
      ],
      benefits: ["Increased efficiency", "Reduced human error", "Cost savings", "Scalable operations"],
    },
    {
      icon: Shield,
      title: "Vulnerability Advisory for SMEs",
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
      description: "Simulated real-world attacks that uncover exploitable weaknesses before attackers find them",
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
            AI Automation & <span className="gradient-text-security">Red Teaming</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Automate with intelligent AI. Expose gaps through red teaming and vulnerability analysis. We connect
            you with the right defender for every issue we find.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
              <Link href="/contact"><Mail className="mr-2 h-5 w-5" />Get Custom Quote</Link>
            </Button>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/contact?interest=security">Book Red Team Assessment</Link>
            </Button>
          </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Additional Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enhance your AI automation and security posture
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI Training & Consultation", description: "Expert guidance on AI implementation and team training" },
              { title: "Custom Integration", description: "Seamless integration with your existing systems and workflows" },
              { title: "24/7 Support & Monitoring", description: "Round-the-clock monitoring for AI systems and security agents" },
            ].map((addon, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white">
                <CardHeader>
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
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Contact us for AI automation, red teaming, or defender matching tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100">
              <Link href="/contact"><Mail className="mr-2 h-5 w-5" />Get Custom Quote</Link>
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
