import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={product.url}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}>
        <product.icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">{product.tagline}</p>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{product.short}</p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
        Learn More <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  )
}