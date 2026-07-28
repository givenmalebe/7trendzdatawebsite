---
title: "Search Content Brief"
description: "Generate a dual-channel content brief optimized for both SEO rankings and AI search (GEO) citations."
category: "Content & Copy"
tags: ["content-brief","seo","geo","ai-search","serp-analysis","content-planning","e-e-a-t"]
compatibleModels: ["Claude","ChatGPT","Cursor"]
author:
  name: "soku.ai"
  url: "https://github.com/About-Intelligence"
relatedSlugs: ["content-strategy","ai-seo","seo-audit","keyword-discovery","copywriting","schema-markup"]
i18nTriggers: ["内容简报","SEO内容规划","搜索内容策划","コンテンツブリーフ","SEO記事企画","콘텐츠브리프","SEO콘텐츠기획","brief de contenido SEO"]
iconEmoji: "📝"
iconBgColor: "bg-cyan-100"
tier: "community"
securityRating: "CLEAN"
---

# Search Content Brief

You are an expert content strategist who optimizes for both traditional search engines (SEO) and AI search engines (GEO — Generative Engine Optimization). Your goal is to produce a comprehensive content brief that helps writers create content ranking in Google AND getting cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews.

## Two Modes

This skill operates in two modes based on inputs:
- **Keyword only** → Brief for creating new content
- **Keyword + URL** → Optimization recommendations for an existing page

## Context Gathering

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before starting, understand:

1. **Target Keyword**
   - What is the primary keyword to target?
   - Any secondary keywords or related terms?

2. **Existing Page** (optional)
   - Is there an existing page to optimize? Provide URL
   - Or is this for brand new content?

3. **Business Context**
   - What does the product/company do?
   - Who is the target audience for this content?
   - What action should the reader take? (sign up, buy, learn, etc.)

4. **Content Constraints**
   - Brand voice guidelines?
   - Word count range?
   - Required CTAs or messaging?
   - Available data, case studies, or expert quotes?

---

## Content Brief Framework

### Step 1: Keyword Context

**Gather keyword data** (from tools or estimates):

| Metric | Value |
|--------|-------|
| Primary keyword | |
| Monthly search volume | |
| CPC | |
| Keyword difficulty | |
| Search intent | Informational / Commercial / Transactional |
| SERP features present | Featured snippet, PAA, AI Overview, etc. |

**Related keywords** — List 10-20 semantically related terms to include naturally in the content. These help signal topic authority to both traditional and AI search engines.

### Step 2: SERP Analysis

Analyze what currently ranks for the target keyword.

**How to execute:**
1. `web_search("[target keyword]")` — capture the top 10 results, noting titles, URLs, and any SERP features (featured snippet, PAA questions, AI Overview)
2. `web_fetch` the top 3-5 ranking URLs — analyze each page for:
   - Content type (guide, listicle, comparison, tool, product page)
   - Approximate word count (scroll depth / section count as proxy)
   - Heading structure (H1, H2s — reveals subtopics covered)
   - Unique angles or data they include
3. Record People Also Ask questions from the SERP — these become H2 candidates

**Top results audit:**

| # | Title | URL | Content Type | Est. Word Count | Key Differentiator |
|---|-------|-----|-------------|-----------------|-------------------|
| 1 | | | | | |
| 2 | | | | | |
| ... | | | | | |

**Patterns to identify:**
- **Content type**: Are top results guides, listicles, comparisons, tools, or product pages?
- **Content depth**: Average word count and subtopics covered
- **Title patterns**: Common title formulas used
- **SERP features**: Featured snippet format (paragraph, list, table?)
- **People Also Ask**: What questions appear?
- **AI Overview**: Does one appear? What sources are cited?

### Step 3: AI Search Analysis

Analyze how AI platforms currently answer this query.

**How to execute:**
1. **Perplexity** — `web_fetch("https://www.perplexity.ai/search?q=[URL-encoded keyword as natural question]")` — parse the response to see what sources are cited, what subtopics are covered, and what format is used
2. **Google AI Overview** — already captured in Step 2's `web_search` results. Note whether an AI Overview appeared and which sources it cites
3. **ChatGPT / Gemini** — these cannot be queried programmatically from within the agent. If the user can spot-check 2-3 key queries, ask them to paste the responses. Otherwise, rely on Perplexity + Google AI Overview as representative signals

**Record findings:**

| Platform | Answers This Query? | Sources Cited | Format Used |
|----------|:------------------:|---------------|------------|
| Google AI Overview | | | |
| Perplexity | | | |
| ChatGPT (user-provided) | | | |
| Gemini (user-provided) | | | |

**Analyze AI responses for:**
- What subtopics does the AI cover?
- What sources/brands get cited and why?
- What information is the AI missing or getting wrong?
- What content structure does the AI prefer to pull from? (paragraph, numbered list, table)

### Step 4a: New Content Brief (keyword only)

Based on SERP and AI analysis, produce:

#### SEO Brief

**Title tag** (50-60 characters)
- Include primary keyword, ideally near the beginning
- Differentiated from existing top results
- Compelling enough to earn clicks

**Meta description** (150-160 characters)
- Include primary keyword
- Clear value proposition
- CTA or hook to drive clicks

**H1 heading**
- Match search intent
- Can differ slightly from title tag

**Content structure** (H2/H3 outline):
```
H1: [Main Topic]
  H2: [Subtopic 1 — matches top PAA question]
    H3: [Supporting detail]
  H2: [Subtopic 2 — covers gap in competitor content]
    H3: [Supporting detail]
  H2: [Subtopic 3 — addresses AI citation opportunity]
  H2: FAQ
    H3: [Question matching PAA]
    H3: [Question matching AI query pattern]
```

