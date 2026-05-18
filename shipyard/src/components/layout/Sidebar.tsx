'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Library, Zap, Plug, Users, Settings2, Anchor, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/store/ui';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Catalog', icon: Library },
  { href: '/workflows', label: 'Workflows', icon: Zap },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/team', label: 'Team', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 64 : 240,
        minWidth: sidebarCollapsed ? 64 : 240,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width 200ms ease, min-width 200ms ease',
        overflow: 'hidden',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: sidebarCollapsed ? '0 16px' : '0 20px',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'var(--brand-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Anchor size={16} color="white" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span style={{
            fontFamily: 'var(--font-sora)',
            fontWeight: 700,
            fontSize: 16,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
          }}>
            Shipyard
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: sidebarCollapsed ? '9px 14px' : '9px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--brand-glow)' : 'transparent',
                borderLeft: active ? '2px solid var(--brand-500)' : '2px solid transparent',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
                fontWeight: active ? 500 : 400,
                fontSize: 14,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={17} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Link
          href="/settings"
          title={sidebarCollapsed ? 'Settings' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: sidebarCollapsed ? '9px 14px' : '9px 12px',
            borderRadius: 8,
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontSize: 14,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Settings2 size={17} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && 'Settings'}
        </Link>

        {/* User */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: sidebarCollapsed ? '8px 12px' : '8px 12px',
          borderRadius: 8,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--brand-900)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--brand-400)',
            flexShrink: 0,
          }}>
            YO
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>You</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>CTO</div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            gap: 10,
            padding: sidebarCollapsed ? '9px 14px' : '9px 12px',
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 13,
            width: '100%',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
        </button>
      </div>
    </aside>
  );
}
