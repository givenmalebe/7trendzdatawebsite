"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-32 pb-20 container mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-slate-900 hover:bg-slate-800 rounded-xl">Go Home</Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="rounded-xl">Read Our Blog</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
