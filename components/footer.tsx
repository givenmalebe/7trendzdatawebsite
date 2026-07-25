import Link from "next/link"
import { Mail, Phone, MapPin, Shield, Bot, Crosshair } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="font-mono text-xs font-bold text-white">7T</span>
              </div>
              <span className="text-xl font-bold">7Trendz Data</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              We help clients automate with intelligent AI and expose security gaps through red teaming and
              vulnerability analysis — then connect you with the right defender for each issue we find.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Services", href: "/services" },
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-400" /> AI Solutions
            </h3>
            <ul className="space-y-2 text-sm text-slate-400 mb-6">
              <li>AI Receptionist & Chatbots</li>
              <li>Custom AI Models</li>
              <li>Process Automation</li>
            </ul>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-red-400" /> Security
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Red Teaming</li>
              <li>Vulnerability Analysis</li>
              <li>Defender Matching</li>
              <li>AI Recon Agents</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <a href="mailto:info@7trendzdata.com" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Mail className="h-4 w-4 text-cyan-400" /> info@7trendzdata.com
              </a>
              <a href="tel:+27736289188" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Phone className="h-4 w-4 text-cyan-400" /> +27 736 289 188
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                113 2nd Avenue Wynberg, Johannesburg, South Africa
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} 7Trendz Data. All rights reserved.</p>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="h-3 w-3 text-cyan-400" /> AI Automation · Red Teaming · Vulnerability Analysis
          </p>
        </div>
      </div>
    </footer>
  )
}
