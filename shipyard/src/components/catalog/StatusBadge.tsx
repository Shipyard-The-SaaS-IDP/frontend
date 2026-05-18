import type { ServiceStatus } from '@/lib/types';

const CONFIG: Record<ServiceStatus, { label: string; color: string; bg: string }> = {
  healthy:   { label: 'Healthy',   color: 'var(--status-healthy)',   bg: 'var(--status-healthy-bg)' },
  degraded:  { label: 'Degraded',  color: 'var(--status-degraded)',  bg: 'var(--status-degraded-bg)' },
  down:      { label: 'Down',      color: 'var(--status-down)',      bg: 'var(--status-down-bg)' },
  deploying: { label: 'Deploying', color: 'var(--status-deploying)', bg: 'var(--status-deploying-bg)' },
};

export default function StatusBadge({ status }: { status: ServiceStatus }) {
  const { label, color, bg } = CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 500,
      background: bg,
      color,
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        flexShrink: 0,
        animation: status === 'deploying' ? 'pulse-dot 1.5s ease-in-out infinite' : undefined,
      }} />
      {label}
    </span>
  );
}
