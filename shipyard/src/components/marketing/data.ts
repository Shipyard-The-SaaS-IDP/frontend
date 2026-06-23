// ─── Hero: animated discovery trace ──────────────────────────────────────────
export const DISCOVERY_TRACE = [
  { icon: '$', iconColor: '#00E87A', color: 'rgba(255,255,255,0.9)', weight: 500, text: 'shipyard discover --connect codebases,environments,tools' },
  { icon: '✓', iconColor: '#00E87A', color: 'rgba(255,255,255,0.9)', weight: 500, text: 'found payments-service' },
  { icon: '', iconColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.5)', weight: 400, text: 'owner: Ana Rodriguez · stack: Node.js, PostgreSQL' },
  { icon: '✓', iconColor: '#00E87A', color: 'rgba(255,255,255,0.9)', weight: 500, text: 'found auth-gateway' },
  { icon: '', iconColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.5)', weight: 400, text: 'owner: Marcus Lee · stack: Go, Redis' },
  { icon: '✓', iconColor: '#00E87A', color: 'rgba(255,255,255,0.9)', weight: 500, text: 'found notifications-worker' },
  { icon: '', iconColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.5)', weight: 400, text: 'owner: Priya Shah · stack: Python, RabbitMQ' },
  { icon: '→', iconColor: '#00C9A7', color: 'rgba(255,255,255,0.9)', weight: 500, text: 'mapped 14 dependencies across 9 services' },
  { icon: '✓', iconColor: '#00E87A', color: '#00E87A', weight: 600, text: 'catalog ready in 4.2s, nothing written by hand' },
];

// ─── Problem section ──────────────────────────────────────────────────────────
export const PROBLEM_CARDS = [
  {
    title: 'Docs go stale fast',
    description: "By the time you write it down, it's already out of date.",
    icon: 'RotateCcw',
  },
  {
    title: 'Ownership is tribal',
    description: "It's 2am, prod is down, and nobody knows who owns this.",
    icon: 'Users',
  },
  {
    title: "Self-service doesn't exist",
    description: 'New service? File a ticket. Join the queue. Wait.',
    icon: 'Inbox',
  },
];

// ─── Auto-discovery showcase: mock catalog cards ─────────────────────────────
// Fixed width for every card (no per-name sizing) so left/top positions
// below can be checked for overlap by hand: row 1 spans x:[20,170],
// [195,345],[370,520]; row 2 spans the same three columns one row down.
export const CATALOG_MOCK_CARD_WIDTH = 150;
export const CATALOG_MOCK_SERVICES = [
  { name: 'api-gateway', stack: 'Go · Redis', status: '#00E87A', owner: 'AR', ownerColor: '#1E5FCC', left: 20, top: 30 },
  { name: 'payments-service', stack: 'Node.js · PostgreSQL', status: '#00E87A', owner: 'AR', ownerColor: '#00C9A7', left: 195, top: 30, highlight: true },
  { name: 'ledger-db', stack: 'PostgreSQL 15', status: '#00E87A', left: 370, top: 30 },
  { name: 'auth-gateway', stack: 'Go · Redis', status: '#febc2e', owner: 'ML', ownerColor: '#7B42BC', left: 195, top: 240 },
  { name: 'notifications', stack: 'Python · RabbitMQ', status: '#00E87A', left: 370, top: 240 },
];

