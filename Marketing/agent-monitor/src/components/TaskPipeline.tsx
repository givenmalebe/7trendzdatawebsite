import { Task } from '../types';

interface TaskPipelineProps {
  tasks: Task[];
  selectedAgent: string | null;
}

const PHASE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  research: { color: 'var(--accent-blue)', icon: '🔍', label: 'Research & Analysis' },
  lead_gen: { color: 'var(--accent-green)', icon: '🎯', label: 'Lead Generation' },
  outreach: { color: 'var(--accent-purple)', icon: '📧', label: 'Outreach & Email' },
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--text-muted)',
  in_progress: 'var(--accent-orange)',
  completed: 'var(--accent-green)',
  failed: 'var(--accent-red)',
};

export default function TaskPipeline({ tasks, selectedAgent }: TaskPipelineProps) {
  const filtered = selectedAgent
    ? tasks.filter(t => t.agentName?.replace(/\s+/g, '-').toLowerCase() === selectedAgent)
    : tasks;

  const phases = ['research', 'lead_gen', 'outreach'];

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>📋</span> Task Pipeline
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
          {filtered.filter(t => t.status === 'completed').length}/{filtered.length} completed
        </span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {phases.map(phase => {
          const cfg = PHASE_CONFIG[phase];
          const phaseTasks = filtered.filter(t => t.phase === phase);
          const completed = phaseTasks.filter(t => t.status === 'completed').length;
          const total = phaseTasks.length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={phase} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {/* Phase header */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border)',
                background: `${cfg.color}08`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{cfg.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {completed}/{total}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: '3px',
                  background: 'var(--bg-primary)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: cfg.color,
                    borderRadius: '2px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Tasks */}
              <div style={{ padding: '8px', maxHeight: '300px', overflow: 'auto' }}>
                {phaseTasks.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                    No tasks yet
                  </div>
                )}
                {phaseTasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      marginBottom: '4px',
                      background: task.status === 'in_progress' ? `${STATUS_COLORS[task.status]}08` : 'transparent',
                      borderLeft: `3px solid ${STATUS_COLORS[task.status]}`,
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {task.title}
                      </span>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: STATUS_COLORS[task.status],
                        letterSpacing: '0.05em',
                      }}>
                        {task.status === 'in_progress' ? '▶ Running' : task.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {task.agentName} · Week {task.week}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
