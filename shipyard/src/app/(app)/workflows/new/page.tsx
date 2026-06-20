'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, GitBranch, Server, Database, ListOrdered } from 'lucide-react';
import { api, ApiError, type ArchitectResource, type GenerateResponse } from '@/lib/api';

const EXAMPLE_PROMPTS = [
  { label: 'Queue consumer', text: 'A Go service that reads the orders queue and writes enriched events to a new Postgres table. Owned by payments.' },
  { label: 'Nightly aggregator', text: 'A Python cron worker that aggregates daily usage into Snowflake. Owned by data.' },
  { label: 'Edge function', text: 'A TypeScript edge function behind the api-gateway for feature flags. Owned by platform.' },
];

const RESOURCE_ICONS: Record<ArchitectResource['type'], typeof GitBranch> = {
  github: GitBranch, server: Server, database: Database, queue: ListOrdered,
};

const STEP_LABELS = ['Describe', 'Review', 'Ship'];

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, maxWidth: 560 }}>
      {STEP_LABELS.map((title, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        const last = i === STEP_LABELS.length - 1;
        return (
          <div key={title} style={{ display: 'flex', alignItems: 'center', flex: last ? '0' : '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, fontWeight: 600,
                background: done ? '#00E87A' : active ? '#00E87A18' : '#fff', color: '#0A2463',
                border: `1.5px solid ${done || active ? '#00E87A' : '#EAEAEA'}`,
              }}>
                {done ? <Check size={13} strokeWidth={2.8} /> : idx}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: done || active ? '#0A2463' : '#9a9a9a', whiteSpace: 'nowrap' }}>{title}</span>
            </div>
            {!last && <span style={{ flex: 1, height: 2, margin: '0 12px', background: done ? '#00E87A' : '#EAEAEA' }} />}
          </div>
        );
      })}
    </div>
  );
}

function NewServiceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GenerateResponse | null>(null);
  const [pending, setPending] = useState(true);
  const [approved, setApproved] = useState(false);

  const generate = useCallback(async (overridePrompt?: string) => {
    const effective = overridePrompt ?? prompt;
    if (!effective.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<GenerateResponse>('/architect/generate', { prompt: effective });
      setPlan(res);
      setStep(2);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not generate a plan. Try again.');
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  useEffect(() => {
    const incoming = searchParams.get('prompt');
    if (!incoming) return;
    setPrompt(incoming);
    if (searchParams.get('autoGenerate') === 'true') generate(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestApproval = async () => {
    if (!plan) return;
    await api.post(`/architect/${plan.requestId}/request-approval`);
    setPending(true);
    setApproved(false);
    setStep(3);
  };

  const approve = async () => {
    if (!plan) return;
    await api.post(`/architect/${plan.requestId}/approve`);
    setApproved(true);
    setPending(false);
  };

  const startAnother = () => {
    setStep(1);
    setPrompt('');
    setPlan(null);
    setApproved(false);
    setPending(true);
    setError(null);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1080, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 20px' }}>New service</h1>

      <StepIndicator step={step} />

      {step === 1 && (
        <div style={{ animation: 'fadeSwap .35s ease', maxWidth: 680 }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 17, color: '#0A2463', marginBottom: 10 }}>
            Describe what you need, in plain English.
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ width: '100%', minHeight: 150, resize: 'vertical', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16, fontSize: 15, lineHeight: 1.6, color: '#0A2463' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <span style={{ fontSize: 12.5, color: '#9a9a9a', alignSelf: 'center' }}>Try:</span>
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setPrompt(ex.text)}
                style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#6B6B6B', fontSize: 12.5, padding: '6px 12px', borderRadius: 999 }}
              >
                {ex.label}
              </button>
            ))}
          </div>
          {error && <p style={{ color: '#ff5f57', fontSize: 13.5, marginTop: 14 }}>{error}</p>}
          <button
            onClick={() => generate()}
            disabled={!prompt.trim() || loading}
            style={{
              marginTop: 24, cursor: !prompt.trim() || loading ? 'not-allowed' : 'pointer', border: 'none',
              background: !prompt.trim() || loading ? '#EAEAEA' : '#00E87A', color: !prompt.trim() || loading ? '#9a9a9a' : '#0A2463',
              fontWeight: 700, fontSize: 15, padding: '13px 26px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: !prompt.trim() || loading ? 'none' : '0 2px 6px rgba(0,232,122,0.25)',
            }}
          >
            {loading ? 'Generating plan…' : 'Generate plan'} {!loading && <ArrowRight size={16} />}
          </button>
        </div>
      )}

      {step === 2 && plan && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, animation: 'fadeSwap .35s ease' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 12 }}>What will be created</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {plan.resources.map((r, i) => {
                const Icon = RESOURCE_ICONS[r.type] ?? Server;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: '14px 16px' }}>
                    <span style={{ width: 38, height: 38, flex: 'none', borderRadius: 10, background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A2463' }}>
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13.5, color: '#0A2463', fontWeight: 500 }}>{r.title}</div>
                      <div style={{ fontSize: 12.5, color: '#6B6B6B', marginTop: 2 }}>{r.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 12 }}>Generated Terraform</div>
            <div style={{ background: '#0A2463', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 15px', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                <span style={{ marginLeft: 10, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>main.tf · terraform plan</span>
              </div>
              <div style={{ padding: '16px 18px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, lineHeight: 1.95 }}>
                {plan.planLines.map((l, i) => (
                  <div key={i} style={{ color: l.color, whiteSpace: 'pre-wrap' }}>{l.text}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 4 }}>
            <button onClick={() => setStep(1)} style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 14.5, padding: '12px 22px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={requestApproval}
              style={{ marginLeft: 'auto', cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 15, padding: '12px 26px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 6px rgba(0,232,122,0.25)' }}
            >
              Request approval <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && plan && (
        <div style={{ maxWidth: 600, animation: 'fadeSwap .35s ease' }}>
          <p style={{ fontSize: 15, color: '#6B6B6B', margin: '0 0 16px' }}>
            Shipyard posted this change to <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13.5, color: '#0A2463' }}>#infra-changes</span> for approval.
          </p>
          <div style={{ border: '1px solid #EAEAEA', borderRadius: 14, overflow: 'hidden', boxShadow: '0 18px 44px -28px rgba(10,36,99,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#3F0E40', padding: '11px 16px' }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: '#fff', opacity: 0.5 }} />
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}># infra-changes</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, marginLeft: 4 }}>posted by Shipyard</span>
            </div>
            <div style={{ background: '#fff', padding: '18px 18px' }}>
              <div style={{ display: 'flex', gap: 11 }}>
                <span style={{ width: 36, height: 36, flex: 'none', borderRadius: 9, background: '#00E87A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={20} height={20} viewBox="0 0 72 72" fill="none"><path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" /></svg>
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5, color: '#1D1C1D' }}>Shipyard</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#616061', background: '#E8E8E8', padding: '1px 5px', borderRadius: 3 }}>APP</span>
                    <span style={{ fontSize: 12, color: '#616061' }}>just now</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#1D1C1D', lineHeight: 1.5, marginBottom: 10 }}>
                    Change request for <strong>{plan.serviceName}</strong> — {plan.resources.length} resources to add.
                  </div>
                  <div style={{ borderLeft: '3px solid #00E87A', padding: '9px 13px', background: '#FAFAFA', borderRadius: '0 8px 8px 0', marginBottom: 13 }}>
                    <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, color: '#0A2463', lineHeight: 1.7 }}>
                      {plan.planLines.filter((l) => l.text.startsWith('+')).map((l, i) => <div key={i}>{l.text}</div>)}
                    </div>
                  </div>
                  {approved ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeSwap .35s ease' }}>
                      <span style={{ display: 'flex', width: 22, height: 22, borderRadius: '50%', background: '#00E87A', alignItems: 'center', justifyContent: 'center' }}><Check size={13} color="#0A2463" strokeWidth={3} /></span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0BA45E' }}>Approved · applying now</span>
                    </div>
                  ) : pending && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={approve} style={{ cursor: 'pointer', border: 'none', background: '#007A5A', color: '#fff', fontWeight: 600, fontSize: 13.5, padding: '9px 18px', borderRadius: 6 }}>Approve</button>
                      <button style={{ cursor: 'pointer', border: '1px solid #D6D6D6', background: '#fff', color: '#1D1C1D', fontWeight: 600, fontSize: 13.5, padding: '9px 18px', borderRadius: 6 }}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            <button onClick={startAnother} style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 14.5, padding: '12px 22px', borderRadius: 12 }}>
              Start another
            </button>
            {approved && (
              <button onClick={() => router.push('/catalog')} style={{ cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 15, padding: '12px 24px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                View in catalog <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewServicePage() {
  return (
    <Suspense fallback={null}>
      <NewServiceInner />
    </Suspense>
  );
}
