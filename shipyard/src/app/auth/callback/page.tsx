'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Anchor } from 'lucide-react';

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

    const next = searchParams.get('next') ?? '/dashboard';
    router.replace(next);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center" style={{ background: '#0A0A0F' }}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: '#6366F1', animation: 'pulse 1.5s ease-in-out infinite' }}
        >
          <Anchor size={24} color="white" strokeWidth={2.5} />
        </div>
        <p className="text-[14px] text-[#64748B]">Signing you in…</p>
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
