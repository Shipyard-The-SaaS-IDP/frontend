'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock } from 'lucide-react';
import { BrandIcon } from '@/components/integrations/brand-icons';
import { COMING_SOON } from '@/components/integrations/coming-soon';
import { api, ApiError, getGithubConnectUrl, getSlackConnectUrl, type ConnectorsResponse, type ConnectorItem } from '@/lib/api';

// Connectors with a real OAuth flow — rendered as a navigation link instead
// of a toggle button. Everything else is still a simulated toggle for now.
const OAUTH_CONNECT_URLS: Record<string, (next: string) => string> = {
  github: getGithubConnectUrl,
  slack: getSlackConnectUrl,
};

function ConnectorRow({
  c, toggling, onToggle, onOpen, isLast,
}: { c: ConnectorItem; toggling: string | null; onToggle: (id: string) => void; onOpen: (id: string) => void; isLast: boolean }) {
  return (
    <div
      onClick={() => c.connected && onOpen(c.id)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', borderTop: isLast ? 'none' : '1px solid #F2F2F2', cursor: c.connected ? 'pointer' : 'default' }}
    >
      <span style={{ display: 'flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', filter: c.connected ? 'none' : 'grayscale(1)', opacity: c.connected ? 1 : 0.55 }}>
        <BrandIcon id={c.id} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: '#0A2463' }}>{c.name}</div>
        <div style={{ fontSize: 12.5, color: c.connected ? '#0BA45E' : '#9a9a9a' }}>{c.connected ? 'Connected · view details' : 'Not connected'}</div>
      </div>
      {c.connected ? (
        <ArrowRight size={16} color="#9a9a9a" />
      ) : OAUTH_CONNECT_URLS[c.id] ? (
        <a
          href={OAUTH_CONNECT_URLS[c.id]('/integrations')}
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 13, padding: '7px 16px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          Connect
        </a>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(c.id); }}
          disabled={toggling === c.id}
          style={{
            cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600,
            fontSize: 13, padding: '7px 16px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6,
            opacity: toggling === c.id ? 0.6 : 1,
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  const router = useRouter();
  const [data, setData] = useState<ConnectorsResponse | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ConnectorsResponse>('/connectors')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not reach the Shipyard API. Is NEXT_PUBLIC_API_URL set correctly?'));
  }, []);

  const toggle = async (id: string) => {
    setToggling(id);
    try {
      const res = await api.post<ConnectorsResponse>(`/connectors/${id}/toggle`);
      setData(res);
    } finally {
      setToggling(null);
    }
  };

  const allItems = data?.groups.flatMap((g) => g.items) ?? [];
  const connected = allItems.filter((c) => c.connected);
  const discoverable = allItems.filter((c) => !c.connected);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 820 }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 4px' }}>Integrations</h1>
      <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 26px' }}>
        Connect the tools Shipyard reads from. {data?.connectedCount ?? 0} connected.
      </p>

      {error && <p style={{ color: '#ff5f57', fontSize: 14 }}>{error}</p>}
      {!data && !error && <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading…</p>}

      {data && (
        <>
          <section style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0BA45E', marginBottom: 10 }}>
              Your integrations
            </div>
            {connected.length === 0 ? (
              <div style={{ border: '1px dashed #EAEAEA', borderRadius: 14, padding: '24px 18px', textAlign: 'center', fontSize: 13.5, color: '#9a9a9a' }}>
                Nothing connected yet — pick something below to get started.
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, overflow: 'hidden' }}>
                {connected.map((c, i) => (
                  <ConnectorRow key={c.id} c={c} toggling={toggling} onToggle={toggle} onOpen={(id) => router.push(`/integrations/${id}`)} isLast={i === connected.length - 1} />
                ))}
              </div>
            )}
          </section>

          <section style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 10 }}>
              Discover more
            </div>
            <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, overflow: 'hidden' }}>
              {discoverable.map((c, i) => (
                <ConnectorRow key={c.id} c={c} toggling={toggling} onToggle={toggle} onOpen={(id) => router.push(`/integrations/${id}`)} isLast={i === discoverable.length - 1} />
              ))}
            </div>
          </section>

          <section>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9a9a9a', marginBottom: 10 }}>
              Coming soon
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {COMING_SOON.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid #EAEAEA', borderRadius: 12, background: '#FAFAFA', opacity: 0.7 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: '#EAEAEA', color: '#9a9a9a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.name[0]}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#6B6B6B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9a9a9a' }}><Clock size={10} /> Soon</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
