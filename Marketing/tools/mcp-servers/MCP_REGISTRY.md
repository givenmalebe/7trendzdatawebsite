# Ceety MCP Server Registry — Digital Marketing

## Cloud-Hosted MCP Servers (API Key Required)

### 1. SearchAtlas — Agentic Omnichannel Marketing MCP
- **Endpoint:** `https://mcp.searchatlas.com/api/v1/mcp`
- **Auth:** `X-API-KEY` header
- **Tools:** 112 — SEO, GEO (LLM visibility), Google Ads, GBP, content, digital PR, website generation
- **Setup:** Sign up at searchatlas.com, get API key
- **Config:**
```json
{
  "mcpServers": {
    "searchatlas": {
      "url": "https://mcp.searchatlas.com/api/v1/mcp",
      "headers": { "X-API-KEY": "${SEARCHATLAS_API_KEY}" }
    }
  }
}
```

### 2. Markifact — Universal Marketing MCP
- **Endpoint:** `https://api.markifact.com/mcp`
- **Auth:** OAuth 2.1
- **Tools:** 500+ operations across 20+ platforms (Google Ads, Meta, TikTok, LinkedIn, Microsoft, Reddit, Pinterest, Snapchat, Amazon, DV360, GA4, BigQuery, GSC, GBP, Shopify, HubSpot, Klaviyo, WhatsApp, Slack)
- **Setup:** Sign up at markifact.com, install per client
- **Config:**
```json
{
  "mcpServers": {
    "markifact": {
      "url": "https://api.markifact.com/mcp"
    }
  }
}
```

### 3. SEO MCP Server (seomcp.dev)
- **Endpoint:** Cloud-hosted, 39 tools
- **Auth:** API key
- **Tools:** GSC, GA4, Indexing API, PageSpeed, Schema validation, site audits
- **Free tier:** 50 calls/month
- **Setup:** seomcp.dev → get API key

### 4. SEO MCP (seomcp.ai)
- **Endpoint:** Cloud-hosted
- **Auth:** API key
- **Tools:** Keyword research, rank tracking, backlink analysis
- **Setup:** seomcp.ai → get API key

### 5. HeySeo — 72 MCP Tools
- **Endpoint:** Cloud-hosted
- **Auth:** Google OAuth (GSC + GA4)
- **Tools:** 72 — GSC, GA4, PageSpeed, SERP, indexing, reports
- **Free tier:** 5 prompts/month
- **Setup:** heyseo.app → connect Google

### 6. Synter — Cross-Platform Ads MCP
- **Endpoint:** Cloud-hosted
- **Auth:** API key
- **Tools:** 140+ across 9 platforms (Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, StackAdapt, TTD)
- **Setup:** syntermedia.ai

### 7. Google+Meta+GA4 MCP (Ryze AI)
- **Endpoint:** Cloud-hosted
- **Tools:** 250+ (Google Ads 150+, Meta Ads 80+, GA4 20+)
- **Setup:** get-ryze.ai

### 8. AdKit Ads MCP
- **Endpoint:** Cloud-hosted
- **Tools:** Google Ads, Meta, TikTok, Reddit campaign management + competitor spying
- **Setup:** adkit.so

### 9. Zoho MCP — Email & Calendar
- **Endpoint:** `https://marjeting-930519142.zohomcp.com/mcp/1fa0ff8b9879389f04a95957aac4198d/message`
- **Account:** info@7trendzdata.com
- **Auth:** Authorization via Connection (OAuth)
- **Tools:** Zoho Mail (send/read/search) + Zoho Calendar (create/list events)
- **Setup:** Created via Zoho MCP Console
- **Config:**
```json
{
  "mcpServers": {
    "zoho": {
      "url": "https://marjeting-930519142.zohomcp.com/mcp/1fa0ff8b9879389f04a95957aac4198d/message"
    }
  }
}
```

## Self-Hosted MCP Servers (Local Install)

### 9. DataForSEO MCP (Official)
- **Repo:** `tools/mcp-servers/dataforseo-mcp/`
- **Type:** TypeScript (npm)
- **Auth:** DataForSEO API credentials
- **Tools:** SERP API, Keywords Data API, OnPage API, Labs API, Backlinks API, Business Data, Domain Analytics, Content Analysis, Merchant API
- **Install:** `npm install` in the server directory, set `DATAFORSEO_USERNAME` and `DATAFORSEO_PASSWORD`

### 10. GeoSEO MCP (Rachit8484)
- **Repo:** `tools/mcp-servers/geoseo-mcp/`
- **Type:** Python, MIT license
- **Tools:** 36 — GSC, IndexNow, LLM citations (ChatGPT/Claude/Gemini/Perplexity), AI Overviews, on-page audit, internal link graph, llms.txt, trend tracking
- **Install:** `pip install -r requirements.txt`, configure API keys
- **Highlight:** Only open-source MCP covering SEO + GEO in one server

