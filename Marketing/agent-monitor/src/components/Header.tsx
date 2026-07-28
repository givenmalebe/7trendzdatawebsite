interface HeaderProps {
  connected: boolean;
  lastUpdate: Date;
}

export default function Header({ connected, lastUpdate }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 700,
          boxShadow: '0 2px 12px rgba(79, 143, 255, 0.3)',
        }}>
          C
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Ceety <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Agent Monitor</span>
          </h1>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            7TrendzData AI Sales Engine
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: connected ? 'var(--accent-green)' : 'var(--accent-red)',
            boxShadow: connected ? '0 0 8px var(--accent-green)' : '0 0 8px var(--accent-red)',
            animation: connected ? 'pulse-glow 2s ease-in-out infinite' : 'none',
          }} />
          {connected ? 'Connected' : 'Reconnecting...'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}
