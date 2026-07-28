# 7Trendz_data — Marketing Skills Knowledge Base

## What this is

A marketing skills knowledge base with 1,900+ skills merged from 10 GitHub repos, plus 15 MCP servers. **Not a code project** — no build, no tests, no CI.

## Entry points

- `Marketing/AGENTS.md` — agent instructions, navigation, how-to-work
- `Marketing/CEETY_MEMORY.md` — agent identity, mission, installed inventory (read first)
- `Marketing/SKILLS_INDEX.md` — quick reference to all 1,900+ skills by category
- `Marketing/tools/mcp-servers/MCP_REGISTRY.md` — MCP server endpoints, auth, config

## Directory structure

```
7Trendz_data/
├── opencode.json            ← superpowers MCP server config
└── Marketing/               ← main working directory
    ├── AGENTS.md            ← detailed agent instructions
    ├── CEETY_MEMORY.md      ← persistent memory / identity
    ├── SKILLS_INDEX.md      ← skill lookup by category
    ├── skills/              ← 200+ skill directories
    │   ├── seo/claude-seo/  ← 25 sub-skills, 18 agents (has own AGENTS.md)
    │   └── agents/kai-cmo/  ← 42 /kai commands (has own AGENTS.md)
    └── tools/mcp-servers/   ← 12 MCP server directories
```

## Shell constraints

- **PowerShell 5.1** — use `curl.exe` (not `curl`), `Add-Type` for ZIP extraction
- **No git, no npm, no gh CLI** available
- **npx** works via `cmd /c "npx ..."` if needed (execution policy blocks PowerShell scripts)

## MCP servers

- **Root level:** `superpowers` (npx superpowers-mcp) — TDD, debugging, brainstorming skills
- **Marketing level:** `zoho` (mail+calendar), `file-reader` (local)
- **Self-hosted in `tools/mcp-servers/`:** DataForSEO, GeoSEO, MCP-Marketing, mcp-marketing-suite, file-reader

## How to work

1. **Always use superpowers first** — for planning, debugging, code review, and workflow enforcement
2. Read `Marketing/CEETY_MEMORY.md` first — holds identity, mission, inventory
3. Use `Marketing/SKILLS_INDEX.md` to find the right skill
4. For SEO → `Marketing/skills/seo/claude-seo/` (read its AGENTS.md)
5. For content/campaign/strategy → `Marketing/skills/agents/kai-cmo/` (read its AGENTS.md)
6. For anything else → grep `Marketing/skills/` for matching skill directory

## Superpowers workflow (always use)

- **Before planning:** `brainstorming` to explore requirements
- **Before coding:** `writing-plans` for implementation steps
- **During coding:** `test-driven-development` — RED-GREEN-REFACTOR
- **When stuck:** `systematic-debugging` — investigate before fixing
- **Before claiming done:** `verification-before-completion` — run it, read output
- **After coding:** `requesting-code-review` for review
