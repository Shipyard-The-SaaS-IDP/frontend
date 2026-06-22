'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Users, Copy, Check } from 'lucide-react';
import { api, ApiError, getClientToken, getCurrentUser, logout, type AuthUser, type ConnectorsResponse } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [connectors, setConnectors] = useState<ConnectorsResponse | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
    api.get<ConnectorsResponse>('/connectors').then(setConnectors).catch(() => {});
  }, []);

  const mcpConfig = JSON.stringify({
    mcpServers: {
      shipyard: {
        command: 'python',
        args: ['/absolute/path/to/shipyard/backend/mcp_server/server.py'],
        env: { SHIPYARD_TOKEN: getClientToken() ?? '<your token>', SHIPYARD_API_URL: API_URL },
      },
    },
  }, null, 2);

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const seedDemoTeam = async () => {
    setSeeding(true);
    setSeedError(null);
    try {
      await api.post('/demo/seed-acme-team');
      router.push('/dashboard');
    } catch (e) {
      setSeedError(e instanceof ApiError ? e.message : 'Could not seed demo data.');
    } finally {
      setSeeding(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div style={{ padding: '28px 32px', maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 24px' }}>Profile</h1>

      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#0A2463', color: '#fff', fontSize: 18,
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-jetbrains-mono)', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0A2463' }}>{user?.name || 'Loading…'}</div>
          <div style={{ fontSize: 13.5, color: '#6B6B6B' }}>{user?.email}</div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 14 }}>
          Connected accounts
        </div>
        {connectors ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {connectors.groups.flatMap((g) => g.items).filter((c) => c.connected).map((c) => (
              <span key={c.id} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, color: '#0BA45E', background: '#00E87A14', padding: '5px 11px', borderRadius: 7 }}>
                {c.name}
              </span>
            ))}
            {connectors.connectedCount === 0 && <p style={{ fontSize: 13, color: '#9a9a9a', margin: 0 }}>Nothing connected yet.</p>}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#9a9a9a', margin: 0 }}>Loading…</p>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 10 }}>
          Use Shipyard from your IDE
        </div>
        <p style={{ fontSize: 13, color: '#6B6B6B', margin: '0 0 14px' }}>
          Query your catalog from Claude Code, Cursor, or any MCP-aware editor — runs locally,
          proxies to this same API with your token. <code style={{ fontSize: 11.5 }}>backend/mcp_server/server.py</code>{' '}
          has the setup steps. Paste this into your MCP client config:
        </p>
        <div style={{ position: 'relative', background: '#0A2463', borderRadius: 10, padding: 14 }}>
          <button
            onClick={copyConfig}
            style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 7, padding: 6 }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <pre style={{ margin: 0, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#00E87A', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {mcpConfig}
          </pre>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 10 }}>
          Demo data
        </div>
        <p style={{ fontSize: 13, color: '#6B6B6B', margin: '0 0 14px' }}>
          Resets your catalog and Architect history to a curated, team-flavored dataset — useful for demos.
          This only affects your own account.
        </p>
        <button
          onClick={seedDemoTeam}
          disabled={seeding}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, cursor: seeding ? 'default' : 'pointer', border: '1px solid #EAEAEA',
            background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 13.5, padding: '10px 18px', borderRadius: 10, opacity: seeding ? 0.6 : 1,
          }}
        >
          <Users size={15} /> {seeding ? 'Seeding…' : 'Seed Acme Corp demo team'}
        </button>
        {seedError && <p style={{ fontSize: 12.5, color: '#ff5f57', margin: '10px 0 0' }}>{seedError}</p>}
      </div>

      <button
        onClick={logout}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: '1px solid #ff5f5740', background: '#ff5f5710',
          color: '#ff5f57', fontWeight: 600, fontSize: 13.5, padding: '10px 18px', borderRadius: 10,
        }}
      >
        <LogOut size={15} /> Log out
      </button>
    </div>
  );
}
