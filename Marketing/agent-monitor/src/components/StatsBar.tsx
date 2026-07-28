interface StatsBarProps {
  stats: {
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    completedTasks: number;
    totalTokens: number;
    estimatedCost: number;
  };
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'Total Agents', value: stats.totalAgents, icon: '🤖', color: 'var(--accent-blue)' },
    { label: 'Active Now', value: stats.activeAgents, icon: '⚡', color: 'var(--accent-green)' },
    { label: 'Tasks', value: `${stats.completedTasks}/${stats.totalTasks}`, icon: '📋', color: 'var(--accent-purple)' },
    { label: 'Completion', value: stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : '0%', icon: '📊', color: 'var(--accent-orange)' },
    { label: 'Tokens', value: stats.totalTokens > 0 ? `${(stats.totalTokens / 1000).toFixed(1)}k` : '0', icon: '🔤', color: 'var(--accent-cyan)' },
    { label: 'Est. Cost', value: `$${stats.estimatedCost.toFixed(2)}`, icon: '💰', color: 'var(--accent-pink)' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '1px',
      background: 'var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: `${item.color}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>
            {item.icon}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
              {item.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
