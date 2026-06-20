'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, GitFork, CheckCircle2, Cpu, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';

interface TechBrief {
  id: string;
  tags: { industry: string; scale: string; team: string; compliance: string[] };
  architecture: string;
  stack: string;
  complianceMapping: string;
  costEstimate: string;
  workflowPrompt: string;
}

const BRIEFS: Record<string, TechBrief> = {
  telehealth: {
    id: 'telehealth',
    tags: { industry: 'Healthcare', scale: '~5,000 patients (year 1)', team: '3 engineers', compliance: ['HIPAA'] },
    architecture: 'Modular monolith',
    stack: 'FastAPI + PostgreSQL + AWS',
    complianceMapping: 'HIPAA → encryption at rest, audit logging, VPC isolation',
    costEstimate: '~$340 / month',
    workflowPrompt: 'I need a FastAPI service with a Postgres database on AWS with CI/CD, HIPAA-compliant infrastructure (encryption at rest, audit logging, VPC isolation), and a Slack notification',
  },
  climate: {
    id: 'climate',
    tags: { industry: 'Nonprofit / Climate', scale: 'A few hundred users', team: 'Solo founder', compliance: ['GDPR (EU donors)'] },
    architecture: 'Simple monolith',
    stack: 'Next.js + Supabase + Vercel',
    complianceMapping: 'GDPR → data export & deletion endpoints, EU data residency',
    costEstimate: '~$0–20 / month (free tiers)',
    workflowPrompt: 'Set up a staging environment for our donation tracking app on Vercel and Supabase with a Slack notification when deployed',
  },
  marketplace: {
    id: 'marketplace',
    tags: { industry: 'Marketplace', scale: 'Pre-launch → launch next month', team: 'Solo founder + Base44', compliance: ['PCI DSS (payments)'] },
    architecture: 'Modular monolith (existing Next.js + Supabase)',
    stack: 'Next.js + Supabase + Vercel + Stripe',
    complianceMapping: 'PCI DSS → Stripe Checkout (no raw card data), webhook signature verification',
    costEstimate: '~$60 / month',
    workflowPrompt: 'I need a FastAPI service with a Postgres database on AWS with CI/CD and a Slack notification, plus Stripe webhook signature verification for our marketplace launch',
  },
  generic: {
    id: 'generic',
    tags: { industry: 'General software', scale: 'Early stage', team: 'Small team', compliance: ['None flagged yet'] },
    architecture: 'Modular monolith',
    stack: 'Node.js + PostgreSQL + AWS',
    complianceMapping: 'No specific regulatory requirements detected — standard security baseline applied',
    costEstimate: '~$150 / month',
    workflowPrompt: 'I need a FastAPI service with a Postgres database on AWS with CI/CD and a Slack notification',
  },
};

const EXAMPLE_PROMPTS = [
  "We're a telehealth startup connecting rural clinics with specialists. Expecting 5,000 patients in year one, need HIPAA compliance, small team of 3 engineers.",
  "We're a climate nonprofit building a donation tracking app for small NGOs. Low budget, expect a few hundred users.",
  "We built an MVP with Base44 — a marketplace app with Next.js and Supabase. Need to get it production-ready for a launch next month.",
];

