'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Play, X, GitFork, GitBranch, Cloud, MessageSquare,
  BookOpen, UserPlus, CheckSquare, ChevronRight,
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { useWorkflowStore } from '@/store/workflows';
import { EXECUTION_LOGS } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

const WorkflowCanvas = dynamic(() => import('@/components/workflows/WorkflowCanvas'), { ssr: false });

const NODE_ICONS: Record<string, React.ElementType> = {
  create_repo: GitFork,
  setup_cicd: GitBranch,
  provision_resource: Cloud,
  register_catalog: BookOpen,
  notify_slack: MessageSquare,
  add_access: UserPlus,
  approval_gate: CheckSquare,
};

const NODE_TYPES_PANEL = [
  { type: 'create_repo', label: 'Create GitHub Repo', icon: GitFork, color: '#F1F5F9' },
  { type: 'setup_cicd', label: 'Setup CI/CD', icon: GitBranch, color: '#6366F1' },
  { type: 'provision_resource', label: 'Provision Cloud Resource', icon: Cloud, color: '#F59E0B' },
  { type: 'register_catalog', label: 'Register in Catalog', icon: BookOpen, color: '#10B981' },
  { type: 'notify_slack', label: 'Notify Slack', icon: MessageSquare, color: '#22C55E' },
  { type: 'add_access', label: 'Add Team Member Access', icon: UserPlus, color: '#38BDF8' },
  { type: 'approval_gate', label: 'Approval Gate', icon: CheckSquare, color: '#F59E0B' },
];

function LogLine({ line, index }: { line: typeof EXECUTION_LOGS[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 500);
    return () => clearTimeout(t);
  }, [index]);

  if (!visible) return null;

  const color = line.type === 'success' ? 'var(--status-healthy)'
    : line.type === 'complete' ? 'var(--status-healthy)'
    : line.type === 'error' ? 'var(--status-down)'
    : 'var(--text-secondary)';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '2px 0',
      animation: 'fadeIn 150ms ease both',
    }}>
      <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12 }}>[{line.time}]</span>
      <span style={{ color, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12 }}>{line.icon} {line.message}</span>
      {'mcp' in line && line.mcp && (
        <span style={{
          fontSize: 10,
          fontFamily: 'var(--font-jetbrains-mono)',
          color: 'var(--brand-400)',
          background: 'var(--brand-glow)',
          border: '1px solid var(--border-brand)',
          borderRadius: 9999,
          padding: '1px 8px',
          flexShrink: 0,
        }}>
          via {line.mcp}
        </span>
      )}
    </div>
  );
}

