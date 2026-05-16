# Shipyard Feature Specs
## Detailed breakdown of every MVP feature

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

## Feature 5: Integrations Panel

### What it does
Shows connected tools and allows connecting new ones. For the demo, connection is stubbed.

### Acceptance Criteria for Demo
- [ ] 8 integrations shown in grid
- [ ] 3 shown as "Connected" with org/account info
- [ ] 5 shown as "Not Connected" with "Connect" button
- [ ] Clicking "Connect" on a disconnected integration shows a mock OAuth flow (just a modal saying "Connecting..." then "Connected!")
- [ ] Connected integrations show: logo, name, connected account name, disconnect option

### Integrations to Show

| Integration | Status | Detail |
|-------------|--------|--------|
| GitHub | ✅ Connected | acme-org (24 repos) |
| AWS | ✅ Connected | us-east-1 |
| Slack | ✅ Connected | #engineering, #deployments |
| Google Cloud | ○ Not connected | |
| Vercel | ○ Not connected | |
| PagerDuty | ○ Not connected | |
| Datadog | ○ Not connected | |
| Linear | ○ Not connected | |

---

## Out of Scope for Google I/O (Roadmap Talking Points)

These are things to mention verbally but not demo:

**Incident Response Agent**
"We're building an AI agent that automatically investigates incidents — correlates the alert with recent deploys, scans logs, posts a summary to Slack, and can execute a fix with one-click approval. No SRE required."

**Platform Memory**
"Over time, Shipyard builds institutional knowledge about how your team operates — every workflow run, every incident resolved. New developers can ask it questions and get answers grounded in your actual history."

**Real GitHub/AWS Integration**
"The integrations are stubbed in the demo but the real OAuth flows and API connections are on the immediate roadmap."

**Team Permissions & Access Control**
"We're deliberately keeping permissions simple in V1 — admin or member. Fine-grained access control is coming once we understand how teams actually use it."

**Billing & Multi-Tenant**
"Pricing model is per-seat SaaS. We're talking to early customers now."