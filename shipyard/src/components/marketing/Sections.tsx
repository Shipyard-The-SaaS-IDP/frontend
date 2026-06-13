import { Anchor, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { PREVIEWS, TranslatorPreview } from './Previews';
import { IntegrationsMarquee } from './Marquee';
import { WaitlistForm } from './Waitlist';
import { FEATURE_SECTIONS, PAIN_POINTS, HOW_IT_WORKS } from './data';

export function Hero({ onJoinClick }: { onJoinClick: () => void }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-10 pb-20 pt-[140px] text-center">
      <div className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
      <div
        className="pointer-events-none absolute left-1/2 top-[28%] h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
      />

      <Reveal className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-3.5 py-[5px] text-[12.5px] font-medium text-[#94A3B8]">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
        Early access now open
      </Reveal>

      <Reveal delay={50}>
        <h1 className="relative mb-[22px] max-w-[780px] font-heading text-[clamp(40px,5.2vw,68px)] font-bold leading-[1.08] tracking-[-0.035em]">
          AI tools build your app.{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #C4B5FD 100%)' }}
          >
            Shipyard builds everything around it.
          </span>
        </h1>
      </Reveal>

      <Reveal delay={100}>
        <p className="relative mb-10 max-w-[520px] text-[17px] leading-[1.7] text-[#64748B]">
          You shipped an MVP with Base44, Lovable, or Claude Code this weekend. Now it needs real infrastructure,
          compliance, and docs — without you hiring a platform team. That&apos;s Shipyard.
        </p>
      </Reveal>

      <Reveal delay={150} className="relative mb-[76px] flex flex-wrap justify-center gap-2.5">
        <button
          onClick={onJoinClick}
          className="flex items-center gap-2 rounded-[10px] border-none px-6 py-3 text-[14.5px] font-semibold text-[#0A0A0F] transition-opacity hover:opacity-85"
          style={{ background: '#F1F5F9' }}
        >
          Join the waitlist <ArrowRight size={15} />
        </button>
        <a
          href="#tour"
          className="flex items-center gap-2 rounded-[10px] border border-white/[0.09] px-6 py-3 text-[14.5px] font-medium text-[#94A3B8] no-underline transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-[#F1F5F9]"
        >
          See the product
        </a>
      </Reveal>

      <Reveal delay={200} className="relative w-full max-w-[800px]">
        <TranslatorPreview />
      </Reveal>
    </section>
  );
}

export function StatsBar() {
  const stats = [
    { value: '1 afternoon', label: 'from idea to running infrastructure' },
    { value: 'Built for solo founders', label: 'and teams too small for a platform engineer' },
    { value: 'Zero maintenance', label: 'Shipyard runs it for you' },
  ];
  return (
    <div className="border-y border-white/[0.05] bg-white/[0.015]">
      <div className="mx-auto grid max-w-[860px] grid-cols-3">
        {stats.map(({ value, label }, i) => (
          <div key={value} className={`px-8 py-8 text-center ${i < 2 ? 'border-r border-white/[0.05]' : ''}`}>
            <div className="mb-1 font-heading text-[22px] font-bold tracking-[-0.01em] text-[#F1F5F9]">{value}</div>
            <div className="text-[13px] text-[#475569]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PainPoints() {
  return (
    <section className="px-12 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <SectionHeader
          eyebrow="The problem"
          title="Every vibe-coded MVP hits the same wall."
          description="AI coding tools get you a working prototype fast. Real users mean real infrastructure, real compliance, and real docs — and most founders don't know where to start."
          maxWidth={520}
        />
        <RevealGroup className="grid grid-cols-2 gap-3.5">
          {PAIN_POINTS.map(({ before, after }) => (
            <RevealItem key={before}>
              <div className="lift-on-hover flex h-full flex-col gap-3.5 rounded-xl border border-white/[0.06] p-[22px] transition-[border-color,transform] duration-200" style={{ background: '#111118' }}>
                <div className="flex items-start gap-2.5">
                  <X size={14} color="#EF4444" strokeWidth={2.2} className="mt-0.5 shrink-0" />
                  <span className="text-[13.5px] leading-[1.6] text-[#64748B]">{before}</span>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} color="#10B981" strokeWidth={2.2} className="mt-0.5 shrink-0" />
                  <span className="text-[13.5px] leading-[1.6] text-[#E2E8F0]">{after}</span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function ProductTour() {
  return (
    <section id="tour" className="bg-dot-grid border-y border-white/[0.05] bg-white/[0.012] px-12 py-[100px]">
      <div className="mx-auto max-w-[1080px]">
        <SectionHeader
          eyebrow="The product"
          title="From business idea to production, in plain English."
          description="Not a framework to configure. A complete production layer for the app your AI tool already built."
          maxWidth={480}
        />
        <div className="flex flex-col gap-[100px]">
          {FEATURE_SECTIONS.map(({ id, icon: Icon, color, eyebrow, title, description, bullets }, i) => {
            const textBlock = (
              <div>
                <div className="mb-[18px] flex items-center gap-2.5">
                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px]" style={{ background: `${color}14`, border: `1px solid ${color}28` }}>
                    <Icon size={16} color={color} strokeWidth={1.8} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color }}>{eyebrow}</p>
                </div>
                <h3 className="mb-3.5 font-heading text-[clamp(22px,2.8vw,30px)] font-bold leading-[1.2] tracking-[-0.025em] text-[#F1F5F9]">{title}</h3>
                <p className="mb-5 max-w-[460px] text-[15px] leading-[1.75] text-[#64748B]">{description}</p>
                <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-[1.6] text-[#94A3B8]">
                      <CheckCircle2 size={14} color={color} strokeWidth={2.2} className="mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
            const previewBlock = <div>{PREVIEWS[id]()}</div>;
            const reverse = i % 2 === 1;
            return (
              <Reveal key={id}>
                <div className="grid grid-cols-2 items-center gap-16">
                  {reverse ? <>{previewBlock}{textBlock}</> : <>{textBlock}{previewBlock}</>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-12 py-[100px]">
      <div className="mx-auto max-w-[760px]">
        <SectionHeader
          eyebrow="How it works"
          title="From prompt to production in an afternoon."
        />
        <RevealGroup className="grid grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(({ n, title, description }) => (
            <RevealItem key={n}>
              <div className="lift-on-hover h-full rounded-xl border border-white/[0.06] p-6 transition-[border-color,transform] duration-200" style={{ background: '#111118' }}>
                <div className="mb-3.5 font-mono text-xs font-semibold tracking-[0.06em] text-[#818CF8]">{n}</div>
                <h3 className="mb-2 font-heading text-[17px] font-semibold tracking-[-0.01em] text-[#F1F5F9]">{title}</h3>
                <p className="text-[13.5px] leading-[1.7] text-[#64748B]">{description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export { IntegrationsMarquee };

export function WaitlistCTA() {
  return (
    <section id="waitlist" className="relative overflow-hidden border-t border-white/[0.05] px-12 py-[120px] text-center">
      <div className="bg-dot-grid pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center 50%, rgba(99,102,241,0.10) 0%, transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-[560px]">
        <Reveal>
          <div className="mx-auto mb-[26px] flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: '#6366F1' }}>
            <Anchor size={24} color="white" strokeWidth={2.5} />
          </div>
          <h2 className="mb-3.5 font-heading text-[clamp(28px,4vw,46px)] font-bold leading-[1.12] tracking-[-0.035em] text-[#F1F5F9]">
            Get early access.
          </h2>
          <p className="mx-auto mb-10 max-w-[400px] text-[15.5px] leading-[1.7] text-[#64748B]">
            We&apos;re onboarding in small batches. Join the list and we&apos;ll reach out as soon as your spot is ready.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <WaitlistForm />
          <p className="mt-4 text-xs text-[#334155]">No spam. Unsubscribe any time.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.05] px-12 py-7">
      <div className="flex items-center gap-2">
        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px]" style={{ background: '#6366F1' }}>
          <Anchor size={12} color="white" strokeWidth={2.5} />
        </div>
        <span className="font-heading text-[13px] font-semibold tracking-[-0.01em] text-[#F1F5F9]">Shipyard</span>
      </div>
      <p className="text-center text-xs text-[#334155]">AI coding tools build your app. Shipyard builds everything around it.</p>
      <div className="flex gap-5">
        <a href="#tour" className="text-xs text-[#475569] no-underline">Product</a>
        <a href="#how-it-works" className="text-xs text-[#475569] no-underline">How it works</a>
        <a href="#waitlist" className="text-xs text-[#475569] no-underline">Waitlist</a>
      </div>
    </footer>
  );
}
