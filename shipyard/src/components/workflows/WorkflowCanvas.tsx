'use client';
import { useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  GitFork, GitBranch, Cloud, BookOpen, MessageSquare, UserPlus, CheckSquare,
} from 'lucide-react';
import type { Workflow, WorkflowNodeData } from '@/lib/types';
import { useWorkflowStore } from '@/store/workflows';

const ICON_MAP: Record<string, React.ElementType> = {
  create_repo: GitFork,
  setup_cicd: GitBranch,
  provision_resource: Cloud,
  register_catalog: BookOpen,
  notify_slack: MessageSquare,
  add_access: UserPlus,
  approval_gate: CheckSquare,
};

const NODE_COLORS: Record<string, string> = {
  create_repo: '#F1F5F9',
  setup_cicd: '#818CF8',
  provision_resource: '#F59E0B',
  register_catalog: '#10B981',
  notify_slack: '#22C55E',
  add_access: '#38BDF8',
  approval_gate: '#F59E0B',
};

const handleStyle = {
  background: '#6366F1',
  border: '2px solid #1A1A24',
  width: 10,
  height: 10,
};

function ShipyardNode({ data, selected }: { data: WorkflowNodeData; selected: boolean }) {
  const Icon = ICON_MAP[data.type] ?? Cloud;
  const color = NODE_COLORS[data.type] ?? '#6366F1';

  return (
    <div style={{
      background: '#1A1A24',
      border: `1px solid ${selected ? '#6366F1' : 'rgba(255,255,255,0.09)'}`,
      borderRadius: 12,
      padding: '10px 14px',
      minWidth: 170,
      cursor: 'pointer',
      boxShadow: selected ? '0 0 20px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.3)' : 'none',
      transition: 'border-color 150ms, box-shadow 150ms',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `${color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={15} color={color} strokeWidth={1.8} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#F1F5F9' }}>{data.label}</div>
        {data.status && data.status !== 'idle' && (
          <div style={{
            fontSize: 10,
            color: data.status === 'complete' ? '#10B981'
              : data.status === 'running' ? '#818CF8'
              : '#EF4444',
            marginTop: 2,
          }}>
            {data.status === 'complete' ? 'Complete'
              : data.status === 'running' ? 'Running...'
              : 'Error'}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
}

const nodeTypes = { default: ShipyardNode };

interface WorkflowCanvasProps {
  workflow: Workflow;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
}

export default function WorkflowCanvas({ workflow, selectedNodeId, onSelectNode }: WorkflowCanvasProps) {
  const { updateNodes, updateEdges } = useWorkflowStore();

  const initialNodes: Node[] = workflow.nodes.map((n) => ({
    id: n.id,
    type: 'default',
    position: n.position,
    data: n.data,
    selected: n.id === selectedNodeId,
  }));

  const initialEdges: Edge[] = workflow.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    style: { stroke: '#475569', strokeWidth: 1.5 },
    type: 'smoothstep',
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, style: { stroke: '#6366F1', strokeWidth: 1.5 }, type: 'smoothstep' }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    onSelectNode(node.id === selectedNodeId ? null : node.id);
  }, [onSelectNode, selectedNodeId]);

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/nodeType');
    const label = e.dataTransfer.getData('application/nodeLabel');
    if (!type) return;

    const bounds = (e.target as HTMLElement).closest('.react-flow')?.getBoundingClientRect();
    if (!bounds) return;

    const position = { x: e.clientX - bounds.left - 85, y: e.clientY - bounds.top - 25 };
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position,
      data: { label, type, icon: type, status: 'idle' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-base)' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.05)"
        />
        <Controls
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
          }}
        />
        <MiniMap
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
          }}
          nodeColor="var(--bg-elevated)"
          maskColor="rgba(0,0,0,0.4)"
        />
      </ReactFlow>
    </div>
  );
}
