'use client';
import { useState } from 'react';
import {
  GitFork, Cloud, MessageSquare, Triangle, Bell, Activity, Layers,
  CheckCircle2, Link as LinkIcon, X,
  Box, Heart, Bot, Wand2, PenTool, Database, Mail, Briefcase,
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { INTEGRATIONS } from '@/lib/mock-data';
import type { IntegrationGroup } from '@/lib/types';

const LOGO_MAP: Record<string, React.ElementType> = {
  Github: GitFork, Cloud, MessageSquare, Triangle, Bell, Activity, Layers,
  Box, Heart, Bot, Wand2, Figma: PenTool, Database, Mail, Briefcase,
};

const GROUPS: { id: IntegrationGroup; title: string; subtitle: string }[] = [
  { id: 'build', title: 'Build tools', subtitle: 'Where your app comes from' },
  { id: 'deploy', title: 'Deploy targets', subtitle: 'Where Shipyard ships your infrastructure' },
  { id: 'operate', title: 'Operate', subtitle: 'Run your venture day to day' },
];

function ConnectModal({ name, onClose, onConnected }: {
  name: string;
  onClose: () => void;
  onConnected: () => void;
}) {
  const [step, setStep] = useState<'prompt' | 'connecting' | 'done'>('prompt');

  const handleConnect = async () => {
    setStep('connecting');
    await new Promise((r) => setTimeout(r, 1500));
    setStep('done');
    setTimeout(() => {
      onConnected();
      onClose();
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeIn 150ms ease both',
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 16,
          padding: 28,
          width: 380,
          boxShadow: 'var(--shadow-modal)',
          animation: 'fadeInUp 200ms ease both',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Connect {name}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {step === 'prompt' && (
          <>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              You'll be redirected to {name} to authorize Shipyard. This is a secure OAuth connection.
            </p>
            <button
              onClick={handleConnect}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                background: 'var(--brand-500)',
                border: 'none',
                color: 'white',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Connect with {name}
            </button>
          </>
        )}

        {step === 'connecting' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3px solid var(--brand-500)',
              borderTop: '3px solid transparent',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }} />
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Connecting to {name}...</p>
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={40} color="var(--status-healthy)" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 14, color: 'var(--status-healthy)', fontWeight: 500 }}>Connected!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const connecting = integrations.find((i) => i.id === connectingId);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="MCP & Integrations"
        subtitle="Connect the tools you're already using to build, ship, and run your venture"
      />

      <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {GROUPS.map((group) => (
        <section key={group.id}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{group.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{group.subtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {integrations.filter((intg) => intg.group === group.id).map((intg, i) => {
            const Logo = LOGO_MAP[intg.logo] ?? LinkIcon;
            const connected = intg.status === 'connected';

            return (
              <div
                key={intg.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : 'var(--border-default)'}`,
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  animation: `fadeIn 200ms ease ${i * 30}ms both`,
                  transition: 'border-color 150ms, box-shadow 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Logo size={20} color={connected ? 'var(--text-primary)' : 'var(--text-muted)'} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{intg.name}</h3>
                      {connected && intg.detail && (
                        <span style={{ fontSize: 12, color: 'var(--status-healthy)' }}>{intg.detail}</span>
                      )}
                    </div>
                  </div>
                  {connected ? (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--status-healthy)',
                      background: 'var(--status-healthy-bg)',
                      padding: '3px 10px',
                      borderRadius: 9999,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--status-healthy)', display: 'inline-block' }} />
                      Connected
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-elevated)',
                      padding: '3px 10px',
                      borderRadius: 9999,
                    }}>
                      Not connected
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {intg.description}
                </p>

                {connected ? (
                  <button
                    onClick={() => setIntegrations((prev) => prev.map((p) => p.id === intg.id ? { ...p, status: 'disconnected' as const, detail: undefined } : p))}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 6,
                      background: 'transparent',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-muted)',
                      fontSize: 12,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setConnectingId(intg.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 6,
                      background: 'var(--brand-500)',
                      border: 'none',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-400)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand-500)'; }}
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
          </div>
        </section>
        ))}
      </main>

      {connecting && (
        <ConnectModal
          name={connecting.name}
          onClose={() => setConnectingId(null)}
          onConnected={() => {
            setIntegrations((prev) =>
              prev.map((p) => p.id === connectingId ? { ...p, status: 'connected' as const, detail: 'Connected' } : p)
            );
            setConnectingId(null);
          }}
        />
      )}
    </div>
  );
}
