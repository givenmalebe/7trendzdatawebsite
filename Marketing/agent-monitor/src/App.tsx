import { useState, useEffect, useCallback } from 'react';
import { Agent, ActivityEvent, Task, AgentStatus } from './types';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import ActivityFeed from './components/ActivityFeed';
import TaskPipeline from './components/TaskPipeline';
import StatsBar from './components/StatsBar';
import ToolsPanel from './components/ToolsPanel';

const API_BASE = '/api';

const AGENT_COLORS: Record<string, string> = {
  'Research Agent': '#4f8fff',
  'Strategy Agent': '#8b5cf6',
  'Lead Agent': '#22c55e',
  'Copy Agent': '#f59e0b',
  'Outreach Agent': '#06b6d4',
  'Sales Agent': '#ec4899',
  'Ops Agent': '#ef4444',
};

const AGENT_ICONS: Record<string, string> = {
  'Research Agent': '🔍',
  'Strategy Agent': '🧠',
  'Lead Agent': '🎯',
  'Copy Agent': '✍️',
  'Outreach Agent': '📧',
  'Sales Agent': '💰',
  'Ops Agent': '⚙️',
};

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<unknown[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/agents/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        updateAgentsFromProjects(data);
      }
    } catch (e) {
      console.log('Fetching projects...');
    }
  }, []);

  const updateAgentsFromProjects = (projectList: unknown[]) => {
    const agentMap = new Map<string, Agent>();
    const allTasks: Task[] = [];

    for (const proj of projectList as { tasks: Task[]; client_name: string; phase: string; week: number; progress: number }[]) {
      for (const task of proj.tasks) {
        allTasks.push(task);

        const agentName = task.agentName || 'Unknown Agent';
        if (!agentMap.has(agentName)) {
          agentMap.set(agentName, {
            id: agentName.replace(/\s+/g, '-').toLowerCase(),
            name: agentName,
            role: getAgentRole(agentName),
            status: 'idle',
            currentTask: null,
            lastActive: new Date().toISOString(),
            tasksCompleted: 0,
            tasksFailed: 0,
            tokensUsed: 0,
            estimatedCost: 0,
            toolsUsed: [],
            avatar: AGENT_ICONS[agentName] || '🤖',
            color: AGENT_COLORS[agentName] || '#666',
          });
        }

        const agent = agentMap.get(agentName)!;
        if (task.status === 'completed') agent.tasksCompleted++;
        if (task.status === 'failed') agent.tasksFailed++;
        if (task.status === 'in_progress') {
          agent.status = 'working';
          agent.currentTask = task.title;
          agent.lastActive = task.startedAt || new Date().toISOString();
        }
      }
    }

    setAgents(Array.from(agentMap.values()));
    setTasks(allTasks);
  };

  const getAgentRole = (name: string): string => {
    const roles: Record<string, string> = {
      'Research Agent': 'Data Research & Analysis',
      'Strategy Agent': 'Strategic Planning',
      'Lead Agent': 'Lead Generation & Scoring',
      'Copy Agent': 'Content & Copywriting',
      'Outreach Agent': 'Multi-Channel Outreach',
      'Sales Agent': 'Sales & Closing',
      'Ops Agent': 'Operations & CRM',
    };
    return roles[name] || 'General Agent';
  };

  const simulateActivity = useCallback(() => {
    const agentNames = Object.keys(AGENT_COLORS);
    const toolCalls = ['web_search', 'read_file', 'write_file', 'api_call', 'scrape', 'analyze', 'send_email', 'linkedin_search'];
    const statuses: AgentStatus[] = ['working', 'thinking', 'idle', 'working', 'working'];

    const randomAgent = agentNames[Math.floor(Math.random() * agentNames.length)];
    const randomTool = toolCalls[Math.floor(Math.random() * toolCalls.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const event: ActivityEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      agentId: randomAgent.replace(/\s+/g, '-').toLowerCase(),
      agentName: randomAgent,
      type: randomStatus === 'working' ? 'tool_call' : randomStatus === 'thinking' ? 'thinking' : 'message',
      message: randomStatus === 'working'
        ? `Calling ${randomTool}...`
        : randomStatus === 'thinking'
        ? 'Analyzing results...'
        : 'Waiting for next task',
      timestamp: new Date().toISOString(),
      duration: Math.floor(Math.random() * 5000),
    };

    setActivities(prev => [event, ...prev].slice(0, 50));
    setLastUpdate(new Date());

    setAgents(prev => prev.map(a =>
      a.name === randomAgent
        ? { ...a, status: randomStatus, lastActive: new Date().toISOString(), toolsUsed: [...new Set([...a.toolsUsed, randomTool])] }
        : a
    ));
  }, []);

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  }, [fetchProjects]);

  useEffect(() => {
    const interval = setInterval(simulateActivity, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [simulateActivity]);

  useEffect(() => {
    const timer = setTimeout(() => setConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgents = selectedAgent
    ? agents.filter(a => a.id === selectedAgent)
    : agents;

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'working' || a.status === 'thinking').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    totalTokens: agents.reduce((sum, a) => sum + a.tokensUsed, 0),
    estimatedCost: agents.reduce((sum, a) => sum + a.estimatedCost, 0),
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header connected={connected} lastUpdate={lastUpdate} />
      <StatsBar stats={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '0', minHeight: 'calc(100vh - 180px)' }}>
        {/* Main Content */}
        <div style={{ padding: '20px 24px', overflow: 'auto' }}>
          {/* Agent Grid */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🤖</span> AI Agents
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {stats.activeAgents}/{stats.totalAgents} active
                </span>
              </h2>
              {selectedAgent && (
                <button
                  onClick={() => setSelectedAgent(null)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Show All
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filteredAgents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgent === agent.id}
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                />
              ))}
              {agents.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px dashed var(--border)',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>No agents running</div>
                  <div style={{ fontSize: '13px' }}>Add a client in the Sales Tracker to launch AI agents</div>
                </div>
              )}
            </div>
          </div>

          {/* Task Pipeline */}
          <TaskPipeline tasks={tasks} selectedAgent={selectedAgent} />
        </div>

        {/* Sidebar */}
        <div style={{
          borderLeft: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <ActivityFeed activities={activities} selectedAgent={selectedAgent} />
          <ToolsPanel agents={agents} />
        </div>
      </div>
    </div>
  );
}

export default App;
