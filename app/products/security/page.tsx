import type { Metadata } from "next"
import Link from "next/link"
import { Radar, ShieldCheck, CornerDownRight, ShieldAlert, FileSearch, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { SecurityRecon } from "@/components/security-recon"
import { getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Security — Red Teaming with AI",
  description:
    "AI-powered red teaming and pentesting by 7Trendz Data — automated vulnerability scanning, AI-driven exploit analysis, continuous monitoring, and detailed reporting.",
  alternates: { canonical: "https://7trendzdata.com/products/security/" },
  openGraph: {
    title: "AI Security — Red Teaming with AI",
    description: "Autonomous AI recon agents find the gaps. Red teaming, pentesting, and vulnerability analysis.",
    url: "https://7trendzdata.com/products/security/",
  },
}

const METRICS = [
  { icon: Radar, value: "24/7 recon", label: "Autonomous agents watch your attack surface around the clock" },
  { icon: ShieldCheck, value: "Less noise", label: "AI triage removes false positives before they reach you" },
  { icon: CornerDownRight, value: "Every finding routed", label: "Reports land with the right defender by issue type" },
]

const PHASE = [
  { step: "01", title: "Assess", text: "AI recon agents map your attack surface and scans find live vulnerabilities." },
  { step: "02", title: "Analyse", text: "AI scores findings by severity and exploit likelihood, cutting the noise." },
  { step: "03", title: "Report & Match", text: "A clear report, and every finding routed to a matched defender." },
]

export default function SecurityProductPage() {
  const product = getProduct("security")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-orange-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label-corporate mb-4 w-fit">Red Team in Action</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">Watch an AI Recon Run</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Autonomous agents map your attack surface, find live exposures, and triage them by severity — then route
              each finding to the defender who can fix it. This is what an AI recon run looks like.
            </p>
            <div className="space-y-6">
              {PHASE.map((p) => (
                <div key={p.step} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                    {p.step}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-red-400/30 to-orange-500/30 blur-2xl rounded-full" aria-hidden />
            <div className="relative">
              <SecurityRecon />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{m.value}</p>
                <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeaturesGrid features={product.features} accentColor={product.color} />

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Problem</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.problem}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <FileSearch className="h-4 w-4 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Solution</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.solution}</p>
          </div>
        </div>
      </section>

      <HowItWorks steps={product.steps} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Find your gaps before attackers do</h2>
          <p className="text-xl text-red-100 mb-8">
            AI red teaming at machine speed — recon, analysis, and a clear path to fixing what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-50 shadow-lg h-12 px-8 font-semibold">
              <Link href={product.ctaHref}>
                Request Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-8">
              <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}