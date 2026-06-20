'use client';
import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';

function ShipyardMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <rect width="72" height="72" rx="18" fill="#00E87A" />
      <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-[border-color,box-shadow] duration-200"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'saturate(140%) blur(12px)',
        borderBottom: `1px solid ${scrolled ? '#EAEAEA' : 'transparent'}`,
        boxShadow: scrolled ? '0 1px 0 rgba(10,36,99,0.04)' : 'none',
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center gap-10 px-8">
        <a href="#top" className="flex shrink-0 items-center gap-[11px] no-underline">
          <ShipyardMark />
          <span className="font-heading text-[19px] font-bold tracking-[-0.02em]" style={{ color: '#0A2463' }}>Shipyard</span>
        </a>
        <div className="ml-auto flex items-center gap-[30px]">
          <div className="flex items-center gap-[30px]">
            <a href="#product" className="text-[15px] font-medium no-underline" style={{ color: '#0A2463' }}>Product</a>
            <a href="#integrations" className="text-[15px] font-medium no-underline" style={{ color: '#0A2463' }}>Integrations</a>
            <a href="#pricing" className="text-[15px] font-medium no-underline" style={{ color: '#0A2463' }}>Pricing</a>
          </div>
          <a
            href="/signup"
            className="flex items-center gap-2 rounded-[10px] px-[18px] py-2.5 text-[14.5px] font-semibold no-underline transition-transform hover:-translate-y-px"
            style={{ background: '#00E87A', color: '#0A2463', boxShadow: '0 1px 2px rgba(10,36,99,0.08)' }}
          >
            <Target size={15} strokeWidth={2.2} />
            Map your context
          </a>
        </div>
      </div>
    </nav>
  );
}
