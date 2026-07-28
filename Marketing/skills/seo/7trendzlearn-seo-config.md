# SEO Configuration — 7trendzlearn.co.za (Future Learning)

> **Product:** AI-Powered Smart Education Platform (LMS + AI Tutoring)
> **Parent:** 7TrendzData (Johannesburg, SA)
> **Date:** 2026-07-08

---

## 1. Critical Technical Fixes (Do First)

### 1.1 Enable SSR / Prerendering
The site is a **React SPA** (built with Lovable). Search engines cannot render JavaScript reliably. This is the #1 SEO blocker.

**Solution:** Use Prerender.io or enable SSR via Next.js/Nuxt. For Lovable/Vite SPA:
- Set up `https://prerender.io` middleware on your server
- Serve pre-rendered HTML to crawlers (Googlebot, Bingbot, etc.)
- Or migrate to Next.js for native SSR

### 1.2 robots.txt
Create at `https://7trendzlearn.co.za/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://7trendzlearn.co.za/sitemap.xml
```

### 1.3 XML Sitemap
Create at `https://7trendzlearn.co.za/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://7trendzlearn.co.za/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
Add course/landing page URLs as they are created.

### 1.4 Add Canonical URL
In `<head>`:
```html
<link rel="canonical" href="https://7trendzlearn.co.za/" />
```

### 1.5 Add Language/Robots Meta
```html
<meta name="robots" content="index, follow" />
<html lang="en-ZA">
```

### 1.6 Fix OG & Twitter Tags
```html
<meta property="og:image" content="https://7trendzlearn.co.za/og-image.jpg" />
<meta name="twitter:site" content="@7TrendzData" />
<meta name="twitter:creator" content="@7TrendzData" />
```

### 1.7 Core Web Vitals
Run: `https://pagespeed.web.dev` — target:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

Common SPA fixes: lazy-load below-fold, preload fonts, code-split routes, compress images.

---

## 2. Schema.org Structured Data (JSON-LD)

Add to `<head>` on homepage:

### 2.1 Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "7TrendzData",
  "url": "https://7trendzdata.com",
  "logo": "https://7trendzlearn.co.za/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/7trendz-youth-developers"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Johannesburg",
    "addressRegion": "Gauteng",
    "addressCountry": "ZA"
  }
}
```

### 2.2 SoftwareApplication Schema (for the platform)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Future Learning",
  "description": "AI-powered Learning Management System that automatically builds courses and provides 24/7 AI tutoring.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ZAR"
  },
  "author": {
    "@type": "Organization",
    "name": "7TrendzData"
  }
}
```

