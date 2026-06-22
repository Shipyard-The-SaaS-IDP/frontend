'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutGrid, GitBranch, RefreshCw, ExternalLink } from 'lucide-react';
import { api, ApiError, type MapResponse, type ServiceDetail, type ServicesResponse } from '@/lib/api';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Degraded', value: 'degraded' },
];

export default function CatalogPage() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [map, setMap] = useState<MapResponse | null>(null);
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rediscovering, setRediscovering] = useState(false);
  const [rediscoverNote, setRediscoverNote] = useState<string | null>(null);

  const loadDetail = useCallback((id: string) => {
    api.get<ServiceDetail>(`/services/${id}`).then(setDetail);
  }, []);

  const rerunDiscovery = async () => {
    setRediscovering(true);
    setRediscoverNote('Reading manifests on your 10 most recently updated repos — usually 10–20s…');
    try {
      const res = await api.post<{ serviceCount: number }>('/onboarding/discover?force=true');
      const [svcRes, mapRes] = await Promise.all([
        api.get<ServicesResponse>('/services'),
        api.get<MapResponse>('/services/map'),
      ]);
      setServices(svcRes);
      setMap(mapRes);
      setRediscoverNote(`Done — reclassified ${res.serviceCount} services.`);
      setTimeout(() => setRediscoverNote(null), 4000);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not re-run discovery.');
      setRediscoverNote(null);
    } finally {
      setRediscovering(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (filter !== 'all') params.set('filter', filter);
    Promise.all([
      api.get<ServicesResponse>(`/services?${params.toString()}`),
      api.get<MapResponse>('/services/map'),
    ]).then(([svcRes, mapRes]) => {
      if (svcRes.total === 0 && !query && filter === 'all') {
        router.replace('/onboarding');
        return;
      }
      setServices(svcRes);
      setMap(mapRes);
      if (!detail) {
        const first = svcRes.services[0];
        if (first) loadDetail(first.id);
      }
    }).catch((e) => {
      setError(e instanceof ApiError ? e.message : 'Could not reach the Shipyard API. Is NEXT_PUBLIC_API_URL set correctly?');
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, router]);

  // Background refresh — picks up new repos/services without a manual
  // "Re-run discovery" click. Only polls the default (no search/filter)
  // view, and skips the request entirely while a discovery run is already
  // in flight to avoid racing it.
  useEffect(() => {
    if (query.trim() || filter !== 'all') return;
    const interval = setInterval(() => {
      if (rediscovering) return;
      Promise.all([
        api.get<ServicesResponse>('/services'),
        api.get<MapResponse>('/services/map'),
      ]).then(([svcRes, mapRes]) => {
        setServices(svcRes);
        setMap(mapRes);
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [query, filter, rediscovering]);

  const dynamicFilters = useMemo(() => {
    const tags = new Set<string>();
    services?.services.forEach((s) => s.tags.forEach((t) => { if (!t.startsWith('link:')) tags.add(t); }));
    return [...FILTERS, ...[...tags].slice(0, 3).map((t) => ({ label: t, value: t }))];
  }, [services]);

  const selectNode = (nodeName: string) => {
    const match = services?.services.find((s) => s.name === nodeName);
    if (match) loadDetail(match.id);
  };

  if (error) return <div style={{ padding: 32, color: '#ff5f57', fontSize: 14 }}>{error}</div>;
  if (loading && !services) return <div style={{ padding: 32, color: '#6B6B6B', fontSize: 14 }}>Loading your catalog…</div>;

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ flex: 1, minWidth: 0, padding: '28px 32px', maxWidth: view === 'list' ? 1180 : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: 0 }}>Catalog</h1>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, color: '#00C9A7', background: '#00C9A714', padding: '3px 9px', borderRadius: 6 }}>
            {services?.total ?? 0} services · auto
          </span>
          <button
            onClick={rerunDiscovery}
            disabled={rediscovering}
            style={{
              marginLeft: 'auto', cursor: rediscovering ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 12.5,
              padding: '7px 13px', borderRadius: 9, opacity: rediscovering ? 0.6 : 1,
            }}
          >
            <RefreshCw size={13} style={rediscovering ? { animation: 'spin 1s linear infinite' } : undefined} />
            {rediscovering ? 'Re-running discovery…' : 'Re-run discovery'}
          </button>
          <div style={{ display: 'flex', border: '1px solid #EAEAEA', borderRadius: 10, padding: 3, background: '#FAFAFA' }}>
            {([['list', LayoutGrid, 'List'], ['map', GitBranch, 'Map']] as const).map(([v, Icon, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', fontWeight: 600, fontSize: 12.5,
                  padding: '6px 12px', borderRadius: 8, background: view === v ? '#fff' : 'transparent',
                  color: view === v ? '#0A2463' : '#9a9a9a', boxShadow: view === v ? '0 1px 4px rgba(10,36,99,0.12)' : 'none',
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 8px' }}>
          {view === 'list' ? 'Every service Shipyard discovered, always current.' : 'Live dependency graph, discovered from your code & environments.'}
        </p>
        {rediscoverNote && (
          <p style={{ fontSize: 12.5, color: rediscovering ? '#9a9a9a' : '#0BA45E', margin: '0 0 14px', fontFamily: 'var(--font-jetbrains-mono)' }}>
            {rediscoverNote}
          </p>
        )}
        {!rediscoverNote && <div style={{ marginBottom: 22 }} />}

        {view === 'list' ? (
          <>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {services?.services.map((s) => {
                const linkTag = s.tags.find((t) => t.startsWith('link:'));
                const sourceUrl = linkTag ? linkTag.slice(5) : null;
                const visibleTags = s.tags.filter((t) => !t.startsWith('link:'));
                return (
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
                      {visibleTags.map((tag) => (
                        <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#0A2463', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 7, padding: '4px 9px' }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingTop: 13, borderTop: '1px solid #F2F2F2' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: s.ownerColor, color: '#fff', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.ownerInitials}</span>
                      <span style={{ fontSize: 12.5, color: '#6B6B6B' }}>{s.ownerName}</span>
                      {sourceUrl && (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#0A2463', fontWeight: 600, textDecoration: 'none' }}
                        >
                          <ExternalLink size={11} /> Source
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {services?.services.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', fontSize: 15, color: '#9a9a9a' }}>No services match your filters.</div>
            )}
          </>
        ) : (
          map && (
            <div style={{
              position: 'relative', background: '#fff', border: '1px solid #EAEAEA', borderRadius: 18, height: 480, overflow: 'hidden',
              backgroundImage: 'radial-gradient(circle at 1px 1px, #EEEEEE 1px, transparent 0)', backgroundSize: '24px 24px',
            }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: 90, background: 'linear-gradient(90deg, transparent, #00E87A18, transparent)', animation: 'dcScan 6s ease-in-out infinite', pointerEvents: 'none' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 860 480" preserveAspectRatio="none">
                {map.edges.map((e, i) => (
                  <path key={i} d={e.d} stroke={e.stroke} strokeWidth={1.6} fill="none" opacity={0.5} strokeDasharray="5 7" style={{ animation: 'dash 5s linear infinite' }} />
                ))}
              </svg>
              {map.nodes.map((node) => {
                const selected = detail?.name === node.name;
                return (
                  <div
                    key={node.name}
                    onClick={() => selectNode(node.name)}
                    style={{
                      position: 'absolute', left: node.left, top: node.top, width: node.w, cursor: 'pointer',
                      background: '#fff', border: `1.5px solid ${selected ? '#00E87A' : '#EAEAEA'}`, borderRadius: 12, padding: '11px 13px',
                      boxShadow: selected ? '0 14px 30px -10px rgba(0,232,122,0.5)' : '0 6px 16px -10px rgba(10,36,99,0.28)',
                      animation: `floaty 7s ease-in-out infinite ${node.delay}s`, transition: 'border-color 200ms ease, box-shadow 200ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: node.statusColor }} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#0A2463' }}>{node.name}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#6B6B6B', marginBottom: 8 }}>{node.stackStr}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 17, height: 17, borderRadius: '50%', background: node.ownerColor, color: '#fff', fontSize: 8.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{node.ownerInitials}</span>
                      <span style={{ fontSize: 10.5, color: '#6B6B6B' }}>{node.ownerName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {view === 'map' && detail && (
        <div style={{ width: 360, flex: 'none', borderLeft: '1px solid #EAEAEA', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#FAFAFA', borderBottom: '1px solid #EAEAEA', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: detail.statusColor }} />
              <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 18, color: '#0A2463' }}>{detail.name}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: detail.statusColor, background: detail.statusBg, padding: '3px 9px', borderRadius: 6 }}>{detail.statusLabel}</span>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <Row label="Stack" value={detail.stackStr} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F2F2F2' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9a9a9a' }}>Owner</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: detail.ownerColor, color: '#fff', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{detail.ownerInitials}</span>
                <span style={{ fontSize: 13, color: '#0A2463' }}>{detail.ownerName}</span>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9a9a9a' }}>Depends on</span>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, color: '#0A2463', textAlign: 'right', maxWidth: 190 }}>{detail.depsStr}</span>
            </div>
          </div>
          <div style={{ padding: '0 22px 22px' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 10 }}>Discovery trace</div>
            <div style={{ background: '#0A2463', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, color: '#00E87A' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E87A', boxShadow: '0 0 8px #00E87A', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />live
                </span>
              </div>
              <div style={{ padding: '14px 16px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, lineHeight: 1.9 }}>
                {detail.trace.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'baseline', color: t.color }}>
                    <span style={{ flex: 'none', width: 11, color: t.iconColor }}>{t.icon}</span>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F2F2F2' }}>
      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9a9a9a' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12.5, color: '#0A2463' }}>{value}</span>
    </div>
  );
}
