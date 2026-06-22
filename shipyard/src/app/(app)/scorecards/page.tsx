'use client';
import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Plug, Sparkles } from 'lucide-react';
import { api, ApiError, type ScorecardsResponse } from '@/lib/api';

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 20 }}>{children}</div>;
}

function CardLabel({ icon: Icon, text }: { icon: typeof Activity; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
      <Icon size={14} color="#0A2463" />
      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B' }}>{text}</span>
    </div>
  );
}

export default function ScorecardsPage() {
  const [data, setData] = useState<ScorecardsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ScorecardsResponse>('/scorecards')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not reach the Shipyard API.'));
  }, []);

  if (error) return <div style={{ padding: 32, color: '#ff5f57', fontSize: 14 }}>{error}</div>;
  if (!data) return <div style={{ padding: 32, color: '#6B6B6B', fontSize: 14 }}>Loading scorecards…</div>;

  const maxStack = Math.max(1, ...data.topStack.map((s) => s.count));

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1180 }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 4px' }}>Scorecards</h1>
      <p style={{ fontSize: 14.5, color: '#6B6B6B', margin: '0 0 24px' }}>One-shot view of everything going on across your catalog.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardLabel icon={CheckCircle2} text="Health score" />
          <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 38, color: data.healthScore !== null && data.healthScore < 70 ? '#febc2e' : '#0BA45E' }}>
            {data.healthScore !== null ? `${data.healthScore}%` : '—'}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            {data.statusBreakdown.map((s) => (
              <span key={s.status} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B6B6B' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />{s.count} {s.label.toLowerCase()}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardLabel icon={Activity} text="Services" />
          <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 38, color: '#0A2463' }}>{data.serviceCount}</div>
          <div style={{ fontSize: 12.5, color: '#6B6B6B', marginTop: 10 }}>discovered across your connected code hosts</div>
        </Card>

        <Card>
          <CardLabel icon={Plug} text="Integrations" />
          <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 38, color: '#0A2463' }}>
            {data.connectedCount}<span style={{ fontSize: 18, color: '#9a9a9a' }}>/{data.totalConnectors}</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#6B6B6B', marginTop: 10 }}>connected</div>
        </Card>

        <Card>
          <CardLabel icon={Sparkles} text="AI Architect" />
          <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 38, color: '#0A2463' }}>{data.architectActivity.total}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 12, color: '#6B6B6B' }}>
            <span>{data.architectActivity.approved} approved</span>
            <span>{data.architectActivity.pending} pending</span>
            <span>{data.architectActivity.denied} denied</span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardLabel icon={Activity} text="Stack composition" />
          {data.topStack.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9a9a9a' }}>No services discovered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.topStack.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 100, fontSize: 12.5, color: '#0A2463', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                  <div style={{ flex: 1, height: 8, background: '#FAFAFA', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(s.count / maxStack) * 100}%`, background: '#00E87A', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, color: '#6B6B6B', width: 20, textAlign: 'right' }}>{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardLabel icon={Plug} text="Integration coverage by category" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.connectorCoverage.map((c) => (
              <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 130, fontSize: 12.5, color: '#0A2463', flexShrink: 0 }}>{c.category}</span>
                <div style={{ flex: 1, height: 8, background: '#FAFAFA', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(c.connected / c.total) * 100}%`, background: '#1E5FCC', borderRadius: 4 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11.5, color: '#6B6B6B', width: 32, textAlign: 'right' }}>{c.connected}/{c.total}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {data.recentRequests.length > 0 && (
        <Card>
          <div style={{ marginTop: 16 }}>
            <CardLabel icon={Sparkles} text="Recent Architect activity" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.recentRequests.map((r) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{
                    fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, padding: '2px 8px', borderRadius: 6,
                    background: r.status === 'approved' ? '#00E87A14' : r.status === 'denied' ? '#ff5f5714' : '#FAFAFA',
                    color: r.status === 'approved' ? '#0BA45E' : r.status === 'denied' ? '#ff5f57' : '#9a9a9a',
                  }}>
                    {r.status.replace('_', ' ')}
                  </span>
                  <span style={{ color: '#0A2463', fontWeight: 500 }}>{r.serviceName}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