// ─── Capabilities showcase: Create / Maintain / Context ─────────────────────
export const CAPABILITIES = {
  create: {
    label: 'Create',
    description: 'Describe what you need. Shipyard writes the code to build it.',
    icon: 'Plus',
    demoTitle: 'New service',
    demoTag: 'terraform plan',
    prompt: 'A Go service that reads the orders queue and writes enriched events to a new Postgres table. Owned by payments.',
    resultLabel: 'Generated terraform plan',
    lines: [
      { color: 'rgba(255,255,255,0.55)', text: '# orders-enricher' },
      { color: '#00E87A', text: '+ aws_ecs_service  "orders_enricher"' },
      { color: '#00E87A', text: '+ aws_sqs_queue    "orders"  (linked)' },
      { color: '#00E87A', text: '+ aws_db_instance  "enriched_events"' },
      { color: 'rgba(255,255,255,0.6)', text: '  owner = payments · repo = orders-enricher' },
      { color: '#00E87A', text: 'Plan: 3 to add, 0 to change, 0 to destroy.' },
    ],
  },
  maintain: {
    label: 'Maintain',
    description: 'Change what you already have running, safely.',
    icon: 'Wrench',
    demoTitle: 'Change request',
    demoTag: 'terraform apply',
    prompt: "Scale payments-service to 4 replicas and rotate its database credentials before Friday's launch.",
    resultLabel: 'Proposed change to live infra',
    lines: [
      { color: 'rgba(255,255,255,0.55)', text: '# payments-service' },
      { color: '#febc2e', text: '~ aws_ecs_service  desired_count: 2 -> 4' },
      { color: '#febc2e', text: '~ secret_version   "db_creds"  (rotate)' },
      { color: 'rgba(255,255,255,0.6)', text: '  rolling restart · zero downtime' },
      { color: '#febc2e', text: 'Plan: 0 to add, 2 to change, 0 to destroy.' },
    ],
  },
  context: {
    label: 'Ask',
    description: 'Ask anything about your setup and get a real answer.',
    icon: 'HelpCircle',
    demoTitle: 'Ask anything',
    demoTag: 'live context',
    prompt: 'Who owns auth-gateway, and what breaks if it goes down?',
    resultLabel: 'Answered from your live graph',
    lines: [
      { color: '#00E87A', text: 'auth-gateway' },
      { color: 'rgba(255,255,255,0.85)', text: 'owner: Marcus Lee · payments team' },
      { color: 'rgba(255,255,255,0.6)', text: 'depends on: redis-sessions, user-db' },
      { color: '#febc2e', text: '3 services break: api-gateway, checkout-web,' },
      { color: '#febc2e', text: '                 mobile-bff' },
      { color: 'rgba(255,255,255,0.6)', text: 'last deploy 2h ago · healthy' },
    ],
  },
} as const;

export type CapabilityKey = keyof typeof CAPABILITIES;

// ─── How it works ─────────────────────────────────────────────────────────────
export const HOW_IT_WORKS_STEPS = [
  { n: '1', icon: 'Plug', title: 'Connect', description: 'Link your code and the tools you use. Two clicks, view-only access.' },
  { n: '2', icon: 'Sparkles', title: 'Discover', description: 'Your catalog fills itself in, owners included.' },
  { n: '3', icon: 'Hammer', title: 'Build', description: 'Describe what you need in plain English. Shipyard builds it.' },
];

// ─── Impact: solo vs team ─────────────────────────────────────────────────────
export const IMPACT_SOLO = {
  description: "Connect once and see everything you've built: what's connected to what, without asking anyone.",
  rows: [
    { label: 'Time to a full map', before: 'Days of digging through repos', after: '5 minutes' },
    { label: 'Getting connected', before: 'Connect each tool one by one', after: '10 tools connected, free' },
    { label: 'Setup files to maintain', before: 'Endless, and always out of date', after: 'Zero, ever' },
  ],
};

export const IMPACT_TEAM = {
  description: 'One live source of truth for the whole org. Every owner known, every dependency mapped, every service self-served.',
  rows: [
    { label: '2am incident, find the owner', before: 'Guesswork and frantic pings', after: 'One click to the owner' },
    { label: 'Catalog accuracy', before: "Stale the day it's written", after: '100% mapped, always' },
    { label: 'Shipping a new service', before: 'File a ticket, then wait', after: 'Self-served, zero tickets' },
  ],
};

// ─── Pricing ──────────────────────────────────────────────────────────────────
export const PRICING_TIERS = [
  {
    name: 'Solo',
    description: 'For builders mapping their own stack.',
    price: 'Free',
    cta: 'Map your context',
    popular: false,
    features: [
      'First 10 app integrations',
      'Full catalog & dependency map',
      'Community support',
    ],
  },
  {
    name: 'Solo Premium',
    description: 'Every tool you run, all at once.',
    price: '$7',
    period: '/ month',
    cta: 'Go Premium',
    popular: true,
    features: [
      'Unlimited third-party integrations',
      'Manage across all your apps & tools',
      'Plain-English service creation',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For orgs that outgrew tribal knowledge.',
    price: 'Pay as you go',
    cta: 'Talk to us',
    popular: false,
    features: [
      'Everything in Premium, org-wide',
      'Usage-based, scales with your estate',
      'SSO, audit log, priority SLA',
    ],
  },
];

// ─── Infra layer diagram ─────────────────────────────────────────────────────
export const INFRA_TOP_TIER = ['api-gateway', 'payments', 'web-app', 'workers'];
export const INFRA_BOTTOM_TIER = ['compute', 'databases', 'queues', 'secrets'];
