import type { Metadata } from "next"
import Link from "next/link"
import { Boxes, ShieldAlert, Gauge, Layers, Rocket, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { Web3Terminal } from "@/components/web3-terminal"
import { getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Web3 Dev — Decentralized Apps Built with AI",
  description:
    "Smart contract auditing, dApps, token engineering, and DAO governance tools — designed, built, and audited using AI by 7Trendz Data.",
  alternates: { canonical: "https://7trendzdata.com/products/web3/" },
  openGraph: {
    title: "AI Web3 Dev — Decentralized Apps Built with AI",
    description: "Smart contracts, dApps, tokenomics, and DAO tools built with AI. Start your project with 7Trendz Data.",
    url: "https://7trendzdata.com/products/web3/",
  },
}

const METRICS = [
  { icon: Gauge, value: "AI-first", label: "Tokenomics modelled before a line of code" },
  { icon: ShieldAlert, value: "Every launch", label: "AI-assisted audit for contracts, gas, and logic" },
  { icon: Layers, value: "Full-stack", label: "dApps with interfaces real users want to use" },
]

const PIPELINE = [
  { step: "01", title: "Model", text: "We model tokenomics and governance with AI before the first line of code." },
  { step: "02", title: "Build", text: "Contracts and interfaces built with AI tooling, reviewed by engineers." },
  { step: "03", title: "Audit & Launch", text: "AI scans for the bugs humans miss, then we ship something you can scale." },
]

export default function Web3ProductPage() {
  const product = getProduct("web3")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400/30 to-blue-500/30 blur-2xl rounded-full" aria-hidden />
              <div className="relative">
                <Web3Terminal />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="section-label-corporate mb-4 w-fit">AI Web3 Pipeline</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">From Tokenomics to Launch — Powered by AI</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Every Web3 product we ship goes through the same pipeline: model the economics, build with AI, audit
              before launch. The terminal shows exactly what an AI audit looks like before your project touches
              mainnet.
            </p>
            <div className="space-y-6">
              {PIPELINE.map((p) => (
                <div key={p.step} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
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
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-indigo-700" />
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
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-indigo-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Problem</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.problem}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Rocket className="h-4 w-4 text-blue-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Solution</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.solution}</p>
          </div>
        </div>
      </section>

      <HowItWorks steps={product.steps} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to build on Web3 with AI?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            From a token idea to a safe mainnet launch — we model, build, and audit it with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg h-12 px-8 font-semibold">
              <Link href={product.ctaHref}>
                Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
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