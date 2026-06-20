'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, GitBranch, FileText, Hash, Frame as FigmaIcon,
  Wrench, CheckCircle2, XCircle, ChevronDown, Anchor,
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import type { AgentStep } from '@/app/api/chat/route';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  steps?: AgentStep[];
}

type Connections = { github: boolean; notion: boolean; slack: boolean; figma: boolean };

const SUGGESTIONS = [
  'What are my most active GitHub repos right now?',
  'Any open issues I should look at on the Shipyard repo?',
  'Search Notion for our launch checklist',
  'Post a standup reminder to #general on Slack',
];

const SERVICE_ICON: Record<string, React.ElementType> = {
  github: GitBranch,
  notion: FileText,
  slack: Hash,
  figma: FigmaIcon,
};

function toolService(toolName: string): keyof Connections {
  if (toolName.startsWith('github')) return 'github';
  if (toolName.startsWith('notion')) return 'notion';
  if (toolName.startsWith('slack')) return 'slack';
  return 'figma';
}

function ToolStep({ step }: { step: AgentStep }) {
  const [open, setOpen] = useState(false);
  if (!step.toolName) return null;
  const Icon = SERVICE_ICON[toolService(step.toolName)] ?? Wrench;
  return (
    <div style={{
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      background: 'var(--bg-elevated)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <Icon size={13} color="var(--brand-400)" />
        <span style={{ fontSize: 12, fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--text-secondary)', flex: 1 }}>
          {step.toolName}
        </span>
        {step.toolError ? (
          <XCircle size={13} color="var(--status-degraded)" />
        ) : (
          <CheckCircle2 size={13} color="var(--status-healthy)" />
        )}
        <ChevronDown size={13} color="var(--text-muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 12px 10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {step.toolInput && Object.keys(step.toolInput).length > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Input</div>
                  <pre style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-jetbrains-mono)', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {JSON.stringify(step.toolInput, null, 2)}
                  </pre>
                </div>
              )}
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Result</div>
                <pre style={{ fontSize: 11, color: step.toolError ? 'var(--status-degraded)' : 'var(--text-secondary)', fontFamily: 'var(--font-jetbrains-mono)', whiteSpace: 'pre-wrap', margin: 0, maxHeight: 200, overflow: 'auto' }}>
                  {JSON.stringify(step.toolResult, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const toolSteps = message.steps?.filter((s) => s.type === 'tool_call') ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
      }}
    >
      {toolSteps.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {toolSteps.map((step, i) => <ToolStep key={i} step={step} />)}
        </div>
      )}
      {message.content && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 12,
          background: isUser ? 'var(--brand-500)' : 'var(--bg-surface)',
          border: isUser ? 'none' : '1px solid var(--border-default)',
          color: isUser ? 'white' : 'var(--text-primary)',
          fontSize: 13.5,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </div>
      )}
    </motion.div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<Connections | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/chat').then((r) => r.json()).then((d) => setConnections(d.connections)).catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Something went wrong: ${data.error ?? 'unknown error'}`, steps: data.steps }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, steps: data.steps }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Network error: ${(err as Error).message}` }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        title="Agent"
        subtitle="Your co-founder that actually has API access."
        action={connections && (
          <div style={{ display: 'flex', gap: 6 }}>
            {(Object.keys(connections) as Array<keyof Connections>).map((key) => {
              const Icon = SERVICE_ICON[key];
              const connected = connections[key];
              return (
                <div key={key} title={`${key}: ${connected ? 'connected' : 'not connected'}`} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 9px', borderRadius: 999,
                  background: connected ? 'var(--status-healthy-bg)' : 'var(--bg-elevated)',
                  border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
                  fontSize: 11, color: connected ? 'var(--status-healthy)' : 'var(--text-muted)',
                }}>
                  <Icon size={11} />
                  <span style={{ textTransform: 'capitalize' }}>{key}</span>
                </div>
              );
            })}
          </div>
        )}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: 24, gap: 16 }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg, var(--brand-500), #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Anchor size={22} color="white" strokeWidth={2} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Ask me anything about your stack
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 420 }}>
                  I can check GitHub, search Notion, post to Slack, and pull Figma activity — for real, live.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 440 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)', fontSize: 12.5, cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => <Bubble key={i} message={m} />)}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
              <Sparkles size={14} className="animate-pulse" />
              Thinking, checking tools...
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask the agent to check something or take an action..."
            rows={1}
            style={{
              flex: 1, resize: 'none', padding: '12px 14px', borderRadius: 10,
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.5, outline: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-500)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 10,
              background: (!input.trim() || loading) ? 'var(--bg-elevated)' : 'var(--brand-500)',
              color: (!input.trim() || loading) ? 'var(--text-muted)' : 'white',
              border: 'none', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            <Send size={17} />
          </button>
        </div>
      </main>
    </div>
  );
}
