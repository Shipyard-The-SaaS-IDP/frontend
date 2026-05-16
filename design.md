# Shipyard Design System
## Visual language, components, and principles

---

## Brand Identity

**Name**: Shipyard
**Tagline**: Backstage is a framework. Shipyard is the platform team.
**Voice**: Confident, technical, approachable. Never corporate. Never fluffy.
**Logo concept**: An anchor or ship's wheel rendered as a minimal geometric mark in indigo.

---

## Design Principles

1. **Information density over whitespace** — Developers are comfortable with dense UIs (GitHub, Linear, Vercel). Don't waste space.
2. **Dark by default** — This is a developer tool. Light mode is secondary.
3. **Status at a glance** — Health and status should be readable in 1 second without reading text.
4. **Actions are obvious** — Every page has one primary action. It's always clear what to do next.
5. **Speed feels like trust** — Instant feedback, skeleton loaders, optimistic updates. A slow tool is an untrustworthy tool.

---

## Color System

### Core Palette
```css
/* Base backgrounds */
--color-bg-base:     #0A0A0F;   /* Page background */
--color-bg-surface:  #111118;   /* Cards, panels */
--color-bg-elevated: #1A1A24;   /* Modals, popovers */
--color-bg-hover:    #1E1E2E;   /* Hover states */
--color-bg-active:   #252538;   /* Active/pressed */

/* Brand - Indigo */
--color-brand-500:   #6366F1;   /* Primary brand */
--color-brand-400:   #818CF8;   /* Hover/lighter */
--color-brand-600:   #4F46E5;   /* Pressed/darker */
--color-brand-900:   #1E1B4B;   /* Subtle backgrounds */
--color-brand-glow:  rgba(99, 102, 241, 0.15);  /* Glow effect */

/* Status Colors */
--color-healthy:     #10B981;   /* Green */
--color-healthy-bg:  rgba(16, 185, 129, 0.10);
--color-degraded:    #F59E0B;   /* Amber */
--color-degraded-bg: rgba(245, 158, 11, 0.10);
--color-down:        #EF4444;   /* Red */
--color-down-bg:     rgba(239, 68, 68, 0.10);
--color-deploying:   #6366F1;   /* Indigo (matches brand) */
--color-deploying-bg:rgba(99, 102, 241, 0.10);

/* Text */
--color-text-primary:   #F1F5F9;   /* Main text */
--color-text-secondary: #94A3B8;   /* Supporting text */
--color-text-muted:     #475569;   /* Placeholders, disabled */
--color-text-inverse:   #0A0A0F;   /* On brand/light backgrounds */

/* Borders */
--color-border-subtle:  rgba(255, 255, 255, 0.05);
--color-border-default: rgba(255, 255, 255, 0.09);
--color-border-strong:  rgba(255, 255, 255, 0.16);
--color-border-brand:   rgba(99, 102, 241, 0.50);
```

### Stack Tag Colors
```css
/* Language/framework color coding */
--stack-python:     #3B82F6;   /* Blue */
--stack-nodejs:     #22C55E;   /* Green */
--stack-go:         #06B6D4;   /* Cyan */
--stack-react:      #38BDF8;   /* Sky blue */
--stack-nextjs:     #F1F5F9;   /* White */
--stack-postgres:   #6366F1;   /* Indigo */
--stack-redis:      #EF4444;   /* Red */
--stack-aws:        #F59E0B;   /* Amber */
--stack-gcp:        #10B981;   /* Green */
--stack-docker:     #0EA5E9;   /* Blue */
--stack-fastapi:    #10B981;   /* Green */
```

---

## Typography

### Font Stack
```css
/* Headings, display text */
font-family: 'Sora', -apple-system, sans-serif;

/* Body text, UI labels, inputs */
font-family: 'DM Sans', -apple-system, sans-serif;

/* Code, logs, technical values */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
```css
--text-xs:   11px / 1.4  /* Labels, tags, captions */
--text-sm:   13px / 1.5  /* Secondary body text */
--text-base: 14px / 1.6  /* Primary body text */
--text-md:   15px / 1.5  /* Slightly emphasized body */
--text-lg:   18px / 1.4  /* Section headers */
--text-xl:   22px / 1.3  /* Page headers */
--text-2xl:  28px / 1.2  /* Hero/dashboard metrics */
--text-3xl:  36px / 1.1  /* Display numbers */
```

### Weight Usage
- 400 Regular — body text, descriptions
- 500 Medium — UI labels, navigation, table headers
- 600 Semibold — card titles, emphasis
- 700 Bold — page headings, metric numbers

---

## Spacing System
```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

---

## Border Radius
```css
--radius-sm:   4px    /* Tags, badges */
--radius-md:   8px    /* Buttons, inputs */
--radius-lg:   12px   /* Cards */
--radius-xl:   16px   /* Modals, large panels */
--radius-full: 9999px /* Pills, avatars */
```

---

## Shadows & Elevation
```css
/* Cards */
--shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);

/* Elevated panels */
--shadow-elevated: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08);

/* Brand glow (on hover, active brand elements) */
--shadow-brand: 0 0 20px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.3);

/* Modals */
--shadow-modal: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10);
```

---

## Component Patterns

### Sidebar
- Width: 240px expanded, 64px collapsed
- Background: `--color-bg-surface`
- Right border: `--color-border-subtle`
- Nav items: icon + label, active state has left border `--color-brand-500` + `--color-brand-glow` background
- Logo top, settings/user at bottom
- Collapse toggle at bottom

**Nav Items**:
```
⬡  Shipyard        [logo]
─────────────────
🏠 Dashboard
📋 Catalog
⚡ Workflows
🔗 Integrations
👥 Team
─────────────────
⚙️  Settings
👤 [User avatar]
```

