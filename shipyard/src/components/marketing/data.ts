import {
  Sparkles, Zap, Library, Cloud, GitFork, GitBranch, BookOpen, MessageSquare,
} from 'lucide-react';

export const FEATURE_SECTIONS = [
  {
    id: 'translator',
    icon: Sparkles,
    color: '#F59E0B',
    eyebrow: 'The Translator',
    title: 'Describe your business. Get a tech plan back.',
    description: 'Plain English in — architecture, stack, compliance, and cost out. In seconds.',
    bullets: [
      'Flags HIPAA, SOC2, GDPR automatically',
      'Hands a clean brief to The Architect',
    ],
    stat: {
      beforeLabel: 'Researching architecture & compliance',
      beforeValue: '~2 weeks',
      beforePct: 92,
      afterLabel: 'Tech plan generated',
      afterValue: '30 sec',
      afterPct: 6,
    },
  },
  {
    id: 'architect',
    icon: Zap,
    color: '#10B981',
    eyebrow: 'The Architect',
    title: 'Turns that plan into something you can ship.',
    description: 'One click and your brief becomes a real workflow — infra, CI/CD, monitoring, docs.',
    bullets: [
      'Infrastructure-as-code, generated for you',
      'CI/CD and environments wired up automatically',
    ],
    stat: {
      beforeLabel: 'Manual infra setup',
      beforeValue: '3–5 days',
      beforePct: 88,
      afterLabel: 'Workflow generated & running',
      afterValue: '1 click',
      afterPct: 4,
    },
  },
  {
    id: 'mcp-hub',
    icon: Library,
    color: '#818CF8',
    eyebrow: 'MCP Hub',
    title: 'Every tool you use, in one place.',
    description: 'Base44, Claude Code, GitHub, AWS, Vercel, Slack — all connected, nothing left behind.',
    bullets: [
      'Build tools, infra, and ops in one hub',
      'Live connection status for everything',
    ],
    stat: {
      beforeLabel: 'Status spread across separate tabs',
      beforeValue: '6+ tools',
      beforePct: 85,
      afterLabel: 'One connected hub',
      afterValue: '1 screen',
      afterPct: 10,
    },
  },
  {
    id: 'dashboard',
    icon: Cloud,
    color: '#6366F1',
    eyebrow: 'The Dashboard',
    title: 'One screen for everything that’s running.',
    description: 'Every service, deploy, and automation — status, stack, and speed — at a glance.',
    bullets: [
      'Live status across every service',
      'Built for a team of one, or your first ten',
    ],
    stat: {
      beforeLabel: 'Checking status across dashboards',
      beforeValue: '6 dashboards',
      beforePct: 80,
      afterLabel: 'Everything, always up to date',
      afterValue: '1 dashboard',
      afterPct: 12,
    },
  },
];

export const PAIN_POINTS = [
  {
    before: 'Your app only runs on your laptop',
    after: 'A real deployment that scales with you',
  },
  {
    before: 'No clue what compliance even applies to you',
    after: 'HIPAA / SOC2 / GDPR mapped to your infra automatically',
  },
  {
    before: 'Nothing’s documented — it’s all in your head',
    after: 'Docs generated as you go, ready for your first hire',
  },
  {
    before: 'A platform engineer is months and $$$ away',
    after: 'Shipyard is your platform team, today',
  },
];

export const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Connect your repo',
    description: 'Built it with Base44, Lovable, or Claude Code? Link the GitHub repo and we’ll scan your stack.',
  },
  {
    n: '02',
    title: 'Describe your business',
    description: 'Plain English in, tech plan out — architecture, stack, compliance, and cost.',
  },
  {
    n: '03',
    title: 'Ship it',
    description: 'One click turns the plan into a running deployment — infra, CI/CD, monitoring, docs.',
  },
];

// ─── Workflow / Architect preview steps ──────────────────────────────────────
export const ARCHITECT_STEPS = [
  { label: 'Create repo', icon: GitFork },
  { label: 'Setup CI/CD', icon: GitBranch },
  { label: 'Provision AWS', icon: Cloud },
  { label: 'Register service', icon: BookOpen },
  { label: 'Notify Slack', icon: MessageSquare },
];
