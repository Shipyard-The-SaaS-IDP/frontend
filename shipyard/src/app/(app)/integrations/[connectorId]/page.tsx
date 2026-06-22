'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, AlertCircle, Lock, ExternalLink, Clock, Calendar, Cloud } from 'lucide-react';
import { BrandIcon } from '@/components/integrations/brand-icons';
import { api, ApiError, type ConnectorsResponse, type ConnectorItem, type GithubReposResponse, type GsuiteEventsResponse, type GcpServicesResponse } from '@/lib/api';

function GithubDeepDive({ connectorName }: { connectorName: string }) {
  const [data, setData] = useState<GithubReposResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<GithubReposResponse>('/connectors/github/repos')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load GitHub data.'));
  }, []);

  if (error) return <p style={{ color: '#ff5f57', fontSize: 14 }}>{error}</p>;
  if (!data) return <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading {connectorName} data…</p>;

  return (
    <div>
      <p style={{ fontSize: 13.5, color: '#6B6B6B', margin: '0 0 18px' }}>
        Signed in as <strong style={{ color: '#0A2463' }}>{data.login}</strong> · {data.repos.length} repositories
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.repos.map((r) => (
          <a
            key={r.fullName}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', border: '1px solid #EAEAEA', borderRadius: 12, padding: '14px 16px', textDecoration: 'none', transition: 'border-color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00E87A55'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EAEAEA'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 14.5, color: '#0A2463' }}>{r.name}</span>
              {r.private && <Lock size={12} color="#9a9a9a" />}
              <ExternalLink size={12} color="#9a9a9a" style={{ marginLeft: 'auto' }} />
            </div>
            {r.description && <p style={{ fontSize: 12.5, color: '#6B6B6B', margin: '0 0 8px' }}>{r.description}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#9a9a9a' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{r.language}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={11} /> {r.stars}</span>
              {r.openIssues > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} /> {r.openIssues} open</span>}
              {r.updatedAt && <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>}
            </div>
          </a>
        ))}
        {data.repos.length === 0 && <p style={{ color: '#9a9a9a', fontSize: 13.5 }}>No repositories found.</p>}
      </div>
    </div>
  );
}

function GsuiteDeepDive({ connectorName }: { connectorName: string }) {
  const [data, setData] = useState<GsuiteEventsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<GsuiteEventsResponse>('/connectors/gsuite/events')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load Calendar data.'));
  }, []);

  if (error) return <p style={{ color: '#ff5f57', fontSize: 14 }}>{error}</p>;
  if (!data) return <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading {connectorName} data…</p>;

  return (
    <div>
      <p style={{ fontSize: 13.5, color: '#6B6B6B', margin: '0 0 18px' }}>Next {data.events.length} upcoming events on your primary calendar</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.events.map((e, i) => (
          <a
            key={i}
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #EAEAEA', borderRadius: 12, padding: '12px 16px', textDecoration: 'none', transition: 'border-color 150ms ease' }}
            onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = '#00E87A55'; }}
            onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = '#EAEAEA'; }}
          >
            <Calendar size={14} color="#9a9a9a" />
            <span style={{ fontWeight: 600, fontSize: 14, color: '#0A2463' }}>{e.title}</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9a9a9a' }}>{new Date(e.start).toLocaleString()}</span>
          </a>
        ))}
        {data.events.length === 0 && <p style={{ color: '#9a9a9a', fontSize: 13.5 }}>No upcoming events found.</p>}
      </div>
    </div>
  );
}

