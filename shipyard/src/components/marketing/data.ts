import {
  Sparkles, Zap, Library, Cloud, GitFork, GitBranch, BookOpen, MessageSquare,
} from 'lucide-react';

export const FEATURE_SECTIONS = [
  {
    id: 'translator',
    icon: Sparkles,
    color: '#F59E0B',
    eyebrow: 'The Translator',
    title: 'Tell it about your business. Get a tech plan back.',
    description: 'Skip the jargon. Describe what you’re building in plain English and get an architecture, stack, compliance checklist, and a real cost estimate — in seconds.',
    bullets: [
      'Reads your business, not just your code',
      'Flags HIPAA, SOC2, GDPR before they bite you',
      'Hands a clean brief straight to The Architect',
    ],
  },
  {
    id: 'architect',
    icon: Zap,
    color: '#10B981',
    eyebrow: 'The Architect',
    title: 'Turns that plan into something you can actually ship.',
    description: 'One click and your brief becomes a real workflow — infrastructure, CI/CD, monitoring, docs. Connect the repo your AI tool already wrote and go.',
    bullets: [
      'Infrastructure-as-code, generated for you',
      'CI/CD and environments wired up automatically',
      'Docs your next hire can actually follow',
    ],
  },
  {
    id: 'mcp-hub',
    icon: Library,
    color: '#818CF8',
    eyebrow: 'MCP Hub',
    title: 'Every tool you already use, in one place.',
    description: 'Shipyard plugs into the tools you picked — Base44, Claude Code, GitHub, AWS, Vercel, Slack — so nothing you’ve built gets left behind.',
    bullets: [
      'Build tools: Base44, Lovable, Claude Code, Figma',
      'Infra: GitHub, AWS, Vercel, Google Cloud',
      'Ops: Slack, Google Workspace, alerts',
    ],
  },
  {
    id: 'dashboard',
    icon: Cloud,
    color: '#6366F1',
    eyebrow: 'The Dashboard',
    title: 'One screen for everything that’s running.',
    description: 'Every service, deploy, and automation — status, stack, and speed — in a single view. The picture a platform team would normally give you.',
    bullets: [
      'Live status across every service',
      'Jump straight to logs, configs, run history',
      'Built for a team of one, or your first ten',
    ],
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
