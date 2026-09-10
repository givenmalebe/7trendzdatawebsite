const LINES = [
  { type: "cmd", text: "7trendz init --product assistant-api" },
  { type: "ok", text: "workflow map .......... 14 automations identified" },
  { type: "ok", text: "model chosen .......... fine-tuned on your data" },
  { type: "ok", text: "api scaffold .......... generated in 9.4s" },
  { type: "ok", text: "full-stack app ........ 12 endpoints wired" },
  { type: "line", text: "────────────────────────────────────────" },
  { type: "result", text: "shipped · monitoring live — models keep learning from real usage" },
]

function Line({ type, text }: { type: string; text: string }) {
  if (type === "cmd") {
    return (
      <p className="text-sky-300">
        <span className="text-slate-500">$ </span>
        <span className="text-sky-200">{text}</span>
      </p>
    )
  }
  if (type === "ok") return <p className="font-mono text-emerald-400">{text}</p>
  if (type === "line") return <p className="font-mono text-slate-700">{text}</p>
  return (
    <p className="font-mono font-bold text-emerald-300">
      <span className="text-emerald-400">✔</span> {text}
    </p>
  )
}

export function DevConsole() {
  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-xl w-full mx-auto">
      <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2 border-b border-slate-800">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs font-mono text-slate-400 truncate">7trendz-development · AI build pipeline</span>
      </div>
      <div className="p-6 space-y-2.5 text-sm font-mono min-h-[320px]">
        <Line type="cmd" text="7trendz init --product assistant-api" />
        {LINES.slice(1).map((l, i) => (
          <Line key={i} type={l.type} text={l.text} />
        ))}
        <div className="flex items-center gap-1 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500">watching production usage to improve the models…</span>
        </div>
      </div>
    </div>
  )
}