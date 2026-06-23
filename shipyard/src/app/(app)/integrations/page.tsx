'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, X } from 'lucide-react';
import { BrandIcon } from '@/components/integrations/brand-icons';
import { COMING_SOON } from '@/components/integrations/coming-soon';
import { api, ApiError, getGithubConnectUrl, getGsuiteConnectUrl, getNotionConnectUrl, getSlackConnectUrl, type ConnectorsResponse, type ConnectorItem } from '@/lib/api';

// Connectors with a real OAuth flow — rendered as a navigation link instead
// of a toggle button. Everything else is still a simulated toggle for now.
const OAUTH_CONNECT_URLS: Record<string, (next: string) => string> = {
  github: getGithubConnectUrl,
  slack: getSlackConnectUrl,
  gsuite: getGsuiteConnectUrl,
  notion: getNotionConnectUrl,
};

// Not OAuth — connecting means pasting a credential (key, or key+token) directly.
const KEY_UPLOAD_CONNECTOR_IDS = new Set(['gcp', 'trello']);

function GcpConnectModal({ onClose, onConnected }: { onClose: () => void; onConnected: () => void }) {
  const [keyText, setKeyText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const submit = async () => {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(keyText);
    } catch {
      setError('Not valid JSON — paste the full service account key file contents.');
      return;
    }
    setConnecting(true);
    try {
      await api.post('/connectors/gcp/connect', { serviceAccountKey: parsed });
      onConnected();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not connect with this key.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,36,99,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 480, maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 17, color: '#0A2463', margin: 0 }}>Connect Google Cloud</h2>
          <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#9a9a9a' }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: '#6B6B6B', margin: '0 0 14px' }}>
          Paste the contents of a service account key JSON file (GCP Console → IAM &amp; Admin → Service Accounts → Keys → Add Key).
          Read-only Cloud Run access is enough.
        </p>
        <textarea
          value={keyText}
          onChange={(e) => setKeyText(e.target.value)}
          placeholder='{"type": "service_account", "project_id": "...", ...}'
          rows={8}
          style={{ width: '100%', border: '1px solid #EAEAEA', borderRadius: 10, padding: 10, fontSize: 12, fontFamily: 'var(--font-jetbrains-mono)', resize: 'vertical', marginBottom: 10 }}
        />
        {error && <p style={{ color: '#ff5f57', fontSize: 12.5, margin: '0 0 10px' }}>{error}</p>}
        <button
          onClick={submit}
          disabled={!keyText.trim() || connecting}
          style={{
            width: '100%', cursor: connecting ? 'default' : 'pointer', border: 'none', background: '#00E87A', color: '#0A2463',
            fontWeight: 700, fontSize: 14, padding: '11px 0', borderRadius: 10, opacity: !keyText.trim() || connecting ? 0.6 : 1,
          }}
        >
          {connecting ? 'Connecting…' : 'Connect'}
        </button>
      </div>
    </div>
  );
}

function TrelloConnectModal({ onClose, onConnected }: { onClose: () => void; onConnected: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const submit = async () => {
    setError(null);
    setConnecting(true);
    try {
      await api.post('/connectors/trello/connect', { apiKey, token });
      onConnected();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not connect with this key/token.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,36,99,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 420, maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 17, color: '#0A2463', margin: 0 }}>Connect Trello</h2>
          <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#9a9a9a' }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: '#6B6B6B', margin: '0 0 14px' }}>
          Get your API key and a token at{' '}
          <a href="https://trello.com/app-key" target="_blank" rel="noopener noreferrer" style={{ color: '#0A2463', fontWeight: 600 }}>trello.com/app-key</a>.
        </p>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API key"
          style={{ width: '100%', border: '1px solid #EAEAEA', borderRadius: 10, padding: '9px 12px', fontSize: 13, marginBottom: 8 }}
        />
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token"
          style={{ width: '100%', border: '1px solid #EAEAEA', borderRadius: 10, padding: '9px 12px', fontSize: 13, marginBottom: 10 }}
        />
        {error && <p style={{ color: '#ff5f57', fontSize: 12.5, margin: '0 0 10px' }}>{error}</p>}
        <button
          onClick={submit}
          disabled={!apiKey.trim() || !token.trim() || connecting}
          style={{
            width: '100%', cursor: connecting ? 'default' : 'pointer', border: 'none', background: '#00E87A', color: '#0A2463',
            fontWeight: 700, fontSize: 14, padding: '11px 0', borderRadius: 10, opacity: !apiKey.trim() || !token.trim() || connecting ? 0.6 : 1,
          }}
        >
          {connecting ? 'Connecting…' : 'Connect'}
        </button>
      </div>
    </div>
  );
}

