"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, Sparkles } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/7trendz-logo-final.png"
              alt="7Trendz Data Logo"
              className="h-10 w-10 object-contain rounded-xl shadow-lg"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-slate-900">7Trendz Data</span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
                Cybersecurity & Red Teaming
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              <Link href="/contact?interest=security">
                <Shield className="mr-2 h-4 w-4" />
                Red Team Assessment
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md shadow-cyan-500/25">
              <Link href="/contact">
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started
              </Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg text-slate-600 hover:text-cyan-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/login" className="text-lg text-slate-600 hover:text-slate-900" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <Button asChild variant="outline" className="border-red-200 text-red-600">
                    <Link href="/contact?interest=security" onClick={() => setIsOpen(false)}>
                      Red Team Assessment
                    </Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
