# Shipyard Feature Specs
## Detailed breakdown of every MVP feature

**Positioning**: AI coding tools build your app. Shipyard builds everything around it.
**ICP**: Solo founders / 1-5 person teams who built their MVP with an AI coding tool (Base44, Lovable, Bolt, Claude Code, Antigravity, Google AI Studio, etc.) and now need it to survive contact with real users, compliance, and eventual hires.

---

## Feature 0: The Translator (Business Intel → Tech Intel)

### What it does
The new centerpiece. A founder describes their business in plain English (or pastes their business plan / pitch deck text). Shipyard extracts the technical implications and produces a "Tech Brief" — the translation layer between "what I'm building" and "what infrastructure that requires."

### User Stories
- As a non-technical founder, I can describe my business idea and get back a recommended architecture, stack, and compliance checklist — without knowing what any of those words mean going in
- As a founder who already has a repo from Base44/Lovable/Claude Code, I can connect it so the Translator factors in what's actually been built, not just what I describe
- As a founder, I can hand the Tech Brief straight to the Architect to generate a real deployment workflow

### Acceptance Criteria for Demo
- [ ] Text input accepts a multi-sentence business description (or pasted doc text)
- [ ] Optional: "Connect repo" shows a connected GitHub repo with detected stack (can be pre-seeded for demo)
- [ ] Submit extracts and displays tags: industry, estimated scale, team size, compliance needs (HIPAA/SOC2/GDPR)
- [ ] Generates a Tech Brief card showing: architecture pattern, recommended stack, compliance-to-infra mapping, estimated monthly cost
- [ ] "Generate workflow" button hands off to the Architect/Workflow Builder with pre-filled nodes based on the brief
- [ ] Works for at least these demo inputs:
  1. "We're a telehealth startup connecting rural clinics with specialists. Expecting 5,000 patients in year one, need HIPAA compliance, small team of 3 engineers."
  2. "We're a climate nonprofit building a donation tracking app for small NGOs. Low budget, expect a few hundred users."
  3. "We built an MVP with Base44 — a marketplace app with Next.js and Supabase. Need to get it production-ready for a launch next month."

### UX Flow
```
1. /translator → input panel (left) + Tech Brief panel (right, empty state)
2. User types business description or connects repo
3. Clicks "Translate to tech brief"
4. Loading: "Reading your business..." pulsing indicator
5. Tags appear (industry, scale, team size, compliance)
6. Tech Brief card populates: architecture, stack, compliance mapping, cost estimate
7. CTA: "Generate workflow" → /workflows/new with pre-filled Architect output
```

### Design Notes
- Compliance tags use the `degraded` (amber) color when flagged as required, `healthy` (green) once mapped to controls
- Tech Brief fields render as key-value rows in a card, matching the existing `.card` style

---

## Feature 1: Service Catalog

### What it does
A live, searchable registry of every service in the engineering org. Auto-populated, always current, clickable into detail.

### User Stories
- As a new engineer, I can open the catalog and understand what services exist, who owns them, and what they do — without asking anyone
- As a CTO, I can see the health of all services at a glance
- As a developer, I can find a service and immediately get to its repo, docs, or runbook

### Acceptance Criteria for Demo
- [ ] 10 seeded services visible in grid view
- [ ] Search filters in real time by name
- [ ] Filter by status works (Healthy / Degraded / Deploying)
- [ ] Filter by stack works
- [ ] Clicking a service opens its detail page
- [ ] Detail page shows: description, owner, stack, status, repo link, last deploy
- [ ] Dependencies tab shows a visual graph (even if simplified/mocked)
- [ ] Deployments tab shows last 3-5 deploy records

### Mock Data Required
See `shipyard-backend.md` → Seed Data section. 10 services with varying statuses.

### Design Notes
- Status dot should be animated (pulse) for "Deploying" state
- Stack tags color-coded: Python=blue, Node.js=green, Go=cyan, React=teal
- Hover on card lifts it slightly (transform: translateY(-2px))

---

## Feature 2: Workflow Builder

### What it does
A visual, drag-and-drop canvas to build golden path workflows. Think n8n but opinionated for platform engineering tasks.

