# Shipyard Frontend Plan

---

## Design Direction

### Aesthetic
**Industrial precision meets developer warmth.**

Not the cold, enterprise grey of AWS. Not the playful bubbly SaaS of Notion. Shipyard feels like a high-end engineering tool — confident, dense with information, but approachable. Think Vercel's dashboard meets Linear's focus meets a touch of Figma's spatial canvas.

- **Theme**: Dark by default (developers live in dark mode)
- **Feel**: Precise, purposeful, fast. Every pixel earns its place.
- **Personality**: This is a tool built by engineers who care about craft

### Color System
```css
:root {
  /* Backgrounds */
  --bg-base: #0A0A0F;        /* near-black with blue undertone */
  --bg-surface: #111118;     /* card/panel backgrounds */
  --bg-elevated: #1A1A24;    /* modals, dropdowns */
  --bg-hover: #1E1E2E;       /* hover states */

  /* Brand */
  --brand-primary: #6366F1;  /* indigo — the Shipyard color */
  --brand-glow: #818CF8;     /* lighter for glows/hovers */
  --brand-muted: #3730A3;    /* darker for backgrounds */

  /* Status */
  --status-healthy: #10B981;   /* green */
  --status-degraded: #F59E0B;  /* amber */
  --status-down: #EF4444;      /* red */
  --status-deploying: #6366F1; /* brand indigo */

  /* Text */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #475569;

  /* Borders */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.18);

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  --gradient-surface: linear-gradient(180deg, #111118 0%, #0A0A0F 100%);
}
```

### Typography
```css
/* Display / Headings */
font-family: 'Sora', sans-serif;  /* geometric, modern, distinct */

/* Body / UI */
font-family: 'DM Sans', sans-serif;  /* clean, readable at small sizes */

/* Code / Monospace */
font-family: 'JetBrains Mono', monospace;
```

Import from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Motion Principles
- Page transitions: subtle fade + slide up (200ms)
- Hover states: 150ms ease
- Workflow node drag: spring physics via Framer Motion
- Execution log: typewriter effect for log lines appearing
- Dashboard numbers: count-up animation on load
- Skeleton loaders instead of spinners

---

## App Structure

```
shipyard/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, sidebar, nav
│   ├── page.tsx                  # Redirect to /dashboard
│   ├── dashboard/
│   │   └── page.tsx              # Home dashboard
│   ├── catalog/
│   │   ├── page.tsx              # Service catalog list
│   │   └── [serviceId]/
│   │       └── page.tsx          # Service detail
│   ├── workflows/
│   │   ├── page.tsx              # Workflow library
│   │   ├── [workflowId]/
│   │   │   └── page.tsx          # Workflow builder canvas
│   │   └── new/
│   │       └── page.tsx          # New workflow (Architect entry)
│   ├── integrations/
│   │   └── page.tsx              # Connected integrations
│   ├── team/
│   │   └── page.tsx              # Team members
│   └── settings/
│       └── page.tsx              # Org settings
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── PageHeader.tsx
│   ├── catalog/
│   │   ├── ServiceCard.tsx
│   │   ├── ServiceList.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── StatusBadge.tsx
│   │   └── DependencyGraph.tsx
│   ├── workflows/
│   │   ├── WorkflowCanvas.tsx    # React Flow wrapper
│   │   ├── NodeLibrary.tsx       # Drag source panel
│   │   ├── nodes/
│   │   │   ├── RepoNode.tsx
│   │   │   ├── CICDNode.tsx
│   │   │   ├── ProvisionNode.tsx
│   │   │   ├── SlackNode.tsx
│   │   │   ├── CatalogNode.tsx
│   │   │   └── AINode.tsx
│   │   ├── WorkflowCard.tsx
│   │   └── ExecutionLog.tsx
│   ├── architect/
│   │   ├── ArchitectInput.tsx    # The AI text input
│   │   └── ArchitectResult.tsx  # Generated workflow preview
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── QuickActions.tsx
│   ├── integrations/
│   │   ├── IntegrationCard.tsx
│   │   └── IntegrationGrid.tsx
│   └── ui/                       # shadcn/ui base components
├── lib/
│   ├── api.ts                    # API client (fetch wrapper)
│   ├── mock-data.ts              # Seed data for demo
│   └── types.ts                  # Shared TypeScript types
├── store/
│   ├── catalog.ts                # Zustand store for services
│   ├── workflows.ts              # Workflow state
│   └── ui.ts                     # UI state (sidebar, modals)
└── styles/
    └── globals.css               # CSS variables, base styles
```

---

## Pages

### 1. Dashboard (`/dashboard`)

**Layout**: 3-column grid at top, activity feed below

**Components**:
- `MetricCard` × 4: Total Services, Workflows Run This Week, Team Members, Last Deploy
- `QuickActions`: 3 big buttons — "New Service", "Onboard Dev", "New Environment"
- `ActivityFeed`: Recent workflow runs, deploys, new services added
- `HealthOverview`: Mini service status grid (all services, color-coded)

**Demo moment**: Numbers count up on load. Activity feed shows realistic recent activity.

---

### 2. Service Catalog (`/catalog`)

**Layout**: Filters sidebar + card grid

**Components**:
- Search bar (prominent, top)
- Filter pills: by team, by stack, by status
- `ServiceCard` grid:
  - Service name + icon (auto-generated from stack)
  - Owner avatar + name
  - Stack tags (Python, FastAPI, PostgreSQL)
  - Status badge (Healthy / Degraded / Deploying)
  - Last deployed timestamp
  - Quick actions: View, Run Workflow
