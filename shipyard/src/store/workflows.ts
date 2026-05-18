'use client';
import { create } from 'zustand';
import type { Workflow, WorkflowNode, WorkflowEdge } from '@/lib/types';
import { WORKFLOW_TEMPLATES } from '@/lib/mock-data';

interface WorkflowState {
  workflows: Workflow[];
  activeWorkflowId: string | null;
  setActiveWorkflow: (id: string) => void;
  updateNodes: (workflowId: string, nodes: WorkflowNode[]) => void;
  updateEdges: (workflowId: string, edges: WorkflowEdge[]) => void;
  addWorkflow: (workflow: Workflow) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: WORKFLOW_TEMPLATES,
  activeWorkflowId: null,
  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
  updateNodes: (workflowId, nodes) =>
    set((s) => ({
      workflows: s.workflows.map((w) => w.id === workflowId ? { ...w, nodes } : w),
    })),
  updateEdges: (workflowId, edges) =>
    set((s) => ({
      workflows: s.workflows.map((w) => w.id === workflowId ? { ...w, edges } : w),
    })),
  addWorkflow: (workflow) =>
    set((s) => ({ workflows: [...s.workflows, workflow] })),
}));