### User Stories
- As a CTO, I can build a "New Service Setup" workflow once, so any developer can run it without asking me
- As a developer, I can see exactly what a workflow does before I run it
- As anyone, I can run a workflow and watch it execute in real time

### Acceptance Criteria for Demo
- [ ] Canvas renders with React Flow
- [ ] Left panel shows draggable node types
- [ ] Can drag nodes onto canvas
- [ ] Can connect nodes with edges
- [ ] Clicking a node opens config panel on the right
- [ ] 3 pre-built templates load correctly with pre-populated nodes/edges
- [ ] "Run" button triggers execution log panel
- [ ] Execution log animates line by line (typewriter effect)
- [ ] Final "✅ Workflow complete" message appears
- [ ] Workflow is saved when navigating away (Zustand store)

### Pre-built Templates (must work for demo)

**1. New Service Setup**
```
[Create GitHub Repo] → [Setup CI/CD] → [Provision Cloud Resource] → [Register in Catalog] → [Notify Slack]
```

**2. Developer Onboarding**
```
[Add Team Member Access] → [Provision Dev Environment] → [Register in Catalog] → [Notify Slack]
```

**3. Spin Up Environment**
```
[Approval Gate] → [Provision Cloud Resource] → [Notify Slack]
```

### Node Configs (right panel fields)

**Create GitHub Repo**
- Repo name (text input)
- Visibility (public/private toggle)
- Template repo (dropdown)

**Setup CI/CD**
- Provider (GitHub Actions / other)
- Trigger events (checkboxes: push, PR, tag)

**Provision Cloud Resource**
- Provider (AWS / GCP)
- Resource type (EC2, RDS, S3, Lambda)
- Region (dropdown)
- Resource name (text)

**Register in Catalog**
- Service name (auto-filled from repo name)
- Tech stack (multi-select tags)
- Owner (team member dropdown)

