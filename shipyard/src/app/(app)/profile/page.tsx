'use client';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { api, getCurrentUser, logout, type AuthUser, type ConnectorsResponse } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [connectors, setConnectors] = useState<ConnectorsResponse | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    api.get<ConnectorsResponse>('/connectors').then(setConnectors).catch(() => {});
  }, []);

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
