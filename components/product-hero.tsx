import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"
import type { Product } from "@/lib/products"

export function ProductHero({ product }: { product: Product }) {
  return (
    <section className="corporate-hero relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg`}>
            <product.icon className="h-7 w-7 text-white" />
          </div>
          <h2 className="section-label-corporate-dark">{product.tagline}</h2>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">{product.heroTitle}</h1>
        <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">{product.heroSubtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className={`bg-gradient-to-r ${product.gradient} text-white shadow-lg h-12 px-8`}>
            <Link href={product.ctaHref}>{product.ctaLabel}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-8">
            <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
          </Button>
        </div>
      </div>
    </section>
  )
}