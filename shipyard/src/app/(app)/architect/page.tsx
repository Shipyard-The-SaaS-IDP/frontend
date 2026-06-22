'use client';
import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUp, Check, X, GitBranch, Server, Database, ListOrdered, Sparkles } from 'lucide-react';
import { api, ApiError, type ArchitectResource, type ProposedPlan, type SendMessageResponse } from '@/lib/api';

const RESOURCE_ICONS: Record<ArchitectResource['type'], typeof GitBranch> = {
  github: GitBranch, server: Server, database: Database, queue: ListOrdered,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plan?: ProposedPlan;
  planStatus?: 'pending' | 'approved' | 'denied';
}

const EXAMPLE_PROMPTS = [
  'A Go service that reads the orders queue and writes enriched events to a new Postgres table.',
  'A Python cron worker that aggregates daily usage into Snowflake.',
  'A TypeScript edge function behind the api-gateway for feature flags.',
];

function PlanCard({ message, onApprove, onDeny }: { message: Message; onApprove: () => void; onDeny: () => void }) {
  const plan = message.plan!;
  const status = message.planStatus ?? 'pending';
  return (
    <div style={{ marginTop: 10, border: '1px solid #EAEAEA', borderRadius: 14, overflow: 'hidden', maxWidth: 560 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #EAEAEA', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={14} color="#0A2463" />
        <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0A2463' }}>{plan.serviceName}</span>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {plan.resources.map((r, i) => {
          const Icon = RESOURCE_ICONS[r.type] ?? Server;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 8, background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A2463' }}>
                <Icon size={14} strokeWidth={1.8} />
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12.5, color: '#0A2463' }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: '#6B6B6B' }}>{r.sub}</div>
              </div>
            </div>
          );
        })}
        <div style={{ background: '#0A2463', borderRadius: 10, padding: '10px 13px', marginTop: 4, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, lineHeight: 1.8 }}>
          {plan.planLines.map((l, i) => <div key={i} style={{ color: l.color, whiteSpace: 'pre-wrap' }}>{l.text}</div>)}
        </div>

        {status === 'pending' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              onClick={onApprove}
              style={{ flex: 1, cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 13.5, padding: '9px 0', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Check size={14} strokeWidth={2.6} /> Approve
            </button>
            <button
              onClick={onDeny}
              style={{ flex: 1, cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#6B6B6B', fontWeight: 600, fontSize: 13.5, padding: '9px 0', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <X size={14} strokeWidth={2.4} /> Deny
            </button>
          </div>
        )}
        {status === 'approved' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, fontSize: 13, fontWeight: 600, color: '#0BA45E' }}>
            <Check size={15} strokeWidth={2.6} /> Approved — added to your catalog.
          </div>
        )}
        {status === 'denied' && (
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9a9a9a', marginTop: 6 }}>Denied.</div>
        )}
      </div>
    </div>
  );
}

function ArchitectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId] = useState(() => (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36)));
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    setInput('');
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: text }]);

    try {
      const res = await api.post<SendMessageResponse>(`/architect/sessions/${sessionId}/messages`, { message: text });
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: 'assistant', content: res.reply,
        plan: res.proposedPlan ?? undefined, planStatus: res.proposedPlan ? 'pending' : undefined,
      }]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not reach the Architect. Try again.');
    } finally {
      setSending(false);
    }
  }, [sessionId, sending]);

  useEffect(() => {
    const incoming = searchParams.get('prompt');
    if (!incoming) return;
    if (searchParams.get('autoGenerate') === 'true') sendMessage(incoming);
    else setInput(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolvePlan = async (messageId: string, requestId: string, action: 'approve' | 'deny') => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, planStatus: action === 'approve' ? 'approved' : 'denied' } : m)));
    try {
      await api.post(`/architect/${requestId}/${action}`);
    } catch {
      // revert on failure
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, planStatus: 'pending' } : m)));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 140px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: '#00E87A14', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <Sparkles size={20} color="#0A2463" strokeWidth={1.8} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 23, color: '#0A2463', margin: '0 0 8px' }}>AI Architect</h1>
              <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 24px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
                Describe what you need in plain English. I&apos;ll check your existing catalog, ask if anything&apos;s unclear, and propose a plan for you to approve.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#6B6B6B', fontSize: 12.5, padding: '8px 14px', borderRadius: 999, maxWidth: 480 }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 18, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '85%' }}>
                {m.content && (
                  <div style={{
                    display: 'inline-block', padding: '10px 14px', borderRadius: 14, fontSize: 14.5, lineHeight: 1.55,
                    background: m.role === 'user' ? '#0A2463' : '#FAFAFA', color: m.role === 'user' ? '#fff' : '#0A2463',
                  }}>
                    {m.content}
                  </div>
                )}
                {m.plan && <PlanCard message={m} onApprove={() => resolvePlan(m.id, m.plan!.requestId, 'approve')} onDeny={() => resolvePlan(m.id, m.plan!.requestId, 'deny')} />}
                {m.planStatus === 'approved' && (
                  <button onClick={() => router.push('/dashboard')} style={{ marginTop: 8, cursor: 'pointer', border: 'none', background: 'none', color: '#0BA45E', fontWeight: 600, fontSize: 12.5, padding: 0, textDecoration: 'underline' }}>
                    View in catalog →
                  </button>
                )}
              </div>
            </div>
          ))}

          {sending && <div style={{ fontSize: 13, color: '#9a9a9a' }}>Thinking…</div>}
          {error && <div style={{ fontSize: 13, color: '#ff5f57' }}>{error}</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '0 32px 24px', background: 'linear-gradient(to top, #fff 60%, transparent)' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 8, background: '#fff',
          border: '1px solid #EAEAEA', borderRadius: 18, padding: 8, boxShadow: '0 12px 30px -16px rgba(10,36,99,0.25)',
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Describe what you need…"
            rows={1}
            style={{ flex: 1, resize: 'none', border: 'none', outline: 'none', padding: '8px 10px', fontSize: 14.5, color: '#0A2463', fontFamily: 'inherit', maxHeight: 120 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: !input.trim() || sending ? 'not-allowed' : 'pointer',
              background: !input.trim() || sending ? '#EAEAEA' : '#00E87A', color: !input.trim() || sending ? '#9a9a9a' : '#0A2463',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowUp size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchitectPage() {
  return (
    <Suspense fallback={null}>
      <ArchitectInner />
    </Suspense>
  );
}
