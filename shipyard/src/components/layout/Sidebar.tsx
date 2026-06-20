'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, Plug, Users, MessageSquare, Newspaper, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Service map', icon: LayoutDashboard },
  { href: '/catalog', label: 'Catalog', icon: Library },
  { href: '/chat', label: 'Agent', icon: MessageSquare },
  { href: '/daily-brief', label: 'Daily Brief', icon: Newspaper },
  { href: '/translator', label: 'Translator', icon: Sparkles },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/team', label: 'Team', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href));

  return (
    <aside
      style={{
        width: 60, minWidth: 60, background: '#FAFAFA', borderRight: '1px solid #EAEAEA',
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: 8,
        height: '100%', flexShrink: 0,
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            style={{
              width: 40, height: 40, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? '#00E87A18' : 'transparent', color: active ? '#0A2463' : '#7E8694',
              transition: 'background 180ms ease, color 180ms ease', textDecoration: 'none',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#EFEFEF'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon size={19} strokeWidth={1.8} />
          </Link>
        );
      })}
    </aside>
  );
}
