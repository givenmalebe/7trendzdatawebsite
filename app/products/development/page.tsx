import type { Metadata } from "next"
import Link from "next/link"
import { Cpu, Brain, Workflow, Rocket, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { DevConsole } from "@/components/dev-console"
import { getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Development — Custom AI-Powered Apps",
  description:
    "We develop apps using AI — integration consulting, custom model training, API development, and full-stack AI applications by 7Trendz Data.",
  alternates: { canonical: "https://7trendzdata.com/products/development/" },
  openGraph: {
    title: "AI Development — Custom AI-Powered Apps",
    description: "From AI consulting to custom models and full-stack products — we develop apps using AI.",
    url: "https://7trendzdata.com/products/development/",
  },
}

const METRICS = [
  { icon: Cpu, value: "Every layer", label: "AI woven from consulting through to full-stack product" },
  { icon: Brain, value: "Your data", label: "Models fine-tuned to your domain, not generic off-the-shelf" },
  { icon: Rocket, value: "Ships fast", label: "AI-assisted builds shipped quickly, then evolved as data grows" },
]

const FLOW = [
  { step: "01", title: "Workshop", text: "We map your workflows and find where AI genuinely moves the needle." },
  { step: "02", title: "Build", text: "The app ships with AI-assisted engineering, your team looped in throughout." },
  { step: "03", title: "Ship & Evolve", text: "We launch, measure, and keep improving the models as your data grows." },
]

export default function DevelopmentProductPage() {
  const product = getProduct("development")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-sky-400/30 to-blue-500/30 blur-2xl rounded-full" aria-hidden />
              <div className="relative">
                <DevConsole />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="section-label-corporate mb-4 w-fit">AI Build Pipeline</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">From Idea to Shipped AI App</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We don&apos;t bolt AI on at the end — it runs through every layer of the build. The console shows how an
              idea becomes a working product with models already learning from real usage.
            </p>
            <div className="space-y-6">
              {FLOW.map((p) => (
                <div key={p.step} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
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
              <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-sky-600" />
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
          <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl border border-sky-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <Workflow className="h-4 w-4 text-sky-600" />
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

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Build your AI product with us</h2>
          <p className="text-xl text-sky-100 mb-8">
            From a single integration to a full AI-powered application — we develop with AI at every layer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-sky-700 hover:bg-sky-50 shadow-lg h-12 px-8 font-semibold">
              <Link href={product.ctaHref}>
                Discuss Your Project <ArrowRight className="ml-2 h-5 w-5" />
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