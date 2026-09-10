# 7Trendz Data — AI Platform Redesign Spec

## Overview

Transform 7Trendz Data from a cybersecurity-only website into a multi-product AI platform covering five verticals: Security, Learning, Web3, Development, and HR. Each product gets its own sub-brand identity under the 7Trendz umbrella.

**Company:** 7Trendz Data  
**Tagline:** "Building the future with AI"  
**Approach:** Single-page product showcase (Approach A) — dedicated product pages under `/products/*`

---

## 1. Brand & Navigation

### Company Identity
- **Name:** 7Trendz Data (unchanged)
- **Tagline:** "Building the future with AI"
- **Domain:** 7trendzdata.com
- **Visual:** Corporate tech — deep blues, geometric patterns, circuit-board motifs

### Navigation Bar
- Logo (existing 7trendz-logo) on left
- **Products** (dropdown) | **About** | **Blog** | **Contact** on right
- Products dropdown: icon + product name + tagline for each

### Sub-Brands

| Product | URL | Tagline | Icon (lucide) |
|---------|-----|---------|---------------|
| FutureLearning | `/products/futurelearning/` | AI-Powered Learning Platform | `GraduationCap` |
| Ask Sarah | `/products/ask-sarah/` | Your AI HR Assistant | `UserCheck` |
| AI Security | `/products/security/` | Red Teaming with AI | `ShieldAlert` |
| AI Web3 Dev | `/products/web3/` | Decentralized Apps Built with AI | `Blocks` |
| AI Development | `/products/development/` | Custom AI-Powered Apps | `Code2` |

### Footer
- Updated with all 5 product links
- Dark `bg-slate-900` base with corporate blue accent colors
- Same contact info, quick links structure

---

## 2. Homepage Redesign

### Hero Section
- Full-width dark gradient (deep navy → dark blue)
- Animated circuit-board / geometric pattern background
- Headline: "Building the Future with AI"
- Subheadline: "From intelligent security to smart learning platforms — we build AI solutions that transform how you work, learn, and protect."
- CTAs: "Explore Our Products" (primary) + "Get in Touch" (secondary)

### Products Showcase Section
- Grid of 5 product cards (3 top row, 2 bottom row centered)
- Each card: product icon, name, 1-line tagline, "Learn More →" link
- Hover effect: subtle lift + glow

### About Snippet Section
- Brief company intro text
- Stats row: "5 Products" | "AI-First Approach" | "South African Innovation"

### Testimonials Section
- 2-3 testimonial cards (placeholder initially)

### CTA Banner
- Full-width dark blue: "Ready to build with AI?" + "Contact Us" button

---

## 3. Product Pages

### Common Template Structure
1. **Hero** — Product icon + name + tagline on dark gradient
2. **Problem/Solution** — What problem it solves, how AI powers the solution
3. **Features Grid** — 3-4 key features with icons
4. **How It Works** — 3-step visual flow
5. **CTA** — "Get Started" or "Contact Us" button

### Product Content

#### FutureLearning (`/products/futurelearning/`)
- **Hero:** "AI-Powered Education at 7trendzlearn.co.za"
- **Features:** Adaptive learning paths, AI tutoring, Progress analytics, Certificate generation
- **CTA:** "Visit FutureLearning" → links to 7trendzlearn.co.za

#### Ask Sarah (`/products/ask-sarah/`)
- **Hero:** "Meet Sarah — Your AI HR Assistant"
- **Features:** Automated onboarding, Policy Q&A, Leave management, Employee sentiment analysis
- **CTA:** "Try Ask Sarah" (contact form for demo)

#### AI Security (`/products/security/`)
- **Hero:** "AI-Powered Red Teaming"
- **Features:** Automated vulnerability scanning, AI-driven exploit chains, Continuous monitoring, Detailed reporting
- **CTA:** "Request Assessment" (existing lead form adapted)

#### AI Web3 Dev (`/products/web3/`)
- **Hero:** "Building Decentralized Futures with AI"
- **Features:** Smart contract auditing, DApp development, Token engineering, DAO governance tools
- **CTA:** "Start Your Project"