**Notify Slack**
- Channel (text, e.g. #engineering)
- Message template (textarea)

**Approval Gate**
- Approvers (team member multi-select)
- Message to approvers (text)

---

## Feature 3: The Architect (AI Workflow Generator)

### What it does
The user describes what they need in plain English. The AI generates a complete workflow on the canvas, ready to run or edit.

### User Stories
- As a founder, I can type "I need a new Python service with a database and CI/CD" and get a ready-to-run workflow without knowing how to configure any of it

### Acceptance Criteria for Demo
- [ ] Text input accepts multi-sentence descriptions
- [ ] Submit triggers AI call (Gemini)
- [ ] Loading state shows animated indicator ("Architect is thinking...")
- [ ] Generated workflow appears on canvas with correct nodes and edges
- [ ] Explanation text appears below canvas ("Here's what I set up...")
- [ ] User can edit the generated workflow before running
- [ ] Works for at least these 3 demo inputs:
  1. "I need a FastAPI service with a Postgres database on AWS with CI/CD and a Slack notification"
  2. "Set up onboarding for a new backend developer joining our team"
  3. "Create a staging environment for our payments service"

### Fallback for Demo
If Gemini API is slow, have these 3 responses pre-baked and returned instantly when the exact phrases are detected. This guarantees a smooth demo.

```python
DEMO_SHORTCUTS = {
    "fastapi": FASTAPI_WORKFLOW_RESPONSE,
    "onboarding": ONBOARDING_WORKFLOW_RESPONSE,
    "staging": STAGING_WORKFLOW_RESPONSE,
}
```

### UX Flow
```
1. /workflows/new → Full-screen Architect input
2. User types description
3. Clicks "Generate Workflow" (or hits ⌘+Enter)
4. Loading: subtle pulsing gradient animation
5. Canvas animates in with nodes dropping into place (staggered)
6. Explanation text fades in below
7. Two CTAs: "Edit in Builder" → /workflows/[new-id]
               "Run Now" → triggers execution immediately
```

---

## Feature 4: Dashboard

### What it does
The home screen. At-a-glance health of the entire platform, recent activity, quick actions.

### Acceptance Criteria for Demo
- [ ] 4 metric cards with count-up animation on load
- [ ] 3 quick action buttons work (navigate to correct flow)
- [ ] Activity feed shows 10+ realistic events
- [ ] Health overview shows mini status for all 10 services
- [ ] Page loads fast (<500ms perceived)

### Metric Cards
| Metric | Demo Value | Trend |
|--------|------------|-------|
| Total Services | 10 | ↑ +2 this month |
| Workflows Run | 24 | ↑ this week |
| Team Members | 6 | — |
| Last Deploy | 2h ago | — |

### Activity Feed Events (seed these)
```
[2h ago]  🚀 payments-service deployed by Ana Rodriguez
[3h ago]  ✅ New Service Setup workflow completed for "auth-v2"
[5h ago]  👋 Marcus Chen joined the team
[6h ago]  ⚠️  notification-worker degraded — high memory usage
[1d ago]  🚀 frontend-web deployed by You
[1d ago]  ✅ Developer Onboarding completed for Marcus Chen
[2d ago]  🔗 AWS integration connected
[2d ago]  📋 analytics-service registered in catalog
[3d ago]  🚀 data-pipeline deployed by Jordan Kim
[3d ago]  ✅ Spin Up Environment completed for staging-v2
```

### Quick Actions
- "New Service" → opens Architect input (/workflows/new)
- "Onboard Developer" → runs Developer Onboarding template
- "New Environment" → runs Spin Up Environment template

---

## Feature 5: MCP / Integrations Hub

### What it does
Shows connected tools, grouped by role in the founder's stack, and allows connecting new ones. For the demo, connection is stubbed (GitHub may be real if time allows).

### Acceptance Criteria for Demo
- [ ] Integrations grouped into three sections: **Build tools**, **Deploy targets**, **Operate**
- [ ] At least 3 shown as "Connected" with org/account info (one per section)
- [ ] Remaining shown as "Not Connected" with "Connect" button
- [ ] Clicking "Connect" on a disconnected integration shows a mock OAuth flow (modal: "Connecting..." then "Connected!")
- [ ] Connected integrations show: logo, name, connected account name, disconnect option

### Integrations to Show

**Build tools** (where your app comes from)
| Integration | Status | Detail |
|-------------|--------|--------|
| GitHub | ✅ Connected | acme-org (24 repos) |
| Base44 | ○ Not connected | |
| Lovable | ○ Not connected | |
| Claude Code | ○ Not connected | |
| Google AI Studio / Antigravity | ○ Not connected | |
| Figma | ○ Not connected | |

**Deploy targets**
| Integration | Status | Detail |
|-------------|--------|--------|
| AWS | ✅ Connected | us-east-1 |
| Vercel | ○ Not connected | |
| GCP | ○ Not connected | |
| Supabase | ○ Not connected | |

**Operate**
| Integration | Status | Detail |
|-------------|--------|--------|
| Slack | ✅ Connected | #engineering, #deployments |
| Google Workspace | ○ Not connected | |
| Microsoft 365 | ○ Not connected | |
| PagerDuty | ○ Not connected | |
| Datadog | ○ Not connected | |

---

## Out of Scope for AIVA Demo (Roadmap Talking Points)

These are things to mention verbally but not demo:

**Incident Response Agent**
"We're building an AI agent that automatically investigates incidents — correlates the alert with recent deploys, scans logs, posts a summary to Slack, and can execute a fix with one-click approval. No SRE required."

**Platform Memory**
"Over time, Shipyard builds institutional knowledge about how your venture operates — every workflow run, every deploy. When you eventually hire your first engineer, they inherit a fully documented system instead of a black box."

**Real GitHub/AWS/Vercel Integration**
"The integrations are stubbed in the demo but the real OAuth flows and API connections are on the immediate roadmap, starting with GitHub."

**Marketing & Business Layer (future)**
"Once your infrastructure is live, the same platform extends to business health — connecting analytics (PostHog/GA), auto-drafting changelogs when features ship, and linking technical milestones to marketing actions. Shipyard becomes the operating system for the whole company, not just the infra."

**Team Permissions & Access Control**
"We're deliberately keeping permissions simple in V1 — single founder or small team. Fine-grained access control comes once teams grow past the founding group."

**Billing & Multi-Tenant**
"Pricing model is per-seat SaaS with a generous free tier for solo founders. We're talking to early customers now."