export default function WorkflowBuilderPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);
  const searchParams = useSearchParams();
  const autoRun = searchParams.get('run') === 'true';

  const { workflows } = useWorkflowStore();
  const workflow = workflows.find((w) => w.id === workflowId);
  if (!workflow) notFound();

  const [isRunning, setIsRunning] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logLines, setLogLines] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = workflow.nodes.find((n) => n.id === selectedNodeId);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setLogOpen(true);
    setLogLines(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setLogLines(count);
      if (count >= EXECUTION_LOGS.length) {
        clearInterval(interval);
        setTimeout(() => setIsRunning(false), 500);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (autoRun) {
      const t = setTimeout(handleRun, 600);
      return () => clearTimeout(t);
    }
  }, [autoRun, handleRun]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        title={workflow.name}
        subtitle={workflow.description}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/workflows" style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
              color: 'var(--text-secondary)', textDecoration: 'none',
              padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)',
            }}>
              <ArrowLeft size={13} /> Back
            </Link>
            <button
              onClick={handleRun}
              disabled={isRunning}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 8,
                background: isRunning ? 'var(--bg-elevated)' : 'var(--brand-500)',
                color: isRunning ? 'var(--text-muted)' : 'white',
                border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 500,
                transition: 'background 150ms',
              }}
            >
              {isRunning
                ? <><span className="animate-spin-slow" style={{ display: 'inline-block' }}>↻</span> Running...</>
                : <><Play size={13} /> Run Workflow</>
              }
            </button>
          </div>
        }
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Node Library */}
        <div style={{
          width: 220,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 4px 8px' }}>
            Node Library
          </p>
          {NODE_TYPES_PANEL.map(({ type, label, icon: Icon, color }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/nodeType', type);
                e.dataTransfer.setData('application/nodeLabel', label);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.09)',
                cursor: 'grab',
                background: '#1A1A24',
                transition: 'border-color 150ms',
                fontSize: 12,
                color: '#94A3B8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                e.currentTarget.style.color = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              <Icon size={14} color={color} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>

        {/* Center: Canvas */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <WorkflowCanvas
            workflow={workflow}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />

          {/* Execution Log */}
          {logOpen && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#08080D',
              borderTop: '1px solid var(--border-default)',
              maxHeight: 260,
              overflow: 'hidden',
              animation: 'slideUp 300ms ease both',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Execution Log</span>
                <button
                  onClick={() => setLogOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: '12px 16px', overflowY: 'auto', maxHeight: 200 }}>
                {EXECUTION_LOGS.slice(0, logLines).map((line, i) => (
                  <LogLine key={i} line={line} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Node Config Panel */}
        {selectedNode && (
          <div style={{
            width: 280,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: 16,
            overflowY: 'auto',
            flexShrink: 0,
            animation: 'fadeIn 150ms ease both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {(() => {
                  const Icon = NODE_ICONS[selectedNode.type] ?? ChevronRight;
                  return <Icon size={16} color="var(--brand-400)" />;
                })()}
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                  {selectedNode.data.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            </div>
            <NodeConfigFields type={selectedNode.type} />
          </div>
        )}
      </div>
    </div>
  );
}

function NodeConfigFields({ type }: { type: string }) {
  const fieldStyle = {
    label: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 },
    input: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 6,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-primary)',
      fontSize: 13,
      outline: 'none',
    },
    group: { marginBottom: 14 },
  };

  if (type === 'create_repo') return (
    <div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Repository Name</label>
        <input style={fieldStyle.input} placeholder="payments-v2" defaultValue="payments-v2" />
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Visibility</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>Private</option>
          <option>Public</option>
        </select>
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Template Repo</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>acme/service-template</option>
          <option>acme/api-template</option>
        </select>
      </div>
    </div>
  );

  if (type === 'setup_cicd') return (
    <div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Provider</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>GitHub Actions</option>
          <option>CircleCI</option>
        </select>
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Trigger Events</label>
        {['push', 'pull_request', 'tag'].map((ev) => (
          <label key={ev} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
            <input type="checkbox" defaultChecked={ev !== 'tag'} />
            {ev}
          </label>
        ))}
      </div>
    </div>
  );

  if (type === 'provision_resource') return (
    <div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Cloud Provider</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>AWS</option>
          <option>GCP</option>
        </select>
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Resource Type</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>EC2</option><option>RDS</option><option>S3</option><option>Lambda</option>
        </select>
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Region</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>us-east-1</option><option>us-west-2</option><option>eu-west-1</option>
        </select>
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Resource Name</label>
        <input style={fieldStyle.input} placeholder="payments-v2-db" defaultValue="payments-v2-db" />
      </div>
    </div>
  );

  if (type === 'notify_slack') return (
    <div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Channel</label>
        <input style={fieldStyle.input} placeholder="#engineering" defaultValue="#engineering" />
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Message Template</label>
        <textarea
          style={{ ...fieldStyle.input, resize: 'vertical', minHeight: 80 }}
          defaultValue="🚀 New service {{service_name}} has been set up and is ready to use!"
        />
      </div>
    </div>
  );

  if (type === 'register_catalog') return (
    <div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Service Name</label>
        <input style={fieldStyle.input} placeholder="Auto-filled from repo name" defaultValue="payments-v2" />
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Tech Stack</label>
        <input style={fieldStyle.input} placeholder="Python, FastAPI, PostgreSQL" />
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Owner</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }}>
          <option>Ana Rodriguez</option><option>Marcus Chen</option><option>Jordan Kim</option>
        </select>
      </div>
    </div>
  );

  if (type === 'approval_gate') return (
    <div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Approvers</label>
        <select style={{ ...fieldStyle.input, cursor: 'pointer' }} multiple size={3}>
          <option>Ana Rodriguez</option><option>Jordan Kim</option><option>Priya Sharma</option>
        </select>
      </div>
      <div style={fieldStyle.group}>
        <label style={fieldStyle.label}>Message to Approvers</label>
        <textarea
          style={{ ...fieldStyle.input, resize: 'vertical', minHeight: 80 }}
          defaultValue="Please approve spinning up a new environment."
        />
      </div>
    </div>
  );

  return (
    <div style={fieldStyle.group}>
      <label style={fieldStyle.label}>Name</label>
      <input style={fieldStyle.input} defaultValue={type} />
    </div>
  );
}
