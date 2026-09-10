const PARTICLES = [
  { left: "8%", top: "72%", size: "h-1 w-1", color: "bg-cyan-400/70", delay: "0s", duration: "12s" },
  { left: "18%", top: "30%", size: "h-1.5 w-1.5", color: "bg-blue-400/60", delay: "2s", duration: "15s" },
  { left: "30%", top: "62%", size: "h-1 w-1", color: "bg-cyan-300/60", delay: "5s", duration: "13s" },
  { left: "42%", top: "20%", size: "h-1 w-1", color: "bg-blue-300/50", delay: "1s", duration: "16s" },
  { left: "55%", top: "74%", size: "h-1.5 w-1.5", color: "bg-cyan-400/50", delay: "7s", duration: "14s" },
  { left: "64%", top: "36%", size: "h-1 w-1", color: "bg-blue-400/60", delay: "3s", duration: "17s" },
  { left: "76%", top: "66%", size: "h-1 w-1", color: "bg-cyan-300/60", delay: "9s", duration: "12s" },
  { left: "88%", top: "26%", size: "h-1.5 w-1.5", color: "bg-blue-300/50", delay: "4s", duration: "15s" },
  { left: "93%", top: "58%", size: "h-1 w-1", color: "bg-cyan-400/60", delay: "6s", duration: "13s" },
]

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 trendz-grid trendz-grid-fade opacity-40 animate-grid-pan" />
      <div className="absolute -top-32 -right-32 h-[440px] w-[440px] rounded-full bg-blue-600/10 blur-3xl animate-orb-drift-a" />
      <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-3xl animate-orb-drift-b" />
      <div className="absolute bottom-0 right-1/4 h-[280px] w-[280px] rounded-full bg-amber-500/5 blur-3xl animate-orb-drift-c" />
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.size} ${p.color} rounded-full animate-particle-drift`}
          style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
        />
      ))}
    </div>
  )
}