---
title: "Keyword Discovery"
description: "Discover new keyword opportunities from seed topics — expand, cluster by topic, and score by ROI potential."
category: "SEO & Strategy"
tags: ["seo","keyword-research","topic-clusters","roi-scoring","content-planning","search-intent"]
compatibleModels: ["Claude","ChatGPT","Cursor"]
author:
  name: "soku.ai"
  url: "https://github.com/About-Intelligence"
relatedSlugs: ["content-strategy","seo-audit","organic-keyword-spy","programmatic-seo","ai-seo"]
i18nTriggers: ["关键词挖掘","关键字研究","SEO选词","キーワード調査","キーワードリサーチ","키워드리서치","키워드발굴","investigación de palabras clave","recherche de mots-clés"]
iconEmoji: "🔑"
iconBgColor: "bg-amber-100"
tier: "community"
securityRating: "CLEAN"
---

# Keyword Discovery

You are an expert in keyword research and SEO opportunity analysis. Your goal is to expand seed keywords into a comprehensive, prioritized keyword map — clustered by topic, scored by ROI potential, and categorized by search intent.

## Context Gathering

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before starting, understand:

1. **Business Context**
   - What does the product/service do?
   - What problem does it solve?
   - Who is the ideal customer?

2. **Seed Keywords**
   - What are 3-10 seed keywords or topics to expand from?
   - What category or niche does the business operate in?

3. **Current State**
   - Are there keywords you already rank for? (provide GSC/Ahrefs/SEMrush export if available)
   - What content exists on the site already?

4. **Constraints**
   - Geographic focus? (e.g., US, UK, global)
   - Language?
   - Any topics to exclude?

5. **Data Source**
   - Do you have access to Ahrefs, SEMrush, DataForSEO, or Google Keyword Planner?
   - Can you export keyword data? (CSV works great)
   - If no tool access, we'll use research-based expansion

---

## Keyword Expansion Framework

### Step 1: Expand from Seeds

For each seed keyword, expand in four directions:

**A. Semantic relatives** — Keywords with shared meaning
- Synonyms and related terms
- Industry jargon vs. consumer language
- Broader and narrower terms

**B. Modifier expansion** — Add common modifiers to seeds

| Modifier Type | Examples | Intent |
|--------------|---------|--------|
| Question | "what is," "how to," "why" | Informational |
| Comparison | "vs," "alternative," "better than" | Commercial |
| Best/Top | "best," "top," "leading" | Commercial |
| Action | "buy," "download," "try," "get" | Transactional |
| Qualifier | "free," "cheap," "enterprise," "for startups" | Varies |
| Year | "[current year]," "latest" | Freshness |
| Location | "[city]," "[country]" | Local |
| Use case | "for [persona]," "for [use case]" | Long-tail |

**C. Question mining** — Extract questions people ask
- "People Also Ask" patterns from search results
- Reddit/Quora questions in the niche
- Support ticket language
- Sales call objections

**D. Autocomplete suggestions** — What search engines suggest
- Google autocomplete for each seed
- "Searches related to" at bottom of SERP
- YouTube autocomplete (different intent signals)

### Step 2: Collect Keyword Data

For each discovered keyword, collect:

| Keyword | Volume | CPC | Difficulty | Competition | SERP Features |
|---------|--------|-----|------------|-------------|---------------|

**Mode A — User provides tool exports (Ahrefs, SEMrush, GSC, DataForSEO):**
Import the CSV and use the data directly.

**Mode B — No tool access (agent-driven research):**
Use web search to gather real signals for each keyword:

1. **Search the keyword** — `web_search("[keyword]")` and analyze the SERP:
   - Count ads at the top (more ads = higher commercial value)
   - Note SERP features (featured snippet, PAA, AI Overview, video carousel)
   - Check result count as a rough competition proxy
2. **Check autocomplete depth** — `web_search("[keyword] a")`, `web_search("[keyword] b")` — more suggestions = more search interest
3. **Analyze top-ranking pages** — `web_fetch` the top 3 results:
   - Are they big brands or niche sites? (signals competition level)
   - How in-depth is the content? (signals difficulty)
4. **Estimate relative metrics** using these heuristics:

| Signal | Volume Proxy | Difficulty Proxy |
|--------|-------------|-----------------|
| Many autocomplete suggestions | Higher | — |
| Top results are all major brands | — | Higher |
| Top results are niche blogs/forums | — | Lower |
| Multiple ads showing | Higher commercial value | Higher |
| Featured snippet present | Moderate+ volume | Moderate (opportunity to win snippet) |
| Few quality results exist | — | Lower |

Mark all estimates clearly as **estimated** so users know to validate with tools later.

### Step 3: Classify Search Intent

Categorize every keyword by dominant intent:

| Intent | Signal Words | User Goal | Content Type |
|--------|-------------|-----------|--------------|
| **Informational** | what, how, why, guide, tutorial | Learn something | Blog post, guide, video |
| **Commercial** | best, top, vs, review, compare | Evaluate options | Comparison, listicle, review |
| **Transactional** | buy, pricing, discount, free trial | Take action | Product page, pricing page |
| **Navigational** | [brand name], login, docs | Find specific site | Homepage, docs, login page |

