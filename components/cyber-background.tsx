interface CyberBackgroundProps {
  variant?: "hero" | "section" | "security"
  className?: string
}

export function CyberBackground({ variant = "hero", className = "" }: CyberBackgroundProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 cyber-grid cyber-grid-fade opacity-60" />

      {variant === "hero" && (
        <>
          <div className="absolute inset-0 bg-cyber-mesh" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-red-500/8 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        </>
      )}

      {variant === "security" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />
        </>
      )}

      {variant === "section" && (
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      )}
    </div>
  )
}
