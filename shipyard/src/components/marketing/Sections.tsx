'use client';
import { useState } from 'react';
import { ArrowRight, Target, RotateCcw, Users, Inbox, Check, Plus, Wrench, HelpCircle } from 'lucide-react';
import { Reveal } from './Reveal';
import { DiscoveryTerminal, InfraLayerDiagram, CatalogMock, CapabilityDemoPanel } from './Previews';
import { IntegrationsMarquee } from './Marquee';
import {
  PROBLEM_CARDS, CAPABILITIES, HOW_IT_WORKS_STEPS, IMPACT_SOLO, IMPACT_TEAM, PRICING_TIERS,
  type CapabilityKey,
} from './data';

const PROBLEM_ICONS = { RotateCcw, Users, Inbox } as const;
const CAP_ICONS = { create: Plus, maintain: Wrench, context: HelpCircle } as const;

export function Hero() {
  return (
    <header className="mx-auto max-w-[1180px] px-8 pb-10 pt-[84px]">
      <div className="max-w-[780px]">
        <Reveal className="mb-[26px] inline-flex items-center gap-2 rounded-full border px-[13px] py-[6px] text-[13px] font-semibold" style={{ background: '#00E87A12', borderColor: '#00E87A40', color: '#0A2463' }}>
          <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#00E87A', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          Agentic AI at the infrastructure-as-code layer
        </Reveal>

        <Reveal delay={50}>
          <h1 className="mb-[22px] font-heading text-[clamp(44px,7vw,70px)] font-extrabold leading-[1.0] tracking-[-0.035em]" style={{ color: '#0A2463' }}>
            Your stack, mapped.
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="mb-[34px] max-w-[600px] text-[20px] leading-[1.55]" style={{ color: '#6B6B6B' }}>
            Shipyard plugs straight into your codebases and environments, then maps every service, owner, and dependency for you. No YAML required.
          </p>
        </Reveal>

        <Reveal delay={150} className="flex flex-wrap gap-[14px]">
          <a
            href="/signup"
            className="flex items-center gap-[9px] rounded-xl px-6 py-[14px] text-[16px] font-semibold no-underline transition-transform hover:-translate-y-0.5"
            style={{ background: '#00E87A', color: '#0A2463', boxShadow: '0 2px 6px rgba(0,232,122,0.25)' }}
          >
            <Target size={17} strokeWidth={2.2} />
            Map your context
          </a>
          <a
            href="#product"
            className="flex items-center gap-[9px] rounded-xl border px-[22px] py-[14px] text-[16px] font-semibold no-underline transition-colors"
            style={{ background: '#fff', color: '#0A2463', borderColor: '#EAEAEA' }}
          >
            See it work
            <ArrowRight size={16} strokeWidth={2.2} />
          </a>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <DiscoveryTerminal />
      </Reveal>
    </header>
  );
}

