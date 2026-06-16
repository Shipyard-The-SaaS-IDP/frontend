'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Anchor, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: 'Google sign-in was cancelled.',
  token_exchange_failed: 'Could not complete sign-in. Please try again.',
  userinfo_failed: 'Could not fetch your Google profile. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function SignupInner() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const errorKey = searchParams.get('error');
  const errorMsg = errorKey ? (ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.unknown) : null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 text-[#F1F5F9]" style={{ background: '#0A0A0F' }}>
      <div className="bg-dot-grid pointer-events-none fixed inset-0" />
      <div
        className="pointer-events-none fixed left-1/2 top-[20%] h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-[400px]">
        <a href="/" className="mb-8 flex items-center justify-center gap-2.5 no-underline">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px]" style={{ background: '#6366F1' }}>
            <Anchor size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-[17px] font-semibold tracking-[-0.01em] text-[#F1F5F9]">Shipyard</span>
        </a>

        <div className="rounded-2xl border border-white/[0.08] p-8" style={{ background: '#111118' }}>
          <h1 className="mb-1.5 text-center font-heading text-[22px] font-bold tracking-[-0.02em] text-[#F1F5F9]">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mb-6 text-center text-[13.5px] text-[#64748B]">
            {mode === 'signup'
              ? 'Start shipping production-ready infrastructure in minutes.'
              : 'Log in to get back to your dashboard.'}
          </p>

          {errorMsg && (
            <div className="mb-4 rounded-[10px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
              {errorMsg}
            </div>
          )}

          {/* Google OAuth — primary CTA */}
          <a
            href={`${API_URL}/auth/google`}
            className="flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-white/[0.12] px-4 py-2.5 text-[14px] font-semibold text-[#F1F5F9] no-underline transition-all hover:border-white/25 hover:bg-white/[0.04]"
            style={{ background: '#1A1A24' }}
          >
            <GoogleIcon />
            Continue with Google
          </a>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#475569]">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Email fallback — no-op for now, shows coming soon */}
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = `${API_URL}/auth/google`; }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-medium text-[#94A3B8]" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                className="rounded-[10px] border border-white/[0.08] px-3.5 py-2.5 text-[14px] text-[#F1F5F9] outline-none transition-colors placeholder:text-[#475569] focus:border-[#6366F1]"
                style={{ background: '#1A1A24' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-medium text-[#94A3B8]" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="rounded-[10px] border border-white/[0.08] px-3.5 py-2.5 text-[14px] text-[#F1F5F9] outline-none transition-colors placeholder:text-[#475569] focus:border-[#6366F1]"
                style={{ background: '#1A1A24' }}
              />
            </div>
            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-[10px] border-none px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: '#6366F1' }}
            >
              {mode === 'signup' ? 'Create account' : 'Log in'} <ArrowRight size={15} />
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[13px] text-[#64748B]">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="border-none bg-transparent font-semibold text-[#818CF8] underline-offset-2 hover:underline"
          >
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </p>
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
