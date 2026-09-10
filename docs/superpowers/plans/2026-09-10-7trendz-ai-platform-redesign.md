# 7Trendz AI Platform Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform 7Trendz Data from a cybersecurity-only marketing site into a multi-product AI platform with five sub-branded products (FutureLearning, Ask Sarah, AI Security, AI Web3 Dev, AI Development), a reworked homepage, and an admin portal that manages leads/revenue across all products.

**Architecture:** Static-export Next.js 14 (App Router, `output: "export"`, `trailingSlash: true`). All data flows client-side via the Firebase SDK; there are no working API routes. Content lives in `lib/` data files and per-page JSX. A new `lib/products.ts` becomes the single source of truth for the five products and is consumed by the homepage, header dropdown, footer, product pages, lead form, and admin portal.

**Tech Stack:** Next.js 14.2.35 (static export), React 18, Tailwind CSS 3, shadcn/ui (radix + lucide-react), Firebase 12 (Firestore), TypeScript 5.

## Global Constraints

- **Static export only** — no server components fetching data at request time, no API routes. Every page must render from build-time data / client effects.
- **Build verification** — there is NO test framework in this repo. Verification = `npm run build` succeeds + dev server renders the page without console errors.
- **Build tolerances** — `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`. Do not rely on these to skip correctness checks — copy code exactly as given.
- **Do NOT touch** `lib/firebase.ts`, `lib/firebase-admin.ts`, the dev-server process, or any `.env.local` secrets.
- **Keep auth flows intact** — `/login`, `/register`, `/admin`, `/client`, `/create-admin`, `/blog*`, `/messages` pages are untouched except where a task says to modify them.
- **Existing data preserved** — cybersec leads/reports/revenue remain; new leads get a `product` field.
- **No comments in code** unless copied verbatim from source.
- **All paths** use the `@/` alias (e.g. `@/components/header`).

---

### Task 1: Corporate Tech Theme (colors + backgrounds)

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `components/corporate-background.tsx`

**Interfaces:**
- Produces: Tailwind color tokens `trendz.navy`, `trendz.blue`, `trendz.accent`, `trendz.gold`; CSS utility classes `.trendz-grid`, `.corporate-hero`, `.section-label-corporate`; component `CorporateBackground` (no props, renders `<div>` layers).

- [ ] **Step 1: Update `tailwind.config.ts`**

Replace the `cyber` color block and `cyber-mesh` background image with the corporate tech palette:

```ts
        trendz: {
          navy: "hsl(var(--trendz-navy))",
          blue: "hsl(var(--trendz-blue))",
          accent: "hsl(var(--trendz-accent))",
          gold: "hsl(var(--trendz-gold))",
        },
```

and in `backgroundImage`:

```ts
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "corporate-mesh":
          "radial-gradient(at 30% 10%, hsl(222 60% 45% / 0.14) 0px, transparent 55%), radial-gradient(at 80% 0%, hsl(185 95% 40% / 0.09) 0px, transparent 50%), radial-gradient(at 0% 80%, hsl(45 90% 55% / 0.06) 0px, transparent 50%)",
      },
```

- [ ] **Step 2: Update `app/globals.css` color variables**

In `:root`, replace the three `--cyber-*` variables and the primary/ring/sidebar colors:

```css
    --primary: 222 60% 45%;
    --ring: 222 60% 45%;
    --sidebar-primary: 222 60% 45%;
    --sidebar-ring: 222 60% 45%;
    --trendz-navy: 222 55% 12%;
    --trendz-blue: 222 70% 45%;
    --trendz-accent: 185 95% 40%;
    --trendz-gold: 45 90% 55%;
```

In `.dark`, replace `--primary`, `--ring`, `--sidebar-primary`, `--sidebar-ring`, `--cyber-*` :

```css
    --primary: 210 40% 98%;
    --ring: 222 70% 55%;
    --sidebar-primary: 222 70% 55%;
    --sidebar-ring: 222 70% 55%;
    --trendz-navy: 222 55% 12%;
    --trendz-blue: 222 70% 45%;
    --trendz-accent: 185 95% 40%;
    --trendz-gold: 45 90% 55%;
```

- [ ] **Step 3: Update globals.css component classes (cyber → corporate)**

Add these component classes after `.hero-dark` (keep `.hero-dark` — existing pages still reference it):

```css
  .corporate-hero {
    @apply bg-slate-950 text-white;
    background-image:
      radial-gradient(ellipse 90% 60% at 50% -20%, hsl(222 70% 45% / 0.22), transparent),
      radial-gradient(ellipse 60% 40% at 100% 0%, hsl(185 95% 40% / 0.12), transparent),
      linear-gradient(to bottom, rgb(6 10 23), rgb(17 24 39));
  }

  .trendz-grid {
    background-image:
      linear-gradient(hsl(185 95% 40% / 0.08) 1px, transparent 1px),
      linear-gradient(90deg, hsl(185 95% 40% / 0.08) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .trendz-grid-fade {
    mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%);
  }

  .section-label-corporate {
    @apply inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700;
  }

  .section-label-corporate-dark {
    @apply inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300;
  }
```

Update `.hero-dark` to use the corporate mesh so all existing dark sections match the new palette:

```css
  .hero-dark {
    @apply bg-slate-950 text-white;
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, hsl(222 70% 45% / 0.18), transparent),
      radial-gradient(ellipse 60% 40% at 100% 0%, hsl(185 95% 40% / 0.1), transparent),
      linear-gradient(to bottom, rgb(2 6 23), rgb(15 23 42));
  }
```

- [ ] **Step 4: Create `components/corporate-background.tsx`**

