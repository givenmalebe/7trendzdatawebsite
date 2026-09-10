"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Cpu, MapPin, Rocket } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CorporateBackground } from "@/components/corporate-background"
import { LeadForm } from "@/components/lead-form"
import { ProductCard } from "@/components/product-card"
import { PRODUCTS } from "@/lib/products"

const testimonials = [
  {
    quote:
      "The team built an internal AI assistant that actually works — it answered our most common support questions within two weeks of kickoff.",
    author: "Ops Director, Johannesburg",
    role: "AI Development Client",
  },
  {
    quote:
      "Their red team assessment found a critical exposure our previous auditor missed. The report was clear and the fix was easy to action.",
    author: "CTO, Cape Town",
    role: "AI Security Client",
  },
  {
    quote:
      "Ask Sarah paid for itself in the first quarter. Our people team finally has time for people, not paperwork.",
    author: "HR Manager, Pretoria",
    role: "Ask Sarah Client",
  },
]

export default function HomePage() {
  const [leadFormOpen, setLeadFormOpen] = useState(false)

  return (
    <div className="page-shell">
      <Header />

      <section className="corporate-hero relative min-h-[88vh] flex items-center py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CorporateBackground />
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <div className="section-label-corporate-dark mb-6 mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Building the Future with AI
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 text-balance drop-shadow-lg">
            AI that Works Across <span className="text-cyan-400">Security</span>, <span className="text-blue-400">Learning</span>, and <span className="text-amber-400">Innovation</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            From intelligent security to smart learning platforms — 7Trendz Data builds AI solutions that transform how
            you work, learn, and protect. Red teaming with AI, the FutureLearning platform, the Ask Sarah AI HR
            assistant, Web3 builds, and custom AI applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 h-12 px-8">
              <a href="#products">Explore Our Products <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <Button size="lg" onClick={() => setLeadFormOpen(true)} className="border-blue-300/40 text-blue-100 hover:bg-white/10 h-12 px-8 bg-white/5">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label-corporate mb-4 mx-auto w-fit">Our Products</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Five Ways We Build with AI</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Each product is its own sub-brand — designed, built, and run on AI.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
            {PRODUCTS.slice(3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label-corporate mb-4 w-fit">About 7Trendz Data</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">A South African AI Company</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                7Trendz Data is a South African AI company building intelligent solutions across security, education,
                HR, Web3, and development. We develop apps using AI — and we use AI to secure them, teach with it,
                support people with it, and build the decentralized future with it.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Today that means the FutureLearning LMS, the Ask Sarah AI HR assistant, AI-powered red teaming,
                Web3 development, and custom AI applications — every one of them built with AI first.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Rocket, title: "5 Products", description: "Five AI product lines under one roof" },
                  { icon: Cpu, title: "AI-First", description: "AI woven through every layer we build" },
                  { icon: MapPin, title: "South African", description: "Proudly building from Johannesburg" },
                ].map((s) => (
                  <div key={s.title} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <s.icon className="h-6 w-6 text-blue-600 mb-3" />
                    <p className="font-semibold text-slate-900">{s.title}</p>
                    <p className="text-sm text-slate-500">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">What we build</h3>
              <ul className="space-y-3">
                {PRODUCTS.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <p.icon className="h-5 w-5 text-white/90" />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-blue-100">{p.tagline}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label-corporate mb-4 mx-auto w-fit">What Clients Say</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Trusted by Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <p className="text-slate-600 leading-relaxed mb-6">“{t.quote}”</p>
                <div>
                  <p className="font-semibold text-slate-900">{t.author}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-700 to-cyan-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to build with AI?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore our products or contact the team — we&apos;ll help you find the right AI solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100 shadow-lg h-12 px-8">
              <Link href="/contact">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
              <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LeadForm open={leadFormOpen} onOpenChange={setLeadFormOpen} />
    </div>
  )
}