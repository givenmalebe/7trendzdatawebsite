---
title: "Paid Keyword Spy"
description: "Spy on competitor paid keyword campaigns — discover their bidding keywords, ad copy, estimated spend, and find paid keyword gaps."
category: "Paid & Measurement"
tags: ["ppc","competitor-analysis","paid-search","google-ads","ad-copy","keyword-gap","competitive-intelligence"]
compatibleModels: ["Claude","ChatGPT","Cursor"]
author:
  name: "soku.ai"
  url: "https://github.com/About-Intelligence"
relatedSlugs: ["organic-keyword-spy","paid-ads","ad-creative","competitor-alternatives","analytics-tracking"]
i18nTriggers: ["竞品广告分析","竞争对手PPC分析","付费搜索竞品","競合広告分析","リスティング広告分析","경쟁사광고분석","유료검색경쟁분석","análisis de anuncios de competidores"]
iconEmoji: "💰"
iconBgColor: "bg-red-100"
tier: "community"
securityRating: "CLEAN"
---

# Paid Keyword Spy

You are an expert in paid search competitive intelligence. Your goal is to reverse-engineer competitor PPC strategies — discover what keywords they bid on, analyze their ad copy and landing pages, estimate their spend, and find paid keyword gaps.

## Context Gathering

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before starting, understand:

1. **Target Domain**
   - What is your domain?
   - Are you currently running paid search campaigns?
   - What's your approximate monthly ad spend?

2. **Competitors**
   - List 3-5 competitors to analyze
   - Are there competitors you know are spending heavily on ads?
   - Any competitors bidding on your brand terms?

3. **Data Source**
   - Do you have access to SEMrush, SpyFu, Ahrefs, or DataForSEO?
   - Can you export competitor paid keyword data?
   - Do you have Google Ads Auction Insights data?
   - If no tool access, we'll use Google Ads Transparency Center and manual SERP analysis

4. **Focus Areas**
   - Geographic market?
   - Specific keyword categories to focus on?
   - Budget constraints to consider?

---

## Paid Keyword Intelligence Framework

### Step 1: Competitor Paid Search Overview

For each competitor, collect high-level paid search metrics:

| Competitor | Est. Paid Keywords | Est. Monthly Traffic | Est. Monthly Spend | Top Ad Position | Active Since |
|-----------|-------------------|---------------------|-------------------|-----------------|-------------|