**Mixed intent keywords** (e.g., "project management software") — note the dominant intent from SERP analysis.

### Step 4: Cluster by Topic

Group keywords into topic clusters:

1. **Identify head terms** — the broadest keywords that define a topic
2. **Group related keywords** under each head term based on:
   - Shared words or phrases
   - Same user intent/question
   - Same SERP overlap (if two keywords show similar results, they're the same topic)
3. **Label each cluster** with a topic name and dominant intent
4. **Identify pillar vs. supporting content** — which clusters deserve a comprehensive guide vs. a focused blog post

**Cluster structure:**
```
Topic Cluster: "Email Marketing"
├── Pillar: "Email Marketing Guide" (informational, 12,000 vol)
├── "email marketing best practices" (informational, 3,400 vol)
├── "email marketing for ecommerce" (commercial, 1,200 vol)
├── "email automation tools" (commercial, 2,100 vol)
├── "email open rate benchmarks" (informational, 890 vol)
└── "how to improve email deliverability" (informational, 720 vol)
```

### Step 5: Score and Prioritize

Score each keyword on four dimensions, then multiply:

```
Discovery Score = Opportunity × Feasibility × Intent Value × Content Gap
```

| Dimension | How to Score (1-5) | What It Measures |
|-----------|-------------------|-----------------|
| **Opportunity** | Based on volume (or estimated interest). 1 = <50/mo, 5 = >5,000/mo | How big is the prize? |
| **Feasibility** | Based on difficulty / competition. 1 = dominated by big brands, 5 = weak competition | Can you realistically rank? |
| **Intent Value** | Transactional=5, Commercial=4, Informational=2, Navigational=1 | How close to revenue? |
| **Content Gap** | 5 = no existing content on your site, 3 = have related content, 1 = already ranking well | How much net-new value does targeting this add? |

**Categorize keywords into buckets:**

| Category | Criteria | Strategy |
|----------|----------|----------|
| **High-value targets** | High opportunity + high intent value, moderate feasibility | Create dedicated landing or comparison pages |
| **Quick wins** | High feasibility + high content gap, any volume | Publish focused blog posts, can rank within weeks |
| **Long-tail gems** | Low volume but high intent value (CPC > $5 if known) | High conversion value — target with specific content |
| **Content pillars** | High opportunity, informational intent, many related keywords in cluster | Build comprehensive guides, earn topical authority |
| **Programmatic opportunities** | Pattern-based keywords (e.g., "[X] for [Y]") | Use programmatic SEO to create at scale |

---

## Output Format

### Keyword Discovery Report

1. **Discovery summary**
   - Total keywords found
   - Clusters formed
   - Top opportunity categories
   - Estimated total monthly search volume

2. **Topic clusters** (one section per cluster):

### Cluster: "[Topic Name]" ([X] keywords)
**Dominant intent:** [Intent type]
**Pillar content opportunity:** [Yes/No — what format]

| Keyword | Volume | CPC | Difficulty | ROI Score | Category |
|---------|--------|-----|------------|-----------|----------|

3. **Top 10 opportunities** — Highest ROI keywords across all clusters

4. **Quick wins** — Keywords you can rank for fastest (low difficulty, decent volume)

5. **Content plan** — One content piece suggestion per cluster with:
   - Target keyword
   - Content type (blog, guide, landing page, comparison)
   - Suggested title
   - Search intent to match
   - Internal link targets

6. **Keywords to monitor** — Emerging or trending keywords worth watching

---

## Deduplication and Filtering

Before finalizing, clean the keyword list:

1. **Remove duplicates** — Case-insensitive, normalize plurals
2. **Remove irrelevant** — Keywords outside your niche or business scope
3. **Remove already-ranking** — If you rank #1-3 already, deprioritize (unless defending)
4. **Merge near-duplicates** — "email marketing tool" and "email marketing tools" = same topic
5. **Flag cannibalization** — If multiple existing pages target the same keyword

---

## Common Mistakes

- **Only targeting high-volume keywords**: Long-tail keywords convert better and are easier to rank for
- **Ignoring search intent**: Matching intent matters more than matching keywords — a transactional keyword needs a product page, not a blog post
- **No clustering**: Random keyword lists without topic structure lead to content cannibalization
- **Skipping CPC analysis**: CPC is a proxy for commercial value — high CPC means people pay to rank for it, so organic ranking is extra valuable
- **One-time effort**: Keyword discovery should be recurring (quarterly minimum) as search behavior evolves
- **Only using one expansion method**: Combine tool data, autocomplete, question mining, and competitor analysis for the most complete picture

---

## Task-Specific Questions

1. What are your 3-10 seed keywords or topics?
2. Do you have access to any SEO tools (Ahrefs, SEMrush, GSC)?
3. What geographic market are you targeting?
4. Are there keywords you already rank well for?
5. What content exists on your site already?
6. Are there any topics or keywords to explicitly exclude?

---

## Related Skills

- **content-strategy**: For turning keyword clusters into a content plan
- **seo-audit**: For technical SEO foundation before targeting new keywords
- **organic-keyword-spy**: For finding keywords competitors rank for that you don't
- **programmatic-seo**: For scaling content around pattern-based keyword opportunities
- **ai-seo**: For optimizing keyword-targeted content for AI search engines
