"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Sparkles, ChevronDown } from "lucide-react"
import { PRODUCT_LIST } from "@/lib/products"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
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
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-blue-600">
                Building the Future with AI
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors focus:outline-none">
                Products <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>Our AI Products</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PRODUCT_LIST.map((p) => (
                  <DropdownMenuItem key={p.url} asChild>
                    <Link href={p.url} className="flex flex-col items-start py-2">
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      <span className="text-xs text-slate-500">{p.tagline}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/25">
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
              <div className="flex flex-col gap-2 mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">Products</p>
                {PRODUCT_LIST.map((p) => (
                  <Link
                    key={p.url}
                    href={p.url}
                    className="px-1 py-2 text-slate-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block text-xs text-slate-500">{p.tagline}</span>
                  </Link>
                ))}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-1 py-2 text-lg text-slate-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/login" className="px-1 py-2 text-lg text-slate-600 hover:text-slate-900" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <div className="pt-4 border-t mt-2">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white w-full">
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