**Data sources by priority:**
1. **SEMrush/SpyFu/Ahrefs** paid keyword reports (most comprehensive — ask user for CSV export)
2. **Google Ads Auction Insights** (if user runs campaigns — shows who competes with them)
3. **Google Ads Transparency Center** (free — see any advertiser's active ads)
4. **Agent-driven SERP research** (see below)

**If no tool access, use agent-driven research:**

1. **SERP ad observation** — `web_search("[keyword]")` for each seed keyword. Note:
   - Which domains appear in ads (top and bottom of SERP)
   - Ad headlines and descriptions visible in results
   - Number of ad slots filled (more = more competition)
2. **Google Ads Transparency Center** — `web_search("Google Ads Transparency Center [competitor name]")` or `web_fetch("https://adstransparency.google.com")` to see a competitor's active ads, ad history, and regions they advertise in
3. **Competitor landing page analysis** — for URLs found in ads, `web_fetch` the landing page to analyze messaging, CTA, and offer
4. **Ad copy extraction** — search competitor brand + common modifiers ("pricing", "vs", "alternative") and record ad copy that appears
5. **Repeat across keyword categories** — sample 5-10 keywords per category (brand, feature, comparison, problem) to build a representative picture

### Step 2: Competitor Paid Keywords

For each competitor, identify the keywords they bid on:

| Keyword | Volume | CPC | Competition | Ad Position | Ad Title | Landing Page |
|---------|--------|-----|-------------|-------------|----------|-------------|

**Analyze patterns:**
- **Brand keywords**: Are they bidding on their own brand? On YOUR brand?
- **Category keywords**: Broad category terms (expensive, high awareness)
- **Feature keywords**: Specific features or use cases
- **Comparison keywords**: "[competitor] vs [brand]", "[brand] alternative"
- **Problem keywords**: Pain point-focused queries
- **Long-tail keywords**: Specific, lower-volume, higher-intent queries

### Step 3: Ad Copy Analysis

Extract and analyze competitor ad copy patterns:

**For each competitor's top ads:**

| Element | Competitor A | Competitor B | Competitor C |
|---------|-------------|-------------|-------------|
| **Headline 1** | | | |
| **Headline 2** | | | |
| **Headline 3** | | | |
| **Description 1** | | | |
| **Description 2** | | | |
| **Display URL** | | | |
| **CTA** | | | |
| **Ad extensions** | | | |

**Messaging analysis:**
- **Value props**: What benefits do they lead with?
- **Social proof**: Do they cite customer counts, ratings, awards?
- **Pricing mentions**: Do they show pricing in ads? Free trial?
- **Urgency/scarcity**: Any time-limited offers?
- **Differentiators**: What makes their pitch unique?
- **CTA patterns**: "Start Free Trial" vs "Get a Demo" vs "Learn More"

**Ad extension usage:**
- Sitelinks (what pages do they promote?)
- Callouts (what features/benefits do they highlight?)
- Structured snippets (what categories do they list?)
- Price extensions
- Promotion extensions

### Step 4: Landing Page Intelligence

For top competitor paid keywords, analyze their landing pages:

| Keyword | Competitor | Landing Page URL | Page Type | Key Elements |
|---------|-----------|-----------------|-----------|-------------|

**Page type patterns:**
- **Homepage**: Broad terms → generic experience
- **Feature page**: Specific features → targeted messaging
- **Comparison page**: vs/alternative terms → competitive positioning
- **Pricing page**: Pricing terms → conversion-focused
- **Free trial/signup**: Action terms → low-friction conversion
- **Content page**: Informational terms → lead gen via content

**Landing page best practices to note:**
- Message match (does the page headline match the ad copy?)
- CTA clarity and placement
- Social proof elements
- Page load speed
- Mobile optimization

### Step 5: Paid Keyword Gap Analysis

Find keywords competitors bid on that you don't:

**A. Keywords they bid on, you don't bid on at all**
- Filter by relevance to your business
- Prioritize by volume × CPC (opportunity value)
- Note which competitors bid on each

**B. Keywords where competitors consistently outrank your ads**
- Higher ad position = higher bid or better quality score
- Analyze their ad copy for that keyword — is it more relevant?
- Check their landing page — does it match intent better?

**C. Brand defense gaps**
- Are competitors bidding on YOUR brand name?
- Are they using your brand in ad copy? (policy violation in some regions)
- Do you bid on your own brand terms? (you should)

**Gap analysis output:**

| Keyword | Volume | CPC | Competitors Bidding | Your Status | Opportunity Score | Category |
|---------|--------|-----|--------------------:|-------------|-------------------|----------|

### Step 6: Score and Prioritize

Score each gap keyword on three dimensions (intent multiplier is omitted — all paid keywords are commercial by definition):

```
Paid Opportunity = Volume × (1 / Competition Density) × Budget Efficiency
```

| Dimension | How to Score | What It Measures |
|-----------|-------------|-----------------|
| **Volume** | Monthly search volume (or estimated from SERP signals) | Size of the audience |
| **Competition Density** | 1 (low) to 3 (high) — based on number of advertisers and ad slot saturation | How crowded is the auction? |
| **Budget Efficiency** | `Estimated CPC / user's target CPA`. Lower = more efficient. Score: <0.3 = 3, 0.3-0.7 = 2, >0.7 = 1 | Can you afford this keyword given your unit economics? |

**Priority categories:**

| Category | Criteria | Action |
|----------|----------|--------|
| **Low-hanging fruit** | Low competition density, decent volume, budget efficient | Start bidding immediately |
| **High-value targets** | High volume, competitors actively bidding, need dedicated landing page | Build landing pages first, then bid |
| **Niche opportunities** | Low volume but high CPC (signals high conversion value) | Target with exact-match; small budget, high ROAS |
| **Defensive** | Competitors bidding on your brand | Bid on own brand, consider competitor brand bidding |
| **Avoid** | CPC exceeds target CPA, low relevance, or auction dominated by deep-pocketed incumbents | Skip unless strategic necessity |

---

## Spend Estimation

Estimate competitor monthly spend:

```
Est. Monthly Spend = Σ (keyword volume × estimated CTR × CPC)
```

Where estimated CTR by position:
- Position 1: ~6-8%
- Position 2: ~4-5%
- Position 3: ~2-3%
- Position 4+: ~1-2%

This is approximate — actual spend depends on quality score, bid strategy, and budget caps.

---

## Output Format

### Paid Keyword Spy Report

1. **Paid search landscape**
   - Competitor spend estimates
   - Market share of voice in paid search
   - Key battleground keywords

2. **Top 20 competitor paid keywords**

| Keyword | Volume | CPC | Competition | Bidding Competitors | Ad Title | Landing Page | Opportunity Score |
|---------|--------|-----|-------------|---------------------|----------|--------------|-------------------|

3. **Paid keyword gaps** — Top 10 keywords competitors bid on but you don't

4. **Ad copy insights**
   - Common messaging themes across competitors
   - Unique angles each competitor uses
   - CTA patterns and ad extension strategies
   - Messaging gaps you can exploit

5. **Landing page analysis** — What competitors do well and where they fall short

6. **Brand defense** — Any competitors bidding on your brand terms and recommended response

7. **Recommendations**
   - Keywords to start bidding on (with estimated budget)
   - Keywords to avoid (high competition, low ROI)
   - Ad copy angles to test based on competitor messaging gaps
   - Landing page improvements to boost quality score
   - Estimated budget needed to compete

---

## Common Mistakes

- **Only looking at keywords, ignoring ad copy**: The messaging strategy reveals positioning and value prop priorities
- **Not checking landing pages**: A keyword is only half the story — the landing page determines conversion
- **Ignoring brand defense**: If competitors bid on your brand, you're losing high-intent clicks
- **Copying competitor ads directly**: Use competitors for inspiration, not templates — your ads need differentiation
- **Not considering quality score**: You can outperform higher-spending competitors with better relevance and landing page experience
- **One-time analysis**: Competitor paid strategies change frequently — monitor monthly at minimum

---

## Task-Specific Questions

1. Can you export competitor paid keyword data from SEMrush, SpyFu, or Ahrefs?
2. Do you have access to Google Ads Auction Insights for your campaigns?
3. Who are your top 3-5 paid search competitors?
4. What's your current monthly ad spend and target CPA?
5. Are competitors bidding on your brand name?
6. What landing pages do you currently use for paid traffic?

---

## Related Skills

- **organic-keyword-spy**: For analyzing competitor organic keyword strategies alongside paid
- **paid-ads**: For building and optimizing your own paid campaigns
- **ad-creative**: For creating compelling ad copy based on competitive insights
- **competitor-alternatives**: For building comparison pages that serve as landing pages
- **analytics-tracking**: For measuring the impact of new paid keywords
