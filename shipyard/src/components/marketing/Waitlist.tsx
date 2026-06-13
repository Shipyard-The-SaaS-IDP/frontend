'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(16,185,129,0.3)]" style={{ background: 'rgba(16,185,129,0.12)' }}>
          <CheckCircle2 size={22} color="#10B981" />
        </div>
        <div className="font-heading text-lg font-semibold text-[#F1F5F9]">You&apos;re on the list.</div>
        <div className="text-sm text-[#64748B]">We&apos;ll reach out as soon as early access opens.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-2.5">
      <div className="flex w-[300px] items-center gap-2.5 rounded-[10px] border border-white/10 px-4 py-3" style={{ background: '#111118' }}>
        <Mail size={15} color="#475569" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          className="w-full border-none bg-transparent text-sm text-[#F1F5F9] outline-none"
        />
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-[10px] border-none px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#818CF8]"
        style={{ background: '#6366F1' }}
      >
        Join waitlist <ArrowRight size={14} />
      </button>
    </form>
  );
}
