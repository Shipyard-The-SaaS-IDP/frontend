import { Fragment } from 'react';
import { Anchor, Library, Zap, Cloud, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ARCHITECT_STEPS } from './data';

export function BrowserFrame({ url, height = 340, children }: { url: string; height?: number; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/[0.09] shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04),0_0_80px_rgba(99,102,241,0.08)]"
      style={{ background: '#111118' }}
    >
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-2.5" style={{ background: '#0A0A0F' }}>
        <div className="flex gap-1.5">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} className="h-2.5 w-2.5 rounded-full opacity-80" style={{ background: c }} />
          ))}
        </div>
        <div className="mx-auto max-w-[280px] flex-1 rounded-md px-3 py-1 text-[11px] font-mono text-[#475569]" style={{ background: '#1A1A24' }}>
          {url}
        </div>
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

export function TranslatorPreview() {
  return (
    <BrowserFrame url="app.getshipyard.dev/translator">
      <div className="flex h-full">
        <div className="flex flex-1 flex-col gap-2.5 border-r border-white/[0.05] p-[18px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#475569]">Tell us about your business</div>
          <div className="flex-1 rounded-lg border border-white/[0.06] p-3 text-xs leading-7 text-[#94A3B8]" style={{ background: '#1A1A24' }}>
            &quot;We&apos;re a telehealth startup connecting rural clinics with specialists. Expecting 5,000 patients in year one, need HIPAA compliance, small team of 3 engineers.&quot;
          </div>
          <div className="flex items-center gap-1.5 self-end rounded-lg px-4 py-1.5 text-xs font-semibold text-white" style={{ background: '#6366F1' }}>
            Translate <ArrowRight size={12} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-[18px]">
          <div className="flex flex-wrap gap-1.5">
            {['Healthcare', '~5,000 patients', '3 engineers', 'HIPAA'].map((t) => (
              <span key={t} className="rounded-full px-2.5 py-0.5 text-[10px] text-[#818CF8]" style={{ background: 'rgba(99,102,241,0.12)' }}>{t}</span>
            ))}
          </div>
          {[
            ['Architecture', 'Modular monolith'],
            ['Stack', 'FastAPI + Postgres + AWS'],
            ['Compliance', 'HIPAA — encryption, audit logs, VPC'],
            ['Est. cost', '~$340 / month'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 rounded-lg border border-white/[0.05] px-[11px] py-2.5" style={{ background: '#1A1A24' }}>
              <span className="text-[11px] text-[#475569]">{k}</span>
              <span className="text-right text-[11px] font-medium text-[#E2E8F0]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

export function ArchitectPreview() {
  return (
    <BrowserFrame url="app.getshipyard.dev/workflows/new">
      <div className="flex h-full flex-col gap-[18px] p-[22px]">
        <div className="rounded-lg border border-[rgba(99,102,241,0.25)] px-3.5 py-[11px] text-xs leading-7 text-[#94A3B8]" style={{ background: 'rgba(99,102,241,0.08)' }}>
          <span className="font-semibold text-[#818CF8]">From brief: </span>
          FastAPI service on Postgres + AWS, CI/CD, HIPAA controls, Slack alerts
        </div>
        <div className="flex flex-1 items-start gap-0 pt-2">
          {ARCHITECT_STEPS.map((s, i) => (
            <Fragment key={s.label}>
              <div className="flex w-[90px] flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.08]" style={{ background: '#1A1A24' }}>
                  <s.icon size={17} color="#818CF8" strokeWidth={1.8} />
                </div>
                <span className="text-center text-[10px] leading-[1.4] text-[#64748B]">{s.label}</span>
              </div>
              {i < ARCHITECT_STEPS.length - 1 && <ArrowRight size={14} color="#334155" className="mt-3 shrink-0" />}
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[rgba(16,185,129,0.2)] px-3.5 py-[11px] text-xs text-[#94A3B8]" style={{ background: '#1A1A24' }}>
          <CheckCircle2 size={14} color="#10B981" strokeWidth={2} />
          Workflow generated — ready to run
        </div>
      </div>
    </BrowserFrame>
  );
}

export function MCPHubPreview() {
  const groups: Array<{ title: string; items: Array<[string, boolean]> }> = [
    { title: 'Build', items: [['GitHub', true], ['Base44', true], ['Claude Code', false]] },
    { title: 'Deploy', items: [['Vercel', true], ['AWS', true], ['Supabase', false]] },
    { title: 'Operate', items: [['Slack', true], ['Google Workspace', false], ['PagerDuty', false]] },
  ];
  return (
    <BrowserFrame url="app.getshipyard.dev/integrations">
      <div className="flex h-full flex-col justify-center gap-4 p-5">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#475569]">{g.title}</div>
            <div className="flex gap-2">
              {g.items.map(([name, connected]) => (
                <div
                  key={name}
                  className="flex flex-1 items-center justify-between rounded-lg border px-[11px] py-2.5"
                  style={{ background: '#1A1A24', borderColor: connected ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)' }}
                >
                  <span className="text-[11px] text-[#94A3B8]">{name}</span>
                  {connected && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#10B981' }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

export function DashboardPreview() {
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
    <BrowserFrame url="app.getshipyard.dev/catalog">
      <div className="flex h-full">
        <div className="flex w-[52px] flex-col items-center gap-1 border-r border-white/[0.04] py-3" style={{ background: '#0D0D14' }}>
          <div className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-[7px]" style={{ background: '#6366F1' }}>
            <Anchor size={13} color="white" strokeWidth={2.5} />
          </div>
          {[Library, Zap, Cloud, Users].map((Icon, i) => (
            <div
              key={i}
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderLeft: i === 0 ? '2px solid #6366F1' : '2px solid transparent',
              }}
            >
              <Icon size={15} color={i === 0 ? '#818CF8' : '#334155'} strokeWidth={1.8} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 px-5 py-[18px]">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heading text-sm font-semibold text-[#F1F5F9]">Service Catalog</div>
              <div className="mt-0.5 text-[11px] text-[#334155]">10 services registered</div>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px]" style={{ background: '#6366F1' }}>
              <ArrowRight size={12} color="white" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-[7px] border border-white/[0.07] px-3 py-[7px]" style={{ background: '#1A1A24' }}>
            <div className="h-3 w-3 rounded-full border-[1.5px] border-[#334155]" />
            <span className="text-[11px] text-[#334155]">Search services, stacks, owners...</span>
          </div>
          <div className="flex gap-1.5">
            {['All', 'Healthy', 'Degraded', 'Deploying'].map((f, i) => (
              <div
                key={f}
                className="rounded-[5px] px-2.5 py-[3px] text-[10px] font-medium"
                style={{
                  background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: i === 0 ? '#818CF8' : '#334155',
                }}
              >
                {f}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[5px]">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between rounded-[7px] border border-white/[0.05] px-3 py-2" style={{ background: '#111118' }}>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: statusColor[svc.status] }} />
                  <span className="font-mono text-[11px] text-[#94A3B8]">{svc.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-[3px] px-1.5 py-0.5 text-[10px] text-[#3B82F6]" style={{ background: 'rgba(59,130,246,0.12)' }}>{svc.stack}</span>
                  <span className="min-w-[36px] text-right font-mono text-[10px] text-[#334155]">{svc.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function ComparisonBar({
  color,
  beforeLabel,
  beforeValue,
  beforePct,
  afterLabel,
  afterValue,
  afterPct,
}: {
  color: string;
  beforeLabel: string;
  beforeValue: string;
  beforePct: number;
  afterLabel: string;
  afterValue: string;
  afterPct: number;
}) {
  const rows = [
    { label: beforeLabel, value: beforeValue, pct: beforePct, fill: '#475569' },
    { label: afterLabel, value: afterValue, pct: afterPct, fill: color },
  ];
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] p-4" style={{ background: '#111118' }}>
      {rows.map((row, i) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] leading-[1.4] text-[#94A3B8]">{row.label}</span>
            <span
              className="shrink-0 font-mono text-[12px] font-semibold"
              style={{ color: i === 0 ? '#64748B' : color }}
            >
              {row.value}
            </span>
          </div>
          <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${row.pct}%`, background: row.fill }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export const PREVIEWS: Record<string, () => React.ReactNode> = {
  translator: () => <TranslatorPreview />,
  architect: () => <ArchitectPreview />,
  'mcp-hub': () => <MCPHubPreview />,
  dashboard: () => <DashboardPreview />,
};
