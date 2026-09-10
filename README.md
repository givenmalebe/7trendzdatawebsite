# 7Trendz Data — Multi-Product AI Company Website

A static marketing and admin website for 7Trendz Data, a South African AI company building intelligent products across security, learning, HR, Web3, and development. Built with Next.js (App Router), TypeScript, and Tailwind CSS, statically exported and deployed to Firebase Hosting.

Tagline: **Building the Future with AI**.

## 🚀 Products

Five AI product lines, each with its own landing page:

| Product | Route | External |
| --- | --- | --- |
| FutureLearning — AI learning management | `/products/futurelearning/` | [7trendzlearn.co.za](https://7trendzlearn.co.za) |
| Ask Sarah — AI HR assistant | `/products/ask-sarah/` | — |
| AI Security — red teaming & pentesting | `/products/security/` | — |
| AI Web3 Dev — smart contracts, dApps, DAOs | `/products/web3/` | — |
| AI Development — custom AI applications | `/products/development/` | — |

All product data lives in `lib/products.ts` (`PRODUCTS`, `getProduct`), which is consumed by the header/footer, homepage, product pages, lead form, and admin portal.

## 🛠 Tech Stack

**Frontend**
- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

**Backend (Firebase client SDK only — no API routes)**
- Cloud Firestore — leads, contact messages, blog posts, clients, revenue, reports, user profiles
- Firebase Auth — email/password for admin & client portals
- Cloud Storage — report PDFs

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx            # Global metadata + JSON-LD structured data
│   ├── page.tsx              # Homepage (hero, product grid, testimonials, CTA)
│   ├── about/page.tsx        # Multi-product AI company story
│   ├── services/page.tsx     # Product grid (legacy /services route)
│   ├── contact/page.tsx      # Contact form with product selector (?product=<id>)
│   ├── products/*/page.tsx   # Five product landing pages
│   ├── blog/                 # Blog listing + AI-generated content
│   ├── admin/page.tsx        # Admin dashboard (leads, revenue, reports, blog)
│   ├── client/               # Client portal (reports, orders, updates)
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── header.tsx / footer.tsx
│   ├── product-hero.tsx / product-card.tsx / features-grid.tsx / how-it-works.tsx
│   ├── lead-form.tsx         # Product-aware lead capture dialog
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── products.ts           # Single source of truth for the five products
    ├── lead-service.ts       # Firestore leads (includes product field)
    ├── catalog.ts            # Pentest tiers, service/product catalog, report stages
    └── firebase.ts           # Firebase client init
```

## 🔧 Setup

1. Install dependencies: `npm install`
2. Add Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Run the dev server: `npm run dev` → http://localhost:3000

> Note: on this machine PowerShell blocks `npm.ps1`; use `cmd /c "npm run build"` and `cmd /c "npx tsc --noEmit"`.

## 🚀 Build & Deploy

- Build + static export: `npm run build` (writes to `out/` via `output: "export"`)
- Deploy to Firebase Hosting (project `web7trendzdata`): `firebase deploy --only hosting`
- After deploy, re-run the Firestore/Storage rules deploy if they changed.

## 🔒 Notes

- This is a **static export** — no server endpoints, no `redirect()`; legacy `/services` is a product grid page.
- Lead generation: `LeadForm` and `/contact` capture an optional `product` (product id), which appears in the admin Leads tab with per-product filter badges. Legacy leads (no `product` field) default to `security`.
- Revenue entries are tagged with a product `category` via `ALL_SERVICES` in `lib/catalog.ts`.
- `robots.ts` disallows `/admin`, `/client`, `/login`, `/register`, `/create-admin`, `/forgot-password`, `/blog-dashboard`, `/messages`.

## 📞 Contact

**7Trendz Data**
- Website: https://7trendzdata.com
- Email: info@7trendzdata.com
- Phone: +27 736 289 188
- Address: 113 2nd Avenue Wynberg, Johannesburg, South Africa

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide](https://lucide.dev/)
- [Firebase](https://firebase.google.com/)