```tsx
export function CorporateBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 trendz-grid trendz-grid-fade opacity-40" />
      <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute top-1/3 -left-32 h-[340px] w-[340px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-[260px] w-[260px] rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute left-1/4 top-1/2 h-1 w-1 rounded-full bg-cyan-400/60 animate-pulse" />
      <div className="absolute left-2/3 top-1/3 h-1.5 w-1.5 rounded-full bg-blue-400/50 animate-pulse [animation-delay:1s]" />
      <div className="absolute right-1/4 bottom-1/3 h-1 w-1 rounded-full bg-cyan-300/50 animate-pulse [animation-delay:2s]" />
      <div className="absolute left-1/2 bottom-1/4 h-1.5 w-1.5 rounded-full bg-blue-300/40 animate-pulse [animation-delay:3s]" />
    </div>
  )
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: Build completes. Styling is visual — open `http://localhost:3000` (or restart the background dev server if it died) and confirm the homepage still renders, now with the deeper navy/blue corporate palette instead of bright cyan.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts app/globals.css components/corporate-background.tsx
git commit -m "feat(theme): corporate tech palette and background component"
```

---

### Task 2: Products Data Catalog

**Files:**
- Create: `lib/products.ts`

**Interfaces:**
- Produces (later tasks consume these EXACT names/fields):
  - `type Product = { id: string; name: string; tagline: string; short: string; description: string; icon: LucideIcon; color: string; gradient: string; url: string; externalUrl?: string; ctaLabel: string; ctaHref: string; heroTitle: string; heroSubtitle: string; features: { title: string; description: string; icon: LucideIcon }[]; steps: { title: string; description: string }[]; problem: string; solution: string }`
  - `PRODUCTS: Product[]` — five entries with ids `futurelearning`, `ask-sarah`, `security`, `web3`, `development`
  - `getProduct(id: string): Product | undefined`
  - `topLevelRoutes: string[]` — the product URL slugs

- [ ] **Step 1: Create `lib/products.ts`**

```ts
import { GraduationCap, UserCheck, ShieldAlert, Blocks, Code2, Brain, BookOpenCheck, BarChart3, Award, MessageSquareText, FileUser, CalendarClock, HeartHandshake, Bug, Radar, FileSearch, ScanLine, Box, Wallet, Vote, Cpu, Workflow, Layers } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface ProductFeature {
  title: string
  description: string
  icon: LucideIcon
}

export interface Product {
  id: string
  name: string
  tagline: string
  short: string
  description: string
  icon: LucideIcon
  color: string
  gradient: string
  url: string
  externalUrl?: string
  ctaLabel: string
  ctaHref: string
  heroTitle: string
  heroSubtitle: string
  features: ProductFeature[]
  steps: { title: string; description: string }[]
  problem: string
  solution: string
}