export function InfraLayerSection() {
  return (
    <section className="mx-auto max-w-[1180px] px-8 pb-6 pt-24">
      <Reveal className="mx-auto mb-12 max-w-[640px] text-center">
        <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>How it fits</p>
        <h2 className="mb-4 font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463', textWrap: 'balance' }}>We live in your infrastructure layer.</h2>
        <p className="mx-auto max-w-[540px] text-[17px] leading-[1.6]" style={{ color: '#6B6B6B' }}>
          Shipyard threads through your whole stack: reading context from the code and services above, acting on the cloud and environments below.
        </p>
      </Reveal>
      <Reveal>
        <InfraLayerDiagram />
      </Reveal>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-[1180px] px-8 pb-10 pt-[88px]">
      <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
        <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>The problem</p>
        <h2 className="font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463', textWrap: 'balance' }}>
          A catalog you fill in by hand is a catalog that&apos;s always wrong.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PROBLEM_CARDS.map((card) => {
          const Icon = PROBLEM_ICONS[card.icon as keyof typeof PROBLEM_ICONS];
          return (
            <Reveal key={card.title}>
              <div
                className="h-full rounded-[18px] border p-[30px] transition-all duration-200 hover:-translate-y-1"
                style={{ background: '#fff', borderColor: '#EAEAEA', boxShadow: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 18px 40px -22px rgba(10,36,99,0.3)'; e.currentTarget.style.borderColor = '#00E87A55'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#EAEAEA'; }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[13px]" style={{ background: '#00E87A14' }}>
                  <Icon size={23} color="#0A2463" strokeWidth={2} />
                </div>
                <h3 className="mb-[9px] font-heading text-[19px] font-semibold" style={{ color: '#0A2463' }}>{card.title}</h3>
                <p className="text-[15.5px] leading-[1.55]" style={{ color: '#6B6B6B' }}>{card.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function AutoDiscoveryShowcase() {
  return (
    <section id="product" className="mx-auto max-w-[1180px] px-8 py-[72px]">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>Auto-discovery</p>
          <h2 className="mb-[18px] font-heading text-[36px] font-bold leading-[1.12] tracking-[-0.025em]" style={{ color: '#0A2463' }}>
            Every other IDP starts empty. Shipyard starts full.
          </h2>
          <p className="text-[17px] leading-[1.6]" style={{ color: '#6B6B6B' }}>
            Point it at your org. Shipyard reads what&apos;s actually running across your codebases and environments: services, languages, datastores, owners. Open it on day one and your whole estate is already there.
          </p>
        </Reveal>
        <Reveal>
          <CatalogMock />
        </Reveal>
      </div>
    </section>
  );
}

export function CapabilitiesShowcase() {
  const [active, setActive] = useState<CapabilityKey>('create');

  return (
    <section className="mx-auto max-w-[1180px] px-8 pb-[88px] pt-12">
      <Reveal className="mx-auto mb-11 max-w-[660px] text-center">
        <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>Natural language → IaC</p>
        <h2 className="mb-4 font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463', textWrap: 'balance' }}>Talk to your infrastructure.</h2>
        <p className="mx-auto max-w-[560px] text-[17px] leading-[1.6]" style={{ color: '#6B6B6B' }}>
          Shipyard lives inside your infrastructure layer. Spin up production, change it safely, and answer anything about it, all in plain English.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <Reveal className="flex flex-col gap-[14px]">
          {(Object.keys(CAPABILITIES) as CapabilityKey[]).map((key) => {
            const cap = CAPABILITIES[key];
            const Icon = CAP_ICONS[key];
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="w-full rounded-2xl p-[18px_20px] text-left transition-all duration-200"
                style={{
                  border: `1.5px solid ${isActive ? '#00E87A' : '#EAEAEA'}`,
                  background: isActive ? '#00E87A0a' : '#fff',
                  boxShadow: isActive ? '0 14px 32px -18px rgba(0,232,122,0.5)' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                }}
              >
                <div className="flex items-center gap-[14px]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: isActive ? '#00E87A' : '#FAFAFA' }}>
                    <Icon size={22} color="#0A2463" strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="font-heading text-[18px] font-bold tracking-[-0.01em]" style={{ color: '#0A2463' }}>{cap.label}</div>
                    <div className="mt-0.5 text-sm leading-[1.45]" style={{ color: '#6B6B6B' }}>{cap.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </Reveal>

        <Reveal className="rounded-[18px] border p-[14px]" style={{ background: '#FAFAFA', borderColor: '#EAEAEA', boxShadow: '0 24px 60px -32px rgba(10,36,99,0.28)' }}>
          <CapabilityDemoPanel active={active} />
        </Reveal>
      </div>
    </section>
  );
}

export { IntegrationsMarquee };

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1180px] px-8 py-[84px]">
      <Reveal className="mx-auto mb-14 max-w-[560px] text-center">
        <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>How it works</p>
        <h2 className="font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463' }}>Three steps. No platform team.</h2>
      </Reveal>
      <div className="relative grid grid-cols-1 gap-7 sm:grid-cols-3">
        <div className="absolute top-[27px] left-[16%] right-[16%] hidden h-[1.5px] opacity-40 sm:block" style={{ background: 'linear-gradient(90deg,#00E87A,#1E5FCC)' }} />
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <Reveal key={step.n} className="relative z-10 text-center">
            <div
              className="mx-auto mb-[22px] flex h-[54px] w-[54px] items-center justify-center rounded-2xl border"
              style={{
                background: i === 2 ? '#00E87A' : '#fff',
                borderColor: i === 2 ? '#00E87A' : '#EAEAEA',
                boxShadow: i === 2 ? '0 8px 20px -6px rgba(0,232,122,0.5)' : '0 6px 16px -8px rgba(10,36,99,0.2)',
              }}
            >
              <span className="font-heading text-xl font-bold" style={{ color: '#0A2463' }}>{step.n}</span>
            </div>
            <h3 className="mb-2.5 font-heading text-[21px] font-semibold" style={{ color: '#0A2463' }}>{step.title}</h3>
            <p className="mx-auto max-w-[240px] text-[15.5px] leading-[1.55]" style={{ color: '#6B6B6B' }}>{step.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ImpactTable({ rows }: { rows: { label: string; before: string; after: string }[] }) {
  return (
    <div className="mx-auto max-w-[940px] overflow-hidden rounded-[24px] border bg-white" style={{ borderColor: '#EAEAEA', boxShadow: '0 30px 70px -42px rgba(10,36,99,0.3)' }}>
      <div className="grid grid-cols-[1.15fr_1fr_1fr]">
        <div className="p-[17px_28px]" />
        <div className="p-[17px_22px] font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#9a9a9a' }}>Before Shipyard</div>
        <div className="p-[17px_24px] font-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ background: '#00E87A0a', color: '#0BA45E' }}>With Shipyard</div>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[1.15fr_1fr_1fr] items-center border-t" style={{ borderColor: '#EAEAEA' }}>
          <div className="p-[22px_28px] text-[15.5px] font-semibold" style={{ color: '#0A2463' }}>{row.label}</div>
          <div className="flex items-center gap-2.5 p-[22px_22px] text-[15px]" style={{ color: '#9a9a9a' }}>
            <span className="block h-[2.4px] w-[12px] shrink-0 rounded" style={{ background: '#c4c4c4' }} />
            {row.before}
          </div>
          <div className="flex items-center gap-2.5 p-[22px_24px] text-[16px] font-bold" style={{ background: '#00E87A0a', color: '#0A2463' }}>
            <Check size={16} color="#00C9A7" strokeWidth={2.6} className="shrink-0" />
            {row.after}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ImpactSection() {
  const [solo, setSolo] = useState(true);
  const panel = solo ? IMPACT_SOLO : IMPACT_TEAM;

  return (
    <section className="mx-auto max-w-[1180px] px-8 pb-[90px] pt-[30px]">
      <Reveal className="mx-auto mb-9 max-w-[580px] text-center">
        <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>The impact</p>
        <h2 className="font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463' }}>See the difference, for you and your team.</h2>
      </Reveal>

      <Reveal className="mb-[34px] flex justify-center">
        <div className="relative flex rounded-[14px] border p-[5px]" style={{ background: '#FAFAFA', borderColor: '#EAEAEA' }}>
          <span
            className="absolute bottom-[5px] left-[5px] top-[5px] rounded-[10px] transition-transform duration-300"
            style={{ width: 'calc(50% - 5px)', background: '#00E87A', transform: solo ? 'translateX(0%)' : 'translateX(100%)' }}
          />
          <button onClick={() => setSolo(true)} className="relative z-10 rounded-[10px] px-[30px] py-[11px] text-[15px] font-semibold" style={{ color: '#0A2463' }}>Just me</button>
          <button onClick={() => setSolo(false)} className="relative z-10 rounded-[10px] px-[30px] py-[11px] text-[15px] font-semibold" style={{ color: '#0A2463' }}>My whole team</button>
        </div>
      </Reveal>

      <div key={solo ? 'solo' : 'team'} style={{ animation: 'fadeSwap .42s ease' }}>
        <p className="mx-auto mb-[30px] max-w-[540px] text-center text-[16px]" style={{ color: '#6B6B6B' }}>{panel.description}</p>
        <ImpactTable rows={panel.rows} />
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="border-t" style={{ background: '#FAFAFA', borderColor: '#EAEAEA' }}>
      <div className="mx-auto max-w-[1100px] px-8 py-[84px]">
        <Reveal className="mx-auto mb-12 max-w-[540px] text-center">
          <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>Pricing</p>
          <h2 className="font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463' }}>Start free. Scale when you&apos;re ready.</h2>
        </Reveal>
        <div className="grid grid-cols-1 items-stretch gap-[22px] md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <Reveal key={tier.name}>
              <div
                className="flex h-full flex-col rounded-[20px] p-8"
                style={{
                  background: tier.popular ? '#0A2463' : '#fff',
                  border: `1px solid ${tier.popular ? '#0A2463' : '#EAEAEA'}`,
                  boxShadow: tier.popular ? '0 30px 60px -30px rgba(10,36,99,0.5)' : 'none',
                  transform: tier.popular ? 'translateY(-6px)' : 'none',
                  position: 'relative',
                }}
              >
                {tier.popular && (
                  <span className="absolute right-5 top-5 rounded-full px-[10px] py-1 font-mono text-[11px] font-semibold" style={{ background: '#00E87A', color: '#0A2463' }}>POPULAR</span>
                )}
                <h3 className="mb-[5px] font-heading text-xl font-bold" style={{ color: tier.popular ? '#fff' : '#0A2463' }}>{tier.name}</h3>
                <p className="mb-5 text-sm" style={{ color: tier.popular ? 'rgba(255,255,255,0.6)' : '#6B6B6B' }}>{tier.description}</p>
                <div className="mb-[22px] flex items-baseline gap-1.5">
                  <span className="font-heading font-extrabold tracking-[-0.02em]" style={{ fontSize: tier.price.length > 6 ? 30 : 38, color: tier.popular ? '#00E87A' : '#0A2463' }}>{tier.price}</span>
                  {tier.period && <span className="text-[15px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{tier.period}</span>}
                </div>
                <a
                  href="/signup"
                  className="block rounded-xl p-3 text-center text-[15px] font-semibold no-underline transition-transform"
                  style={{
                    background: tier.popular ? '#00E87A' : '#fff',
                    color: '#0A2463',
                    border: tier.popular ? 'none' : '1px solid #0A246330',
                  }}
                >
                  {tier.cta}
                </a>
                <div className="mt-[22px] flex flex-col gap-3">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-[14.5px] leading-[1.4]" style={{ color: tier.popular ? 'rgba(255,255,255,0.8)' : '#6B6B6B' }}>
                      <Check size={17} color="#00E87A" strokeWidth={2.6} className="mt-0.5 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#0A2463' }}>
      <div className="pointer-events-none absolute -right-20 -top-[120px] h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle, #1E5FCC55, transparent 70%)' }} />
      <Reveal className="relative mx-auto max-w-[1180px] px-8 py-24 text-center">
        <h2 className="mb-[18px] font-heading text-[clamp(34px,5vw,50px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
          Map your context in <span style={{ color: '#00E87A' }}>5 minutes.</span>
        </h2>
        <p className="mx-auto mb-[34px] max-w-[480px] text-[18px] leading-[1.55]" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Read-only access. No YAML, no manual setup, no platform team required.
        </p>
        <a
          href="/signup"
          className="inline-flex items-center gap-[9px] rounded-2xl px-[30px] py-4 text-[17px] font-bold no-underline transition-transform hover:-translate-y-0.5"
          style={{ background: '#00E87A', color: '#0A2463', boxShadow: '0 8px 24px rgba(0,232,122,0.3)' }}
        >
          <Target size={18} strokeWidth={2.2} />
          Map your context
        </a>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: '#EAEAEA' }}>
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-5 px-8 py-[34px]">
        <a href="#top" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
            <rect width="72" height="72" rx="18" fill="#00E87A" />
            <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="font-heading text-base font-bold" style={{ color: '#0A2463' }}>Shipyard</span>
        </a>
        <span className="text-[13.5px]" style={{ color: '#6B6B6B' }}>© 2026 Shipyard, Inc.</span>
        <div className="ml-auto flex gap-6">
          <a href="#" className="text-sm no-underline" style={{ color: '#6B6B6B' }}>Privacy</a>
          <a href="#" className="text-sm no-underline" style={{ color: '#6B6B6B' }}>Terms</a>
          <a href="#integrations" className="text-sm no-underline" style={{ color: '#6B6B6B' }}>Integrations</a>
          <a href="#" className="text-sm no-underline" style={{ color: '#6B6B6B' }}>X</a>
        </div>
      </div>
    </footer>
  );
}
