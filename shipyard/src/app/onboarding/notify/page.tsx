'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { BrandIcon } from '@/components/integrations/brand-icons';
import { api, getSlackConnectUrl, type ConnectorsResponse } from '@/lib/api';

export default function OnboardingNotifyPage() {
  const router = useRouter();
  const [slackConnected, setSlackConnected] = useState(false);

  useEffect(() => {
    api.get<ConnectorsResponse>('/connectors').then((res) => {
      const slack = res.groups.flatMap((g) => g.items).find((c) => c.id === 'slack');
      setSlackConnected(!!slack?.connected);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <OnboardingHeader step={4} />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 28px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00E87A12', border: '1px solid #00E87A40', color: '#0A2463', fontSize: 12.5, fontWeight: 600, padding: '5px 12px', borderRadius: 999, marginBottom: 22 }}>
          Step 4 of 4
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 34, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0A2463', margin: '0 0 12px' }}>
          Get pinged when something needs you.
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.55, color: '#6B6B6B', margin: '0 auto 30px', maxWidth: 440 }}>
          When the AI Architect proposes a plan, you can get a notification instead of having to remember to check back.
        </p>

        <div style={{ border: '1px solid #EAEAEA', borderRadius: 16, padding: 24, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BrandIcon id="slack" size={28} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#0A2463' }}>Slack</div>
              <div style={{ fontSize: 12.5, color: '#6B6B6B' }}>Pings the channel you pick during connect.</div>
            </div>
            {slackConnected ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: '#0BA45E' }}>
                <Check size={14} /> Connected
              </span>
            ) : (
              <a
                href={getSlackConnectUrl('/onboarding/notify')}
                style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#FAFAFA', color: '#0A2463', fontWeight: 600, fontSize: 13, padding: '8px 16px', borderRadius: 9, textDecoration: 'none' }}
              >
                Connect
              </a>
            )}
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: '#9a9a9a', margin: '0 0 26px' }}>
          Email and other channels are on the roadmap — Slack is the only one wired up so far. You can always set this up later from Integrations.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          style={{ cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 16, padding: '15px 32px', borderRadius: 13, display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: '0 8px 24px rgba(0,232,122,0.3)' }}
        >
          {slackConnected ? 'Explore your catalog' : 'Skip for now'} <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
