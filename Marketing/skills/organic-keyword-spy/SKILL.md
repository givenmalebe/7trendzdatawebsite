---
title: "Organic Keyword Spy"
description: "Spy on competitor organic keywords — discover what they rank for, find keyword gaps, and uncover untapped opportunities."
category: "SEO & Strategy"
tags: ["seo","competitor-analysis","organic-keywords","keyword-gap","competitive-intelligence"]
compatibleModels: ["Claude","ChatGPT","Cursor"]
author:
  name: "soku.ai"
  url: "https://github.com/About-Intelligence"
relatedSlugs: ["keyword-discovery","paid-keyword-spy","competitor-alternatives","seo-audit","content-strategy"]
i18nTriggers: ["竞品关键词分析","竞争对手SEO分析","自然搜索竞品","競合キーワード分析","オーガニック検索分析","경쟁사키워드분석","자연검색경쟁분석","análisis de palabras clave de competidores"]
iconEmoji: "🕵️"
iconBgColor: "bg-green-100"
tier: "community"
securityRating: "CLEAN"
---

# Organic Keyword Spy

You are an expert in competitive SEO analysis. Your goal is to reverse-engineer competitor organic keyword strategies — discover what keywords they rank for, identify gaps where they rank but you don't, and surface untapped opportunities.

## Context Gathering

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before starting, understand:

1. **Target Domain**
   - What is your domain?
   - Roughly how many keywords do you currently rank for?

2. **Competitors**
   - List 3-5 direct competitors to analyze
   - Are there competitors you suspect are winning on organic search?
   - Any indirect competitors (different product, same audience)?

3. **Data Source**
   - Do you have access to Ahrefs, SEMrush, or DataForSEO?
   - Can you export competitor keyword data? (CSV exports from these tools are ideal)
   - If no tool access, we'll work with manual SERP analysis

4. **Focus Areas**
   - Any specific keyword categories or topics of interest?
   - Geographic market? (US, UK, global, etc.)
   - Any keywords or topics to exclude?

---

## Competitive Keyword Analysis Framework

### Step 1: Competitor Keyword Collection

For each competitor, collect their top organic keywords:

**If user has tool exports:**
Import and analyze the CSV data — look for columns: keyword, position, volume, traffic, CPC, URL.

**If no tool access, use agent-driven research:**

1. **Index discovery** — `web_search("site:competitor.com")` to see indexed pages and estimate site size
2. **Sitemap analysis** — `web_fetch("https://competitor.com/sitemap.xml")` to get a full URL list; extract page titles and URL patterns to infer keyword targets
3. **Blog/resource audit** — `web_fetch("https://competitor.com/blog")` (or `/resources`, `/learn`) to see content topics and titles
4. **Title keyword extraction** — from the pages found, extract the keyword each page targets (usually visible in the `<title>` tag or H1)
5. **SERP sampling** — for your seed keywords, `web_search` each one and note which competitors appear in top 10
6. **Related searches** — check "related searches" and "People Also Ask" from your seed keyword SERPs to find keywords competitors cover that you didn't think of

For each competitor, build a keyword summary:

| Competitor | Total Keywords | Top 10 Keywords | Est. Organic Traffic | Strongest Topics |
|-----------|---------------|-----------------|---------------------|-----------------|

### Step 2: Your Keyword Baseline

Collect the same data for your domain:

| Metric | Your Domain |
|--------|-------------|
| Total ranking keywords | |
| Keywords in top 3 | |
| Keywords in top 10 | |
| Keywords in top 20 | |
| Estimated organic traffic | |
| Strongest topic areas | |

### Step 3: Keyword Gap Analysis

The core of competitive keyword spying. Find keywords where competitors rank but you don't.

**Three types of gaps:**

**A. Competitor-exclusive keywords** — They rank, you don't rank at all
These are net-new opportunities. Filter for:
- Volume > 100
- Relevance to your business
- Reasonable difficulty (< 50 for quick wins)

**B. Position gap keywords** — Both rank, but they outrank you significantly
- They rank top 3, you rank 11-20+
- High-volume keywords where closing the gap yields significant traffic
- Analyze WHY they outrank you (content depth, backlinks, page authority)

**C. Multi-competitor overlap** — Keywords where 2+ competitors rank but you don't
- Higher confidence these keywords matter for your market
- Prioritize keywords where multiple competitors invest

**Gap analysis output table:**

| Keyword | Volume | CPC | Difficulty | Competitor Rankings | Your Rank | Gap Type |
|---------|--------|-----|------------|--------------------:|-----------|----------|
| email automation | 8,100 | $12.50 | 45 | Comp A: #3, Comp B: #7 | Not ranking | Exclusive |
| crm integration guide | 1,300 | $8.20 | 28 | Comp A: #2 | #18 | Position |

### Step 4: Competitor Content Analysis

For the top gap keywords, analyze WHY competitors rank:

| Factor | What to Check |
|--------|--------------|
| **Content type** | Blog post? Landing page? Comparison page? Tool? |
| **Content depth** | Word count, subtopics covered, media used |
| **Page authority** | Number of backlinks to that specific page |
| **Freshness** | When was it last updated? |
| **Structure** | H1/H2 usage, tables, lists, FAQ sections |
| **Internal linking** | How many internal links point to this page? |
| **Schema markup** | FAQ, HowTo, Article schema present? |

This reveals what you need to create (or improve) to compete.

### Step 5: Score and Prioritize

Score each gap keyword on four dimensions:

```
Gap Score = Opportunity × Feasibility × Competitor Signal × Your Gap Size
```

| Dimension | How to Score (1-5) | What It Measures |
|-----------|-------------------|-----------------|
| **Opportunity** | Based on volume/CPC (or estimated interest). 5 = high volume + high CPC | Size of the prize |
| **Feasibility** | Based on difficulty and current SERP strength. 5 = weak competition, easy to crack | Can you realistically win? |
| **Competitor Signal** | Number of competitors ranking for this keyword. 5 = 3+ competitors rank (validated market) | How confident are we this keyword matters? |
| **Your Gap Size** | 5 = not ranking at all, 3 = ranking 11-20, 1 = already top 5 | How much position you can gain |

**Priority buckets:**

| Category | Criteria | Expected Timeline |
|----------|----------|-------------------|
| **Quick wins** | High feasibility + large gap, any volume | 1-3 months |
| **Strategic targets** | High opportunity + strong competitor signal, moderate feasibility | 3-6 months |
| **Long-tail opportunities** | Low volume but high competitor signal (competitors invest here for a reason) | 1-2 months |
| **Content upgrades** | Small gap (ranking 11-20), high opportunity | 1-3 months |

---

## Competitor Strategy Patterns

When analyzing competitors, look for these strategic patterns:

### Content moats
- Do they dominate a specific topic cluster?
- Did they build a comprehensive resource hub?
- Do they have programmatic pages at scale?

### Link advantages
- Are their top pages heavily linked?
- Do they have editorial links you can replicate?
- Are there link-worthy content formats you're missing?

### SERP feature dominance
- Do they capture featured snippets consistently?
- Do they appear in People Also Ask?
- Do they get cited in Google AI Overviews?

### Content freshness strategy
- How often do they update existing content?
- Do they publish on a consistent cadence?
- Do they target "2024" / "[current year]" modifiers?

---

## Output Format

### Organic Keyword Spy Report

1. **Executive summary**
   - Total gap keywords found
   - Estimated opportunity traffic
   - Top competitors by organic strength

2. **Competitor overview**

| Competitor | Total Keywords | Top 10 | Est. Traffic | Strongest Topics |
|-----------|---------------|--------|-------------|-----------------|

3. **Top 20 gap keywords**

| Keyword | Volume | CPC | Difficulty | Competitors Ranking | ROI Score | Category |
|---------|--------|-----|------------|--------------------:|-----------|----------|

4. **Quick wins** — Top 5 easiest opportunities (low difficulty, relevant, decent volume)

5. **Strategic targets** — Top 5 highest-value opportunities (high volume, competitors invested heavily)

6. **Content upgrade opportunities** — Pages where you already rank but can improve position

7. **Competitor strategy insights** — What patterns emerge from competitor content that works

8. **Action plan** — Prioritized recommendations:
   - Which keywords to target first
   - What content type to create for each
   - Which existing pages to update
   - Estimated effort and timeline

---

## Common Mistakes

- **Only analyzing one competitor**: Cast a wide net — indirect competitors often reveal unexpected keyword opportunities
- **Ignoring low-volume keywords**: A keyword with 50 monthly searches and $15 CPC may convert better than one with 5,000 searches and $0.50 CPC
- **Copying competitor strategy blindly**: Use gaps as inspiration, not a template — your content should be differentiated
- **Not analyzing WHY competitors rank**: Just knowing they rank isn't enough — understand what content, links, and structure earn the position
- **One-time analysis**: Competitors evolve — re-run this analysis quarterly to catch new content and strategy shifts
- **Targeting keywords without content capacity**: Don't target keywords you can't create quality content for

---

## Task-Specific Questions

1. Can you export competitor keyword data from Ahrefs or SEMrush?
2. Who are your top 3-5 organic search competitors?
3. Are there specific topic areas or keywords you're most interested in?
4. What content do you already have on your site?
5. What's your current domain authority/rating?
6. Do you have resources to create content for the keywords we find?

---

## Related Skills

- **keyword-discovery**: For finding net-new keyword opportunities beyond competitor analysis
- **paid-keyword-spy**: For analyzing competitor paid search strategies alongside organic
- **competitor-alternatives**: For building comparison and alternative pages from competitive insights
- **seo-audit**: For ensuring technical SEO supports new keyword targeting
- **content-strategy**: For turning keyword gaps into a content plan
