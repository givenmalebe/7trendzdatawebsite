import { Agent, AgentStatus } from '../types';

interface AgentCardProps {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
}

const STATUS_CONFIG: Record<AgentStatus, { color: string; glow: string; label: string; pulse: boolean }> = {
  working: { color: 'var(--accent-green)', glow: 'var(--glow-green)', label: 'Working', pulse: true },
  thinking: { color: 'var(--accent-blue)', glow: 'var(--glow-blue)', label: 'Thinking', pulse: true },
  idle: { color: 'var(--text-muted)', glow: 'transparent', label: 'Idle', pulse: false },
  error: { color: 'var(--accent-red)', glow: 'var(--glow-red)', label: 'Error', pulse: true },
  blocked: { color: 'var(--accent-orange)', glow: 'var(--glow-orange)', label: 'Blocked', pulse: true },
  offline: { color: 'var(--text-muted)', glow: 'transparent', label: 'Offline', pulse: false },
};

export default function AgentCard({ agent, selected, onClick }: AgentCardProps) {
  const statusCfg = STATUS_CONFIG[agent.status];

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${selected ? agent.color : 'var(--border)'}`,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected ? `0 0 20px ${agent.color}22` : 'none',
      }}
    >
      {/* Status glow background */}
      {agent.status === 'working' && (
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, ${agent.color}08 0%, transparent 70%)`,
          animation: 'pulse-glow 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Top row: avatar + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${agent.color}18`,
            border: `1px solid ${agent.color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            position: 'relative',
          }}>
            {agent.avatar}
            {/* Status dot */}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: statusCfg.color,
              border: '2px solid var(--bg-card)',
              boxShadow: statusCfg.pulse ? `0 0 6px ${statusCfg.color}` : 'none',
              animation: statusCfg.pulse ? 'pulse-glow 2s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{agent.role}</div>
          </div>
        </div>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: statusCfg.color,
          background: statusCfg.glow,
          padding: '3px 8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <div style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: statusCfg.color,
            animation: statusCfg.pulse ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
          }} />
          {statusCfg.label}
        </div>
      </div>

      {/* Current task */}
      {agent.currentTask && (
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          padding: '8px 10px',
          marginBottom: '12px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          borderLeft: `3px solid ${agent.color}`,
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Task
          </div>
          {agent.currentTask}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-green)' }}>{agent.tasksCompleted}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Done</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-orange)' }}>{agent.tasksFailed}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Failed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-blue)' }}>{agent.toolsUsed.length}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Tools</div>
        </div>
      </div>

      {/* Activity indicator */}
      {agent.status === 'working' && (
        <div style={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--accent-green)',
        }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          Processing...
        </div>
      )}
    </div>
  );
}