#### AI Development (`/products/development/`)
- **Hero:** "Custom AI Applications Built for You"
- **Features:** AI integration consulting, Custom model training, API development, Full-stack AI apps
- **CTA:** "Discuss Your Project"

---

## 4. Admin Portal Rework

### Dashboard Sidebar — New Structure
- **Overview** — aggregated metrics across all products
- **FutureLearning** — LMS-specific leads/orders
- **Ask Sarah** — HR leads/orders
- **AI Security** — pentesting leads/orders (existing data preserved)
- **AI Web3** — Web3 dev leads/orders
- **AI Dev** — Development leads/orders
- **Blog** — stays as-is
- **Settings** — stays as-is

### Leads Table
- New "Product" column for filtering by product
- Existing cybersec leads keep their data (retroactive product tag = "security")

### Client Portal
- Each client sees only their product's orders/reports
- Product selector at top if client has multiple products

### Revenue Dashboard
- Filterable by product
- Summary cards show per-product revenue

### Catalog Update (`lib/catalog.ts`)
- Add `PRODUCTS` constant: `{ id, name, tagline, icon, color, url }` for all 5
- Update `SERVICES_PRODUCTS` to reference product IDs
- Add product-specific lead form variants

---

## 5. Theme & Styling Changes

### Tailwind Config Updates
- Replace `--cyber-cyan` with `--trendz-blue` (deep blue: 215 80% 50%)
- Replace `--cyber-red` with `--trendz-accent` (vibrant teal: 170 70% 50%)
- Replace `--cyber-purple` with `--trendz-gold` (gold accent: 45 90% 55%)
- Primary color: deep blue range instead of cyan

### Background Animations
- Replace `CyberBackground` with `CorporateBackground` — geometric grid lines, subtle particle connections
- Replace `HeroVideoBackground` with static gradient + animated geometric pattern
- Keep `AnimatedBackground` utility but restyle for corporate look

### Global CSS
- Update CSS custom properties for new color palette
- Dark mode: deep navy backgrounds instead of pure black

---

## 6. File Changes Summary

### New Files
- `app/products/futurelearning/page.tsx`
- `app/products/ask-sarah/page.tsx`
- `app/products/security/page.tsx`
- `app/products/web3/page.tsx`
- `app/products/development/page.tsx`
- `components/product-card.tsx` (reusable product showcase card)
- `components/product-hero.tsx` (reusable product hero)
- `components/features-grid.tsx` (reusable features section)
- `components/how-it-works.tsx` (reusable steps section)
- `components/corporate-background.tsx` (new background animation)
- `components/testimonial-card.tsx`

### Modified Files
- `app/layout.tsx` — update metadata, title, description
- `app/page.tsx` — complete homepage rewrite
- `app/about/page.tsx` — update to reflect multi-product company
- `app/services/page.tsx` → redirect to homepage product grid
- `app/contact/page.tsx` — update with product selector in form
- `components/header.tsx` — new nav with Products dropdown
- `components/footer.tsx` — update links, branding
- `components/lead-form.tsx` — add product selector
- `lib/catalog.ts` — add PRODUCTS constant, update services
- `tailwind.config.ts` — new color palette
- `app/globals.css` — new CSS variables
- `components/dashboard-sidebar.tsx` — add product tabs
- `components/admin/revenue-table.tsx` — add product filter
- `components/admin/client-table.tsx` — add product column

### Files to Potentially Remove
- `components/cyber-background.tsx` (replaced by corporate-background)
- `components/hero-video-background.tsx` (replaced by static gradient)
- `app/services/page.tsx` (content moves to product pages)

---

## 7. Technical Constraints

- **Static export** (`output: "export"`) — all pages must work without server-side rendering
- **No API routes** — all backend via Firebase client SDK
- **Firebase backend** — Firestore `leads` collection needs `product` field
- **Existing data** — cybersec leads get retroactive `product: "security"` tag
- **Build** — TypeScript/ESLint errors ignored at build time (existing config)

---

## 8. Migration Notes

- All existing `/services` content moves to `/products/security/`
- Lead form submissions tagged with product ID
- Existing client portal data preserved, tagged with "security" product
- Blog posts unaffected
- Admin email configs unchanged