function ConnectorCard({
  c, toggling, onToggle, onOpen, onOpenKeyUpload,
}: { c: ConnectorItem; toggling: string | null; onToggle: (id: string) => void; onOpen: (id: string) => void; onOpenKeyUpload: (id: string) => void }) {
  return (
    <div
      onClick={() => c.connected && onOpen(c.id)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 14, border: '1px solid #EAEAEA',
        background: '#fff', cursor: c.connected ? 'pointer' : 'default', transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={(e) => { if (c.connected) { e.currentTarget.style.borderColor = '#00E87A55'; e.currentTarget.style.boxShadow = '0 10px 24px -16px rgba(10,36,99,0.3)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EAEAEA'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{
          display: 'flex', width: 36, height: 36, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 9,
          background: '#FAFAFA', filter: c.connected ? 'none' : 'grayscale(1)', opacity: c.connected ? 1 : 0.55,
        }}>
          <BrandIcon id={c.id} size={20} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: '#0A2463', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, color: '#9a9a9a' }}>{c.category}</div>
        </div>
        {c.connected && <ArrowRight size={14} color="#9a9a9a" style={{ flexShrink: 0, marginTop: 3 }} />}
      </div>

      {c.connected ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: '#0BA45E' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0BA45E' }} /> Connected
        </span>
      ) : KEY_UPLOAD_CONNECTOR_IDS.has(c.id) ? (
        <button
          onClick={(e) => { e.stopPropagation(); onOpenKeyUpload(c.id); }}
          style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#FAFAFA', color: '#0A2463', fontWeight: 600, fontSize: 12.5, padding: '7px 0', borderRadius: 8 }}
        >
          Connect
        </button>
      ) : OAUTH_CONNECT_URLS[c.id] ? (
        <a
          href={OAUTH_CONNECT_URLS[c.id]('/integrations')}
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#FAFAFA', color: '#0A2463', fontWeight: 600, fontSize: 12.5, padding: '7px 0', borderRadius: 8, textAlign: 'center', textDecoration: 'none' }}
        >
          Connect
        </a>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(c.id); }}
          disabled={toggling === c.id}
          style={{
            cursor: 'pointer', border: '1px solid #EAEAEA', background: '#FAFAFA', color: '#0A2463', fontWeight: 600,
            fontSize: 12.5, padding: '7px 0', borderRadius: 8, opacity: toggling === c.id ? 0.6 : 1,
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
  const [keyUploadFor, setKeyUploadFor] = useState<string | null>(null);

  const refetch = () => api.get<ConnectorsResponse>('/connectors').then(setData);

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

  const connected = data?.groups.flatMap((g) => g.items).filter((c) => c.connected) ?? [];
  const discoverableGroups = data?.groups
    .map((g) => ({ ...g, items: g.items.filter((c) => !c.connected && c.live) }))
    .filter((g) => g.items.length > 0) ?? [];
  const notLiveYet = data?.groups.flatMap((g) => g.items).filter((c) => !c.connected && !c.live) ?? [];

  const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 } as const;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 4px' }}>Integrations</h1>
      <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 26px' }}>
        Connect the tools Shipyard reads from. {data?.connectedCount ?? 0} connected.
      </p>

      {error && <p style={{ color: '#ff5f57', fontSize: 14 }}>{error}</p>}
      {!data && !error && <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading…</p>}

      {data && (
        <>
          <section style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0BA45E', marginBottom: 12 }}>
              Your integrations
            </div>
            {connected.length === 0 ? (
              <div style={{ border: '1px dashed #EAEAEA', borderRadius: 14, padding: '24px 18px', textAlign: 'center', fontSize: 13.5, color: '#9a9a9a' }}>
                Nothing connected yet — pick something below to get started.
              </div>
            ) : (
              <div style={cardGrid}>
                {connected.map((c) => (
                  <ConnectorCard key={c.id} c={c} toggling={toggling} onToggle={toggle} onOpen={(id) => router.push(`/integrations/${id}`)} onOpenKeyUpload={setKeyUploadFor} />
                ))}
              </div>
            )}
          </section>

          <section style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 12 }}>
              Discover more
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {discoverableGroups.map((g) => (
                <div key={g.category}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0A2463', marginBottom: 8 }}>{g.category}</div>
                  <div style={cardGrid}>
                    {g.items.map((c) => (
                      <ConnectorCard key={c.id} c={c} toggling={toggling} onToggle={toggle} onOpen={(id) => router.push(`/integrations/${id}`)} onOpenKeyUpload={setKeyUploadFor} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9a9a9a', marginBottom: 10 }}>
              Coming soon
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {[...notLiveYet.map((c) => ({ id: c.id, name: c.name })), ...COMING_SOON].map((c) => (
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

      {keyUploadFor === 'gcp' && (
        <GcpConnectModal
          onClose={() => setKeyUploadFor(null)}
          onConnected={() => { setKeyUploadFor(null); refetch(); }}
        />
      )}
      {keyUploadFor === 'trello' && (
        <TrelloConnectModal
          onClose={() => setKeyUploadFor(null)}
          onConnected={() => { setKeyUploadFor(null); refetch(); }}
        />
      )}
    </div>
  );
}
