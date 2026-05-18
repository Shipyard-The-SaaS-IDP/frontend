'use client';
import { Fragment, useRef, useEffect, useState } from 'react';
import {
  Anchor, Library, Zap, Sparkles, ArrowRight, CheckCircle2, X,
  Cloud, Users, Mail,
} from 'lucide-react';

// ─── Scroll reveal ────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Library,
    color: '#818CF8',
    title: 'Service Catalog',
    description: 'Every service your team owns, always current. Search, filter, and click into any service to see its owner, stack, health, and deploy history without asking anyone.',
  },
  {
    icon: Zap,
    color: '#10B981',
    title: 'Workflow Builder',
    description: 'Turn tribal knowledge into golden paths. Drag, connect, configure. Run workflows for new services, onboarding, and environments on demand, by anyone.',
  },
  {
    icon: Sparkles,
    color: '#F59E0B',
    title: 'AI Architect',
    description: 'Describe what you need in plain English. The Architect maps it to the right steps, configures every node, and hands you a ready-to-run workflow in seconds.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Connect your tools',
    description: 'Link GitHub, AWS, and Slack in minutes. Shipyard reads your repos, detects services, and populates your catalog automatically. No YAML, no manual entry.',
    icon: Cloud,
    color: '#818CF8',
  },
  {
    number: '02',
    title: 'Your catalog goes live',
    description: 'Every service appears with its owner, tech stack, health status, and deploy history. One URL your whole team bookmarks.',
    icon: Library,
    color: '#10B981',
  },
  {
    number: '03',
    title: 'Workflows run on demand',
    description: 'Developers self-serve. New service? Describe it. New teammate? One click. Environment needed? Approved and running without a ticket.',
    icon: Zap,
    color: '#F59E0B',
  },
];

const PAIN_POINTS = [
  {
    before: 'Slack DMs to find who owns a service',
    after: 'Searchable catalog with owner, stack, and health',
  },
  {
    before: 'Senior engineer manually sets up every repo',
    after: 'Self-service workflow runs in 4 minutes',
  },
  {
    before: 'New hire takes 3 days to be productive',
    after: 'Onboarding workflow provisions everything automatically',
  },
  {
    before: 'Backstage takes months to configure',
    after: 'Shipyard is running the same afternoon',
  },
];

const COMPARE_FEATURES = [
  { label: 'Setup time', shipyard: '1 afternoon', backstage: '2–3 months', diy: 'Unknown' },
  { label: 'Maintenance required', shipyard: 'None, we run it', backstage: 'Full-time engineer', diy: 'Your team' },
  { label: 'Service catalog', shipyard: true, backstage: true, diy: false },
  { label: 'Workflow builder', shipyard: true, backstage: false, diy: false },
  { label: 'AI-powered setup', shipyard: true, backstage: false, diy: false },
  { label: 'Built-in integrations', shipyard: true, backstage: 'Plugin required', diy: false },
  { label: 'Works for 10-person teams', shipyard: true, backstage: false, diy: true },
];

// ─── SVG Logo marks ──────────────────────────────────────────────────────────

const SvgGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#E6EDF3">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);
const SvgVercel = () => (
  <svg width="15" height="13" viewBox="0 0 24 21" fill="#E6EDF3">
    <path d="M12 0L24 21H0L12 0Z"/>
  </svg>
);
const SvgSlack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z" fill="#E01E5A"/>
    <path d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.527 2.527 0 012.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 012.521 2.521 2.527 2.527 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.527 2.527 0 012.522-2.521h6.312z" fill="#36C5F0"/>
    <path d="M18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.162 0a2.528 2.528 0 012.523 2.522v6.312z" fill="#2EB67D"/>
    <path d="M15.162 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.162 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.271a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.162a2.528 2.528 0 01-2.522 2.523h-6.316z" fill="#ECB22E"/>
  </svg>
);
const SvgLinear = () => (
  <svg width="18" height="18" viewBox="0 0 100 100" fill="#5E6AD2">
    <path d="M1.22 61.5L38.5 98.78a50 50 0 01-37.28-37.28zM0 49.25L50.75 100A50 50 0 010 49.25zM8.5 17.5l74 74a50 50 0 01-74-74zM17.5 8.5a50 50 0 0174 74l-74-74zM49.25 0A50 50 0 01100 50.75L49.25 0zM61.5 1.22A50 50 0 0198.78 38.5L61.5 1.22z"/>
  </svg>
);
const SvgDocker = () => (
  <svg width="20" height="15" viewBox="0 0 56 40" fill="none">
    <rect x="0"  y="14" width="8" height="8" rx="1" fill="#0EA5E9"/>
    <rect x="10" y="14" width="8" height="8" rx="1" fill="#0EA5E9"/>
    <rect x="20" y="14" width="8" height="8" rx="1" fill="#0EA5E9"/>
    <rect x="30" y="14" width="8" height="8" rx="1" fill="#0EA5E9"/>
    <rect x="10" y="4"  width="8" height="8" rx="1" fill="#0EA5E9"/>
    <rect x="20" y="4"  width="8" height="8" rx="1" fill="#0EA5E9"/>
    <rect x="20" y="24" width="8" height="8" rx="1" fill="#0EA5E9" opacity="0.5"/>
    <path d="M55 18c-1-2-4-3-6-2.5-.5-4-3-6-5-7l-1 2c1 1 2 2.5 2 4-1 0-2 .5-2.5 1H0c0 8 5 14 13 15h18c8 0 14-4 17-10 2 0 6-1 7-2.5z" fill="#0EA5E9" opacity="0.8"/>
  </svg>
);
const SvgTerraform = () => (
  <svg width="16" height="18" viewBox="0 0 32 37" fill="#7B42BC">
    <path d="M0 21.2V29l7 4V25.1zM7.8 10.3v7.8l7 4V14.3zM7.8 22.5v7.8l7 4V26.4zM16.4.8v7.8l7 4V4.8z"/>
  </svg>
);
const SvgKubernetes = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#326CE5">
    <path d="M12 1a11 11 0 100 22A11 11 0 0012 1zm0 1.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19zM12 5a1 1 0 100 2 1 1 0 000-2zm-3.5 2.3l-.9 1.6.9.3A4 4 0 008.4 11l-.9.4 1 1.6.8-.4a4 4 0 001.4 1l-.1.9 1.9.3.2-.9a4 4 0 001.6-.3l.6.7 1.5-1.2-.5-.7a4 4 0 00.6-1.5l.9-.1-.1-1.9-.9.1a4 4 0 00-.8-1.5l.5-.7L14 7.2l-.6.7a4 4 0 00-1.5-.4l-.2-.9-1.9.3.1.9a4 4 0 00-1.4.5l-.9-.5zM12 10a2 2 0 110 4 2 2 0 010-4zM5 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z"/>
  </svg>
);
const SvgAWS = () => (
  <svg width="22" height="14" viewBox="0 0 60 36" fill="none">
    <path d="M17 22.5l-5-16h-3l-5 16h3l1-4h5l1 4h3zm-8-7l1.5-6 1.5 6H9zM33 22.5l-4-16h-3l-4 16h3l1-4h4l1 4h2zm-7-7l1.5-5 1.5 5h-3zM47 6.5l-4 16h-3l-2.5-11-2.5 11h-3l-4-16h3l2.5 11.5 2.5-11.5h3l2.5 11.5L41 6.5h6z" fill="#F59E0B"/>
    <path d="M5 28c7 5 18 8 31 4M50 29c2-1 4-2.5 5-4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const SvgDatadog = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#774AA4">
    <path d="M21.28 9.81c-.28-.83-.87-1.52-1.64-1.94-.29-.16-.61-.27-.93-.33V5.22h-2.43v2.43H9.19l-.6-.26V5.22H6.16v2.43H3.73v2.43H6.1l.06.05v1.2L4.49 16.2l1.82 1.1 1.55-2.57h9.3l1.55 2.57 1.82-1.1-1.73-2.87v-1.17c0-.04.03-.07.06-.09h2.38V9.81h-2.38zm-3.34 1.85l.03.05H6.06l.03-.05V9.59c0-.04.03-.07.06-.09h11.72c.04.02.06.05.06.09v2.07z"/>
  </svg>
);
const SvgGrafana = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#F46800"/>
    <path d="M12 7v5h5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1.5" fill="white"/>
  </svg>
);
const SvgSentry = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#958DF1">
    <path d="M13.882 3.242a2.28 2.28 0 00-3.764 0L2.31 17.09A2.28 2.28 0 004.192 20.5h4.13a.5.5 0 000-1H4.192a1.28 1.28 0 01-1.108-1.91L10.9 3.74a1.28 1.28 0 012.198 0l1.38 2.39a10.83 10.83 0 012.302 10.87H15.5a.5.5 0 000 1h1.44a.5.5 0 00.46-.68 11.83 11.83 0 00-2.33-11.64zm.946 16.258H9.5a.5.5 0 000 1h5.328a.5.5 0 000-1zm-2.664-4a.5.5 0 000 1h.5a.5.5 0 000-1h-.5zm0-3a.5.5 0 000 1h3.5a.5.5 0 000-1h-3.5zm0-3a.5.5 0 000 1h6.5a.5.5 0 000-1h-6.5z"/>
  </svg>
);
const SvgCircleCI = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#9BA0AA">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 2.4a9.6 9.6 0 110 19.2A9.6 9.6 0 0112 2.4zm0 4.2a5.4 5.4 0 100 10.8A5.4 5.4 0 0012 6.6zm0 2.4a3 3 0 110 6 3 3 0 010-6z"/>
  </svg>
);
const SvgPagerDuty = () => (
  <svg width="14" height="18" viewBox="0 0 36 48" fill="#06AC38">
    <path d="M25.4 0H4v17.6h21.4C31.4 17.6 36 13 36 7.2S31.4 0 25.4 0zM4 22.4V48h8V22.4H4zM25.4 4.8c1.2 0 5.8.4 5.8 2.4s-4.6 5.6-5.8 5.6H12V4.8h13.4z"/>
  </svg>
);
const SvgJira = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11.75 0L0 11.75l4.5 4.5L11.75 9l7.25 7.25L23.5 11.75 11.75 0z" fill="#2684FF"/>
    <path d="M11.75 9L7.25 13.5l4.5 4.5 4.5-4.5L11.75 9z" fill="#0052CC"/>
    <path d="M11.75 14.25l-4.5 4.5L11.75 23.25l4.5-4.5-4.5-4.5z" fill="#2684FF"/>
  </svg>
);
const SvgNewRelic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2z" fill="#1CE783" opacity="0.15"/>
    <path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2zM12 5.5l5.5 3v6.5L12 18.5 6.5 15V8.5L12 5.5z" fill="#1CE783"/>
    <circle cx="12" cy="12" r="2.5" fill="#1CE783"/>
  </svg>
);
const SvgGoogleCloud = () => (
  <svg width="20" height="16" viewBox="0 0 64 50" fill="none">
    <path d="M40 0H24L8 28h32L24 50h16l24-28H40L52 0H40z" fill="#4285F4" opacity="0.3"/>
    <path d="M32 8L16 36h32L32 8z" fill="#4285F4"/>
    <path d="M0 28l8-14-8 14z" fill="#EA4335"/>
    <path d="M64 28l-8-14 8 14z" fill="#34A853"/>
    <path d="M24 50l8-14 8 14H24z" fill="#FBBC05"/>
  </svg>
);
const SvgHoneycomb = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M9 2L3 5.5v7L9 16l6-3.5v-7L9 2zM9 8.5L6 6.75l3-1.75 3 1.75-3 1.75zm-4.5 5.25v-3.5l4.5 2.5v3.5l-4.5-2.5zm9 0l-4.5 2.5v-3.5l4.5-2.5v3.5zm-4.5 5.25l-6-3.5v-7l6 3.5v7z" opacity="0.6"/>
    <path d="M15 8L9 11.5v7l6 3.5 6-3.5v-7L15 8zm0 6.5l-3-1.75 3-1.75 3 1.75-3 1.75zm-4.5 5.25v-3.5l4.5 2.5v3.5l-4.5-2.5zm9 0l-4.5 2.5v-3.5l4.5-2.5v3.5z"/>
  </svg>
);
const SvgLaunchDarkly = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#405BFF">
    <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5l6.5 6.5-6.5 6.5L5.5 12 12 5.5z"/>
    <circle cx="12" cy="12" r="3" fill="#405BFF"/>
    <path d="M16 8l4-4M8 16l-4 4" stroke="#405BFF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

