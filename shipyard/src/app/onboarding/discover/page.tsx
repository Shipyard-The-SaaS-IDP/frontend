'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { api, ApiError, type DiscoverResponse } from '@/lib/api';

export default function OnboardingDiscoverPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiscoverResponse | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.post<DiscoverResponse>('/onboarding/discover')
      .then(setResult)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Something went wrong.'));
  }, []);

  useEffect(() => {
    if (!result || visibleCount >= result.trace.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 500);
    return () => clearTimeout(t);
  }, [result, visibleCount]);

  const traceDone = !!result && visibleCount >= result.trace.length;

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <OnboardingHeader step={2} />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 28px', textAlign: 'center' }}>
          <p style={{ color: '#ff5f57', marginBottom: 16 }}>{error}</p>
          <button onClick={() => router.push('/onboarding')} style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 14.5, padding: '10px 20px', borderRadius: 12 }}>
            Back to connect tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <OnboardingHeader step={2} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '54px 28px 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00E87A12', border: '1px solid #00E87A40', color: '#0A2463', fontSize: 12.5, fontWeight: 600, padding: '5px 12px', borderRadius: 999, marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E87A', animation: 'pulse-dot 1.6s ease-in-out infinite' }} />Step 2 of 3
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 38, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#0A2463', margin: '0 0 12px' }}>
          Reading your stack…
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#6B6B6B', margin: '0 0 30px', maxWidth: 540 }}>
          Shipyard is connecting read-only and mapping every service, owner, and dependency. This usually takes a few seconds.
        </p>

        <div style={{ background: '#00E87A0A', border: '1px solid #00E87A2e', borderRadius: 20, padding: 16 }}>
          <div style={{ background: '#0A2463', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px -28px rgba(10,36,99,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
              <span style={{ marginLeft: 12, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>shipyard · discover</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, color: '#00E87A' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E87A', boxShadow: '0 0 8px #00E87A', animation: 'pulse-dot 1.4s ease-in-out infinite' }} />live
              </span>
            </div>
            <div style={{ padding: '22px 24px', minHeight: 300, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 14, lineHeight: 2 }}>
              {result?.trace.slice(0, visibleCount).map((line, i) => (
                <div key={i} style={{ animation: 'traceIn .28s ease-out', display: 'flex', gap: 11, alignItems: 'baseline', color: line.color }}>
                  <span style={{ flex: 'none', width: 15, color: line.iconColor }}>{line.icon}</span>
                  <span style={{ whiteSpace: 'pre-wrap', fontWeight: line.weight }}>{line.text}</span>
                </div>
              ))}
              {!traceDone && (
                <span style={{ display: 'inline-block', width: 8, height: 16, background: '#00E87A', verticalAlign: 'middle', marginLeft: 26, animation: 'dcBlink 1s step-end infinite' }} />
              )}
            </div>
          </div>
        </div>

        {traceDone && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, animation: 'fadeSwap .4s ease' }}>
            <button
              onClick={() => router.push('/onboarding/complete')}
              style={{ cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 15, padding: '12px 26px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 6px rgba(0,232,122,0.25)' }}
            >
              See what we found <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