### Top Bar
- Height: 56px
- Background: transparent (shows page bg through)
- Border bottom: `--color-border-subtle`
- Left: Breadcrumb / Page title
- Right: Search (global), Notifications bell, User menu

### Cards
```css
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: border-color 150ms, box-shadow 150ms;
}

.card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-card);
}
```

### Status Badge
```css
/* Pill: colored dot + text */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  font-family: 'DM Sans';
}

.badge-healthy  { background: var(--color-healthy-bg);   color: var(--color-healthy); }
.badge-degraded { background: var(--color-degraded-bg);  color: var(--color-degraded); }
.badge-down     { background: var(--color-down-bg);      color: var(--color-down); }
.badge-deploying{ background: var(--color-deploying-bg); color: var(--color-deploying); }

/* Dot animation for deploying */
.badge-deploying .dot {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Buttons
```css
/* Primary */
.btn-primary {
  background: var(--color-brand-500);
  color: white;
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: background 150ms, box-shadow 150ms;
}
.btn-primary:hover {
  background: var(--color-brand-400);
  box-shadow: var(--shadow-brand);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border-default);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  padding: 8px 16px;
}
.btn-secondary:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-hover);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  padding: 8px 12px;
}
.btn-ghost:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}
```

### Workflow Nodes (React Flow custom nodes)
```css
.workflow-node {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  min-width: 180px;
  cursor: pointer;
  transition: border-color 150ms, box-shadow 150ms;
}
.workflow-node:hover,
.workflow-node.selected {
  border-color: var(--color-brand-500);
  box-shadow: var(--shadow-brand);
}
.workflow-node.running {
  border-color: var(--color-brand-500);
  animation: nodeGlow 1s ease-in-out infinite alternate;
}
.workflow-node.complete {
  border-color: var(--color-healthy);
}
.workflow-node.error {
  border-color: var(--color-down);
}
```

### Execution Log
```css
.log-panel {
  background: #08080D;  /* Deeper than base */
  border-top: 1px solid var(--color-border-default);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  padding: 16px;
  max-height: 280px;
  overflow-y: auto;
}
.log-line {
  display: flex;
  gap: 12px;
  padding: 2px 0;
  animation: fadeIn 200ms ease;
}
.log-line .timestamp { color: var(--color-text-muted); }
.log-line .message   { color: var(--color-text-primary); }
.log-line.success .message { color: var(--color-healthy); }
.log-line.error .message   { color: var(--color-down); }
```

---

## Animation Tokens
```css
/* Durations */
--duration-fast:   100ms
--duration-base:   150ms
--duration-slow:   200ms
--duration-slower: 300ms

/* Easings */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)
--ease-in:       cubic-bezier(0.4, 0, 1, 1)
--ease-out:      cubic-bezier(0, 0, 0.2, 1)
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)

/* Key animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

@keyframes nodeGlow {
  from { box-shadow: 0 0 8px rgba(99,102,241,0.2); }
  to   { box-shadow: 0 0 24px rgba(99,102,241,0.5); }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
```

---

## Workflow Canvas (React Flow Config)
```tsx
// Canvas appearance
const proOptions = { hideAttribution: true }

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: '#475569', strokeWidth: 1.5 },
  animated: false,  // animate during execution
}

const nodeTypes = {
  create_repo:       RepoNode,
  setup_cicd:        CICDNode,
  provision_resource: ProvisionNode,
  register_catalog:  CatalogNode,
  notify_slack:      SlackNode,
  add_access:        AccessNode,
  approval_gate:     ApprovalNode,
  ai_node:           AINode,
}

// Canvas background: dot grid
<Background
  variant={BackgroundVariant.Dots}
  gap={24}
  size={1}
  color="rgba(255,255,255,0.05)"
/>
```

---

## Responsive Breakpoints
```css
--bp-sm:  640px   /* Mobile landscape */
--bp-md:  768px   /* Tablet */
--bp-lg:  1024px  /* Small desktop (sidebar collapses) */
--bp-xl:  1280px  /* Standard desktop */
--bp-2xl: 1536px  /* Large desktop */
```

---

## Iconography
Use **Lucide React** throughout. Key icons:

| Context | Icon |
|---------|------|
| Dashboard | `LayoutDashboard` |
| Catalog | `Library` |
| Workflows | `Zap` |
| Integrations | `Plug` |
| Team | `Users` |
| Settings | `Settings2` |
| Healthy | `CheckCircle2` |
| Degraded | `AlertTriangle` |
| Down | `XCircle` |
| Deploying | `RefreshCw` (spinning) |
| New Service | `PlusCircle` |
| Run | `Play` |
| AI/Architect | `Sparkles` |
| GitHub | custom SVG |
| AWS | custom SVG |
| Slack | custom SVG |

---

## Demo Prep Checklist

### Visual Polish
- [ ] Favicon set (anchor icon)
- [ ] Page titles correct in browser tab
- [ ] No console errors
- [ ] Loading states on all data fetches
- [ ] Empty states are designed (not raw HTML)
- [ ] All status badges render correctly

### Demo Flow Polish
- [ ] Click path rehearsed: Dashboard → Catalog → Catalog Detail → Workflows → New Workflow (Architect) → Run
- [ ] Architect input pre-filled with demo text on /workflows/new
- [ ] Execution log timing feels right (not too fast, not too slow)
- [ ] All 10 services render in catalog
- [ ] Dashboard metrics are realistic

### Presentation
- [ ] Browser zoom at 90% (more content visible)
- [ ] Browser in full screen
- [ ] Localhost or deployed URL ready
- [ ] Have a backup: screen recording of the demo in case of wifi issues at Google I/O