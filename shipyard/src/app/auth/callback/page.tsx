'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { api, type ConnectorsResponse } from '@/lib/api';

function ShipyardMark() {
  return (
    <svg width={40} height={40} viewBox="0 0 72 72" fill="none" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }}>
      <rect width="72" height="72" rx="18" fill="#00E87A" />
      <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      router.replace('/signup?error=' + (error ?? 'unknown'));
      return;
    }

    // Store token in a cookie accessible to the Next.js middleware
    document.cookie = `shipyard_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

    const explicitNext = searchParams.get('next');
    if (explicitNext) {
      router.replace(explicitNext);
      return;
    }

    // No explicit destination — send first-time users to onboarding,
    // returning users (who've already connected something) to the dashboard.
    api.get<ConnectorsResponse>('/connectors')
      .then((res) => router.replace(res.connectedCount === 0 ? '/onboarding' : '/dashboard'))
      .catch(() => router.replace('/dashboard'));
  }, [router, searchParams]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <ShipyardMark />
        <p style={{ fontSize: 14, color: '#6B6B6B' }}>Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackInner />
    </Suspense>
  );
}
