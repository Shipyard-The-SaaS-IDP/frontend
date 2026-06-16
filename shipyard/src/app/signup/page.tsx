'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, ArrowRight, GitBranch } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/dashboard');
  };

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
            {mode === 'signup' ? 'Start shipping production-ready infrastructure in minutes.' : 'Log in to get back to your dashboard.'}
          </p>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-white/[0.08] px-4 py-2.5 text-[14px] font-medium text-[#E2E8F0] transition-all hover:border-white/20 hover:bg-white/[0.04]"
            style={{ background: '#1A1A24' }}
          >
            <GitBranch size={16} />
            Continue with GitHub
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#475569]">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-medium text-[#94A3B8]" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