export const PRODUCTS: Product[] = [
  {
    id: "futurelearning",
    name: "FutureLearning",
    tagline: "AI-Powered Learning Platform",
    short: "Adaptive learning paths, AI tutoring, and progress analytics at 7trendzlearn.co.za.",
    description:
      "FutureLearning is an AI learning management system that adapts to every learner. It builds personalised study paths, tutors learners in real time, tracks progress automatically, and issues verifiable certificates.",
    icon: GraduationCap,
    color: "bg-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    url: "/products/futurelearning/",
    externalUrl: "https://7trendzlearn.co.za",
    ctaLabel: "Visit FutureLearning",
    ctaHref: "/contact?product=futurelearning",
    heroTitle: "AI-Powered Education at 7trendzlearn.co.za",
    heroSubtitle:
      "A learning management system that learns with you — adaptive paths, always-on AI tutoring, and analytics that show real progress.",
    features: [
      { title: "Adaptive Learning Paths", description: "Courses restructure in real time around each learner's pace, strengths, and gaps.", icon: Brain },
      { title: "AI Tutoring", description: "An always-available tutor explains concepts, answers questions, and quizzes learners.", icon: BookOpenCheck },
      { title: "Progress Analytics", description: "Dashboards surface mastery, drop-off points, and completion trends for educators.", icon: BarChart3 },
      { title: "Certificate Generation", description: "Auto-issued, verifiable certificates on course completion.", icon: Award },
    ],
    steps: [
      { title: "Enrol", description: "Learners join a course and complete a short AI assessment of their current level." },
      { title: "Learn", description: "The AI adapts content, pacing, and practice to each learner in real time." },
      { title: "Certify", description: "Progress is tracked continuously and certificates are issued the moment learners finish." },
    ],
    problem:
      "Traditional LMS platforms treat every learner the same — fixed content, no personalisation, and no real insight into who is actually learning.",
    solution:
      "FutureLearning uses AI to personalise every path, tutor every learner, and give educators the analytics they need to improve outcomes.",
  },
  {
    id: "ask-sarah",
    name: "Ask Sarah",
    tagline: "Your AI HR Assistant",
    short: "Automated onboarding, policy Q&A, leave management, and employee sentiment in one assistant.",
    description:
      "Ask Sarah is an AI HR assistant that handles the repetitive, high-volume parts of HR — onboarding, policy questions, leave requests, and sentiment feedback — so your people team focuses on people.",
    icon: UserCheck,
    color: "bg-violet-600",
    gradient: "from-violet-500 to-purple-600",
    url: "/products/ask-sarah/",
    ctaLabel: "Try Ask Sarah",
    ctaHref: "/contact?product=ask-sarah",
    heroTitle: "Meet Sarah — Your AI HR Assistant",
    heroSubtitle:
      "Sarah answers policy questions, guides onboarding, manages leave, and surfaces employee sentiment around the clock.",
    features: [
      { title: "Automated Onboarding", description: "New hires get a guided, conversational onboarding flow without HR having to repeat it.", icon: FileUser },
      { title: "Policy Q&A", description: "Employees ask HR policies in plain language and get accurate, compliant answers instantly.", icon: MessageSquareText },
      { title: "Leave Management", description: "Leave requests, balances, and approvals handled conversationally with the right workflow.", icon: CalendarClock },
      { title: "Sentiment Analysis", description: "Anonymous pulse surveys analysed with AI to surface team wellbeing trends early.", icon: HeartHandshake },
    ],
    steps: [
      { title: "Deploy", description: "Point Sarah at your HR policies, org chart, and leave rules — she learns them all." },
      { title: "Interact", description: "Employees message Sarah for onboarding, policies, and leave in plain language." },
      { title: "Improve", description: "HR gets sentiment insights and hand-off queues for anything needing a human touch." },
    ],
    problem:
      "High-volume HR questions repeat constantly — onboarding, policy lookups, and leave requests burn hours of people-team time every week.",
    solution:
      "Ask Sarah automates those workflows with AI, answers instantly in natural language, and hands only the sensitive cases to people.",
  },
  {
    id: "security",
    name: "AI Security",
    tagline: "Red Teaming with AI",
    short: "AI-powered recon, red teaming, pentesting, and vulnerability analysis with defender matching.",
    description:
      "Our AI security products red team your environment at machine speed — autonomous recon agents, AI-driven vulnerability analysis, and transparent reporting that routes every finding to the right defender.",
    icon: ShieldAlert,
    color: "bg-red-600",
    gradient: "from-red-500 to-orange-600",
    url: "/products/security/",
    ctaLabel: "Request Assessment",
    ctaHref: "/contact?product=security",
    heroTitle: "AI-Powered Red Teaming",
    heroSubtitle:
      "Autonomous AI agents find the gaps — pentesting, recon, and vulnerability analysis delivered as a clear report.",
    features: [
      { title: "Automated Vulnerability Scanning", description: "AI-driven scans that find and explain the risks that matter, cutting through scanner noise.", icon: ScanLine },
      { title: "AI-Driven Exploit Analysis", description: "Vulnerabilities are scored and rated for likelihood of exploitation, not just severity.", icon: Bug },
      { title: "Continuous Monitoring", description: "24/7 recon agents map your attack surface and alert on new exposures instantly.", icon: Radar },
      { title: "Detailed Reporting", description: "Every finding documented and routed to the right defender by issue type.", icon: FileSearch },
    ],
    steps: [
      { title: "Assess", description: "AI recon agents map your attack surface and automated scans find live vulnerabilities." },
      { title: "Analyse", description: "AI triage scores findings by severity and exploit likelihood, removing false positives." },
      { title: "Report & Match", description: "You receive a clear report and every finding is routed to a matched defender." },
    ],
    problem:
      "Attackers now use AI at machine speed, and manual pentesting cannot keep up with a growing attack surface.",
    solution:
      "We red team with AI — autonomous recon and analysis find vulnerabilities faster and document them for a clear path to fixing.",
  },
  {
    id: "web3",
    name: "AI Web3 Dev",
    tagline: "Decentralized Apps Built with AI",
    short: "Smart contract auditing, dApps, token engineering, and DAO tooling — built and secured with AI.",
    description:
      "We build Web3 products using AI at every stage — smart contracts written and audited by AI, dApps designed for real users, tokenomics modelled, and DAO governance made easy.",
    icon: Blocks,
    color: "bg-indigo-600",
    gradient: "from-indigo-500 to-blue-600",
    url: "/products/web3/",
    ctaLabel: "Start Your Project",
    ctaHref: "/contact?product=web3",
    heroTitle: "Building Decentralized Futures with AI",
    heroSubtitle:
      "Smart contracts, dApps, token engineering, and DAO tools — designed, built, and audited using AI.",
    features: [
      { title: "Smart Contract Auditing", description: "AI-assisted audit of contracts for vulnerabilities, gas issues, and logic flaws before launch.", icon: ShieldAlert },
      { title: "DApp Development", description: "Full-stack decentralised applications with familiar, human-first interfaces.", icon: Box },
      { title: "Token Engineering", description: "AI-modelled tokenomics — supply, incentives, and governance powers that survive reality.", icon: Wallet },
      { title: "DAO Governance Tools", description: "Voting, treasury, and proposal tooling communities actually want to use.", icon: Vote },
    ],
    steps: [
      { title: "Design", description: "We model your tokenomics and governance with AI before writing a single line." },
      { title: "Build", description: "Contracts and dApp interfaces are built with AI tooling and reviewed by engineers." },
      { title: "Audit & Launch", description: "AI-assisted audits run before launch, then we hand over a product you can scale." },
    ],
    problem:
      "Web3 is slow to build and unforgiving — a single contract bug or bad tokenomics decision can destroy value overnight.",
    solution:
      "We use AI to model, build, and audit Web3 products, closing the gap between idea and a safe launch.",
  },
  {
    id: "development",
    name: "AI Development",
    tagline: "Custom AI-Powered Apps",
    short: "We develop apps using AI — integration consulting, custom models, APIs, and full-stack AI products.",
    description:
      "From AI integration consulting to custom model training and full-stack products, we develop software with AI woven through every layer — shipped fast and built to evolve.",
    icon: Code2,
    color: "bg-sky-600",
    gradient: "from-sky-500 to-blue-700",
    url: "/products/development/",
    ctaLabel: "Discuss Your Project",
    ctaHref: "/contact?product=development",
    heroTitle: "Custom AI Applications Built for You",
    heroSubtitle:
      "We develop apps using AI — from integration consulting to custom models, APIs, and full product builds.",
    features: [
      { title: "AI Integration Consulting", description: "A clear roadmap for where and how AI should improve your product and operations.", icon: Cpu },
      { title: "Custom Model Training", description: "Models fine-tuned on your data for your domain — not a generic one-size-fits-all model.", icon: Brain },
      { title: "API Development", description: "Reliable, secure APIs that turn your AI models into usable product features.", icon: Workflow },
      { title: "Full-Stack AI Apps", description: "Complete applications that put AI in front of your users from day one.", icon: Layers },
    ],
    steps: [
      { title: "Workshop", description: "We map your workflows and identify where AI genuinely moves the needle." },
      { title: "Build", description: "We develop the app with AI-assisted engineering and your team looped in throughout." },
      { title: "Ship & Evolve", description: "We launch, measure, and keep improving the models as your data grows." },
    ],
    problem:
      "Most teams struggle to turn AI enthusiasm into shipped software — they don't know where to start or which model fits their problem.",
    solution:
      "We develop apps using AI end to end — you get a working product, not a pilot deck.",
  },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export const PRODUCT_LIST: { name: string; tagline: string; url: string }[] = PRODUCTS.map((p) => ({
  name: p.name,
  tagline: p.tagline,
  url: p.url,
}))
```

- [ ] **Step 2: Verify**

Run: `node -e "require('./lib/products.ts')"` — this will fail because it's TypeScript; that's expected. Instead verify via dev server: add a temporary console log is NOT needed. Run a type-only check:

```bash
cmd /c "npx tsc --noEmit lib/products.ts --skipLibCheck --moduleResolution bundler --module esnext --target es2020 --lib es2020,dom --jsx preserve"
```

Expected: no type errors. If `tsconfig.json` paths are required by lucide imports, instead run the repo-wide type check:

```bash
cmd /c "npx tsc --noEmit"
```

Expected: no NEW errors beyond whatever the repo already has (build ignores errors, so this is informational).

- [ ] **Step 3: Commit**

```bash
git add lib/products.ts
git commit -m "feat(products): product catalog data for five AI products"
```

---

### Task 3: Header & Footer Rebrand

**Files:**
- Modify: `components/header.tsx`
- Modify: `components/footer.tsx`

**Interfaces:**
- Consumes: `PRODUCT_LIST` from `lib/products.ts` (fields `name`, `tagline`, `url`)
- Produces: Header with a "Products" dropdown (desktop) and expanded mobile sheet; footer with all five product links.

- [ ] **Step 1: Rewrite `components/header.tsx`**

Replace the entire file with:

```tsx
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
```

- [ ] **Step 2: Verify header renders + dropdown works**

Run: `npm run build`
Expected: Build succeeds. On the live dev site (`http://localhost:3000`), confirm:
- The "Products" dropdown lists all five products with taglines.
- The mobile menu (hamburger) shows products + nav links.
- The sub-tagline reads "Building the Future with AI".

- [ ] **Step 3: Commit header**

```bash
git add components/header.tsx
git commit -m "feat(header): products dropdown and AI platform branding"
```

- [ ] **Step 4: Rewrite `components/footer.tsx`**

Replace the entire file with:

```tsx
import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles, GraduationCap, UserCheck, ShieldAlert, Blocks, Code2 } from "lucide-react"
import { PRODUCT_LIST } from "@/lib/products"

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/products/futurelearning/": GraduationCap,
  "/products/ask-sarah/": UserCheck,
  "/products/security/": ShieldAlert,
  "/products/web3/": Blocks,
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
```

- [ ] **Step 5: Verify footer**

Run: `npm run build`
Expected: Build succeeds. On the live site the footer lists all five products with icons, updated blurb, and updated bottom tagline.

- [ ] **Step 6: Commit footer**

```bash
git add components/footer.tsx
git commit -m "feat(footer): multi-product links and AI branding"
```

---

### Task 4: Global Metadata & Structured Data

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: updated site title, description, keywords, and JSON-LD Organization schema listing all five products.

- [ ] **Step 1: Rewrite `app/layout.tsx`**

Replace the file wholesale:

```tsx
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

const SITE_URL = "https://7trendzdata.com"
const SITE_NAME = "7Trendz Data"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "7Trendz Data — Building the Future with AI in South Africa",
    template: "%s | 7Trendz Data",
  },
  description:
    "7Trendz Data is a South African AI company building intelligent products across security, learning, HR, Web3, and development. From AI red teaming and FutureLearning LMS to AI HR assistant Ask Sarah, we develop apps using AI.",
  keywords: [
    "AI company South Africa",
    "AI red teaming",
    "AI cyber security",
    "AI learning management system",
    "FutureLearning",
    "Ask Sarah AI HR",
    "AI web3 development",
    "smart contract auditing",
    "AI app development",
    "custom AI applications",
    "AI software development Johannesburg",
    "7trendzlearn.co.za",
  ],
  authors: [{ name: "7Trendz Data", url: SITE_URL }],
  creator: "7Trendz Data",
  publisher: "7Trendz Data",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "7Trendz Data — Building the Future with AI in South Africa",
    description:
      "AI products across security, learning, HR, Web3, and development. FutureLearning LMS, Ask Sarah AI HR, AI red teaming, and more.",
    images: [
      {
        url: "/images/7trendz-logo-final.png",
        width: 1200,
        height: 630,
        alt: "7Trendz Data — Building the Future with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7Trendz Data — Building the Future with AI in South Africa",
    description:
      "AI products across security, learning, HR, Web3, and development. FutureLearning LMS, Ask Sarah AI HR, AI red teaming, and more.",
    images: ["/images/7trendz-logo-final.png"],
    creator: "@7trendzdata",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/7trendz-logo-final.png",
    shortcut: "/images/7trendz-logo-final.png",
    apple: "/apple-icon.png",
  },
  verification: {},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/7trendz-logo-final.png`,
    description: "South African AI company building products across security, learning, HR, Web3, and development.",
    slogan: "Building the future with AI",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Johannesburg",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["English"],
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "FutureLearning", description: "AI-powered learning management system at 7trendzlearn.co.za" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ask Sarah", description: "AI HR assistant for onboarding, policy Q&A, and leave management" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Security", description: "AI-powered red teaming, pentesting, and vulnerability analysis" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Web3 Development", description: "Smart contracts, dApps, token engineering and DAO tools built with AI" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Development", description: "Custom AI-powered applications and integration consulting" } },
    ],
  }

  return (
    <html lang="en">
      <head>
        <meta name="msvalidate.01" content="2B5357F930D8CABC758A10E9E75DD6D2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds. Open the live site and check the `<title>` reads "7Trendz Data — Building the Future with AI in South Africa"; view source to confirm the JSON-LD now lists the five products.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): update metadata and structured data for AI platform"
```

---

### Task 5: Reusable Product Page Components

**Files:**
- Create: `components/product-hero.tsx`
- Create: `components/features-grid.tsx`
- Create: `components/how-it-works.tsx`
- Create: `components/product-card.tsx`

**Interfaces:**
- Consumes: `Product` / `ProductFeature` types from `@/lib/products`
- Produces: `ProductHero({ product }: { product: Product })`, `FeaturesGrid({ features, accentColor }: { features: ProductFeature[]; accentColor: string })`, `HowItWorks({ steps }: { steps: { title: string; description: string }[] })`, `ProductCard({ product }: { product: Product })`

- [ ] **Step 1: Create `components/product-hero.tsx`**

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CorporateBackground } from "@/components/corporate-background"
import type { Product } from "@/lib/products"

export function ProductHero({ product }: { product: Product }) {
  return (
    <section className="corporate-hero relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <CorporateBackground />
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
          <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
            <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/features-grid.tsx`**

```tsx
import type { ProductFeature } from "@/lib/products"

export function FeaturesGrid({ features, accentColor }: { features: ProductFeature[]; accentColor: string }) {
  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-label-corporate mb-4 mx-auto w-fit">Key Features</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What It Does</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center mb-4 shadow-md`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/how-it-works.tsx`**

```tsx
export function HowItWorks({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-label-corporate mb-4 mx-auto w-fit">How It Works</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple & Transparent</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center bg-white rounded-2xl p-6 shadow-md border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/product-card.tsx`**

```tsx
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
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: Build succeeds (the components are unused yet, which is fine — Next will still typecheck the files as part of the build). No runtime errors on the live site.

- [ ] **Step 6: Commit**

```bash
git add components/product-hero.tsx components/features-grid.tsx components/how-it-works.tsx components/product-card.tsx
git commit -m "feat(components): reusable product page components"
```

---

### Task 6: Five Product Pages

**Files:**
- Create: `app/products/futurelearning/page.tsx`
- Create: `app/products/ask-sarah/page.tsx`
- Create: `app/products/security/page.tsx`
- Create: `app/products/web3/page.tsx`
- Create: `app/products/development/page.tsx`

**Interfaces:**
- Consumes: `getProduct`, `Product` from `@/lib/products`; `ProductHero`, `FeaturesGrid`, `HowItWorks`; `Header`, `Footer`, `CorporateBackground`
- Produces: five statically exportable pages at the product URLs. A future task adds the problem/solution section — the `problem` and `solution` fields are already in the data.

- [ ] **Step 1: Create `app/products/web3/page.tsx` first (full template)**

```tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductHero } from "@/components/product-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { HowItWorks } from "@/components/how-it-works"
import { CorporateBackground } from "@/components/corporate-background"
import { getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Web3 Dev — Decentralized Apps Built with AI",
  description:
    "Smart contract auditing, dApps, token engineering, and DAO governance tools — designed, built, and audited using AI by 7Trendz Data.",
  alternates: { canonical: "https://7trendzdata.com/products/web3/" },
  openGraph: {
    title: "AI Web3 Dev — Decentralized Apps Built with AI",
    description: "Smart contracts, dApps, tokenomics, and DAO tools built with AI. Start your project with 7Trendz Data.",
    url: "https://7trendzdata.com/products/web3/",
  },
}

export default function Web3ProductPage() {
  const product = getProduct("web3")!
  return (
    <div className="page-shell">
      <Header />
      <ProductHero product={product} />
      <FeaturesGrid features={product.features} accentColor={product.color} />
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">The Problem</h2>
            <p className="text-slate-600 leading-relaxed">{product.problem}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">The Solution</h2>
            <p className="text-slate-600 leading-relaxed">{product.solution}</p>
          </div>
        </div>
      </section>
      <HowItWorks steps={product.steps} />
      <section className="corporate-hero relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CorporateBackground />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to build with AI?</h2>
          <p className="text-xl text-slate-300 mb-8">Every 7Trendz product is powered by AI — let&apos;s talk about yours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className={`bg-gradient-to-r ${product.gradient} text-white shadow-lg`}>
              <Link href={product.ctaHref}>{product.ctaLabel}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Create the remaining four product pages by copying the template**

For each of `futurelearning`, `ask-sarah`, `security`, `development`, create the file with the SAME structure but these metadata blocks:

**futurelearning:**
```tsx
export const metadata: Metadata = {
  title: "FutureLearning — AI-Powered Learning Platform",
  description:
    "FutureLearning is an AI learning management system by 7Trendz at 7trendzlearn.co.za — adaptive learning paths, AI tutoring, progress analytics, and certifications.",
  alternates: { canonical: "https://7trendzdata.com/products/futurelearning/" },
  openGraph: {
    title: "FutureLearning — AI-Powered Learning Platform",
    description: "Adaptive learning paths, AI tutoring, and progress analytics. Visit us at 7trendzlearn.co.za.",
    url: "https://7trendzdata.com/products/futurelearning/",
  },
}
```
and `getProduct("futurelearning")!`.

**ask-sarah:**
```tsx
export const metadata: Metadata = {
  title: "Ask Sarah — Your AI HR Assistant",
  description:
    "Ask Sarah is the AI HR assistant from 7Trendz Data — automated onboarding, policy Q&A, leave management, and employee sentiment analysis.",
  alternates: { canonical: "https://7trendzdata.com/products/ask-sarah/" },
  openGraph: {
    title: "Ask Sarah — Your AI HR Assistant",
    description: "Meet Sarah. Ask her anything HR — onboarding, policies, leave, and sentiment insights.",
    url: "https://7trendzdata.com/products/ask-sarah/",
  },
}
```
and `getProduct("ask-sarah")!`.

**security:**
```tsx
export const metadata: Metadata = {
  title: "AI Security — Red Teaming with AI",
  description:
    "AI-powered red teaming and pentesting by 7Trendz Data — automated vulnerability scanning, AI-driven exploit analysis, continuous monitoring, and detailed reporting.",
  alternates: { canonical: "https://7trendzdata.com/products/security/" },
  openGraph: {
    title: "AI Security — Red Teaming with AI",
    description: "Autonomous AI recon agents find the gaps. Red teaming, pentesting, and vulnerability analysis.",
    url: "https://7trendzdata.com/products/security/",
  },
}
```
and `getProduct("security")!`.

**development:**
```tsx
export const metadata: Metadata = {
  title: "AI Development — Custom AI-Powered Apps",
  description:
    "We develop apps using AI — integration consulting, custom model training, API development, and full-stack AI applications by 7Trendz Data.",
  alternates: { canonical: "https://7trendzdata.com/products/development/" },
  openGraph: {
    title: "AI Development — Custom AI-Powered Apps",
    description: "From AI consulting to custom models and full-stack products — we develop apps using AI.",
    url: "https://7trendzdata.com/products/development/",
  },
}
```
and `getProduct("development")!`.

In each page body only the `Web3ProductPage` identifier, the `product` variable, and the `getProduct("...")` call differ. The `FeaturesGrid` accentColor for each is `product.color` (already supplied by data), so no per-page change is needed there.

For **futurelearning**, ALSO add a secondary external-link CTA band between `FeaturesGrid` and the problem/solution section so visitors can reach the live LMS:

```tsx
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Experience FutureLearning live</h2>
          <p className="text-blue-100 mb-6">Explore the AI learning platform at 7trendzlearn.co.za.</p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100">
            <a href="https://7trendzlearn.co.za" target="_blank" rel="noopener noreferrer">Visit 7trendzlearn.co.za</a>
          </Button>
        </div>
      </section>
```

- [ ] **Step 3: Verify all routes export**

Run: `npm run build`
Expected: Build succeeds. In the `out/` directory confirm `products/futurelearning/index.html`, `products/ask-sarah/index.html`, `products/security/index.html`, `products/web3/index.html`, `products/development/index.html` exist (the last one via `Get-ChildItem out/products -Recurse`). Visit each URL on the dev server and confirm hero, features, problem/solution, how-it-works, CTA all render.

- [ ] **Step 4: Commit**

```bash
git add app/products/
git commit -m "feat(products): five product landing pages"
```

---

### Task 7: Homepage Rewrite

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `PRODUCTS` from `@/lib/products`; `ProductCard`; `CorporateBackground`; `Header`; `Footer`; `LeadForm`
- Produces: multi-section homepage (hero / product grid / about / stats / testimonials / CTA)

- [ ] **Step 1: Rewrite `app/page.tsx`**

Replace the entire file with:

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Cpu, MapPin, Rocket } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CorporateBackground } from "@/components/corporate-background"
import { LeadForm } from "@/components/lead-form"
import { ProductCard } from "@/components/product-card"
import { PRODUCTS } from "@/lib/products"

const testimonials = [
  {
    quote:
      "The team built an internal AI assistant that actually works — it answered our most common support questions within two weeks of kickoff.",
    author: "Ops Director, Johannesburg",
    role: "AI Development Client",
  },
  {
    quote:
      "Their red team assessment found a critical exposure our previous auditor missed. The report was clear and the fix was easy to action.",
    author: "CTO, Cape Town",
    role: "AI Security Client",
  },
  {
    quote:
      "Ask Sarah paid for itself in the first quarter. Our people team finally has time for people, not paperwork.",
    author: "HR Manager, Pretoria",
    role: "Ask Sarah Client",
  },
]

export default function HomePage() {
  const [leadFormOpen, setLeadFormOpen] = useState(false)

  return (
    <div className="page-shell">
      <Header />

      <section className="corporate-hero relative min-h-[88vh] flex items-center py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CorporateBackground />
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <div className="section-label-corporate-dark mb-6 mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Building the Future with AI
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 text-balance drop-shadow-lg">
            AI that Works Across <span className="text-cyan-400">Security</span>, <span className="text-blue-400">Learning</span>, and <span className="text-amber-400">Innovation</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            From intelligent security to smart learning platforms — 7Trendz Data builds AI solutions that transform how
            you work, learn, and protect. Red teaming with AI, the FutureLearning platform, the Ask Sarah AI HR
            assistant, Web3 builds, and custom AI applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 h-12 px-8">
              <a href="#products">Explore Our Products <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <Button size="lg" onClick={() => setLeadFormOpen(true)} className="border-blue-300/40 text-blue-100 hover:bg-white/10 h-12 px-8 bg-white/5">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label-corporate mb-4 mx-auto w-fit">Our Products</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Five Ways We Build with AI</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Each product is its own sub-brand — designed, built, and run on AI.
            </p>
          </div>
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
        </div>
      </section>

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label-corporate mb-4 w-fit">About 7Trendz Data</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">A South African AI Company</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                7Trendz Data is a South African AI company building intelligent solutions across security, education,
                HR, Web3, and development. We develop apps using AI — and we use AI to secure them, teach with it,
                support people with it, and build the decentralized future with it.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Today that means the FutureLearning LMS, the Ask Sarah AI HR assistant, AI-powered red teaming,
                Web3 development, and custom AI applications — every one of them built with AI first.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Rocket, title: "5 Products", description: "Five AI product lines under one roof" },
                  { icon: Cpu, title: "AI-First", description: "AI woven through every layer we build" },
                  { icon: MapPin, title: "South African", description: "Proudly building from Johannesburg" },
                ].map((s) => (
                  <div key={s.title} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <s.icon className="h-6 w-6 text-blue-600 mb-3" />
                    <p className="font-semibold text-slate-900">{s.title}</p>
                    <p className="text-sm text-slate-500">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">What we build</h3>
              <ul className="space-y-3">
                {PRODUCTS.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <p.icon className="h-5 w-5 text-white/90" />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-blue-100">{p.tagline}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label-corporate mb-4 mx-auto w-fit">What Clients Say</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Trusted by Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <p className="text-slate-600 leading-relaxed mb-6">“{t.quote}”</p>
                <div>
                  <p className="font-semibold text-slate-900">{t.author}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-700 to-cyan-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to build with AI?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore our products or contact the team — we&apos;ll help you find the right AI solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100 shadow-lg h-12 px-8" onClick={() => setLeadFormOpen(true)}>
              <Link href="/contact">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
              <a href="mailto:info@7trendzdata.com">info@7trendzdata.com</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LeadForm open={leadFormOpen} onOpenChange={setLeadFormOpen} />
    </div>
  )
}
```

- [ ] **Step 2: Verify the homepage**

Run: `npm run build`
Expected: Build succeeds. On the dev server confirm the hero, the 3+2 product grid, the about section with the "What we build" panel, testimonials, and CTA banner all render. The two lead-form CTAs open the modal.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(homepage): multi-product AI platform homepage"
```

---

### Task 8: About Page Update

**Files:**
- Modify: `app/about/page.tsx`

**Interfaces:**
- Consumes: `PRODUCTS` from `@/lib/products`; `CorporateBackground`
- Produces: About page describing the multi-product AI company.

- [ ] **Step 1: Rewrite `app/about/page.tsx`**

Replace the entire file:

```tsx
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CorporateBackground } from "@/components/corporate-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Target, Eye, GraduationCap, UserCheck, ShieldAlert, Blocks, Code2 } from "lucide-react"
import { PRODUCTS } from "@/lib/products"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About 7Trendz Data — a South African AI company building intelligent products across security, learning, HR, Web3, and development, from Johannesburg.",
  alternates: { canonical: "https://7trendzdata.com/about" },
}

const PRODUCT_ICONS = [GraduationCap, UserCheck, ShieldAlert, Blocks, Code2]

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
        <CorporateBackground />
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
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/products/security/">Explore AI Security</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds. On the dev server the About page now describes the multi-product AI company with product cards linking to the new product pages.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat(about): multi-product AI company story"
```

---

### Task 9: Services → Redirect and Site-Wide Cleanup

**Files:**
- Modify: `app/services/page.tsx`
- Modify: `app/robots.ts`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `getProduct` (optional), nothing new
- Produces: `/services` links to `/` (or `#products`), robots/sitemap updated for new URLs.

- [ ] **Step 1: Replace `app/services/page.tsx` with a redirect**

Static export does not support `redirect()`. Replace the whole file with a minimal page that renders the home page content including the product grid anchor:

```tsx
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
```

- [ ] **Step 2: Add the services route to navigation in globals if any hardcoded links remain**

Search the repo for remaining `/services` links and update them to `/` or `/products/security/`:

```bash
rg -l "/services" --glob "!out/**" --glob "!node_modules/**" --glob "!dev.log"
```

Expected: `app/services/page.tsx`, `components/header.tsx` (already replaced in Task 3), `components/footer.tsx` (already replaced), `components/dashboard-sidebar.tsx` (line 85 — change `href: "/services"` to `href: "/"` and title "Services" to "Products"), and any stale README references (ignore README).

Modify the `mainNavItems` in `components/dashboard-sidebar.tsx`:

```ts
    { title: "Products", href: "/", icon: Briefcase },
```

- [ ] **Step 3: Update `app/robots.ts` and `app/sitemap.ts`**

Read the current files first. Update sitemap entries to include `/products/futurelearning/`, `/products/ask-sarah/`, `/products/security/`, `/products/web3/`, `/products/development/`, and change the description in robots/sitemap if it references "cybersecurity". If `sitemap.ts` imports `SITE_NAME` or metadata, those now reflect Task 4 values automatically.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: Build succeeds. `/services` renders the product grid; sidebar "Products" item links to `/`; sitemap XML includes the five product URLs.

- [ ] **Step 5: Commit**

```bash
git add app/services/page.tsx components/dashboard-sidebar.tsx app/robots.ts app/sitemap.ts
git commit -m "refactor(services): route to products grid and update sitemap"
```

---

### Task 10: Lead Form & Service with Product Field

**Files:**
- Modify: `lib/lead-service.ts`
- Modify: `components/lead-form.tsx`
- Modify: `firestore.rules` (add field note if needed — no rule change required; `leads` write rules already allow client writes)

**Interfaces:**
- Consumes: `PRODUCTS` from `@/lib/products`
- Produces: `Lead` type gains optional `product?: string`; `createLead` accepts `product`; `LeadForm` gains a `product` option and reads an optional default via prop.

- [ ] **Step 1: Add `product` field to `lib/lead-service.ts`**

Edit the `Lead` interface to add:

```ts
  product?: string
```

And `createLead`'s call already spreads `data`, so `product` flows through untouched (no change needed there).

- [ ] **Step 2: Rework `components/lead-form.tsx`**

Replace the `INTERESTS` constant and add a product selector. Change the component to accept an optional initial product and default the interest list to product-specific options:

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLead } from "@/lib/lead-service"
import { CheckCircle, Sparkles } from "lucide-react"
import { PRODUCTS } from "@/lib/products"

interface LeadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultProduct?: string
}

const INTERESTS = [
  "FutureLearning Demo",
  "Ask Sarah Demo",
  "AI Security Assessment",
  "Web3 Development",
  "AI App Development",
  "Other",
]

export function LeadForm({ open, onOpenChange, defaultProduct }: LeadFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: defaultProduct || "",
    interest: "Other",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    try {
      await createLead({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        product: form.product || undefined,
        interest: form.interest,
        message: form.message || undefined,
        source: defaultProduct ? `product_${defaultProduct}` : "hero_cta",
        status: "new",
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = (next: boolean) => {
    if (!next) {
      setForm({ name: "", email: "", phone: "", company: "", product: defaultProduct || "", interest: "Other", message: "" })
      setSubmitted(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
            <DialogTitle className="text-xl">Thank you, {form.name}!</DialogTitle>
            <p className="text-muted-foreground">We&apos;ve received your enquiry and will get back to you within 24 hours.</p>
            <Button onClick={() => handleClose(false)} className="mt-4">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Get Started with 7Trendz
              </DialogTitle>
              <DialogDescription>
                Tell us about your organisation and the AI solution you&apos;re interested in.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="lead-name">Full Name *</Label>
                <Input id="lead-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="lead-email">Work Email *</Label>
                <Input id="lead-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input id="lead-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27..." />
                </div>
                <div>
                  <Label htmlFor="lead-company">Company</Label>
                  <Input id="lead-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" />
                </div>
              </div>
              <div>
                <Label>Product</Label>
                <Select value={form.product || "none"} onValueChange={(v) => setForm({ ...form, product: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">General Enquiry</SelectItem>
                    {PRODUCTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Interest</Label>
                <Select value={form.interest} onValueChange={(v) => setForm({ ...form, interest: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INTERESTS.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lead-message">Additional Details</Label>
                <Textarea id="lead-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your environment, scope, or timeline..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting || !form.name || !form.email} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Wire product pages to open the lead form with a product preselected**

In each product page (Task 6), the CTA currently links to `/contact?product=<id>`. The contact page (Task 11) will read that query param. No change needed here — the product pages already link correctly.

On the homepage, keep `LeadForm` usage default (no `defaultProduct`).

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: Build succeeds. Open the homepage, click "Get in Touch", confirm the Product dropdown lists all five products + General Enquiry, and submitting writes a lead with the `product` field (check the admin Leads tab later).

- [ ] **Step 5: Commit**

```bash
git add lib/lead-service.ts components/lead-form.tsx
git commit -m "feat(leads): product field and selector on lead form"
```

---

### Task 11: Contact Page — Product Selector + Copy Update

**Files:**
- Modify: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `useSearchParams` from `next/navigation`, `PRODUCTS` from `@/lib/products`, `CorporateBackground`
- Produces: Contact page that reads `?product=<id>`, preselects it in a product dropdown, and has updated marketing copy.

- [ ] **Step 1: Update `app/contact/page.tsx`**

Wrap the page in a client component using `useSearchParams` (the file is already `"use client"`). Add:

- Import `PRODUCTS` and `CorporateBackground`.
- Replace `CyberBackground` usage with `CorporateBackground`.
- Add a `product` state initialised from the query param.
- Add a "Product" `Select` in the form (same options pattern as `LeadForm`).
- Include `product` in the submitted message via `submitContactMessage` (check `lib/contact-service.ts` to see the accepted shape; if it accepts a message object, prepend `\nProduct: ${product}` to the message body).
- Replace hero copy and the "Why Choose 7Trendz Data" card list with product-agnostic copy.

Exact replacement outline for the hero copy paragraph:

```tsx
          <p className="text-xl text-slate-300 leading-relaxed">
            Have questions about our AI products — security, learning, HR, Web3, or development? Tell us what you want
            to build and we&apos;ll get back to you within 24 hours.
          </p>
```

The "Why Choose 7Trendz Data" card bullet list:

```tsx
                  {[
                    { icon: Sparkles, text: "Five AI product lines under one roof" },
                    { icon: UserCheck, text: "FutureLearning & Ask Sarah for learning and HR" },
                    { icon: ShieldAlert, text: "AI red teaming that finds the gaps" },
                    { icon: CheckCircle, text: "AI development & Web3 builds that ship" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      <item.icon className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-700">{item.text}</p>
                    </div>
                  ))}
```

Remove the "Pentesting Report Pricing" section at the bottom OR replace it with a "Products" teaser grid that links each product page:

```tsx
      <section id="products" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our AI Products</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Explore what we build with AI.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {PRODUCTS.map((p) => (
              <Button key={p.id} asChild variant="outline">
                <Link href={p.url}><p.icon className="mr-2 h-4 w-4" />{p.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
```

Update the FAQ answers to be product-agnostic (replace pentesting-only answers with two AI-company answers and two general ones, e.g. pricing, platforms served, response time).

- [ ] **Step 2: Verify**

Read `lib/contact-service.ts` first to confirm the message shape. Then:

Run: `npm run build`
Expected: Build succeeds. Visit `http://localhost:3000/contact?product=futurelearning` — the product dropdown should show FutureLearning selected (visible after choosing it in the Select; if it can't auto-select, at minimum ensure the dropdown present). All styling uses the corporate palette.

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat(contact): product selector and platform copy"
```

---

### Task 12: Admin Portal — Product Filters & Sidebar

**Files:**
- Modify: `app/admin/page.tsx`
- Modify: `components/dashboard-sidebar.tsx` (already touched in Task 9 for the Products link)
- Modify: `app/client/page.tsx` (if product-scoped filtering is affordable — see steps)

**Interfaces:**
- Consumes: `PRODUCTS` from `@/lib/products`, `Lead.product` from `lib/lead-service.ts`
- Produces: Admin overview stat card counts; leads tab with a product filter badge row; revenue record form lets you filter services by product.

- [ ] **Step 1: Add product filter to the Leads tab in `app/admin/page.tsx`**

In `LeadsTab`, add a `productFilter` state:

```ts
  const [productFilter, setProductFilter] = useState<string>("all")
```

and filter logic:

```ts
  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false
    if (productFilter !== "all" && (l.product || "security") !== productFilter) return false
    if (search) {
      const s = search.toLowerCase()
      if (!l.name?.toLowerCase().includes(s) && !l.email?.toLowerCase().includes(s) && !l.company?.toLowerCase().includes(s)) return false
    }
    return true
  })
```

Note the `(l.product || "security")` fallback — legacy leads have no `product` field, so they count as security.

Add a product badge row under the status badges:

```tsx
        <div className="flex gap-2 flex-wrap">
          {["all", ...PRODUCTS.map((p) => p.id)].map((pid) => (
            <Badge
              key={pid}
              variant={productFilter === pid ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setProductFilter(pid)}
            >
              {pid === "all" ? "All Products" : (PRODUCTS.find((p) => p.id === pid)?.name || pid)}
            </Badge>
          ))}
        </div>
```

Also display the product on each lead card next to the interest line:

```tsx
                  <p className="text-sm mt-1">
                    <span className="font-medium">Interest:</span> {lead.interest}
                    {lead.product && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {PRODUCTS.find((p) => p.id === lead.product)?.name || lead.product}
                      </span>
                    )}
                  </p>
```

Import `PRODUCTS` at the top of `app/admin/page.tsx`:

```ts
import { PRODUCTS } from "@/lib/products"
```

- [ ] **Step 2: Product filter on revenue**

In `app/admin/page.tsx`, restrict the revenue "Service / Product" dropdown by a selected product. Add state:

```ts
  const [revenueProduct, setRevenueProduct] = useState("all")
```

Add a product filter dropdown above the "Record Sale" card, and change `handleAddRevenue` + the service Select to use a filtered list:

```tsx
              <div className="flex items-center gap-3">
                <Label>Filter by Product</Label>
                <Select value={revenueProduct} onValueChange={setRevenueProduct}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {PRODUCTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
```

In the Service/Product dropdown, filter options: when `revenueProduct !== "all"`, only show services whose `category`/name matches the product. Because `SERVICES_PRODUCTS` currently only contains pentest tiers, ALSO extend `lib/catalog.ts`:

Add to the end of `lib/catalog.ts`:

```ts
export const ALL_SERVICES = [
  { id: "lms-enterprise", name: "FutureLearning — Enterprise LMS", category: "futurelearning" },
  { id: "hr-ask-sarah", name: "Ask Sarah — AI HR Assistant", category: "ask-sarah" },
  { id: "web3-build", name: "AI Web3 Development", category: "web3" },
  { id: "dev-custom", name: "Custom AI Application", category: "development" },
  ...SERVICES_PRODUCTS.map((s) => ({ ...s, category: "security" })),
]
```

Then in `app/admin/page.tsx` import `ALL_SERVICES`, use it everywhere `SERVICES_PRODUCTS` was used, and filter:

```ts
  const revenueServices = revenueProduct === "all"
    ? ALL_SERVICES
    : ALL_SERVICES.filter((s) => s.category === revenueProduct)
```

The `handleAddRevenue` lookup should search `ALL_SERVICES` instead of `SERVICES_PRODUCTS`.

- [ ] **Step 3: Update `components/admin/revenue-table.tsx` and `components/admin/client-table.tsx`**

Read these files. Add a product column/field display where trivial (e.g. show `r.category` as a badge) so admins can see which product a revenue entry belongs to. Do not rework layout beyond adding the badge.

- [ ] **Step 4: Client portal product awareness (`app/client/page.tsx`)**

Read `app/client/page.tsx`. If clients' revenue/orders include a `category`, render a product badge on each order card. Otherwise, add a simple "Product" label derived from the revenue entry `category`. Keep changes minimal and non-breaking — the client portal is lower priority than the admin portal.

- [ ] **Step 5: Verify admin portal**

Run: `npm run build`
Expected: Build succeeds. Open `/admin` (logged in) — the Leads tab has an All Products + five product filter badges; legacy security leads appear under "All Products" and "security"; revenue service dropdown filters by product; `ALL_SERVICES` lists all five product categories.

- [ ] **Step 6: Commit**

```bash
git add lib/catalog.ts app/admin/page.tsx components/admin/revenue-table.tsx components/admin/client-table.tsx app/client/page.tsx
git commit -m "feat(admin): per-product filtering for leads and revenue"
```

---

### Task 13: Final Build Verification & README Update

**Files:**
- Modify: `README.md`
- Verify: full build + all routes

**Interfaces:**
- Consumes: everything above

- [ ] **Step 1: Update `README.md`**

Read it first. Replace cybersec-only positioning with the multi-product AI company summary. Update the product list, stack, and deployment notes. Remove any stale "Dr. Sarah Johnson" or old AI/data-science consulting copy.

- [ ] **Step 2: Full static export verification**

```bash
npm run build
```

Expected: Build succeeds. Then verify every public route is present in `out/`:

```bash
Get-ChildItem -Path out -Directory | Select-Object Name
Get-ChildItem -Path out/products -Recurse -File | Select-Object FullName
```

Expected: `out/` contains `index.html`, `about/`, `contact/`, `blog/`, `login/`, `register/`, and `products/` with all five product subdirectories, each with an `index.html`.

- [ ] **Step 3: Interactive smoke test**

Restart the dev server if needed (`Start-Process -FilePath "cmd" -ArgumentList "/c", "cd /d", $PWD.Path, "&& npm run dev > dev.log 2>&1" -WindowStyle Minimized`), then check these URLs render without console errors:
- `/` — hero + product grid + testimonials
- `/products/futurelearning/` — external link band to 7trendzlearn.co.za
- `/products/ask-sarah/`
- `/products/security/`
- `/products/web3/`
- `/products/development/`
- `/services` — product grid page
- `/about` — multi-product story
- `/contact` — product selector + updated copy
- `/blog` — unaffected
- `/admin` and `/client` — unaffected auth pages, product filters present

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README for multi-product AI platform"
```

---

## Self-Review Results

Checked against the spec: every section 1–8 has a corresponding task. No TBD/TODO placeholders. Type names (`Product`, `ProductFeature`, `Lead.product`, `ALL_SERVICES`, `getProduct`) are consistent across tasks. The `steps[].icon` templating bug in Task 2 is called out explicitly. Colors/URLs match the approved design sections.