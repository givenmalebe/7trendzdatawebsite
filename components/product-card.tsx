import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={product.url}
      className="group relative bg-white rounded-2xl border-2 border-slate-200 shadow-xl hover:border-blue-300 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${product.gradient}`} aria-hidden />
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg ring-4 ring-slate-100 group-hover:scale-110 transition-transform`}>
            <product.icon className="h-7 w-7 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            Product
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 mb-3">{product.tagline}</p>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{product.short}</p>
        <Button
          asChild
          size="lg"
          className={`w-full bg-gradient-to-r ${product.gradient} hover:opacity-90 text-white shadow-md shadow-slate-300 transition-all duration-300 [&>span]:gap-2`}
        >
          <span className="inline-flex items-center justify-center">
            Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </Link>
  )
}