### 11. MCP-Marketing (elmandalorian-thx)
- **Repo:** `tools/mcp-servers/mcp-marketing/`
- **Type:** Python
- **Tools:** 14 — GSC, GA4, Google Ads Keyword Planner, Meta interests, YouTube, Reddit, Google Trends, PageSpeed, GBP, Google Drive
- **Install:** `pip install -r requirements.txt`, configure API keys

### 12. mcp-marketing-suite (mharnett)
- **Repo:** `tools/mcp-servers/mcp-marketing-suite/`
- **Type:** TypeScript + Python, 8 servers
- **Tools:** 124 — Google Ads (34), Meta Ads (28), Bing Ads (10), LinkedIn Ads (7), Reddit Ads (18), GA4 (9), GSC (4), GTM+GA4 (14)
- **Install:** `npm install mcp-google-ads`, `pip install meta-ads-mcp`, etc.

### 13. mcp-seo (slamer59) — DataForSEO + PageRank
- **Repo:** `tools/mcp-servers/mcp-seo/`
- **Type:** Python
- **Tools:** SEO audit, keyword research, SERP analysis, competitor comparison, content gap analysis, PageRank analysis with Kuzu graph DB
- **Install:** `pip install -r requirements.txt`, set DataForSEO credentials

### 14. Gmail MCP Server (simiancraft) — Bun
- **Repo:** `tools/mcp-servers/gmail-mcp/`
- **Tools:** 31 — send/reply/search/read emails, labels, semantic search, knowledge graph
- **Auth:** Google OAuth 2.0 (needs GCP credentials)
- **Setup:** Enable Gmail API in Google Cloud Console, create OAuth credentials (Desktop app), run `node dist/index.js auth`
- **Config:**
```json
{
  "mcpServers": {
    "gmail": {
      "command": "node",
      "args": ["tools/mcp-servers/gmail-mcp/dist/index.js"],
      "env": {
        "GMAIL_CREDENTIALS_PATH": "~/.gmail-mcp/credentials.json",
        "GMAIL_OAUTH_KEYS_PATH": "~/.gmail-mcp/gcp-oauth.keys.json"
      }
    }
  }
}
```

### 15. Gmail MCP Server (darrinm/official) — TypeScript
- **Repo:** `tools/mcp-servers/gmail-mcp-official/`
- **Tools:** 24 — send/read/search/draft/label/filter, multi-account, batch ops
- **Auth:** Google OAuth 2.0
- **Setup:** Same as above — GCP OAuth credentials needed
- **Config:** Same pattern, `node dist/index.js`

### Gmail Setup Steps (for both):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **Gmail API**
3. Go to Credentials → Create OAuth client ID → **Desktop app** type
4. Download JSON → save as `~/.gmail-mcp/gcp-oauth.keys.json`
5. Run `node dist/index.js auth` → browser opens for Google consent
6. Token saved to `~/.gmail-mcp/credentials.json`

## Quick-Start Priority (Recommended Install Order)

### For SEO/GEO data:
1. **GeoSEO MCP** — free, open source, SEO+GEO, runs locally
2. **DataForSEO MCP** — needs paid API key, most comprehensive SEO data

### For Ad Management:
3. **mcp-marketing-suite** — 124 tools, 8 platforms, production-grade
4. **Markifact** — 500+ ops, 20+ platforms, needs account

### For Analytics:
5. **MCP-Marketing** — lightweight, 10 API integrations in one server
6. **SEO MCP (seomcp.dev)** — 39 tools, free tier available

### For All-in-One:
7. **SearchAtlas** — 112 tools, omnichannel marketing, needs account
8. **Synter** — 140+ tools, 9 ad platforms, read+write

## Config Format (opencode.json)
```json
{
  "mcpServers": {
    "geoseo": {
      "command": "python",
      "args": ["-m", "geoseo_mcp"],
      "env": {
        "GSC_CREDENTIALS": "${GSC_CREDENTIALS}",
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}",
        "OPENAI_API_KEY": "${OPENAI_API_KEY}",
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}",
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "SERPAPI_KEY": "${SERPAPI_KEY}"
      }
    },
    "dataforseo": {
      "command": "node",
      "args": ["tools/mcp-servers/dataforseo-mcp/dist/index.js"],
      "env": {
        "DATAFORSEO_USERNAME": "${DATAFORSEO_USERNAME}",
        "DATAFORSEO_PASSWORD": "${DATAFORSEO_PASSWORD}"
      }
    },
    "mcp-marketing": {
      "command": "python",
      "args": ["-m", "mcp_marketing"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT": "${GOOGLE_SERVICE_ACCOUNT}",
        "META_ACCESS_TOKEN": "${META_ACCESS_TOKEN}",
        "YOUTUBE_API_KEY": "${YOUTUBE_API_KEY}"
      }
    }
  }
}
```
