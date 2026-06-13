import Sidebar from '@/components/layout/Sidebar';
import { PageTransition } from '@/components/layout/PageTransition';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
