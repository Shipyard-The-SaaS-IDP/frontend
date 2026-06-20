'use client';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { BrandIcon } from '@/components/integrations/brand-icons';
import { api, type ConnectorsResponse } from '@/lib/api';

export default function IntegrationsPage() {
  const [data, setData] = useState<ConnectorsResponse | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    api.get<ConnectorsResponse>('/connectors').then(setData);
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

  return (
    <div style={{ padding: '28px 32px', maxWidth: 820 }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 4px' }}>Integrations</h1>
      <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 26px' }}>
        Connect the tools Shipyard reads from. {data?.connectedCount ?? 0} connected.
      </p>

      {!data && <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading…</p>}

      {data?.groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 26 }}>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 10 }}>
            {group.category}
          </div>
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, overflow: 'hidden' }}>
            {group.items.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', borderTop: i === 0 ? 'none' : '1px solid #F2F2F2' }}>
                <span style={{ display: 'flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', filter: c.connected ? 'none' : 'grayscale(1)', opacity: c.connected ? 1 : 0.55 }}>
                  <BrandIcon id={c.id} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: '#0A2463' }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: c.connected ? '#0BA45E' : '#9a9a9a' }}>{c.connected ? 'Connected · syncing' : 'Not connected'}</div>
                </div>
                <button
                  onClick={() => toggle(c.id)}
                  disabled={toggling === c.id}
                  style={{
                    cursor: 'pointer', border: `1px solid ${c.connected ? '#00E87A' : '#EAEAEA'}`, background: c.connected ? '#00E87A18' : '#fff',
                    color: '#0A2463', fontWeight: 600, fontSize: 13, padding: '7px 16px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6,
                    opacity: toggling === c.id ? 0.6 : 1,
                  }}
                >
                  {c.connected && <Check size={13} strokeWidth={2.6} />}
                  {c.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
