'use client';
import { Bell, Search } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header style={{
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-base)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-sora)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {action}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 8,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-muted)',
          fontSize: 13,
          cursor: 'pointer',
        }}>
          <Search size={14} />
          <span>Search...</span>
          <kbd style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 4,
            padding: '1px 5px',
          }}>⌘K</kbd>
        </button>
        <button style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          position: 'relative',
        }}>
          <Bell size={15} />
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--brand-500)',
          }} />
        </button>
      </div>
    </header>
  );
}
