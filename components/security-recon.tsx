const LINES = [
  { type: "cmd", text: "7trendz recon run --full --env prod" },
  { type: "meta", text: "[01:02:03] mapping attack surface ........ 512 exposed hosts" },
  { type: "meta", text: "[01:04:12] scanning services ............ 3,208 endpoints" },
  { type: "crit", text: "[01:05:07] FOUND  open admin panel ........ /admin (critical)" },
  { type: "high", text: "[01:06:45] FOUND  TLS 1.0 enabled ......... prod-gateway (high)" },
  { type: "high", text: "[01:08:19] FOUND  exposed .env backup ..... api.internal (high)" },
  { type: "meta", text: "[01:09:03] triage complete .............. 2 critical / 4 high / 11 low" },
  { type: "line", text: "───────────────────────────────────────" },
  { type: "result", text: "Report written · every finding routed to a matched defender" },
]

function Line({ type, text }: { type: string; text: string }) {
  if (type === "cmd") {
    return (
      <p className="text-rose-300">
        <span className="text-slate-500">$ </span>
        <span className="text-rose-200">{text}</span>
      </p>
    )
  }
  if (type === "meta") return <p className="font-mono text-slate-400">{text}</p>
  if (type === "crit")
    return (
      <p className="font-mono text-red-400">
        <span className="bg-red-500/20 text-red-300 border border-red-500/40 rounded px-1.5 py-0.5 mr-2 text-xs font-bold">CRITICAL</span>
        {text}
      </p>
    )
  if (type === "high")
    return (
      <p className="font-mono text-amber-300">
        <span className="bg-amber-500/20 text-amber-200 border border-amber-500/40 rounded px-1.5 py-0.5 mr-2 text-xs font-bold">HIGH</span>
        {text}
      </p>
    )
  if (type === "line") return <p className="font-mono text-slate-700">{text}</p>
  return (
    <p className="font-mono font-bold text-emerald-300">
      <span className="text-emerald-400">✔</span> {text}
    </p>
  )
}

export function SecurityRecon() {
  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-xl w-full mx-auto">
      <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2 border-b border-slate-800">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs font-mono text-slate-400 truncate">7trendz-security · live recon</span>
      </div>
      <div className="p-6 space-y-2.5 text-sm font-mono min-h-[320px]">
        <Line type="cmd" text="7trendz recon run --full --env prod" />
        {LINES.slice(1).map((l, i) => (
          <Line key={i} type={l.type} text={l.text} />
        ))}
        <div className="flex items-center gap-1 mt-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-xs text-slate-500">continuous monitoring active on testnet mirrors…</span>
        </div>
      </div>
    </div>
  )
}