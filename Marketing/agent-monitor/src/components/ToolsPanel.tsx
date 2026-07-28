import { Agent } from '../types';

interface ToolsPanelProps {
  agents: Agent[];
}

const TOOL_INFO: Record<string, { icon: string; category: string }> = {
  web_search: { icon: '🌐', category: 'Research' },
  read_file: { icon: '📖', category: 'File System' },
  write_file: { icon: '✏️', category: 'File System' },
  api_call: { icon: '🔗', category: 'Integration' },
  scrape: { icon: '🕷️', category: 'Research' },
  analyze: { icon: '📊', category: 'Analysis' },
  send_email: { icon: '📧', category: 'Outreach' },
  linkedin_search: { icon: '💼', category: 'Research' },
};

export default function ToolsPanel({ agents }: ToolsPanelProps) {
  const allTools = new Map<string, number>();
  agents.forEach(agent => {
    agent.toolsUsed.forEach(tool => {
      allTools.set(tool, (allTools.get(tool) || 0) + 1);
    });
  });

  const sortedTools = Array.from(allTools.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      padding: '12px 16px',
    }}>
      <h3 style={{
        fontSize: '13px',
        fontWeight: 600,
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: '14px' }}>🔧</span> Tools in Use
      </h3>

      {sortedTools.length === 0 && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '12px 0' }}>
          No tools used yet
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sortedTools.map(([tool, count]) => {
          const info = TOOL_INFO[tool] || { icon: '🔧', category: 'Other' };
          return (
            <div
              key={tool}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>{info.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)' }}>{tool}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{info.category}</div>
                </div>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--accent-blue)',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {count}x
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
