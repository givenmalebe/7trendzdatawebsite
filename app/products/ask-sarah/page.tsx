import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, HeartHandshake, MessagesSquare, CalendarCheck, ShieldCheck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { AskSarahDemo } from "@/components/ask-sarah-demo"
import { getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Ask Sarah — Your AI HR Assistant",
  description:
    "Ask Sarah is the AI HR assistant from 7Trendz Data — automated onboarding, policy Q&A, leave management, and employee sentiment analysis.",
  alternates: { canonical: "https://7trendzdata.com/products/ask-sarah/" },
  openGraph: {
    title: "Ask Sarah — Your AI HR Assistant",
    description: "Meet Sarah. Ask her anything HR — onboarding, policies, leave, and sentiment insights.",
    url: "https://7trendzdata.com/products/ask-sarah/",
  },
}

const DEMO_POINTS = [
  { icon: MessagesSquare, title: "Plain-language answers", text: "No policy hunting. Sarah answers instantly, 24/7." },
  { icon: CalendarCheck, title: "Leave handled in chat", text: "Requests, balances, and approvals without forms." },
  { icon: ShieldCheck, title: "Compliant and safe", text: "Access-controlled with a human hand-off for sensitive cases." },
]

export default function AskSarahProductPage() {
  const product = getProduct("ask-sarah")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label-corporate mb-4 w-fit">Live Demo</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">Ask Sarah — See Her in Action</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Sarah is built for the moment an employee needs an answer. Try the sample questions — this is exactly how
              she responds to your people.
            </p>
            <div className="space-y-5">
              {DEMO_POINTS.map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shrink-0">
                    <p.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-400/30 to-purple-500/30 blur-2xl rounded-full" aria-hidden />
            <div className="relative">
              <AskSarahDemo />
            </div>
          </div>
        </div>
      </section>

      <FeaturesGrid features={product.features} accentColor={product.color} />

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-violet-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Problem</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.problem}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <HeartHandshake className="h-4 w-4 text-purple-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Solution</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.solution}</p>
          </div>
        </div>
      </section>

      <HowItWorks steps={product.steps} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Put Sarah to work with your team</h2>
          <p className="text-xl text-violet-100 mb-8">
            Automate onboarding, policy Q&amp;A, and leave — so your people team focuses on people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-violet-700 hover:bg-violet-50 shadow-lg h-12 px-8 font-semibold">
              <Link href={product.ctaHref}>Try Ask Sarah</Link>
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