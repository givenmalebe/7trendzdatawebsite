import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Target, Eye, GraduationCap, UserCheck, ShieldAlert, Boxes, Code2 } from "lucide-react"
import { PRODUCTS } from "@/lib/products"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About 7Trendz Data — a South African AI company building intelligent products across security, learning, HR, Web3, and development, from Johannesburg.",
  alternates: { canonical: "https://7trendzdata.com/about" },
}

const PRODUCT_ICONS = [GraduationCap, UserCheck, ShieldAlert, Boxes, Code2]

export default function AboutPage() {
  const values = [
    { icon: Sparkles, title: "AI First", description: "We design, build, and run every product with AI at its core — not bolted on later." },
    { icon: Target, title: "Focused on Results", description: "Every product we ship is measured by the real outcomes it delivers for clients." },
    { icon: Eye, title: "South African Made", description: "Proudly built from Johannesburg for businesses in South Africa and beyond." },
  ]

  const stats = [
    { number: "5", label: "AI Product Lines" },
    { number: "AI-First", label: "Engineering Approach" },
    { number: "24/7", label: "AI Security Recon" },
    { number: "ZA", label: "Made in South Africa" },
  ]

  return (
    <div className="page-shell">
      <Header />

      <section className="corporate-hero relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="section-label-corporate-dark mb-4 mx-auto w-fit">About 7Trendz Data</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Building the Future with <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            7Trendz Data is a South African AI company. We develop apps using AI, learn with it through FutureLearning,
            support teams with the Ask Sarah HR assistant, secure businesses with AI red teaming, and build the
            decentralized future with AI Web3 development.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-slate-900">
                <Target className="h-6 w-6 text-blue-600" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-lg leading-relaxed">
                To make the power of AI accessible to every business — through security products that find the gaps,
                learning platforms that actually teach, HR assistants that free up people teams, Web3 builds that ship
                safely, and custom applications that solve real problems.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-slate-900">
                <Eye className="h-6 w-6 text-cyan-600" /> Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-lg leading-relaxed">
                To be recognised as Africa&apos;s most practical AI company — where intelligent products in security,
                learning, HR, Web3, and development work together to move businesses forward.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label-corporate mb-4 mx-auto w-fit">Our Products</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What We Build</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Five AI product lines, one team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => {
              const Icon = PRODUCT_ICONS[index] || product.icon
              return (
                <Card key={product.id} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 mb-2">{product.tagline}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{product.short}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={product.url}>Learn More <ArrowRight className="ml-1 h-3 w-3" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Have an idea?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 text-sm mb-4">Tell us what you want to build with AI.</p>
                <Button asChild size="sm" className="bg-white text-blue-700 hover:bg-slate-100">
                  <Link href="/contact">Contact Us <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
            <p>7Trendz Data started with a red team insight: businesses needed someone to find their security gaps, not sell them generic fixes. We built that, and the same AI-first thinking propelled us forward.</p>
            <p>As AI matured, we realised the same approach applied everywhere — so we built FutureLearning to change how people learn, Ask Sarah to change how HR supports people, and an AI development practice that ships Web3 and custom applications.</p>
            <p>Today, 7Trendz Data is a multi-product AI company from Johannesburg, building the future with AI across security, learning, HR, Web3, and development.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600">The principles that guide everything we build</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-700 to-cyan-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to work with us?</h2>
          <p className="text-xl text-blue-100 mb-8">Explore our five products, or start a conversation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100">
              <Link href="/contact">Start Your Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm">
              <Link href="/products/security/">Explore AI Security</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}