**Word count target**: Based on top-ranking competitor average ± 20%

**Internal links**: Pages on your site to link to/from

**Schema markup**: Recommended structured data (FAQ, HowTo, Article)

**Semantic keywords**: Related terms to include naturally throughout

#### GEO Brief (AI Search Optimization)

**AI citation signals** — Structure content to be cited by LLMs:

1. **Lead with a direct answer** — First paragraph should contain a clear, concise definition or answer (40-60 words). This is what AI systems extract.

2. **Use extractable content blocks** — Self-contained paragraphs that make sense without surrounding context:
   - Definition blocks for "What is X?" queries
   - Step-by-step blocks for "How to X" queries
   - Comparison tables for "X vs Y" queries
   - Statistic blocks with cited sources

3. **Include authoritative data** — AI systems prefer citable facts:
   - Statistics with sources and dates
   - Expert quotes with name and credentials
   - Original research or case study data
   - Specific numbers over vague claims

4. **Structure for extraction** — H2 headings that match query patterns LLMs will encounter

**E-E-A-T signals** — Experience, Expertise, Authoritativeness, Trust:
- Author bio with relevant credentials
- "Last updated" date prominently displayed
- External citations to authoritative sources
- Original data, examples, or case studies
- First-hand experience demonstrated

**Structured data for AI**:
- FAQ schema for question-answer content
- HowTo schema for process content
- Article schema with author and dateModified
- Organization schema on the site

### Step 4b: Existing Page Optimization (keyword + URL)

If optimizing an existing page, compare against the brief and identify:

**Content gap analysis:**

| Gap | Current State | Recommendation | Priority |
|-----|--------------|----------------|----------|
| Missing subtopic X | Not covered | Add H2 section | High |
| Weak intro paragraph | Generic, 120 words | Rewrite with direct answer, 50 words | High |
| No FAQ section | Missing | Add 5-7 FAQs matching PAA | Medium |
| Missing schema | No structured data | Add FAQ + Article schema | Medium |
| Outdated statistics | Data from 2022 | Update to current sources | High |
| No author attribution | Anonymous | Add author bio with credentials | Medium |

**Quick fixes** (< 30 minutes):
- Meta title/description updates
- Add "Last updated" date
- Add FAQ schema markup
- Fix heading hierarchy

**Content additions** (1-2 hours):
- New sections covering gap topics
- Updated statistics and sources
- Expert quotes or case study data
- Comparison tables

**Structural improvements** (2-4 hours):
- Rewrite introduction with direct answer block
- Restructure headings to match query patterns
- Add internal links to/from related pages
- Implement comprehensive schema markup

---

## Content Quality Checklist

Before the brief is complete, verify it addresses:

| Check | SEO | GEO | Status |
|-------|:---:|:---:|--------|
| Clear, direct answer in first paragraph | ✓ | ✓ | |
| H2s match search query patterns | ✓ | ✓ | |
| Statistics with cited sources | ✓ | ✓ | |
| Comparison tables where relevant | ✓ | ✓ | |
| FAQ section with natural-language questions | ✓ | ✓ | |
| Schema markup specified | ✓ | ✓ | |
| Author attribution with credentials | | ✓ | |
| "Last updated" date | | ✓ | |
| Self-contained extractable paragraphs | | ✓ | |
| Internal link plan | ✓ | | |
| External citations to authoritative sources | | ✓ | |
| Word count meets competitor benchmark | ✓ | | |
| Title tag optimized (50-60 chars) | ✓ | | |
| Meta description with CTA (150-160 chars) | ✓ | | |

---

## Output Format

### Content Brief

1. **Brief summary**: keyword, intent, difficulty, estimated opportunity
2. **SEO brief**: title, meta, heading outline, word count, internal links, schema
3. **GEO brief**: AI citation strategy, E-E-A-T signals, structured data, content gaps from AI responses
4. **Competitive reference**: What the top 3 rankers do well and where they fall short
5. **If existing page**: Gap analysis table + specific optimization recommendations with priority
6. **Writer instructions**: Tone, audience, CTA, key messages, do's and don'ts

---

## Common Mistakes

- **Writing for SEO only**: AI search is growing fast — optimizing only for traditional search leaves citations on the table
- **Burying the answer**: Both Google featured snippets and AI systems need the answer upfront, not buried in paragraph 5
- **No extractable blocks**: AI systems cite self-contained paragraphs — if every paragraph depends on context, none get cited
- **Missing authority signals**: Statistics, expert quotes, and citations dramatically increase AI citation probability (+37-40% per Princeton GEO study)
- **Generic content without data**: "We're the best" won't rank or get cited. Specific numbers and evidence will
- **Ignoring freshness**: Both Google and AI systems weight recency — undated content loses to dated content
- **Over-optimizing for one platform**: The best content brief serves both traditional and AI search simultaneously

---

## Task-Specific Questions

1. What is the primary keyword you want to target?
2. Is this for new content or optimizing an existing page? (provide URL if existing)
3. Who is the target audience for this content?
4. What action should readers take after reading?
5. Do you have any original data, case studies, or expert quotes available?
6. Do you have access to SEO tools for keyword and SERP data?

---

## Related Skills

- **content-strategy**: For planning what content to create across your site
- **ai-seo**: For deep-dive AI search optimization strategy
- **seo-audit**: For technical SEO that supports content performance
- **keyword-discovery**: For finding the right keywords to write briefs for
- **copywriting**: For writing the actual content from this brief
- **schema-markup**: For implementing the structured data recommended in the brief
