'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User, LogOut, ChevronDown } from 'lucide-react';
import { getCurrentUser, logout, type AuthUser } from '@/lib/api';

function ShipyardMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <rect width="72" height="72" rx="18" fill="#00E87A" />
      <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function AccountMenu({ user }: { user: AuthUser | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
      >
        <div
          title={user?.email}
          style={{
            width: 32, height: 32, borderRadius: '50%', background: '#0A2463', color: '#fff', fontSize: 12,
            fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-jetbrains-mono)',
          }}
        >
          {initials}
        </div>
        <ChevronDown size={14} color="#9a9a9a" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 200, background: '#fff',
          border: '1px solid #EAEAEA', borderRadius: 12, boxShadow: '0 12px 30px -10px rgba(10,36,99,0.2)', overflow: 'hidden', zIndex: 50,
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #F2F2F2' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0A2463', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Account'}</div>
            <div style={{ fontSize: 11.5, color: '#9a9a9a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
          <button
            onClick={() => { setOpen(false); router.push('/profile'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', cursor: 'pointer', border: 'none', background: 'none', fontSize: 13, color: '#0A2463', textAlign: 'left' }}
          >
            <User size={14} /> Profile
          </button>
          <button
            onClick={() => { setOpen(false); logout(); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', cursor: 'pointer', border: 'none', background: 'none', fontSize: 13, color: '#ff5f57', textAlign: 'left' }}
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function AppTopNav() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <nav
      style={{
        height: 64, flexShrink: 0, borderBottom: '1px solid #EAEAEA', display: 'flex',
        alignItems: 'center', padding: '0 24px', gap: 36, background: '#fff', position: 'sticky', top: 0, zIndex: 30,
      }}
    >
      <button
        onClick={() => router.push('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', border: 'none', background: 'none' }}
      >
        <ShipyardMark />
        <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 17, color: '#0A2463', letterSpacing: '-0.02em' }}>Shipyard</span>
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => router.push('/architect')}
          style={{
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none',
            background: '#00E87A', color: '#0A2463', fontWeight: 600, fontSize: 14, padding: '9px 16px',
            borderRadius: 10, boxShadow: '0 1px 2px rgba(10,36,99,0.08)', transition: 'transform 150ms ease, box-shadow 200ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,232,122,0.35)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(10,36,99,0.08)'; }}
        >
          <Plus size={15} strokeWidth={2} /> AI Architect
        </button>
        <AccountMenu user={user} />
      </div>
    </nav>
  );
}