type LogoItem = { name: string; icon: React.ReactNode; bg: string };

const ROW1: LogoItem[] = [
  { name: 'GitHub',       icon: <SvgGitHub />,       bg: '#21262D' },
  { name: 'Slack',        icon: <SvgSlack />,        bg: '#1A0E2E' },
  { name: 'Vercel',       icon: <SvgVercel />,       bg: '#111111' },
  { name: 'Linear',       icon: <SvgLinear />,       bg: 'rgba(94,106,210,0.14)' },
  { name: 'Docker',       icon: <SvgDocker />,       bg: 'rgba(14,165,233,0.12)' },
  { name: 'Terraform',    icon: <SvgTerraform />,    bg: 'rgba(123,66,188,0.14)' },
];
const ROW2: LogoItem[] = [
  { name: 'Kubernetes',   icon: <SvgKubernetes />,   bg: 'rgba(50,108,229,0.14)' },
  { name: 'AWS',          icon: <SvgAWS />,          bg: 'rgba(245,158,11,0.1)' },
  { name: 'Datadog',      icon: <SvgDatadog />,      bg: 'rgba(119,74,164,0.14)' },
  { name: 'Google Cloud', icon: <SvgGoogleCloud />,  bg: 'rgba(66,133,244,0.1)' },
  { name: 'Grafana',      icon: <SvgGrafana />,      bg: 'rgba(244,104,0,0.1)' },
  { name: 'Sentry',       icon: <SvgSentry />,       bg: 'rgba(149,141,241,0.14)' },
];
const ROW3: LogoItem[] = [
  { name: 'PagerDuty',    icon: <SvgPagerDuty />,    bg: 'rgba(6,172,56,0.12)' },
  { name: 'CircleCI',     icon: <SvgCircleCI />,     bg: 'rgba(155,160,170,0.1)' },
  { name: 'New Relic',    icon: <SvgNewRelic />,     bg: 'rgba(28,231,131,0.1)' },
  { name: 'Jira',         icon: <SvgJira />,         bg: 'rgba(38,132,255,0.12)' },
  { name: 'Honeycomb',    icon: <SvgHoneycomb />,    bg: 'rgba(245,166,35,0.1)' },
  { name: 'LaunchDarkly', icon: <SvgLaunchDarkly />, bg: 'rgba(64,91,255,0.12)' },
];

