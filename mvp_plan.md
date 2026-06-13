# Shipyard MVP Plan
## "AI coding tools build your app. Shipyard builds everything around it."

---

## Status as of June 13, 2026 — deadline extended to June 22 (9 days)

### End goal for June 22
Ship a live, demoable product that proves three things in under 3 minutes, now with room to make each one deeper/more "real" than the original 1-day cut:
1. **Translate** — a founder describes their business in plain English and gets a real technical brief (architecture, stack, compliance, cost).
2. **Agent** — a real AI agent with live tool access (GitHub, Notion, Slack, Figma, +more) that can answer questions and take actions across the founder's actual stack — not a scripted demo.
3. **Daily Brief** — a generated, spoken morning rundown of the company's status, pulling from the same live tools + the service catalog.

Plus a polished, modern, modular frontend across every page (landing + app) that doesn't read like a tech doc.

**With the extra 8 days**, the items previously deferred under "What We Are NOT Building for AIVA" (below) are now back on the table as stretch goals — particularly real OAuth for GitHub/Slack/Notion (vs. manual tokens), a real Postgres-backed service catalog instead of mock data, and expanding the agent's tool set. These should be prioritized only after the June 14 punch list (deploy, demo video, pitch deck) is done, since the submission still needs a working, demoable link as the floor.

### Done
- **Landing page** — fully rewritten as modular components (`src/components/marketing/*`): new hero, stats, pain points, product tour, how-it-works, integrations marquee, waitlist CTA, footer. New conversational copy, no "high and mighty" claims.
- **Global page transitions** — `PageTransition` wraps the whole `(app)` shell via framer-motion.
- **Dashboard** — reframed as "everything you've shipped, in one place", animated metric cards, fixed hook bug.
- **The Translator** — plain English → Tech Brief (architecture, stack, compliance mapping, cost estimate) via `/api/translator`, with fallback heuristic. Wired to "Generate workflow" handoff. Polished copy + animation.
- **Workflows / Catalog / Integrations / Team** — already modular/token-based, inherit global transitions.
- **Agent Chat (`/chat`)** — NEW. Real agentic chat via `/api/chat`: Claude tool-use loop over **real, live API integrations**:
  - GitHub (list repos, list issues, create issue) — `GITHUB_TOKEN`
  - Notion (search, create page) — `NOTION_TOKEN`
  - Slack (post message, list channels) — `SLACK_BOT_TOKEN`
  - Figma (file metadata, comments) — `FIGMA_TOKEN`
  UI shows each tool call as an expandable step (inputs/outputs) + live per-integration connection badges. Gracefully reports "not connected" per-tool if a token is missing.
- **Daily Brief (`/daily-brief`)** — NEW. `/api/daily-brief` runs the agent against the service catalog + connected tools to generate headline / wins / needs-attention / integration notes, plus a spoken narration played via browser `speechSynthesis` ("Listen" button).
- **Nav** — Agent + Daily Brief added to sidebar.
- **Env config** — `.env.local.example` documents all 5 keys (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `NOTION_TOKEN`, `SLACK_BOT_TOKEN`, `FIGMA_TOKEN`). Everything degrades gracefully without keys.
- `tsc` + `eslint` clean on all touched/new files. Dev server verified serving `/chat`, `/daily-brief`, `/api/chat`, `/api/daily-brief`.

