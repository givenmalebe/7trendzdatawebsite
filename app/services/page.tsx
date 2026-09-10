import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { PRODUCTS } from "@/lib/products"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Products",
  description: "Explore the five AI product lines from 7Trendz Data — FutureLearning, Ask Sarah, AI Security, AI Web3 Dev, and AI Development.",
}

export default function ServicesPage() {
  return (
    <div className="page-shell">
      <Header />
      <section className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 text-center">
        <div className="section-label-corporate mb-4 mx-auto w-fit">Products</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Explore Our AI Products</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          From security to learning, HR to Web3 and development — every product is built with AI.
        </p>
      </section>
      <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
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
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/">Back to Home <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}