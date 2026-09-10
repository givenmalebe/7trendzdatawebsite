import type { Metadata } from "next"
import Link from "next/link"
import { Brain, Sparkles, Award, GraduationCap, ArrowRight, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { LearnDashboard } from "@/components/learn-dashboard"
import { getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "FutureLearning — AI-Powered Learning Platform",
  description:
    "FutureLearning is an AI learning management system by 7Trendz at 7trendzlearn.co.za — adaptive learning paths, AI tutoring, progress analytics, and certifications.",
  alternates: { canonical: "https://7trendzdata.com/products/futurelearning/" },
  openGraph: {
    title: "FutureLearning — AI-Powered Learning Platform",
    description: "Adaptive learning paths, AI tutoring, and progress analytics. Visit us at 7trendzlearn.co.za.",
    url: "https://7trendzdata.com/products/futurelearning/",
  },
}

const METRICS = [
  { icon: Brain, value: "Adapts to you", label: "Courses restructure around each learner's pace and gaps" },
  { icon: Sparkles, value: "Tutors 24/7", label: "Always-available AI explanations, answers, and quizzes" },
  { icon: Award, value: "Verifiable", label: "Certificates issued the moment learners finish" },
]

const FLOW = [
  { step: "01", title: "Enrol", text: "Learners join a course and complete a short AI assessment of their current level." },
  { step: "02", title: "Learn", text: "The AI adapts content, pacing, and practice to each learner in real time." },
  { step: "03", title: "Certify", text: "Progress is tracked continuously and certificates are issued at the finish line." },
]

export default function FutureLearningProductPage() {
  const product = getProduct("futurelearning")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label-corporate mb-4 w-fit">Learning Dashboard</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">A Course That Learns With You</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              See how FutureLearning looks from a learner&apos;s seat: a path that adapts to pace and gaps, an AI tutor
              that steps in exactly when needed, and a clear path to a verifiable certificate.
            </p>
            <div className="space-y-6">
              {FLOW.map((p) => (
                <div key={p.step} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
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
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 blur-2xl rounded-full" aria-hidden />
            <div className="relative">
              <LearnDashboard />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-emerald-600" />
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
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Problem</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.problem}</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The Solution</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.solution}</p>
          </div>
        </div>
      </section>

      <HowItWorks steps={product.steps} />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Try FutureLearning live</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Explore the AI learning platform in your browser — adaptive paths, AI tutoring, real analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg h-12 px-8 font-semibold">
              <a href={product.externalUrl!} target="_blank" rel="noopener noreferrer">
                Visit 7trendzlearn.co.za <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-8">
              <Link href={product.ctaHref}>
                Discuss your needs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}