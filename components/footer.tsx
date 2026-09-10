import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles, GraduationCap, UserCheck, ShieldAlert, Boxes, Code2 } from "lucide-react"
import { PRODUCT_LIST } from "@/lib/products"

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/products/futurelearning/": GraduationCap,
  "/products/ask-sarah/": UserCheck,
  "/products/security/": ShieldAlert,
  "/products/web3/": Boxes,
  "/products/development/": Code2,
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                <span className="font-mono text-xs font-bold text-white">7T</span>
              </div>
              <span className="text-xl font-bold">7Trendz Data</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Building the future with AI. We develop intelligent products across security, learning, HR, Web3, and
              development — powered by AI at every layer.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Products</h3>
            <ul className="space-y-2">
              {PRODUCT_LIST.map((p) => {
                const Icon = PRODUCT_ICONS[p.url] || Sparkles
                return (
                  <li key={p.url}>
                    <Link href={p.url} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                      <Icon className="h-4 w-4 text-blue-400" /> {p.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Client Login", href: "/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <a href="mailto:info@7trendzdata.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Mail className="h-4 w-4 text-blue-400" /> info@7trendzdata.com
              </a>
              <a href="tel:+27736289188" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Phone className="h-4 w-4 text-blue-400" /> +27 736 289 188
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                113 2nd Avenue Wynberg, Johannesburg, South Africa
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} 7Trendz Data. All rights reserved.</p>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3 w-3 text-blue-400" /> AI · Security · Learning · HR · Web3 · Development
          </p>
        </div>
      </div>
    </footer>
  )
}