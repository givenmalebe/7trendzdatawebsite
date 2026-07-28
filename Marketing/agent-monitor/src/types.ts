export type AgentStatus = 'working' | 'idle' | 'thinking' | 'error' | 'blocked' | 'offline';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask: string | null;
  lastActive: string;
  tasksCompleted: number;
  tasksFailed: number;
  tokensUsed: number;
  estimatedCost: number;
  toolsUsed: string[];
  avatar: string;
  color: string;
}

export interface ActivityEvent {
  id: string;
  agentId: string;
  agentName: string;
  type: 'tool_call' | 'task_start' | 'task_complete' | 'task_failed' | 'thinking' | 'message' | 'error';
  message: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface Task {
  id: string;
  projectId: string;
  phase: string;
  week: number;
  taskType: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  agentName: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface AgentProject {
  id: number;
  client_id: string;
  client_name: string;
  industry: string;
  website: string;
  status: string;
  phase: string;
  week: number;
  progress: number;
  tasks: Task[];
  leads: unknown[];
  competitors: unknown[];
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  totalTokens: number;
  estimatedCost: number;
  uptime: string;
}
