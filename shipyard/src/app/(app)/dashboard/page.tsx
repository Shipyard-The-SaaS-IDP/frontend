'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, type MapResponse, type ServiceDetail, type ServicesResponse } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [map, setMap] = useState<MapResponse | null>(null);
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = useCallback((id: string) => {
    api.get<ServiceDetail>(`/services/${id}`).then(setDetail);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get<ServicesResponse>('/services'),
      api.get<MapResponse>('/services/map'),
    ]).then(([svcRes, mapRes]) => {
      if (svcRes.total === 0) {
        router.replace('/onboarding');
        return;
      }
      setServices(svcRes);
      setMap(mapRes);
      const first = svcRes.services[0];
      if (first) loadDetail(first.id);
      setLoading(false);
    });
  }, [router, loadDetail]);

  const selectNode = (nodeName: string) => {
    const match = services?.services.find((s) => s.name === nodeName);
    if (match) loadDetail(match.id);
  };

  if (loading || !map || !services) {
    return <div style={{ padding: 32, color: '#6B6B6B', fontSize: 14 }}>Loading your service map…</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ flex: 1, minWidth: 0, padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: 0 }}>Service map</h1>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, color: '#00C9A7', background: '#00C9A714', padding: '3px 9px', borderRadius: 6 }}>
            {services.total} services · auto
          </span>
        </div>
        <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 22px' }}>Live dependency graph, discovered from your code &amp; environments.</p>

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
      </div>

      {detail && (
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
