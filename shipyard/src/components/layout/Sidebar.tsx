'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Library, Plug, Sparkles, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/ui';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Catalog', icon: Library },
  { href: '/architect', label: 'AI Architect', icon: Sparkles },
  { href: '/scorecards', label: 'Scorecards', icon: BarChart3 },
  { href: '/integrations', label: 'Integrations', icon: Plug },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const isActive = (href: string) => (href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href));

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 60 : 200, minWidth: sidebarCollapsed ? 60 : 200, background: '#FAFAFA',
        borderRight: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column',
        padding: '16px 0', gap: 2, height: '100%', flexShrink: 0, transition: 'width 180ms ease, min-width 180ms ease',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, height: 40,
                padding: sidebarCollapsed ? 0 : '0 10px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: 11, background: active ? '#00E87A18' : 'transparent', color: active ? '#0A2463' : '#7E8694',
                transition: 'background 180ms ease, color 180ms ease', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#EFEFEF'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={19} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 500 }}>{label}</span>}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: '0 10px' }}>
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, height: 36, width: '100%',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: sidebarCollapsed ? 0 : '0 10px',
            borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: '#9a9a9a', fontSize: 13,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#EFEFEF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {sidebarCollapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /> Collapse</>}
        </button>
      </div>
    </aside>
  );
}
