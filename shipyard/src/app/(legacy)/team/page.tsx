'use client';
import { UserPlus } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { TEAM_MEMBERS, SERVICES } from '@/lib/mock-data';

const ROLE_COLORS: Record<string, string> = {
  'Platform Lead': '#6366F1',
  'Backend Engineer': '#10B981',
  'Data Engineer': '#F59E0B',
  'Frontend Engineer': '#38BDF8',
  'CTO': '#8B5CF6',
};

export default function TeamPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Team"
        subtitle={`${TEAM_MEMBERS.length} members`}
        action={
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 8,
            background: 'var(--brand-500)',
            color: 'white',
            border: 'none',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}>
            <UserPlus size={14} /> Invite Member
          </button>
        }
      />

      <main style={{ flex: 1, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {TEAM_MEMBERS.map((member, i) => {
            const ownedServices = SERVICES.filter((s) => s.owner.id === member.id);
            const roleColor = ROLE_COLORS[member.role] ?? '#94A3B8';

            return (
              <div
                key={member.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  animation: `fadeIn 200ms ease ${i * 40}ms both`,
                  transition: 'border-color 150ms, box-shadow 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `${roleColor}20`,
                    border: `2px solid ${roleColor}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 700,
                    color: roleColor,
                    flexShrink: 0,
                  }}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{member.name}</h3>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: roleColor,
                      background: `${roleColor}15`,
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}>
                      {member.role}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{member.email}</div>

                {ownedServices.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Owns {ownedServices.length} service{ownedServices.length > 1 ? 's' : ''}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {ownedServices.map((svc) => (
                        <span key={svc.id} style={{
                          fontSize: 11,
                          color: 'var(--text-secondary)',
                          background: 'var(--bg-elevated)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'var(--font-jetbrains-mono)',
                        }}>
                          {svc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  paddingTop: 12,
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}>
                  Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