- Empty state with CTA to connect GitHub

**Demo seed data** (10 services):
- `payments-service` — Node.js, Stripe, PostgreSQL — Healthy
- `auth-service` — Python, FastAPI — Healthy
- `notification-worker` — Python, Redis, Celery — Degraded
- `frontend-web` — Next.js, Vercel — Healthy
- `admin-dashboard` — React — Healthy
- `data-pipeline` — Python, Airflow — Deploying
- `recommendation-engine` — Python, ML — Healthy
- `file-storage-service` — Go, S3 — Healthy
- `analytics-service` — Python, BigQuery — Healthy
- `email-service` — Node.js, SendGrid — Healthy

---

### 3. Service Detail (`/catalog/[serviceId]`)

**Layout**: Full-width with tabs

**Tabs**:
1. Overview — description, owner, stack, links (repo, docs, runbook)
2. Dependencies — visual graph of what this service talks to
3. Deployments — recent deploy history, who deployed, what changed
4. Runbooks — linked SOPs (placeholder for demo)

**Sidebar**: Status, health metrics (latency, error rate — mocked), quick actions

---

### 4. Workflow Builder (`/workflows/[id]`)

**Layout**: Full-screen canvas — left panel (node library) + main canvas + right panel (node config)

**Left Panel**: Draggable node types
- 🗂 Create GitHub Repo
- ⚙️ Setup CI/CD Pipeline
- ☁️ Provision Cloud Resource
- 💬 Send Slack Notification
- 📋 Register in Catalog
- 👤 Add Team Member Access
- ✅ Approval Gate
- 🤖 AI Node (Architect)

**Canvas**: React Flow
- Nodes connected by animated edges
- Click a node → right panel shows its config
- Run button → triggers execution log panel sliding up from bottom

**Execution Log Panel** (slides up on run):
```
[10:42:01] ▶ Starting workflow: New Service Setup
[10:42:01] ✓ Creating GitHub repository: payments-v2
[10:42:03] ✓ Repository created: github.com/acme/payments-v2
[10:42:03] ▶ Setting up CI/CD pipeline...
[10:42:05] ✓ GitHub Actions workflow configured
[10:42:05] ▶ Provisioning AWS resources...
[10:42:08] ✓ RDS instance created: payments-v2-db
[10:42:08] ▶ Registering service in catalog...
[10:42:09] ✓ Service registered: payments-v2
[10:42:09] ▶ Sending Slack notification...
[10:42:10] ✓ Message sent to #engineering
[10:42:10] ✅ Workflow complete in 9s
```
(Typewriter effect, each line appears 500ms apart)

---

### 5. Workflow Library (`/workflows`)

**Layout**: Grid of workflow cards + "New Workflow" button

**Pre-built templates** (shown as cards):
- 🚀 New Service Setup
- 👋 Developer Onboarding
- ☁️ Spin Up Environment
- 🔁 CI/CD Pipeline Setup
- 📋 Service Offboarding

Each card shows: name, description, last run, run count, "Use Template" CTA

---

### 6. The Architect (`/workflows/new`)

**Layout**: Centered, full-page focus mode

**Flow**:
1. Large text input: "Describe what you need..."
   - Placeholder: "I need a FastAPI service with a Postgres database on AWS, a CI/CD pipeline, and a Slack notification when deployed"
2. Submit → loading state (AI generating)
3. Generated workflow appears on canvas below
4. "Edit in Builder" or "Run Now" CTAs

**Visual**: Subtle animated gradient background during AI generation

---

### 7. Integrations (`/integrations`)

**Layout**: Grid of integration cards

**Integrations shown**:
- GitHub ✅ Connected (acme-org)
- AWS ✅ Connected (us-east-1)
- Slack ✅ Connected (#engineering)
- GCP 〇 Not connected
- Vercel 〇 Not connected
- PagerDuty 〇 Not connected
- Datadog 〇 Not connected
- Linear 〇 Not connected

Each card: logo, name, status badge, "Connect" or "Manage" button, brief description

---

## Key UI Components

### StatusBadge
```tsx
type Status = 'healthy' | 'degraded' | 'down' | 'deploying'

// Pill with colored dot + label
// Healthy → green dot, "Healthy"
// Degraded → amber dot, "Degraded"
// Down → red dot, "Down"
// Deploying → animated indigo dot, "Deploying"
```

### ServiceCard
- Hover: subtle border glow in brand indigo
- Stack tags as colored pills (color-coded by language)
- Owner shown as avatar + name
- Last deployed: relative time ("2h ago")

### Node (Workflow Canvas)
- Dark card with icon + label
- Selected state: indigo border glow
- Running state: pulsing animation
- Complete state: green checkmark overlay
- Error state: red border

### MetricCard (Dashboard)
- Large number (count-up animation)
- Trend indicator (↑ +12% this week)
- Icon top-right
- Subtle gradient border

---

## Responsive Behavior
- Desktop first (1280px+) — this is a developer tool
- Sidebar collapses to icon-only at 1024px
- Workflow builder is desktop-only (show message on mobile)
- Catalog and dashboard work on tablet (768px+)

---

## Demo-Specific Notes
- All data starts seeded from `lib/mock-data.ts`
- Workflow execution is simulated (no real API calls needed for demo)
- AI responses can be pre-baked for the specific demo inputs
- Keep a "Reset Demo" button in dev mode to restore seed data
- Have a rehearsed click path: Dashboard → Catalog → New Workflow → Architect → Run