'use client';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { DISCOVERY_TRACE, CATALOG_MOCK_SERVICES, CAPABILITIES, type CapabilityKey } from './data';

// ─── Hero: animated terminal discovery trace ─────────────────────────────────
export function DiscoveryTerminal() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= DISCOVERY_TRACE.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 560);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="mt-[54px] rounded-[20px] border p-[18px]" style={{ background: '#00E87A0A', borderColor: '#00E87A2e' }}>
      <div className="overflow-hidden rounded-[14px]" style={{ background: '#0A2463', boxShadow: '0 24px 60px -24px rgba(10,36,99,0.5)' }}>
        <div className="flex items-center gap-2 border-b px-[18px] py-[13px]" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} className="h-[11px] w-[11px] rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-3 font-mono text-[12.5px]" style={{ color: 'rgba(255,255,255,0.5)' }}>shipyard · discover</span>
          <span className="ml-auto flex items-center gap-[7px] font-mono text-[12px]" style={{ color: '#00E87A' }}>
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#00E87A', boxShadow: '0 0 8px #00E87A', animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
            live
          </span>
        </div>
        <div className="min-h-[298px] px-6 py-[22px] font-mono text-[14.5px]" style={{ lineHeight: 2 }}>
          {DISCOVERY_TRACE.slice(0, count).map((line, i) => (
            <div key={i} className="flex items-baseline gap-[11px]" style={{ animation: 'traceIn .28s ease-out', color: line.color }}>
              <span className="w-[15px] shrink-0" style={{ color: line.iconColor }}>{line.icon}</span>
              <span style={{ whiteSpace: 'pre-wrap', fontWeight: line.weight }}>{line.text}</span>
            </div>
          ))}
          {count < DISCOVERY_TRACE.length && (
            <span className="ml-[26px] inline-block h-[17px] w-2 align-middle" style={{ background: '#00E87A', animation: 'dcBlink 1s step-end infinite' }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Infra layer diagram: 3-tier stack with flowing connectors ──────────────
function ConnectorColumn({ direction, delay }: { direction: 'up' | 'down'; delay: number }) {
  const gradient = direction === 'up'
    ? 'linear-gradient(180deg,#1E5FCC44,#00E87A66)'
    : 'linear-gradient(180deg,#00E87A66,#1E5FCC44)';
  const dotColor = direction === 'up' ? '#00C9A7' : '#00E87A';
  return (
    <div className="relative h-10 w-[2px]" style={{ background: gradient }}>
      <span
        className="absolute left-[-2px] h-[6px] w-[6px] rounded-full"
        style={{
          background: dotColor,
          boxShadow: `0 0 8px ${dotColor}`,
          animation: `${direction === 'up' ? 'flowUp' : 'flowDown'} 2.6s linear infinite ${delay}s`,
        }}
      />
    </div>
  );
}

export function InfraLayerDiagram() {
  return (
    <div className="mx-auto max-w-[920px] rounded-[24px] border bg-white p-[34px]" style={{ borderColor: '#EAEAEA', boxShadow: '0 34px 80px -44px rgba(10,36,99,0.34)' }}>
      <div className="flex flex-wrap items-center gap-[18px] rounded-[14px] border p-[15px_20px]" style={{ background: '#FAFAFA', borderColor: '#EAEAEA' }}>
        <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#6B6B6B' }}>Your code &amp; services</span>
        <div className="ml-auto flex flex-wrap gap-[9px]">
          {['api-gateway', 'payments', 'web-app', 'workers'].map((s) => (
            <span key={s} className="rounded-lg border bg-white px-[11px] py-[6px] font-mono text-xs" style={{ color: '#0A2463', borderColor: '#EAEAEA' }}>{s}</span>
          ))}
        </div>
      </div>

      <div className="flex h-10 items-stretch justify-center gap-[90px]">
        {[0, 0.9, 1.7].map((d, i) => <ConnectorColumn key={i} direction="up" delay={d} />)}
      </div>

      <div className="relative flex items-center gap-[14px] overflow-hidden rounded-2xl p-[18px_22px]" style={{ background: '#0A2463', boxShadow: '0 18px 44px -18px rgba(10,36,99,0.6)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, #00E87A14, transparent)' }} />
        <svg width="32" height="32" viewBox="0 0 72 72" fill="none" className="relative shrink-0">
          <rect width="72" height="72" rx="18" fill="#00E87A" />
          <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <div className="relative">
          <div className="font-heading text-lg font-bold tracking-[-0.01em] text-white">Shipyard</div>
          <div className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>reads context up, ships changes down</div>
        </div>
        <span className="relative ml-auto flex items-center gap-[7px] font-mono text-[11.5px]" style={{ color: '#00E87A' }}>
          <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#00E87A', boxShadow: '0 0 8px #00E87A', animation: 'pulse-dot 1.6s ease-in-out infinite' }} />
          active
        </span>
      </div>

      <div className="flex h-10 items-stretch justify-center gap-[90px]">
        {[0.4, 1.3, 2.1].map((d, i) => <ConnectorColumn key={i} direction="down" delay={d} />)}
      </div>

      <div className="flex flex-wrap items-center gap-[18px] rounded-[14px] border p-[15px_20px]" style={{ background: '#FAFAFA', borderColor: '#EAEAEA' }}>
        <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#6B6B6B' }}>Your cloud &amp; environments</span>
        <div className="ml-auto flex flex-wrap gap-[9px]">
          {['compute', 'databases', 'queues', 'secrets'].map((s) => (
            <span key={s} className="rounded-lg border bg-white px-[11px] py-[6px] font-mono text-xs" style={{ color: '#0A2463', borderColor: '#EAEAEA' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Auto-discovery showcase: floating service-card catalog mock ───────────
export function CatalogMock() {
  return (
    <div className="rounded-[18px] border p-[14px]" style={{ background: '#FAFAFA', borderColor: '#EAEAEA', boxShadow: '0 24px 60px -32px rgba(10,36,99,0.28)' }}>
      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#EAEAEA' }}>
        <div className="flex items-center gap-[13px] border-b px-4 py-3" style={{ borderColor: '#EAEAEA' }}>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="h-[9px] w-[9px] rounded-full" style={{ background: '#EAEAEA' }} />)}
          </div>
          <span className="text-[13.5px] font-semibold" style={{ color: '#0A2463' }}>Service Catalog</span>
          <span className="rounded-md px-2 py-[3px] font-mono text-[11.5px]" style={{ color: '#00C9A7', background: '#00C9A714' }}>24 services · auto</span>
          <span className="ml-auto text-xs" style={{ color: '#6B6B6B' }}>Map</span>
        </div>
        <div
          className="relative h-[360px] overflow-hidden"
          style={{ background: 'radial-gradient(circle at 1px 1px, #EAEAEA 1px, transparent 0)', backgroundSize: '22px 22px' }}
        >
          <div className="pointer-events-none absolute inset-y-0 w-20" style={{ background: 'linear-gradient(90deg, transparent, #00E87A22, transparent)', animation: 'dcScan 4s ease-in-out infinite' }} />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 360" preserveAspectRatio="none">
            <path d="M88 85 C 150 85, 200 85, 310 85" stroke="#1E5FCC" strokeWidth="1.6" fill="none" opacity="0.45" />
            <path d="M88 85 C 150 85, 200 290, 299 290" stroke="#1E5FCC" strokeWidth="1.6" fill="none" opacity="0.45" />
            <path d="M310 85 C 370 85, 400 70, 432 70" stroke="#00C9A7" strokeWidth="1.6" fill="none" opacity="0.5" />
            <path d="M299 290 C 360 290, 400 275, 432 275" stroke="#00C9A7" strokeWidth="1.6" fill="none" opacity="0.5" />
          </svg>
          {CATALOG_MOCK_SERVICES.map((svc, i) => (
            <div
              key={svc.name}
              className="absolute rounded-[11px] border bg-white p-[11px_12px]"
              style={{
                left: svc.left,
                top: svc.top,
                width: svc.name.length > 12 ? 150 : 128,
                borderColor: svc.highlight ? '#00E87A' : '#EAEAEA',
                boxShadow: svc.highlight ? '0 10px 24px -8px rgba(0,232,122,0.4)' : '0 6px 16px -8px rgba(10,36,99,0.25)',
                animation: `floaty 6s ease-in-out infinite ${i * 0.4}s`,
              }}
            >
              <div className="mb-[7px] flex items-center gap-[7px]">
                <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: svc.status }} />
                <span className="text-[13px] font-semibold" style={{ color: '#0A2463' }}>{svc.name}</span>
              </div>
              <div className="font-mono text-[10.5px]" style={{ color: '#6B6B6B', marginBottom: svc.owner ? 9 : 0 }}>{svc.stack}</div>
              {svc.owner && (
                <div className="flex items-center gap-1.5">
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ background: svc.ownerColor }}>{svc.owner}</span>
                  <span className="text-[11px]" style={{ color: '#6B6B6B' }}>{svc.owner === 'AR' ? 'Ana R.' : 'Marcus L.'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Capabilities showcase: live demo panel for Create/Maintain/Context ────
export function CapabilityDemoPanel({ active }: { active: CapabilityKey }) {
  const cap = CAPABILITIES[active];
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#EAEAEA' }}>
      <div className="flex items-center gap-[13px] border-b px-4 py-3" style={{ borderColor: '#EAEAEA' }}>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => <span key={i} className="h-[9px] w-[9px] rounded-full" style={{ background: '#EAEAEA' }} />)}
        </div>
        <span className="text-[13.5px] font-semibold" style={{ color: '#0A2463' }}>{cap.demoTitle}</span>
        <span className="ml-auto rounded-md px-[9px] py-[3px] font-mono text-[11px]" style={{ color: '#00C9A7', background: '#00C9A714' }}>{cap.demoTag}</span>
      </div>
      <div className="flex-1 p-[18px]">
        <div className="mb-[14px] flex items-start gap-[10px]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] font-mono text-xs font-semibold" style={{ background: '#0A2463', color: '#00E87A' }}>›</span>
          <div className="flex-1 rounded-[11px] border p-[12px_14px]" style={{ borderColor: '#00E87A', background: '#00E87A0a' }}>
            <div key={active} className="text-[14.5px] leading-[1.5]" style={{ color: '#0A2463', animation: 'fadeSwap .35s ease' }}>{cap.prompt}</div>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 pl-[34px] font-mono text-[11.5px]" style={{ color: '#6B6B6B' }}>
          <Check size={13} color="#00C9A7" strokeWidth={2.6} />
          {cap.resultLabel}
        </div>
        <div key={active + '-out'} className="rounded-[10px] p-[15px_17px] font-mono text-xs" style={{ background: '#0A2463', lineHeight: 1.9, animation: 'fadeSwap .4s ease' }}>
          {cap.lines.map((ln, i) => (
            <div key={i} style={{ color: ln.color }}>{ln.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
