'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Sparkles, ThumbsUp, AlertTriangle, Plug, RefreshCw, Volume2,
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { RevealGroup, RevealItem } from '@/components/marketing/Reveal';

interface DailyBrief {
  headline: string;
  wins: string[];
  attention: string[];
  integrationNotes: string[];
  narration: string;
}

function Section({ icon: Icon, title, items, color }: {
  icon: React.ElementType;
  title: string;
  items: string[];
  color: string;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={13} color={color} strokeWidth={1.8} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 4 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, listStyle: 'none' }}>
            <span style={{ color, flexShrink: 0 }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DailyBriefPage() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBrief(null);
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setSpeaking(false);
    try {
      const res = await fetch('/api/daily-brief');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load brief');
      setBrief(data.brief);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
  useEffect(() => { load(); }, [load]);

  const toggleSpeak = useCallback(() => {
    if (!brief || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(brief.narration);
    utterance.rate = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [brief, speaking]);

  useEffect(() => {
    return () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); };
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Daily Brief"
        subtitle="The morning rundown — read it, or have it read to you."
        action={
          <button
            onClick={load}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} /> Refresh
          </button>
        }
      />

      <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--brand-500), #8B5CF6)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 2s ease infinite',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ fontSize: 13 }}>Pulling together this morning&apos;s brief...</div>
          </div>
        )}

        {error && !loading && (
          <div style={{
            padding: 16, borderRadius: 10, background: 'var(--status-degraded-bg)',
            border: '1px solid rgba(245,158,11,0.3)', color: 'var(--status-degraded)', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <AnimatePresence>
          {brief && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Headline + play */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.03) 100%)',
                border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    Today&apos;s headline
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {brief.headline}
                  </h2>
                </div>
                <button
                  onClick={toggleSpeak}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
                    padding: '10px 18px', borderRadius: 10,
                    background: speaking ? 'var(--bg-elevated)' : 'var(--brand-500)',
                    color: speaking ? 'var(--text-primary)' : 'white',
                    border: speaking ? '1px solid var(--border-default)' : 'none',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  {speaking ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Listen</>}
                </button>
              </div>

              {speaking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', paddingLeft: 4 }}>
                  <Volume2 size={13} className="animate-pulse" /> Playing the brief out loud...
                </div>
              )}

              <RevealGroup style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <RevealItem><Section icon={ThumbsUp} title="Wins" items={brief.wins} color="var(--status-healthy)" /></RevealItem>
                <RevealItem><Section icon={AlertTriangle} title="Needs attention" items={brief.attention} color="var(--status-degraded)" /></RevealItem>
                <RevealItem><Section icon={Plug} title="From your connected tools" items={brief.integrationNotes} color="var(--brand-400)" /></RevealItem>
              </RevealGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
