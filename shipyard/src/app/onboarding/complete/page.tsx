'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { api, type DiscoverResponse } from '@/lib/api';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const [result, setResult] = useState<DiscoverResponse | null>(null);

  useEffect(() => {
    // Idempotent — returns the already-discovered catalog if discovery already ran.
    api.post<DiscoverResponse>('/onboarding/discover').then(setResult).catch(() => router.replace('/onboarding'));
  }, [router]);

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <OnboardingHeader step={3} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <OnboardingHeader step={3} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 28px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00E87A12', border: '1px solid #00E87A40', color: '#0A2463', fontSize: 12.5, fontWeight: 600, padding: '5px 12px', borderRadius: 999, marginBottom: 22 }}>
          <Check size={13} strokeWidth={2.6} />Step 3 of 3 · complete
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 46, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#0A2463', margin: '0 0 14px' }}>
          Your stack is mapped.
        </h1>
        <p style={{ fontSize: 17.5, lineHeight: 1.55, color: '#6B6B6B', margin: '0 auto 30px', maxWidth: 520 }}>
          Shipyard found {result.serviceCount} services and mapped {result.depCount} dependencies across your org — owners and all.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 36, marginBottom: 34 }}>
          {[
            { value: result.serviceCount, label: 'services' },
            { value: result.depCount, label: 'dependencies' },
            { value: 0, label: 'YAML written' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 34, color: '#0A2463' }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9, maxWidth: 600, margin: '0 auto 40px' }}>
          {result.services.map((s) => (
            <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12.5, color: '#0A2463', background: '#fff', border: '1px solid #EAEAEA', borderRadius: 999, padding: '7px 13px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.statusColor }} />{s.name}
            </span>
          ))}
        </div>

        <button
          onClick={() => router.push('/onboarding/notify')}
          style={{ cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 16, padding: '15px 32px', borderRadius: 13, display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: '0 8px 24px rgba(0,232,122,0.3)' }}
        >
          Continue <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
