export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'deploying';

export type StackTag =
  | 'Python' | 'Node.js' | 'Go' | 'React' | 'Next.js'
  | 'FastAPI' | 'PostgreSQL' | 'Redis' | 'AWS' | 'GCP'
  | 'Docker' | 'Stripe' | 'Celery' | 'Airflow' | 'SendGrid'
  | 'S3' | 'ML' | 'BigQuery' | 'Vercel';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedAt: string;
}

export interface Deployment {
  id: string;
  version: string;
  deployedBy: string;
  deployedAt: string;
  status: 'success' | 'failed' | 'in_progress';
  duration: string;
  commit: string;
  message: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  stack: StackTag[];
  owner: TeamMember;
  repoUrl: string;
  docsUrl?: string;
  runbookUrl?: string;
  lastDeployedAt: string;
  lastDeployedBy: string;
  uptime: string;
  latency: string;
  errorRate: string;
  deployments: Deployment[];
  dependencies: string[];
}

export type WorkflowNodeType =
  | 'create_repo'
  | 'setup_cicd'
  | 'provision_resource'
  | 'register_catalog'
  | 'notify_slack'
  | 'add_access'
  | 'approval_gate';

export interface WorkflowNodeData {
  label: string;
  type: WorkflowNodeType;
  icon: string;
  config?: Record<string, unknown>;
  status?: 'idle' | 'running' | 'complete' | 'error';
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  runCount: number;
  lastRunAt: string;
  createdAt: string;
  isTemplate: boolean;
  explanation?: string;
}

export interface ActivityEvent {
  id: string;
  emoji: string;
  message: string;
  timestamp: string;
  relativeTime: string;
  type: 'deploy' | 'workflow' | 'team' | 'alert' | 'integration' | 'catalog';
}

export type IntegrationGroup = 'build' | 'deploy' | 'operate';

export interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'disconnected';
  detail?: string;
  group: IntegrationGroup;
}