function GcpDeepDive({ connectorName }: { connectorName: string }) {
  const [data, setData] = useState<GcpServicesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<GcpServicesResponse>('/connectors/gcp/services')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load GCP data.'));
  }, []);

  if (error) return <p style={{ color: '#ff5f57', fontSize: 14 }}>{error}</p>;
  if (!data) return <p style={{ color: '#9a9a9a', fontSize: 14 }}>Loading {connectorName} data…</p>;

  return (
    <div>
      <p style={{ fontSize: 13.5, color: '#6B6B6B', margin: '0 0 18px' }}>
        Project <strong style={{ color: '#0A2463' }}>{data.projectId}</strong> · {data.services.length} Cloud Run services
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.services.map((s) => (
          <a
            key={s.name}
            href={s.uri || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', border: '1px solid #EAEAEA', borderRadius: 12, padding: '14px 16px', textDecoration: 'none', transition: 'border-color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00E87A55'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EAEAEA'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Cloud size={13} color="#9a9a9a" />
              <span style={{ fontWeight: 600, fontSize: 14.5, color: '#0A2463' }}>{s.name}</span>
              <ExternalLink size={12} color="#9a9a9a" style={{ marginLeft: 'auto' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#9a9a9a' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{s.region}</span>
              {s.updateTime && <span>Updated {new Date(s.updateTime).toLocaleDateString()}</span>}
            </div>
          </a>
        ))}
        {data.services.length === 0 && <p style={{ color: '#9a9a9a', fontSize: 13.5 }}>No Cloud Run services found in this project.</p>}
      </div>
    </div>
  );
}

function GenericConnectedPlaceholder({ name }: { name: string }) {
  return (
    <div style={{ border: '1px dashed #EAEAEA', borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
      <Clock size={22} color="#9a9a9a" style={{ marginBottom: 10 }} />
      <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>
        {name} is connected, but a live data view isn&apos;t built yet — same pattern as GitHub, coming as each integration gets wired up.
      </p>
    </div>
  );
}

export default function ConnectorDetailPage({ params }: { params: Promise<{ connectorId: string }> }) {
  const { connectorId } = use(params);
  const router = useRouter();
  const [connector, setConnector] = useState<ConnectorItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get<ConnectorsResponse>('/connectors').then((res) => {
      const found = res.groups.flatMap((g) => g.items).find((c) => c.id === connectorId);
      if (!found) setNotFound(true);
      else setConnector(found);
    });
  }, [connectorId]);

  if (notFound) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <p style={{ color: '#9a9a9a', fontSize: 15, marginBottom: 16 }}>Unknown integration.</p>
        <button onClick={() => router.push('/integrations')} style={{ cursor: 'pointer', border: '1px solid #EAEAEA', background: '#fff', color: '#0A2463', fontWeight: 600, fontSize: 14, padding: '9px 18px', borderRadius: 10 }}>
          Back to integrations
        </button>
      </div>
    );
  }

  if (!connector) return <div style={{ padding: 32, color: '#6B6B6B', fontSize: 14 }}>Loading…</div>;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 760 }}>
      <button
        onClick={() => router.push('/integrations')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', background: 'none', color: '#6B6B6B', fontSize: 13.5, fontWeight: 500, padding: 0, marginBottom: 20 }}
      >
        <ArrowLeft size={15} /> Back to integrations
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <span style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrandIcon id={connector.id} size={30} />
        </span>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 24, color: '#0A2463', margin: 0 }}>{connector.name}</h1>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: connector.connected ? '#0BA45E' : '#9a9a9a', background: connector.connected ? '#00E87A14' : '#FAFAFA', padding: '3px 9px', borderRadius: 6 }}>
          {connector.connected ? 'Connected' : 'Not connected'}
        </span>
      </div>
      <p style={{ fontSize: 13.5, color: '#6B6B6B', margin: '0 0 28px' }}>{connector.category}</p>

      {connector.connected ? (
        connector.id === 'github' ? <GithubDeepDive connectorName={connector.name} />
        : connector.id === 'gsuite' ? <GsuiteDeepDive connectorName={connector.name} />
        : connector.id === 'gcp' ? <GcpDeepDive connectorName={connector.name} />
        : <GenericConnectedPlaceholder name={connector.name} />
      ) : (
        <div style={{ border: '1px dashed #EAEAEA', borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6B6B6B', margin: '0 0 16px' }}>Connect {connector.name} to see live data here.</p>
          <button onClick={() => router.push('/integrations')} style={{ cursor: 'pointer', border: 'none', background: '#00E87A', color: '#0A2463', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 10 }}>
            Go connect it
          </button>
        </div>
      )}
    </div>
  );
}
