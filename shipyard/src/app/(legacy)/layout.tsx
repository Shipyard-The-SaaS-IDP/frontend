import LegacySidebar from '@/components/layout/LegacySidebar';
import { PageTransition } from '@/components/layout/PageTransition';

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <LegacySidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
