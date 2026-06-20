'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { api, ApiError, type ServicesResponse } from '@/lib/api';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Degraded', value: 'degraded' },
];

export default function CatalogPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (filter !== 'all') params.set('filter', filter);
    api.get<ServicesResponse>(`/services?${params.toString()}`)
      .then((res) => {
        if (res.total === 0 && !query && filter === 'all') {
          router.replace('/onboarding');
          return;
        }
        setData(res);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : 'Could not reach the Shipyard API. Is NEXT_PUBLIC_API_URL set correctly?');
      })
      .finally(() => setLoading(false));
  }, [query, filter, router]);

  const dynamicFilters = useMemo(() => {
    const tags = new Set<string>();
    data?.services.forEach((s) => s.tags.forEach((t) => tags.add(t)));
    return [...FILTERS, ...[...tags].slice(0, 3).map((t) => ({ label: t, value: t }))];
  }, [data]);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1180 }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 4px' }}>Service catalog</h1>
      <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 22px' }}>Every service Shipyard discovered, always current.</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 340 }}>
          <Search size={17} color="#9a9a9a" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, stacks, tags…"
            style={{ width: '100%', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 999, padding: '10px 16px 10px 38px', fontSize: 14, color: '#0A2463' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {dynamicFilters.map((f) => {
            const on = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{ cursor: 'pointer', border: `1px solid ${on ? '#00E87A' : '#EAEAEA'}`, background: on ? '#00E87A18' : '#fff', color: '#0A2463', fontWeight: 600, fontSize: 13, padding: '7px 15px', borderRadius: 999 }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p style={{ color: '#ff5f57', fontSize: 14 }}>{error}</p>
      ) : loading ? (
        <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {data?.services.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/catalog/${s.id}`)}
              style={{ cursor: 'pointer', background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 18, transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 36px -22px rgba(10,36,99,0.34)'; e.currentTarget.style.borderColor = '#00E87A55'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#EAEAEA'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.statusColor }} />
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 16, color: '#0A2463' }}>{s.name}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: s.statusColor }}>{s.statusLabel}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {s.tags.map((tag) => (
                  <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#0A2463', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 7, padding: '4px 9px' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingTop: 13, borderTop: '1px solid #F2F2F2' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: s.ownerColor, color: '#fff', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.ownerInitials}</span>
                <span style={{ fontSize: 12.5, color: '#6B6B6B' }}>{s.ownerName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && data?.services.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', fontSize: 15, color: '#9a9a9a' }}>No services match your filters.</div>
      )}
    </div>
  );
}
