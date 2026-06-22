'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { api, ApiError, type ServiceDetail } from '@/lib/api';

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = use(params);
  const router = useRouter();
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get<ServiceDetail>(`/services/${serviceId}`)
      .then(setDetail)
      .catch((e) => { if (e instanceof ApiError && e.status === 404) setNotFound(true); });
  }, [serviceId]);

  if (notFound) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <p style={{ color: '#9a9a9a', fontSize: 15, marginBottom: 16 }}>Service not found.</p>
        <button onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 14, padding: '9px 18px', borderRadius: 10 }}>
          Back to catalog
        </button>
      </div>
    );
  }

  if (!detail) return <div style={{ padding: 32, color: '#6B6B6B', fontSize: 14 }}>Loading…</div>;

  const linkTag = detail.tags.find((t) => t.startsWith('link:'));
  const sourceUrl = linkTag ? linkTag.slice(5) : null;
  const visibleTags = detail.tags.filter((t) => !t.startsWith('link:'));

  return (
    <div style={{ padding: '28px 32px', maxWidth: 760 }}>
      <button
        onClick={() => router.push('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', background: 'none', color: '#6B6B6B', fontSize: 13.5, fontWeight: 500, padding: 0, marginBottom: 20 }}
      >
        <ArrowLeft size={15} /> Back to catalog
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: detail.statusColor }} />
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: '#0A2463', margin: 0 }}>{detail.name}</h1>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, color: detail.statusColor, background: detail.statusBg, padding: '4px 10px', borderRadius: 6 }}>{detail.statusLabel}</span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#0A2463', fontWeight: 600, textDecoration: 'none' }}
          >
            <ExternalLink size={13} /> View source
          </a>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
        {visibleTags.map((tag) => (
          <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#0A2463', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 7, padding: '4px 9px' }}>{tag}</span>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, marginBottom: 24 }}>
        <DetailRow label="Stack" value={detail.stackStr} />
        <DetailRow
          label="Owner"
          value={
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: detail.ownerColor, color: '#fff', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{detail.ownerInitials}</span>
              <span style={{ fontSize: 13, color: '#0A2463' }}>{detail.ownerName}</span>
            </span>
          }
        />
        <DetailRow label="Depends on" value={detail.depsStr} last />
      </div>

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
  );
}

function DetailRow({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: last ? 'none' : '1px solid #F2F2F2' }}>
      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9a9a9a' }}>{label}</span>
      {typeof value === 'string'
        ? <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: '#0A2463' }}>{value}</span>
        : value}
    </div>
  );
}
