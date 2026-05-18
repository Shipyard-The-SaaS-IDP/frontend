'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookOpen, GitBranch, CheckCircle2, Clock, AlertTriangle, Zap } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import StatusBadge from '@/components/catalog/StatusBadge';
import StackTag from '@/components/catalog/StackTag';
import { SERVICES } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

const TABS = ['Overview', 'Deployments', 'Dependencies', 'Runbooks'];

function DeployStatusIcon({ status }: { status: string }) {
  if (status === 'success') return <CheckCircle2 size={14} color="var(--status-healthy)" />;
  if (status === 'failed') return <AlertTriangle size={14} color="var(--status-down)" />;
  return <Clock size={14} color="var(--status-deploying)" className="animate-spin-slow" />;
}

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = use(params);
  const svc = SERVICES.find((s) => s.id === serviceId);
  if (!svc) notFound();

  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title={svc.name}
        subtitle={svc.description.slice(0, 60) + '…'}
        action={
          <Link href="/catalog" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--border-default)',
          }}>
            <ArrowLeft size={13} /> Back
          </Link>
        }
      />

      <main style={{ flex: 1, padding: 24, display: 'flex', gap: 24 }}>
        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Header card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}>
                  {svc.name}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{svc.description}</p>
              </div>
              <StatusBadge status={svc.status} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {svc.stack.map((tag) => <StackTag key={tag} tag={tag} />)}
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            gap: 0,
          }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--brand-500)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <InfoRow label="Owner" value={svc.owner.name} />
                <InfoRow label="Owner Email" value={svc.owner.email} />
                <InfoRow label="Last Deployed" value={`by ${svc.lastDeployedBy}`} />
                <InfoRow label="Stack" value={svc.stack.join(', ')} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href={svc.repoUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                  borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                  textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13,
                }}>
                  <GitBranch size={14} /> View Repository <ExternalLink size={12} />
                </a>
                {svc.docsUrl && (
                  <a href={svc.docsUrl} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13,
                  }}>
                    <BookOpen size={14} /> Docs <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Deployments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {svc.deployments.map((dep) => (
                <div key={dep.id} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}>
                  <DeployStatusIcon status={dep.status} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {dep.version}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {dep.commit}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{dep.message}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{dep.deployedBy}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{dep.deployedAt} · {dep.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Dependencies' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}>
              {svc.dependencies.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No dependencies — this service is standalone.</p>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{svc.name}</strong> depends on:
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {svc.dependencies.map((dep) => (
                      <Link key={dep} href={`/catalog/${dep}`} style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        textDecoration: 'none',
                        color: 'var(--brand-400)',
                        fontFamily: 'var(--font-jetbrains-mono)',
                        fontSize: 13,
                      }}>
                        {dep}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'Runbooks' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <BookOpen size={32} color="var(--text-muted)" strokeWidth={1} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Runbooks will appear here when connected.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MetricPanel label="Uptime" value={svc.uptime} color="var(--status-healthy)" />
          <MetricPanel label="Avg Latency" value={svc.latency} color="var(--brand-400)" />
          <MetricPanel label="Error Rate" value={svc.errorRate} color={parseFloat(svc.errorRate) > 1 ? 'var(--status-degraded)' : 'var(--status-healthy)'} />

          <Link href={`/workflows/new-service-setup`} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'var(--brand-500)',
            color: 'white',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-400)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand-500)'; }}
          >
            <Zap size={14} /> Run Workflow
          </Link>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 8,
      padding: '12px 16px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

function MetricPanel({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
