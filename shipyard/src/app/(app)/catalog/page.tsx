'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ExternalLink, Zap } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import StatusBadge from '@/components/catalog/StatusBadge';
import StackTag from '@/components/catalog/StackTag';
import { SERVICES } from '@/lib/mock-data';
import type { ServiceStatus } from '@/lib/types';

const STATUS_FILTERS: { label: string; value: ServiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Deploying', value: 'deploying' },
  { label: 'Down', value: 'down' },
];

function Avatar({ initials, color = 'var(--brand-900)' }: { initials: string; color?: string }) {
  return (
    <div style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: color,
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 600,
      color: 'var(--brand-400)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all');

  const filtered = SERVICES.filter((svc) => {
    const matchesSearch = svc.name.toLowerCase().includes(search.toLowerCase()) ||
      svc.description.toLowerCase().includes(search.toLowerCase()) ||
      svc.stack.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || svc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Service Catalog"
        subtitle={`${SERVICES.length} services registered`}
      />

      <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Search + Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            flex: 1,
            position: 'relative',
            maxWidth: 420,
          }}>
            <Search size={15} style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services, stacks, owners..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 8,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-500)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} color="var(--text-muted)" />
            {STATUS_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor: statusFilter === value ? 'var(--brand-500)' : 'var(--border-default)',
                  background: statusFilter === value ? 'var(--brand-glow)' : 'transparent',
                  color: statusFilter === value ? 'var(--brand-400)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filtered.length} service{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {filtered.map((svc, i) => (
            <Link
              key={svc.id}
              href={`/catalog/${svc.id}`}
              style={{
                display: 'block',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 12,
                padding: 20,
                textDecoration: 'none',
                transition: 'all 150ms ease',
                animation: `fadeIn 200ms ease ${i * 30}ms both`,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-brand)';
                e.currentTarget.style.boxShadow = 'var(--shadow-brand)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>
                    {svc.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar initials={svc.owner.avatar} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{svc.owner.name}</span>
                  </div>
                </div>
                <StatusBadge status={svc.status} />
              </div>

              {/* Description */}
              <p style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: 12,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {svc.description}
              </p>

              {/* Stack tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {svc.stack.map((tag) => (
                  <StackTag key={tag} tag={tag} />
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Deployed {svc.lastDeployedBy === 'You' ? 'by you' : `by ${svc.lastDeployedBy.split(' ')[0]}`} · {
                    svc.lastDeployedAt.includes('T')
                      ? (() => {
                          const diff = Date.now() - new Date(svc.lastDeployedAt).getTime();
                          const h = Math.floor(diff / 3600000);
                          if (h < 24) return `${h}h ago`;
                          return `${Math.floor(h / 24)}d ago`;
                        })()
                      : svc.lastDeployedAt
                  }
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    <ExternalLink size={11} /> Repo
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    <Zap size={11} /> Run
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
            color: 'var(--text-muted)',
            gap: 12,
          }}>
            <Search size={32} strokeWidth={1} />
            <p style={{ fontSize: 14 }}>No services match your search</p>
          </div>
        )}
      </main>
    </div>
  );
}