function detectBrief(input: string): TechBrief {
  const lower = input.toLowerCase();
  if (lower.includes('telehealth') || lower.includes('hipaa') || lower.includes('clinic') || lower.includes('patient')) return BRIEFS.telehealth;
  if (lower.includes('climate') || lower.includes('nonprofit') || lower.includes('donation') || lower.includes('ngo')) return BRIEFS.climate;
  if (lower.includes('base44') || lower.includes('marketplace') || lower.includes('lovable') || lower.includes('supabase')) return BRIEFS.marketplace;
  return BRIEFS.generic;
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      padding: '10px 12px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: accent ? 'var(--status-healthy)' : 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function TranslatorPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [repoConnected, setRepoConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<TechBrief | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setBrief(null);

    try {
      const res = await fetch('/api/translator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ description: input }),
      });
      if (!res.ok) throw new Error('translator API unavailable');
      const data = await res.json();
      setBrief({ id: 'ai', ...data.brief });
    } catch {
      await new Promise((r) => setTimeout(r, 800));
      setBrief(detectBrief(input));
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleGenerateWorkflow = () => {
    if (!brief) return;
    router.push(`/workflows/new?prompt=${encodeURIComponent(brief.workflowPrompt)}&autoGenerate=true`);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="The Translator" subtitle="Plain English in. A tech plan out." />

      <main style={{ flex: 1, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left: input */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={16} color="var(--brand-400)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Tell us about your business</span>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="We're a telehealth startup connecting rural clinics with specialists. Expecting 5,000 patients in year one, need HIPAA compliance, small team of 3 engineers."
            rows={6}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 10,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontSize: 14,
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'var(--font-dm-sans)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-500)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          />

          {/* Connect repo (optional, stubbed) */}
          {repoConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--status-healthy-bg)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <GitFork size={15} color="var(--status-healthy)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>acme/marketplace-mvp</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Detected: Next.js, Supabase, Stripe</div>
              </div>
              <CheckCircle2 size={15} color="var(--status-healthy)" />
            </div>
          ) : (
            <button
              onClick={() => setRepoConnected(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 8,
                background: 'transparent', border: '1px dashed var(--border-default)',
                color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
              }}
            >
              <GitFork size={14} /> Connect a repo from Base44, Lovable, Claude Code, etc. (optional)
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleTranslate}
              disabled={!input.trim() || loading}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 8,
                background: (!input.trim() || loading) ? 'var(--bg-elevated)' : 'var(--brand-500)',
                color: (!input.trim() || loading) ? 'var(--text-muted)' : 'white',
                border: 'none', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 500, transition: 'background 150ms',
              }}
            >
              {loading ? (
                <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span> Reading your business...</>
              ) : (
                <>Translate to tech brief <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          {/* Example prompts */}
          {!brief && !loading && (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Try an example:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    style={{
                      textAlign: 'left', padding: '9px 12px', borderRadius: 8,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)', fontSize: 12.5, cursor: 'pointer',
                      lineHeight: 1.5, transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: tech brief */}
        <div style={{
          background: 'var(--bg-surface)',
          border: `1px solid ${brief ? 'var(--border-brand)' : 'var(--border-default)'}`,
          borderRadius: 12,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minHeight: 360,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={16} color="var(--status-healthy)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Tech brief</span>
          </div>

          {!brief && !loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', gap: 8 }}>
              <Sparkles size={28} color="var(--text-muted)" />
              <p style={{ fontSize: 13, maxWidth: 260, lineHeight: 1.6 }}>
                Describe your business on the left and Shipyard will translate it into a recommended architecture, stack, compliance mapping, and cost estimate.
              </p>
            </div>
          )}

          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--brand-500), #8B5CF6)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 2s ease infinite',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={18} color="white" />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Reading your business...</div>
            </div>
          )}

          <AnimatePresence>
            {brief && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                {/* Extracted tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--brand-400)', background: 'var(--brand-glow)', padding: '3px 9px', borderRadius: 9999 }}>{brief.tags.industry}</span>
                  <span style={{ fontSize: 11, color: 'var(--brand-400)', background: 'var(--brand-glow)', padding: '3px 9px', borderRadius: 9999 }}>{brief.tags.scale}</span>
                  <span style={{ fontSize: 11, color: 'var(--brand-400)', background: 'var(--brand-glow)', padding: '3px 9px', borderRadius: 9999 }}>{brief.tags.team}</span>
                  {brief.tags.compliance.map((c) => (
                    <span key={c} style={{ fontSize: 11, color: 'var(--status-degraded)', background: 'var(--status-degraded-bg)', padding: '3px 9px', borderRadius: 9999 }}>{c}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Field label="Architecture" value={brief.architecture} />
                  <Field label="Recommended stack" value={brief.stack} />
                  <Field label="Compliance" value={brief.complianceMapping} accent />
                  <Field label="Est. monthly cost" value={brief.costEstimate} />
                </div>

                <button
                  onClick={handleGenerateWorkflow}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 18px', borderRadius: 8,
                    background: 'var(--brand-500)', border: 'none', color: 'white',
                    fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4,
                  }}
                >
                  Generate workflow <ArrowRight size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
