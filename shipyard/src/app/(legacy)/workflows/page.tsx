'use client';
import Link from 'next/link';
import { Rocket, Users, Cloud, PlusCircle, Play, Zap, Clock, ArrowRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { WORKFLOW_TEMPLATES } from '@/lib/mock-data';

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket, Users, Cloud, Zap,
};

const COLOR_MAP: Record<string, string> = {
  'new-service-setup': '#818CF8',
  'developer-onboarding': '#10B981',
  'spin-up-environment': '#F59E0B',
};

export default function WorkflowsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Workflows"
        subtitle="Automate your golden paths — no tickets, no Slack DMs."
        action={
          <Link href="/workflows/new" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 8,
            background: 'var(--brand-500)',
            color: 'white',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
          }}>
            <PlusCircle size={14} /> New Workflow
          </Link>
        }
      />

      <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* AI Architect callout */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 12,
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={17} color="#818CF8" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                Build a workflow with AI
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Describe what you need in plain English. The Architect maps it to the right steps in seconds.
              </div>
            </div>
          </div>
          <Link href="/workflows/new" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#818CF8',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Open Architect <ArrowRight size={13} />
          </Link>
        </div>

        {/* Template cards */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Templates
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {WORKFLOW_TEMPLATES.map((wf, i) => {
              const Icon = ICON_MAP[wf.icon] ?? Zap;
              const color = COLOR_MAP[wf.id] ?? '#6366F1';
              return (
                <div
                  key={wf.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    animation: `fadeIn 200ms ease ${i * 50}ms both`,
                    transition: 'border-color 150ms, box-shadow 150ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${color}40`;
                    e.currentTarget.style.boxShadow = `0 0 24px ${color}08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={19} color={color} strokeWidth={1.8} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                      <Clock size={11} strokeWidth={1.8} />
                      {wf.lastRunAt}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>
                      {wf.name}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {wf.description}
                    </p>
                  </div>

                  {/* Node pipeline preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    {wf.nodes.map((node, idx) => (
                      <span key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{
                          fontSize: 10,
                          color: 'var(--text-muted)',
                          background: 'var(--bg-elevated)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'var(--font-jetbrains-mono)',
                          whiteSpace: 'nowrap',
                        }}>
                          {node.data.label}
                        </span>
                        {idx < wf.nodes.length - 1 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>›</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Run {wf.runCount}×
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/workflows/${wf.id}`} style={{
                        padding: '5px 11px',
                        borderRadius: 6,
                        background: 'transparent',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: 12,
                        fontWeight: 500,
                        transition: 'border-color 150ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                      >
                        Edit
                      </Link>
                      <Link href={`/workflows/${wf.id}?run=true`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 11px',
                        borderRadius: 6,
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        color,
                        textDecoration: 'none',
                        fontSize: 12,
                        fontWeight: 500,
                      }}>
                        <Play size={10} strokeWidth={2.5} /> Run
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