// ─── Components ──────────────────────────────────────────────────────────────

function NavBar({ onJoinClick }: { onJoinClick: () => void }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Anchor size={15} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>
          Shipyard
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <a href="#how-it-works" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', padding: '6px 12px' }}>
          How it works
        </a>
        <a href="#compare" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', padding: '6px 12px' }}>
          vs Backstage
        </a>
        <button
          onClick={onJoinClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 16px',
            borderRadius: 8,
            background: '#6366F1',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Join waitlist
        </button>
      </div>
    </nav>
  );
}

function ProductPreview() {
  const services = [
    { name: 'payments-service', status: 'healthy', stack: 'Node.js', latency: '42ms' },
    { name: 'auth-service', status: 'healthy', stack: 'FastAPI', latency: '18ms' },
    { name: 'notification-worker', status: 'degraded', stack: 'Python', latency: '320ms' },
    { name: 'data-pipeline', status: 'deploying', stack: 'Airflow', latency: '--' },
    { name: 'frontend-web', status: 'healthy', stack: 'Next.js', latency: '95ms' },
  ];
  const statusColor: Record<string, string> = {
    healthy: '#10B981', degraded: '#F59E0B', deploying: '#6366F1', down: '#EF4444',
  };

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(99,102,241,0.08)',
    }}>
      <div style={{ padding: '10px 16px', background: '#0A0A0F', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, background: '#1A1A24', borderRadius: 5, padding: '4px 12px', fontSize: 11, color: '#475569', fontFamily: 'var(--font-jetbrains-mono)', maxWidth: 280, margin: '0 auto' }}>
          app.shipyard.dev/catalog
        </div>
      </div>
      <div style={{ display: 'flex', height: 340 }}>
        <div style={{ width: 52, background: '#0D0D14', borderRight: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Anchor size={13} color="white" strokeWidth={2.5} />
          </div>
          {[Library, Zap, Cloud, Users].map((Icon, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent', borderLeft: i === 0 ? '2px solid #6366F1' : '2px solid transparent' }}>
              <Icon size={15} color={i === 0 ? '#818CF8' : '#334155'} strokeWidth={1.8} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: 'var(--font-sora)' }}>Service Catalog</div>
              <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>10 services registered</div>
            </div>
            <div style={{ width: 24, height: 24, background: '#6366F1', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={12} color="white" />
            </div>
          </div>
          <div style={{ background: '#1A1A24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #334155' }} />
            <span style={{ fontSize: 11, color: '#334155' }}>Search services, stacks, owners...</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Healthy', 'Degraded', 'Deploying'].map((f, i) => (
              <div key={f} style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 500, background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent', border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`, color: i === 0 ? '#818CF8' : '#334155' }}>
                {f}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {services.map((svc) => (
              <div key={svc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[svc.status], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', color: '#94A3B8' }}>{svc.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, color: '#3B82F6', background: 'rgba(59,130,246,0.12)', padding: '2px 6px', borderRadius: 3 }}>{svc.stack}</span>
                  <span style={{ fontSize: 10, color: '#334155', fontFamily: 'var(--font-jetbrains-mono)', minWidth: 36, textAlign: 'right' }}>{svc.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareCell({ value }: { value: boolean | string }) {
  if (value === true) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CheckCircle2 size={16} color="#10B981" strokeWidth={2} />
    </div>
  );
  if (value === false) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <X size={16} color="#475569" strokeWidth={2} />
    </div>
  );
  return <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>{value}</div>;
}

function LogoCard({ name, icon, bg }: LogoItem) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 18px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0,
      userSelect: 'none',
    }}>
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: bg,
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8', whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#10B981" />
          </div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, color: '#F1F5F9' }}>You're on the list.</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>We'll reach out as soon as early access opens.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: '#111118', border: '1px solid rgba(255,255,255,0.1)', width: 300 }}>
            <Mail size={15} color="#475569" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#F1F5F9', width: '100%' }}
            />
          </div>
          <button
            type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#6366F1', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#818CF8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#6366F1'; }}
          >
            Join waitlist <ArrowRight size={14} />
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const waitlistRef = useRef<HTMLElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: '#F1F5F9', width: '100%' }}>
      <NavBar onJoinClick={scrollToWaitlist} />

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, height: 700, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: 32, fontSize: 12, fontWeight: 500, color: '#818CF8' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
          Early access now open
        </div>

        <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(40px, 5.5vw, 70px)', fontWeight: 700, lineHeight: 1.1, maxWidth: 820, marginBottom: 24, letterSpacing: '-0.025em' }}>
          The platform team{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #C4B5FD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            you never had.
          </span>
        </h1>

        <p style={{ fontSize: 18, color: '#64748B', maxWidth: 540, lineHeight: 1.75, marginBottom: 44 }}>
          Service catalog, self-service workflows, and AI-powered setup, out of the box.
          Backstage took months to configure. Shipyard takes an afternoon.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}>
          <button
            onClick={scrollToWaitlist}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 10, background: '#6366F1', color: 'white', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, transition: 'all 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#818CF8'; e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Join the waitlist <ArrowRight size={15} />
          </button>
          <a href="#how-it-works" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 10, background: 'transparent', color: '#94A3B8', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,0.09)', transition: 'all 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#F1F5F9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
          >
            How it works
          </a>
        </div>

        <div style={{ width: '100%', maxWidth: 800, animation: 'fadeInUp 400ms ease 200ms both' }}>
          <ProductPreview />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { value: '1 afternoon', label: 'to a working platform' },
            { value: '18+ integrations', label: 'GitHub, AWS, Slack, and more' },
            { value: 'Zero maintenance', label: 'we run the infrastructure' },
          ].map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px 32px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 13, color: '#475569' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Problem / Before & After ── */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>The problem</p>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: 14 }}>
                Every startup hits the same wall.
              </h2>
              <p style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
                Your team grows past 10 engineers. Suddenly no one knows who owns what, onboarding takes days, and every new service starts with a Slack message to the most senior person.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Without Shipyard</div>
              </div>
              <div style={{ padding: '16px 24px', background: 'rgba(99,102,241,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>With Shipyard</div>
              </div>
              {PAIN_POINTS.map(({ before, after }, i) => (
                <Fragment key={i}>
                  <div style={{ padding: '18px 24px', borderBottom: i < PAIN_POINTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: 10, background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <X size={14} color="#EF4444" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{before}</span>
                  </div>
                  <div style={{ padding: '18px 24px', borderBottom: i < PAIN_POINTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 10, background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <CheckCircle2 size={14} color="#10B981" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{after}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 48px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Platform features</p>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: 14 }}>
                Everything assembled. Nothing to maintain.
              </h2>
              <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
                Not a framework to configure. A complete, working platform your team can use on day one.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {FEATURES.map(({ icon: Icon, color, title, description }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div
                  style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, height: '100%', transition: 'border-color 200ms, box-shadow 200ms' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 0 40px ${color}0A`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={22} color={color} strokeWidth={1.6} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, color: '#F1F5F9', marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.75 }}>{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How it works</p>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
                From zero to platform in an afternoon.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map(({ number, title, description, icon: Icon, color }, i) => (
              <Reveal key={number} delay={i * 80}>
                <div style={{ display: 'flex', gap: 32, padding: '36px 0', borderBottom: i < STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}10`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color={color} strokeWidth={1.6} />
                    </div>
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#6366F1', fontWeight: 500, marginBottom: 6, letterSpacing: '0.06em' }}>STEP {number}</div>
                    <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 600, color: '#F1F5F9', marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, maxWidth: 500 }}>{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section id="compare" style={{ padding: '100px 48px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Comparison</p>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: 14 }}>
                Shipyard vs Backstage vs building your own
              </h2>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
                Backstage is the industry standard, and it takes a full-time engineer to maintain. Most startups can&apos;t afford that.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ padding: '16px 20px' }} />
                <div style={{ padding: '16px 20px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <Anchor size={12} color="#818CF8" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#818CF8' }}>Shipyard</span>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#475569' }}>Backstage</span>
                </div>
                <div style={{ padding: '16px 20px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#475569' }}>Build your own</span>
                </div>
              </div>
              {COMPARE_FEATURES.map(({ label, shipyard, backstage, diy }, i) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: i < COMPARE_FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <div style={{ padding: '14px 20px', fontSize: 13, color: '#94A3B8' }}>{label}</div>
                  <div style={{ padding: '14px 20px', borderLeft: '1px solid rgba(255,255,255,0.04)', background: 'rgba(99,102,241,0.03)' }}>
                    <CompareCell value={shipyard} />
                  </div>
                  <div style={{ padding: '14px 20px', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                    <CompareCell value={backstage} />
                  </div>
                  <div style={{ padding: '14px 20px', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                    <CompareCell value={diy} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Integrations carousel ── */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 40 }}>Works with your existing stack</p>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Row 1 — scrolls left */}
          <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            <div className="animate-marquee" style={{ display: 'flex', flexWrap: 'nowrap', gap: 12 }}>
              {[...ROW1, ...ROW1, ...ROW1, ...ROW1].map((item, i) => (
                <LogoCard key={i} {...item} />
              ))}
            </div>
          </div>
          {/* Row 2 — scrolls right */}
          <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            <div className="animate-marquee-reverse" style={{ display: 'flex', flexWrap: 'nowrap', gap: 12 }}>
              {[...ROW2, ...ROW2, ...ROW2, ...ROW2].map((item, i) => (
                <LogoCard key={i} {...item} />
              ))}
            </div>
          </div>
          {/* Row 3 — scrolls left, different speed */}
          <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            <div className="animate-marquee" style={{ display: 'flex', flexWrap: 'nowrap', gap: 12, animationDuration: '30s' }}>
              {[...ROW3, ...ROW3, ...ROW3, ...ROW3].map((item, i) => (
                <LogoCard key={i} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Waitlist / Final CTA ── */}
      <section
        ref={waitlistRef}
        id="waitlist"
        style={{ padding: '120px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center 60%, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 580, margin: '0 auto' }}>
          <Reveal>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <Anchor size={26} color="white" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#F1F5F9', marginBottom: 16, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              Get early access.
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.75, maxWidth: 420, margin: '0 auto 44px' }}>
              Be the first to know when Shipyard opens to new teams. We&apos;re onboarding in small batches.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <WaitlistSection />
            <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>No spam. Unsubscribe any time.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Anchor size={12} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>Shipyard</span>
        </div>
        <p style={{ fontSize: 12, color: '#334155', textAlign: 'center' }}>Backstage is a framework. Shipyard is the platform team.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#how-it-works" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>How it works</a>
          <a href="#compare" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>vs Backstage</a>
          <a href="#waitlist" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>Waitlist</a>
        </div>
      </footer>
    </div>
  );
}
