# Shipyard MVP Plan
## "Backstage's vision. None of the maintenance."

---

## What We're Building

Shipyard is a managed Internal Developer Platform for small engineering teams that can't afford a platform team. You get a working service catalog, self-service templates, and AI-powered setup — without hiring, building, or maintaining any of it yourself.

**Positioning**: Backstage is a framework. Shipyard is the platform team.

**ICP**: Founders and CTOs at startups with 10–60 engineers, no dedicated platform team.

---

## Google I/O MVP Scope (1 week)

This is a demo-first MVP. The goal is to walk someone through a compelling story in under 3 minutes. Every feature decision should ask: *does this make the demo better?*

### The Demo Story
> "You just hired your 4th backend engineer. Watch what onboarding looks like without Shipyard — and with it."

**Without Shipyard**: Slack DMs, tribal knowledge, manual repo setup, someone writes Terraform, takes 3 days.

**With Shipyard**: Open the dashboard, see all your services in the catalog, click "New Service", describe it in plain English, watch the workflow execute. Done in 4 minutes.

---

## MVP Features (Demo-Ready)

### 1. Service Catalog
- Auto-populated list of services (can be seeded/mocked for demo)
- Each service shows: name, owner, tech stack, status (healthy/degraded), last deployed
- Search and filter
- Click into a service → see description, dependencies, README preview, linked repo

### 2. Workflow Builder (Visual, Simplified)
- Canvas with drag-and-drop nodes (not full n8n complexity — just enough to look real)
- Pre-built node types: Create Repo, Setup CI/CD, Provision Environment, Send Slack Notification, Register in Catalog
- 3 pre-built workflow templates:
  - New Service Setup
  - Developer Onboarding
  - Spin Up Environment
- Run a workflow → show a live execution log (can be simulated)

### 3. The Architect (AI Node)
- Text input: "I need a FastAPI service with a Postgres database on AWS"
- AI maps it to the right workflow template and pre-fills the nodes
- This is the demo centerpiece — show it live

### 4. Integrations Panel
- Show connected integrations: GitHub, AWS, Slack
- Toggle switches (UI only for demo — don't need real OAuth for Google I/O)
- Visual showing "your stack, connected"

### 5. Dashboard / Home
- Summary: X services, X workflows run this week, X team members
- Recent activity feed
- Quick actions: "New Service", "Onboard Dev", "New Environment"

---

## What We Are NOT Building for Google I/O
- Real GitHub OAuth / actual repo creation
- Real Terraform execution
- Access control / permissions
- Billing
- Multi-tenant auth
- Incident response agent
- Full platform memory

These are roadmap stories to tell verbally. The demo shows the UI and AI — not real infra execution.

---

## Files in This Plan
1. `shipyard-mvp-plan.md` — this file, master overview
2. `shipyard-frontend.md` — frontend architecture, design system, pages, components
3. `shipyard-backend.md` — backend architecture, API design, data models
4. `shipyard-features.md` — detailed feature specs for each MVP feature
5. `shipyard-design.md` — visual design direction, color, typography, UI principles

---

## Tech Stack Decision

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom design tokens
- **UI Components**: shadcn/ui as base, heavily customized
- **Canvas/Workflow**: React Flow (for the workflow builder)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand (lightweight, fast to set up)

### Backend
- **Framework**: FastAPI (Python — you know this from LearnPulse)
- **Database**: PostgreSQL + SQLAlchemy
- **AI**: Gemini API (you have experience with this)
- **Auth**: Clerk (fastest to set up, great DX)
- **Background Jobs**: Not needed for MVP

### Deployment (for demo day)
- Frontend: Vercel
- Backend: Railway or Render (fast deploys, free tier)
- DB: Supabase (managed Postgres, free tier)

---

## Timeline 

| Day | Focus |
|-----|-------|
| Day 1 | Design system, layout, navigation, dashboard shell |
| Day 2 | Service catalog — list view, detail view, search |
| Day 3 | Workflow builder canvas — nodes, connections, templates |
| Day 4 | The Architect (AI input → workflow generation) |
| Day 5 | Integrations panel, execution log simulation, polish |
| Day 6 | Backend API + connect frontend to real data |
| Day 7 | End-to-end demo run, bug fixes, deploy |

---

## The Pitch (30 seconds at Google I/O)

"Every engineering team needs an internal developer platform — a service catalog, self-service templates, a way to onboard devs and spin up services without filing tickets. Backstage is the standard but it takes months to set up and a full-time engineer to maintain. Most small teams can't afford that. Shipyard is the managed version — you connect your GitHub and AWS, and you get a working platform in an afternoon. This is what I'm building."

Then show the demo.