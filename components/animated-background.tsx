const PARTICLES = [
  { left: "8%", top: "72%", size: "h-1.5 w-1.5", color: "bg-cyan-400/90", delay: "0s", duration: "9s" },
  { left: "18%", top: "30%", size: "h-2 w-2", color: "bg-blue-400/80", delay: "2s", duration: "11s" },
  { left: "30%", top: "62%", size: "h-1.5 w-1.5", color: "bg-cyan-300/80", delay: "4s", duration: "10s" },
  { left: "42%", top: "20%", size: "h-1.5 w-1.5", color: "bg-blue-300/70", delay: "1s", duration: "12s" },
  { left: "55%", top: "74%", size: "h-2 w-2", color: "bg-cyan-400/80", delay: "6s", duration: "9s" },
  { left: "64%", top: "36%", size: "h-1.5 w-1.5", color: "bg-blue-400/80", delay: "3s", duration: "12s" },
  { left: "76%", top: "66%", size: "h-1.5 w-1.5", color: "bg-cyan-300/80", delay: "7s", duration: "10s" },
  { left: "88%", top: "26%", size: "h-2 w-2", color: "bg-blue-300/70", delay: "5s", duration: "11s" },
  { left: "93%", top: "58%", size: "h-1.5 w-1.5", color: "bg-cyan-400/90", delay: "8s", duration: "9s" },
]

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 trendz-grid trendz-grid-fade opacity-50 animate-grid-pan" />
      <div
        className="absolute -inset-[20%] animate-aurora-sweep"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 30%, rgba(34,211,238,0.22) 45%, rgba(59,130,246,0.18) 55%, transparent 70%)",
          backgroundSize: "250% 250%",
        }}
      />
      <div className="absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full bg-blue-600/15 blur-3xl animate-orb-drift-a" />
      <div className="absolute top-1/3 -left-32 h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-3xl animate-orb-drift-b" />
      <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-3xl animate-orb-drift-c" />
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