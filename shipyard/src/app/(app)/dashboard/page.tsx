'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Server, Zap, Users, Clock, PlusCircle, UserPlus, Cloud,
  Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight,
  Rocket, Library, Plug,
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { SERVICES, ACTIVITY_FEED, TEAM_MEMBERS } from '@/lib/mock-data';
import type { ServiceStatus } from '@/lib/types';

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function MetricCard({ label, value, trend, icon: Icon, color }: {
  label: string;
  value: number | string;
  trend?: string;
  icon: React.ElementType;
  color: string;
}) {
  const numericValue = typeof value === 'number' ? value : null;
  const displayed = numericValue !== null ? useCountUp(numericValue) : value;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'border-color 150ms, box-shadow 150ms',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={17} color={color} strokeWidth={1.8} />
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-sora)',
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1,
          animation: 'fadeInUp 300ms ease both',
        }}>
          {displayed}
        </div>
        {trend && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{trend}</div>
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: ServiceStatus }) {
  const colors: Record<ServiceStatus, string> = {
    healthy: 'var(--status-healthy)',
    degraded: 'var(--status-degraded)',
    down: 'var(--status-down)',
    deploying: 'var(--status-deploying)',
  };
  return (
    <span style={{
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: colors[status],
      animation: status === 'deploying' ? 'pulse-dot 1.5s ease-in-out infinite' : undefined,
    }} />
  );
}

function QuickActionButton({ href, icon: Icon, label, color }: {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderRadius: 10,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      textDecoration: 'none',
      color: 'var(--text-primary)',
      fontSize: 14,
      fontWeight: 500,
      transition: 'all 150ms ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-brand)';
      e.currentTarget.style.boxShadow = 'var(--shadow-brand)';
      e.currentTarget.style.background = 'var(--bg-hover)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.background = 'var(--bg-surface)';
    }}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `${color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={16} color={color} strokeWidth={2} />
      </div>
      {label}
    </Link>
  );
}

export default function DashboardPage() {
  const healthyCount = SERVICES.filter((s) => s.status === 'healthy').length;
  const degradedCount = SERVICES.filter((s) => s.status === 'degraded').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Dashboard" subtitle="Welcome back. Here's what's happening." />

      <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <MetricCard label="Total Services" value={10} trend="↑ +2 this month" icon={Server} color="#6366F1" />
          <MetricCard label="Workflows Run" value={24} trend="↑ this week" icon={Zap} color="#10B981" />
          <MetricCard label="Team Members" value={TEAM_MEMBERS.length} icon={Users} color="#F59E0B" />
          <MetricCard label="Last Deploy" value="2h ago" icon={Clock} color="#38BDF8" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          {/* Activity Feed */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 72 hours</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {ACTIVITY_FEED.map((event, i) => {
                const ActivityIcon = {
                  deploy: Rocket,
                  workflow: CheckCircle2,
                  team: Users,
                  alert: AlertTriangle,
                  integration: Plug,
                  catalog: Library,
                }[event.type] ?? Zap;
                const iconColor = {
                  deploy: '#818CF8',
                  workflow: '#10B981',
                  team: '#38BDF8',
                  alert: '#F59E0B',
                  integration: '#6366F1',
                  catalog: '#94A3B8',
                }[event.type] ?? '#94A3B8';
                return (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '10px 20px',
                      animation: `fadeIn 200ms ease ${i * 40}ms both`,
                      transition: 'background 100ms',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: `${iconColor}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}>
                      <ActivityIcon size={13} color={iconColor} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{event.message}</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{event.relativeTime}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Actions */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Quick Actions
                </h2>
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <QuickActionButton href="/workflows/new" icon={Sparkles} label="New Service" color="#6366F1" />
                <QuickActionButton href="/workflows/developer-onboarding" icon={UserPlus} label="Onboard Developer" color="#10B981" />
                <QuickActionButton href="/workflows/spin-up-environment" icon={Cloud} label="New Environment" color="#F59E0B" />
              </div>
            </div>

            {/* Health Overview */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Service Health
                </h2>
                <Link href="/catalog" style={{ fontSize: 12, color: 'var(--brand-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  View all <ArrowUpRight size={11} />
                </Link>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} color="var(--status-healthy)" />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Healthy</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{healthyCount}</span>
                </div>
                <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={14} color="var(--status-degraded)" />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Degraded</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{degradedCount}</span>
                </div>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 16px' }} />
                {SERVICES.map((svc) => (
                  <Link
                    key={svc.id}
                    href={`/catalog/${svc.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 16px',
                      textDecoration: 'none',
                      transition: 'background 100ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-jetbrains-mono)' }}>{svc.name}</span>
                    <StatusDot status={svc.status} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
