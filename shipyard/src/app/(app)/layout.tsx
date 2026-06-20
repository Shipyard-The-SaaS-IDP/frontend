import AppTopNav from '@/components/layout/AppTopNav';
import Sidebar from '@/components/layout/Sidebar';
import { PageTransition } from '@/components/layout/PageTransition';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: '#fff' }}>
      <AppTopNav />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
