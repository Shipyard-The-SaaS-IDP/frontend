'use client';
import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUp, Check, X, GitBranch, Server, Database, ListOrdered, Sparkles, FileCode, ExternalLink, Hammer, MessageCircleQuestion, Bot } from 'lucide-react';
import { api, ApiError, type ApprovePlanResponse, type ArchitectResource, type IacFile, type ProposedPlan, type SendMessageResponse, type SessionResponse } from '@/lib/api';

const RESOURCE_ICONS: Record<ArchitectResource['type'], typeof GitBranch> = {
  github: GitBranch, server: Server, database: Database, queue: ListOrdered,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plan?: ProposedPlan;
  planStatus?: 'pending' | 'approved' | 'denied';
  iacFiles?: IacFile[];
  repo?: { repoUrl: string; repoFullName: string } | null;
}

function IacFilesPanel({ files }: { files: IacFile[] }) {
  const [active, setActive] = useState(0);
  if (files.length === 0) return null;
  return (
    <div style={{ marginTop: 10, border: '1px solid #EAEAEA', borderRadius: 14, overflow: 'hidden', maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid #EAEAEA', background: '#FAFAFA' }}>
        <FileCode size={13} color="#0A2463" />
        <span style={{ fontWeight: 600, fontSize: 12.5, color: '#0A2463' }}>Generated infrastructure</span>
      </div>
      <div style={{ display: 'flex', gap: 2, padding: '8px 10px 0', flexWrap: 'wrap' }}>
        {files.map((f, i) => (
          <button
            key={f.path}
            onClick={() => setActive(i)}
            style={{
              cursor: 'pointer', border: 'none', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5,
              padding: '6px 11px', borderRadius: 8, background: active === i ? '#0A2463' : 'transparent',
              color: active === i ? '#fff' : '#6B6B6B', fontWeight: 600,
            }}
          >
            {f.path}
          </button>
        ))}
      </div>
      <pre style={{
        margin: 0, padding: 14, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, lineHeight: 1.7,
        color: '#0A2463', background: '#fff', overflow: 'auto', maxHeight: 320, whiteSpace: 'pre',
      }}>
        {files[active]?.content}
      </pre>
    </div>
  );
}

const EXAMPLE_PROMPTS: { mode: 'ask' | 'build'; label: string; text: string }[] = [
  { mode: 'build', label: 'Build', text: 'A Go service that reads the orders queue and writes enriched events to a new Postgres table.' },
  { mode: 'build', label: 'Build', text: 'A Python cron worker that aggregates daily usage into Snowflake.' },
  { mode: 'ask', label: 'Ask', text: 'What stack is payments-service running on, and what depends on it?' },
  { mode: 'ask', label: 'Ask', text: 'Do I already have a Postgres database I could reuse for a new feature?' },
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
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12.5, color: '#0A2463', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: '#6B6B6B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.sub}</div>
              </div>
            </div>
          );
        })}
        <div style={{ background: '#0A2463', borderRadius: 10, padding: '10px 13px', marginTop: 4, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, lineHeight: 1.8 }}>
          {plan.planLines.map((l, i) => <div key={i} style={{ color: l.color, whiteSpace: 'pre-wrap' }}>{l.text.replace(/`/g, '')}</div>)}
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
  const urlSessionId = searchParams.get('session');
  // Stable fallback id for a brand-new (no ?session=) chat — created once
  // and reused across re-renders, but NOT tied to the URL, so switching to
  // a different ?session=X via client-side nav (no remount) doesn't get
  // stuck on this value.
  const freshSessionIdRef = useRef<string>(typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36));
  const sessionId = urlSessionId || freshSessionIdRef.current;
  const [mode, setMode] = useState<'ask' | 'build'>('build');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Resuming a previous chat from the sidebar — hydrate the transcript.
  // Keyed on urlSessionId (not the frozen old sessionId state) so this
  // actually re-runs when the user clicks a different chat in the
  // sidebar — Next's client-side nav doesn't remount this component for a
  // same-route query-param change, so a mount-only effect never re-fired.
  // Historical plan cards render as a static note rather than an
  // interactive approve/deny card: the underlying request may already be
  // resolved by the time you're looking back at it.
  useEffect(() => {
    if (!urlSessionId) {
      // "New chat" — mint a fresh id so this doesn't reuse whatever
      // session was last active before navigating here with no ?session=.
      freshSessionIdRef.current = typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36);
      setMessages([]);
      setHistoryLoaded(true);
      return;
    }
    setHistoryLoaded(false);
    api.get<SessionResponse>(`/architect/sessions/${urlSessionId}`).then((res) => {
      setMessages(res.messages.map((m) => ({
        id: crypto.randomUUID(),
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content || (m.toolCalls.find((t) => t.name === 'propose_plan') ? '(proposed a plan)' : ''),
      })));
    }).finally(() => setHistoryLoaded(true));
  }, [urlSessionId]);

  const sendMessage = useCallback(async (text: string, modeOverride?: 'ask' | 'build') => {
    if (!text.trim() || sending) return;
    const activeMode = modeOverride ?? mode;
    if (modeOverride) setMode(modeOverride);
    setSending(true);
    setError(null);
    setInput('');
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: text }]);
    if (!urlSessionId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('session', sessionId);
      params.delete('prompt');
      params.delete('autoGenerate');
      router.replace(`/architect?${params.toString()}`);
    }

    try {
      const res = await api.post<SendMessageResponse>(`/architect/sessions/${sessionId}/messages`, { message: text, mode: activeMode });
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: 'assistant', content: res.reply,
        plan: res.proposedPlan ?? undefined, planStatus: res.proposedPlan ? 'pending' : undefined,
      }]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not reach the Architect. Try again.');
    } finally {
      setSending(false);
    }
  }, [sessionId, urlSessionId, sending, mode, searchParams, router]);

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
      const res = await api.post<ApprovePlanResponse>(`/architect/${requestId}/${action}`);
      if (action === 'approve') {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, iacFiles: res.iacFiles, repo: res.repo } : m)));
      }
    } catch {
      // revert on failure
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, planStatus: 'pending' } : m)));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 140px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {!historyLoaded && (
            <div style={{ textAlign: 'center', padding: '100px 0 0', color: '#9a9a9a', fontSize: 13.5 }}>
              Loading conversation…
            </div>
          )}
          {historyLoaded && messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: '#00E87A14', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <Sparkles size={20} color="#0A2463" strokeWidth={1.8} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 23, color: '#0A2463', margin: '0 0 18px' }}>AI Architect</h1>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 26, flexWrap: 'wrap' }}>
                <div style={{ width: 220, textAlign: 'left', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
                  <Hammer size={16} color="#0BA45E" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2463', marginBottom: 4 }}>Build something new</div>
                  <div style={{ fontSize: 12.5, color: '#6B6B6B', lineHeight: 1.5 }}>
                    Describe a service in plain English. I&apos;ll check your catalog, ask if anything&apos;s unclear, then propose a plan to approve.
                  </div>
                </div>
                <div style={{ width: 220, textAlign: 'left', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
                  <MessageCircleQuestion size={16} color="#1E5FCC" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2463', marginBottom: 4 }}>Ask about your catalog</div>
                  <div style={{ fontSize: 12.5, color: '#6B6B6B', lineHeight: 1.5 }}>
                    Stacks, owners, dependencies — anything about services you already have.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => sendMessage(p.text, p.mode)}
                    style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#6B6B6B', fontSize: 12.5, padding: '8px 14px', borderRadius: 999, maxWidth: 480, display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left' }}
                  >
                    <span style={{ flexShrink: 0, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#0BA45E', background: '#00E87A14', padding: '2px 7px', borderRadius: 5 }}>
                      {p.label}
                    </span>
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 18, display: 'flex', gap: 8, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', background: '#00E87A14', color: '#0A2463', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
                }}>
                  <Bot size={14} />
                </span>
              )}
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
                {m.planStatus === 'approved' && m.repo && (
                  <a
                    href={m.repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600,
                      color: '#0A2463', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 10, padding: '8px 13px', textDecoration: 'none',
                    }}
                  >
                    <GitBranch size={14} /> Repo created: {m.repo.repoFullName} <ExternalLink size={12} color="#9a9a9a" />
                  </a>
                )}
                {m.planStatus === 'approved' && m.iacFiles && <IacFilesPanel files={m.iacFiles} />}
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
        <div style={{ maxWidth: 680, margin: '0 auto 8px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid #EAEAEA', borderRadius: 10, padding: 3, background: '#FAFAFA' }}>
            {(['ask', 'build'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', fontWeight: 600, fontSize: 12.5,
                  padding: '6px 16px', borderRadius: 8, background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#0A2463' : '#9a9a9a', boxShadow: mode === m ? '0 1px 4px rgba(10,36,99,0.12)' : 'none',
                }}
              >
                {m === 'ask' ? 'Ask about your catalog' : 'Build something new'}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 8, background: '#fff',
          border: '1px solid #EAEAEA', borderRadius: 18, padding: 8, boxShadow: '0 12px 30px -16px rgba(10,36,99,0.25)',
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={mode === 'ask' ? 'Ask about a service in your catalog…' : 'Describe what you need…'}
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
