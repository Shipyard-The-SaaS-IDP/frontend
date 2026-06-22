'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// The New Service flow moved to /architect (now a real multi-turn agent
// instead of a one-shot form). Keep this redirect so the Translator's
// existing handoff link (?prompt=&autoGenerate=) keeps working.
function RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    router.replace(`/architect?${searchParams.toString()}`);
  }, [router, searchParams]);

  return null;
}

export default function WorkflowsNewRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectInner />
    </Suspense>
  );
}
