const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getClientToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)shipyard_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * GitHub's OAuth flow is a real browser navigation, not a fetch — so the
 * Bearer-token pattern apiFetch uses doesn't apply. The shipyard_token
 * travels as a query param instead, which the backend round-trips through
 * GitHub's `state` param back to /connectors/github/callback.
 */
export function getGithubConnectUrl(nextPath: string): string {
  const token = getClientToken() ?? '';
  return `${API_URL}/connectors/github/connect?token=${encodeURIComponent(token)}&next=${encodeURIComponent(nextPath)}`;
}

/**
 * Client-side fetch against the FastAPI backend (a different origin than the
 * frontend, so the shipyard_token cookie can't travel automatically — send it
 * explicitly as a Bearer token instead).
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getClientToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

/** Client-side: fetch the current user. Returns null if not authenticated. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await api.get<AuthUser>('/auth/me');
  } catch {
    return null;
  }
}

// ─── Types matching backend responses ────────────────────────────────────────

export interface ConnectorItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
  connected: boolean;
}
export interface ConnectorGroup {
  category: string;
  items: ConnectorItem[];
}
export interface ConnectorsResponse {
  groups: ConnectorGroup[];
  connectedCount: number;
}

export interface TraceLine {
  icon: string;
  iconColor: string;
  color: string;
  weight?: number;
  text: string;
}

export interface DiscoverResponse {
  trace: TraceLine[];
  serviceCount: number;
  depCount: number;
  services: { name: string; statusColor: string }[];
}

export interface ServiceSummary {
  id: string;
  name: string;
  tags: string[];
  statusColor: string;
  statusLabel: string;
  ownerColor: string;
  ownerInitials: string;
  ownerName: string;
}
export interface ServicesResponse {
  services: ServiceSummary[];
  total: number;
}

export interface ServiceDetail extends ServiceSummary {
  stackStr: string;
  statusBg: string;
  depsStr: string;
  trace: TraceLine[];
}

export interface MapNode {
  name: string;
  left: number;
  top: number;
  w: number;
  delay: number;
  statusColor: string;
  stackStr: string;
  ownerColor: string;
  ownerInitials: string;
  ownerName: string;
}
export interface MapEdge {
  d: string;
  stroke: string;
}
export interface MapResponse {
  nodes: MapNode[];
  edges: MapEdge[];
}

export interface PlanLine {
  color: string;
  text: string;
}
export interface ArchitectResource {
  type: 'github' | 'server' | 'database' | 'queue';
  title: string;
  sub: string;
}
export interface ProposedPlan {
  requestId: string;
  serviceName: string;
  resources: ArchitectResource[];
  planLines: PlanLine[];
}
export interface SendMessageResponse {
  reply: string;
  proposedPlan: ProposedPlan | null;
}
export interface ArchitectChatMessage {
  role: 'user' | 'model' | 'function';
  content: string;
  toolCalls: Array<{ name: string; args?: Record<string, unknown>; result?: unknown }>;
}
export interface SessionResponse {
  messages: ArchitectChatMessage[];
}
