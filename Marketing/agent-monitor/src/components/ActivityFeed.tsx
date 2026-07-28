import { ActivityEvent } from '../types';

interface ActivityFeedProps {
  activities: ActivityEvent[];
  selectedAgent: string | null;
}

const EVENT_ICONS: Record<string, { icon: string; color: string }> = {
  tool_call: { icon: '🔧', color: 'var(--accent-blue)' },
  task_start: { icon: '▶️', color: 'var(--accent-green)' },
  task_complete: { icon: '✅', color: 'var(--accent-green)' },
  task_failed: { icon: '❌', color: 'var(--accent-red)' },
  thinking: { icon: '🧠', color: 'var(--accent-purple)' },
  message: { icon: '💬', color: 'var(--accent-cyan)' },
  error: { icon: '⚠️', color: 'var(--accent-red)' },
};

export default function ActivityFeed({ activities, selectedAgent }: ActivityFeedProps) {
  const filtered = selectedAgent
    ? activities.filter(a => a.agentId === selectedAgent)
    : activities;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>📡</span> Live Activity
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {filtered.length} events
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📡</div>
            Waiting for activity...
          </div>
        )}

        {filtered.map((event, i) => {
          const cfg = EVENT_ICONS[event.type] || EVENT_ICONS.message;
          return (
            <div
              key={event.id}
              style={{
                padding: '8px 16px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                animation: i === 0 ? 'slide-in-right 0.3s ease-out' : 'none',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: `${cfg.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: cfg.color }}>{event.agentName}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {event.message}
                </div>
                {event.duration && (
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {event.duration}ms
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