### Left — Phase 1 (do first, same as the original June 14 punch list)
1. **Drop in real keys** — `ANTHROPIC_API_KEY` (have it) + `GITHUB_TOKEN` (priority) into `.env.local`, then live-test the Agent against real GitHub data. Add Notion/Slack/Figma tokens as time allows.
2. **Deploy to Vercel** — push current state live, set the same env vars in Vercel project settings. *(This is the "live product link" submission requirement — get this done early so there's always a working fallback link.)*
3. **Demo video script** — update the existing demo story (below) to include the Agent chat + Daily Brief as the new centerpieces, record ≤3 min walkthrough.
4. **Pitch deck content + speaker notes** — incorporate the "real agentic AI + real integrations" angle as the differentiator vs. other AI-wrapper submissions.
5. Smoke-test on mobile widths; quick visual QA pass on `/chat` and `/daily-brief` against the rest of the app's design tokens.

### Left — Phase 2 (stretch goals enabled by the extra time, June 15–22)
6. **Real OAuth** for GitHub/Slack/Notion instead of manual tokens — better demo flow ("Connect your GitHub" button vs. env vars).
7. **Persist the service catalog** — move off `src/lib/mock-data.ts` to a real Postgres/Supabase-backed catalog, possibly auto-populated from the connected GitHub org.
8. **Expand the Agent's tool set** — more GitHub actions (PRs, CI status), Vercel/AWS read access, more Slack actions.
9. **The Architect** — make workflow generation graph-aware (reads the real catalog instead of static templates).
10. *(If time allows)* Begin the MCP server endpoint described in `backend/mvp_plan.md` as a "wow" moment for technical reviewers.

---

## Repositioning (as of June 10, 2026)

**Old framing**: Managed Backstage for 10–60 person eng teams.
**New framing**: The production layer for founders building with AI coding tools.

**Positioning statement**: AI coding tools (Base44, Lovable, Bolt, v0, Replit, Google AI Studio, Antigravity, Claude Code, Codex, Cursor) get you a working app fast. None of them handle what comes next — deployment, infrastructure, compliance, monitoring, and the documentation a future hire needs to understand what was built. Shipyard is that missing layer.

**ICP**: Solo founders / 1–5 person teams who built (or are building) their MVP with an AI coding tool, have little/no infra or ops knowledge, and are at — or approaching — the "we have real users now" moment.

**The hook (from founder's own story)**: 68% of internal developer portals are abandoned within 18 months because they need dedicated headcount to maintain. Vibe-coded MVPs hit the same wall on day one — they were never built with a platform team in mind, because there isn't one. Shipyard is that platform team, generated automatically.

---

## AIVA Demo Story (3 minutes) — updated

> "You used [Base44 / Claude Code / Lovable] to build your MVP this weekend. It works on your laptop. Now what?"

1. **Connect** — link the GitHub repo your AI tool generated. Shipyard scans it (stack, dependencies, gaps).
2. **Translate** — describe your business in plain English. Shipyard generates a Tech Brief: recommended architecture, compliance flags (HIPAA/SOC2/GDPR), cost estimate.
3. **Architect** — one click turns the Tech Brief into a real deployment workflow (IaC, CI/CD, monitoring, docs).
4. **Agent** — open the Agent tab and ask it something real: "what are my most active repos?" / "any open issues I should look at?" — it calls live GitHub/Notion/Slack/Figma tools and shows its work step by step.
5. **Daily Brief** — open the Daily Brief: a generated morning rundown across your stack, read aloud.
6. **Dashboard** — founder now has a live "company health" view: infra status, cost, compliance, docs coverage — all in plain English.

---

## Core Features for the Demo

### 1. Landing Page — done
Repositioned copy, modular components, conversational tone.

### 2. Connect / Import
- Connect GitHub repo (the output of Base44/Lovable/Claude Code/etc.)
- Shipyard detects stack from repo (framework, DB, deps)
- For demo: can use a pre-seeded "imported" repo if live OAuth isn't ready

### 3. The Translator — done
- Plain-English business description input
- Outputs a **Tech Brief**: architecture pattern, recommended stack, compliance-to-infra mapping, cost estimate
- "Generate workflow" → hands off to Architect/Workflow Builder

### 4. The Architect (existing — repurposed)
- Takes the Tech Brief (or a typed request) and generates a workflow on the canvas
- Existing 3 templates remain (New Service Setup, Onboarding, Spin Up Environment) + a new "Deploy MVP from repo" template

### 5. MCP / Integrations Hub (existing page — expanded)
Reframe into three groups:
- **Build tools** (where your app comes from): GitHub, Base44, Lovable, Claude Code, Antigravity, Google AI Studio, Figma
- **Deploy targets**: AWS, GCP, Vercel, Supabase
- **Operate**: Slack, Google Workspace / Microsoft 365, PagerDuty, Datadog

### 6. Dashboard (existing — reframed) — done
Same layout, new framing: "Your venture's tech health" — infra status, cost, compliance score, docs coverage, recent MCP activity.

### 7. Agent Chat (`/chat`) — done, NEW
- Real Claude tool-use agent with live GitHub/Notion/Slack/Figma access via API tokens
- Visible step-by-step tool calls (the "orchestration" feel)
- Per-integration connection status badges

### 8. Daily Brief (`/daily-brief`) — done, NEW
- Agent-generated morning rundown across service catalog + connected tools
- Spoken aloud via browser TTS

---

## What We Are NOT Building for AIVA
- OAuth flows for integrations (using direct API tokens instead — still real, live data, just faster to wire up)
- Real Terraform execution (show generated plan, simulate apply)
- Marketing/CRM integration layer (verbal roadmap only)
- Multi-tenant auth, billing, fine-grained permissions
- Full RepoPrompt-style multi-agent orchestrator (single agent with tool-use loop instead — visible steps give the same "watching it work" feel within a 1-day budget)

---

## Build Plan — original 4 days (June 10–14), now extended to June 22

| Day | Focus | Status |
|-----|-------|--------|
| **Day 1 (Wed)** | Repositioning pass: landing page copy, dashboard framing, integrations page restructure | Done |
| **Day 2 (Thu)** | Translator page + Architect handoff | Done |
| **Day 3 (Fri)** | MCP activity log, Agent chat + real integrations, Daily Brief, connect demo data end-to-end | Done |
| **Day 4 (Sat, June 14)** | Phase 1 punch list: deploy to Vercel with real keys, demo video, pitch deck, polish | Remaining — do first |
| **June 15–21** | Phase 2 stretch goals: real OAuth, persisted catalog, expanded agent tools, graph-aware Architect, MCP server prototype | Remaining — time permitting |
| **June 22** | Final polish, re-record demo video if scope grew, final submission | Remaining |

---

## Three AIVA Submissions — Tracking

1. **Live product link** — remaining: deploy current app to Vercel with env vars set. Must show core features working, not a promo page.
2. **Demo video** (≤3 min, YouTube public/unlisted, English subtitles) — remaining: script needs updating to include Agent + Daily Brief.
3. **Pitch deck** (PDF/slides + detailed speaker notes) — not started; lean on "real agentic AI + real integrations, built in days" as the differentiator.

---

## Tech Stack (current)

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Zustand, lucide-react
- **Agent / AI**: Claude API (`claude-sonnet-4-5-20250929`) via direct `fetch` to `/v1/messages`, tool-use loop in `src/app/api/chat/route.ts` and `src/app/api/daily-brief/route.ts`
- **Live integrations**: GitHub, Notion, Slack, Figma — token-based REST calls in `src/lib/agent/tools.ts`
- **Deploy**: Frontend on Vercel. No separate backend service currently — all "backend" logic lives in Next.js route handlers under `src/app/api/`.
