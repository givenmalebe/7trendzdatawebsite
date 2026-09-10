export function CorporateBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 trendz-grid trendz-grid-fade opacity-40" />
      <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute top-1/3 -left-32 h-[340px] w-[340px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-[260px] w-[260px] rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute left-1/4 top-1/2 h-1 w-1 rounded-full bg-cyan-400/60 animate-pulse" />
      <div className="absolute left-2/3 top-1/3 h-1.5 w-1.5 rounded-full bg-blue-400/50 animate-pulse [animation-delay:1s]" />
      <div className="absolute right-1/4 bottom-1/3 h-1 w-1 rounded-full bg-cyan-300/50 animate-pulse [animation-delay:2s]" />
      <div className="absolute left-1/2 bottom-1/4 h-1.5 w-1.5 rounded-full bg-blue-300/40 animate-pulse [animation-delay:3s]" />
    </div>
  )
}