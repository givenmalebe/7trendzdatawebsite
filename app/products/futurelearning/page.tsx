import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { CorporateBackground } from "@/components/corporate-background"
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

export default function FutureLearningProductPage() {
  const product = getProduct("futurelearning")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />
      <FeaturesGrid features={product.features} accentColor={product.color} />
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Experience FutureLearning live</h2>
          <p className="text-blue-100 mb-6">Explore the AI learning platform at 7trendzlearn.co.za.</p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100">
            <a href="https://7trendzlearn.co.za" target="_blank" rel="noopener noreferrer">Visit 7trendzlearn.co.za</a>
          </Button>
        </div>
      </section>
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">The Problem</h2>
            <p className="text-slate-600 leading-relaxed">{product.problem}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">The Solution</h2>
            <p className="text-slate-600 leading-relaxed">{product.solution}</p>
          </div>
        </div>
      </section>
      <HowItWorks steps={product.steps} />
      <section className="corporate-hero relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CorporateBackground />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to build with AI?</h2>
          <p className="text-xl text-slate-300 mb-8">Every 7Trendz product is powered by AI — let&apos;s talk about yours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className={`bg-gradient-to-r ${product.gradient} text-white shadow-lg`}>
              <Link href={product.ctaHref}>{product.ctaLabel}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm">
              <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}