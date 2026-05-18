import type { StackTag as StackTagType } from '@/lib/types';

const STACK_COLORS: Record<string, string> = {
  'Python': '#3B82F6',
  'Node.js': '#22C55E',
  'Go': '#06B6D4',
  'React': '#38BDF8',
  'Next.js': '#94A3B8',
  'FastAPI': '#10B981',
  'PostgreSQL': '#6366F1',
  'Redis': '#EF4444',
  'AWS': '#F59E0B',
  'GCP': '#10B981',
  'Docker': '#0EA5E9',
  'Stripe': '#6366F1',
  'Celery': '#22C55E',
  'Airflow': '#3B82F6',
  'SendGrid': '#22C55E',
  'S3': '#F59E0B',
  'ML': '#8B5CF6',
  'BigQuery': '#3B82F6',
  'Vercel': '#94A3B8',
};

export default function StackTag({ tag }: { tag: StackTagType | string }) {
  const color = STACK_COLORS[tag] ?? '#94A3B8';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      background: `${color}18`,
      color,
      border: `1px solid ${color}28`,
    }}>
      {tag}
    </span>
  );
}
