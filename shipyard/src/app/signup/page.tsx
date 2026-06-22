'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DiscoveryTerminal } from '@/components/marketing/Previews';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: 'Google sign-in was cancelled.',
  token_exchange_failed: 'Could not complete sign-in. Please try again.',
  userinfo_failed: 'Could not fetch your Google profile. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

function ShipyardMark() {
  return (
    <svg width={40} height={40} viewBox="0 0 72 72" fill="none">
      <rect width="72" height="72" rx="18" fill="#00E87A" />
      <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const VALUE_PROPS = [
  'Auto-discovers every service, owner, and dependency',
  'No YAML, no manual setup — read-only access in two clicks',
  'Plain-English service creation, real infra underneath',
];

function BrandPanel() {
  return (
    <div style={{ flex: 1, background: '#0A2463', padding: '56px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, #1E5FCC55, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 34, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 16px' }}>
          Your stack, mapped <span style={{ color: '#00E87A' }}>in five minutes.</span>
        </h2>
        <ul style={{ listStyle: 'none', margin: '0 0 32px', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {VALUE_PROPS.map((v) => (
            <li key={v} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.75)' }}>
              <span style={{ marginTop: 6, width: 5, height: 5, borderRadius: '50%', background: '#00E87A', flexShrink: 0 }} />
              {v}
            </li>
          ))}
        </ul>
        <DiscoveryTerminal />
      </div>
    </div>
  );
}

function SignupInner() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const errorKey = searchParams.get('error');
  const errorMsg = errorKey ? (ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.unknown) : null;
  const isLogin = mode === 'login';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      <div style={{ flex: '0 0 480px', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 380, animation: 'fadeSwap .4s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
            <a href="/" style={{ marginBottom: 18 }}><ShipyardMark /></a>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 27, letterSpacing: '-0.02em', color: '#0A2463', margin: '0 0 6px', textAlign: 'center' }}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ fontSize: 15, color: '#6B6B6B', margin: 0, textAlign: 'center' }}>
              {isLogin ? 'Log in to your Shipyard workspace.' : 'Map your stack in five minutes.'}
            </p>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: 18, borderRadius: 12, border: '1px solid rgba(255,95,87,0.3)', background: 'rgba(255,95,87,0.08)', padding: '12px 14px', fontSize: 13, color: '#c0392b' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ position: 'relative', display: 'flex', background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 12, padding: 4, marginBottom: 22 }}>
            <span style={{
              position: 'absolute', top: 4, left: 4, bottom: 4, width: 'calc(50% - 4px)', background: '#fff', border: '1px solid #EAEAEA',
              borderRadius: 9, boxShadow: '0 1px 3px rgba(10,36,99,0.06)', transition: 'transform .3s cubic-bezier(.65,.05,.36,1)',
              transform: isLogin ? 'translateX(100%)' : 'translateX(0%)',
            }} />
            <button onClick={() => setMode('signup')} style={{ position: 'relative', zIndex: 1, flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#0A2463', padding: '9px 0', borderRadius: 9 }}>Sign up</button>
            <button onClick={() => setMode('login')} style={{ position: 'relative', zIndex: 1, flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#0A2463', padding: '9px 0', borderRadius: 9 }}>Log in</button>
          </div>

          <a
            href={`${API_URL}/auth/google`}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 15, padding: 12, borderRadius: 12, border: '1px solid #EAEAEA', textDecoration: 'none' }}
          >
            <GoogleIcon />
            Continue with Google
          </a>

          <p style={{ textAlign: 'center', fontSize: 12.5, color: '#9a9a9a', margin: '22px 0 0', lineHeight: 1.5 }}>
            By continuing you agree to Shipyard&apos;s<br />Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex" style={{ flex: 1 }}>
        <BrandPanel />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupInner />
    </Suspense>
  );
}