### 2.3 Course Schema (add on each course page)
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Course Name",
  "description": "Course description",
  "provider": {
    "@type": "Organization",
    "name": "7TrendzData",
    "sameAs": "https://7trendzdata.com"
  },
  "educationalCredentialAwarded": "Certificate of Completion",
  "teaches": "Subject area"
}
```

---

## 3. On-Page SEO Recommendations

### 3.1 Homepage Title & Meta
- **Title:** Future Learning — AI-Powered LMS & 24/7 Tutor | 7TrendzData
- **Description:** Transform education with Future Learning — an intelligent AI LMS that auto-builds courses, personalizes learning paths, and tutors students 24/7. Built for South African schools.
- **H1:** Future Learning — AI That Teaches Back

### 3.2 URL Structure (for course/feature pages)
```
/ → Homepage
/courses → Course catalog
/courses/{course-name} → Individual course
/features → Features page
/pricing → Pricing
/blog → Blog
/blog/{post-slug} → Blog post
/about → About
/contact → Contact
```

### 3.3 Internal Linking
- Add breadcrumb navigation: Home > Courses > Course Name
- Link between related courses
- Add a blog → link blog posts to relevant course pages

---

## 4. Content & Keyword Strategy

### 4.1 Primary Keywords (Target)
| Keyword | Search Intent | Target Page |
|---------|--------------|-------------|
| AI LMS South Africa | Commercial | Homepage |
| AI tutoring platform SA | Commercial | Features |
| online learning platform South Africa | Commercial | Courses |
| AI education software | Commercial | Homepage |
| best LMS for schools SA | Commercial | Features |
| AI tutor for students | Transactional | Courses |
| smart learning platform | Informational | Homepage |
| AI course builder | Commercial | Features |

### 4.2 Long-Tail Keywords
| Keyword | Monthly Volume (est.) |
|---------|----------------------|
| AI-powered learning management system South Africa | Low |
| personalised AI tutor for matric students | Low |
| South African online school platform with AI | Low |
| CAPS-aligned AI tutoring platform | Low |
| affordable LMS for small schools SA | Low |

### 4.3 Content Plan (First 8 Weeks)
| Week | Content Type | Topic | Target Keyword |
|------|-------------|-------|---------------|
| 1 | Blog | "How AI Is Transforming South African Classrooms in 2026" | AI education South Africa |
| 2 | Blog | "LMS vs Traditional Classroom: Which Works Better for SA Schools?" | LMS South Africa |
| 3 | Blog | "How AI Tutoring Helps Matric Students Ace Their Exams" | AI tutor matric |
| 4 | Landing Page | Features page with structured data | AI LMS features |
| 5 | Blog | "The Cost of Education Technology in South Africa (2026 Guide)" | education tech SA |
| 6 | Case Study | "How [School] Improved Pass Rates by X% Using Future Learning" | AI in schools |
| 7 | Blog | "CAPS Curriculum and AI: The Perfect Match for SA Education" | CAPS AI platform |
| 8 | Landing Page | Pricing page | affordable LMS South Africa |

---

## 5. GEO / AI Search Optimization (ChatGPT, Claude, Perplexity)

### 5.1 llms.txt
Create `https://7trendzlearn.co.za/llms.txt`:
```
# Future Learning — AI-Powered Education Platform

## About
Future Learning is an AI-powered Learning Management System (LMS) that automatically builds courses and provides 24/7 AI tutoring for students. Built by 7TrendzData in Johannesburg, South Africa.

## Key Features
- Auto course building with AI
- 24/7 AI tutoring
- Personalized learning paths
- Student progress tracking
- CAPS curriculum alignment
- Multi-language support

## Docs
- Platform: https://7trendzlearn.co.za
- Company: https://7trendzdata.com
```

### 5.2 Citation Signals
- Reference real statistics in content (Matric pass rates, SA education stats)
- Link to authoritative sources (DBE, StatsSA, UNESCO)
- Cite specific research and data points

### 5.3 Entity Signals
- Create Wikipedia-style entity descriptions
- Build topical authority clusters (hub content on "AI in SA education" linked to specific course pages)
- Use Information Gain — focus on novel insights, unique SA perspective

---

## 6. Off-Page SEO / Backlinks

### 6.1 Immediate Opportunities
| Source | Action |
|--------|--------|
| 7Trendz Youth Developers NPO | Cross-link from NPO website |
| RLabs Joburg | Partner blog post / backlink |
| LinkedIn articles | Publish thought leadership → link to platform |
| Local education blogs | Guest posts about AI in SA education |
| GitHub | Open-source education tools → link in README |

### 6.2 Directory Submissions
- SA Web Directories (business)
- EdTech directories (Edshelf, Common Sense EdTech)
- South African startup directories

---

## 7. Monitoring & Tools

| Tool | Purpose | Setup |
|------|---------|-------|
| Google Search Console | Indexing, search performance, Core Web Vitals | Verify domain ownership |
| Google Analytics 4 | User behavior, traffic sources | Add GA4 tag |
| Ahrefs Webmaster Tools | Backlinks, keyword rankings | Already installed (free tier) |
| PageSpeed Insights | Core Web Vitals | Monthly check |
| SE Ranking / Wincher | Keyword rank tracking | Optional paid tool |

---

## 8. Action Priority Matrix

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| P0 | Enable SSR/prerendering (SPA fix) | High | Critical |
| P0 | Add robots.txt + sitemap.xml | Low | High |
| P0 | Add canonical URL | Low | High |
| P0 | Add Schema.org JSON-LD | Low | High |
| P1 | Fix OG image + Twitter tags | Low | Medium |
| P1 | Set up GSC + GA4 | Medium | High |
| P1 | Create blog + publish 4 articles | High | High |
| P1 | Add llms.txt for AI crawlers | Low | Medium |
| P2 | Course/feature landing pages | Medium | High |
| P2 | Backlink outreach | High | Medium |
| P2 | Core Web Vitals optimization | Medium | Medium |
| P3 | Full keyword/content calendar | Ongoing | High |

---

**Next immediate step:** Deploy robots.txt, sitemap.xml, canonical URL, and Schema.org markup. These take 30 minutes and give the biggest quick wins.
