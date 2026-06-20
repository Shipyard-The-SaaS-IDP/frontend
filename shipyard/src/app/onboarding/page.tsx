'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Check, ArrowRight } from 'lucide-react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { BrandIcon } from '@/components/integrations/brand-icons';
import { api, type ConnectorsResponse } from '@/lib/api';

export default function OnboardingConnectPage() {
  const router = useRouter();
  const [data, setData] = useState<ConnectorsResponse | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    api.get<ConnectorsResponse>('/connectors').then(setData).finally(() => setLoading(false));
  }, []);

  const codeHostsConnected = useMemo(() => {
    if (!data) return false;
    const codeHostGroup = data.groups.find((g) => g.category === 'Code hosts');
    return codeHostGroup?.items.some((c) => c.connected) ?? false;
  }, [data]);

  const toggle = async (id: string) => {
    setToggling(id);
    try {
      const res = await api.post<ConnectorsResponse>(`/connectors/${id}/toggle`);
      setData(res);
    } finally {
      setToggling(null);
    }
  };

  const ql = query.trim().toLowerCase();
  const visibleGroups = (data?.groups ?? [])
    .map((g) => ({ ...g, items: g.items.filter((c) => !ql || c.name.toLowerCase().includes(ql)) }))
    .filter((g) => g.items.length > 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <OnboardingHeader step={1} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <OnboardingHeader step={1} />
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '54px 28px 120px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00E87A12', border: '1px solid #00E87A40', color: '#0A2463', fontSize: 12.5, fontWeight: 600, padding: '5px 12px', borderRadius: 999, marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E87A' }} />Step 1 of 3
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#0A2463', margin: '0 0 12px' }}>
          Let&apos;s map your stack.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#6B6B6B', margin: '0 0 28px', maxWidth: 560 }}>
          Connect the tools Shipyard should read from. Pick at least one code host to get started — everything else is optional and can be added later.
        </p>

        <div style={{ position: 'relative', maxWidth: 420, marginBottom: 34 }}>
          <Search size={17} color="#9a9a9a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GitLab, Bitbucket, CloudFormation…"
            style={{ width: '100%', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 12, padding: '11px 14px 11px 40px', fontSize: 14.5, color: '#0A2463' }}
          />
        </div>

        {visibleGroups.map((group) => (
          <div key={group.category} style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 13 }}>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>{group.category}</span>
              {group.items.some((c) => c.required) && (
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A2463', background: '#00E87A22', padding: '2px 7px', borderRadius: 999 }}>Required</span>
              )}
              <span style={{ flex: 1, height: 1, background: '#F0F0F0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(196px, 1fr))', gap: 13 }}>
              {group.items.map((c) => (
                <div
                  key={c.id}
                  style={{ background: '#fff', border: `1.5px solid ${c.connected ? '#00E87A' : '#EAEAEA'}`, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}><BrandIcon id={c.id} /></span>
                    <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 15, color: '#0A2463' }}>{c.name}</span>
                  </div>
                  <button
                    onClick={() => toggle(c.id)}
                    disabled={toggling === c.id}
                    style={{
                      cursor: 'pointer', border: `1px solid ${c.connected ? '#00E87A' : '#EAEAEA'}`,
                      background: c.connected ? '#00E87A18' : '#fff', color: '#0A2463', fontWeight: 600, fontSize: 13.5,
                      padding: '8px 0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      opacity: toggling === c.id ? 0.6 : 1,
                    }}
                  >
                    {c.connected && <Check size={14} strokeWidth={2.6} />}
                    {c.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #EAEAEA', padding: '16px 28px', zIndex: 40 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#6B6B6B' }}>
            {codeHostsConnected ? `${data?.connectedCount ?? 0} tools connected · ready to discover` : 'Connect at least one code host to continue'}
          </span>
          <button
            onClick={() => codeHostsConnected && router.push('/onboarding/discover')}
            disabled={!codeHostsConnected}
            style={{
              marginLeft: 'auto', cursor: codeHostsConnected ? 'pointer' : 'not-allowed',
              border: 'none', background: codeHostsConnected ? '#00E87A' : '#EAEAEA', color: codeHostsConnected ? '#0A2463' : '#9a9a9a',
              fontWeight: 700, fontSize: 15, padding: '12px 26px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: codeHostsConnected ? '0 2px 6px rgba(0,232,122,0.25)' : 'none',
            }}
          >
            Start discovery <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
