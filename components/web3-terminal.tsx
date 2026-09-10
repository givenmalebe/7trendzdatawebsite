import { ShieldCheck } from "lucide-react"

const LINES = [
  { type: "cmd", text: "7trendz ai audit ./contracts/TrendzToken.sol --deep" },
  { type: "ok", text: "[PASS] Reentrancy guard ....................." },
  { type: "ok", text: "[PASS] Integer overflow / underflow .........." },
  { type: "warn", text: "[INFO] Gas optimisation ................... 3 suggestions" },
  { type: "ok", text: "[PASS] Access control / roles .............." },
  { type: "ok", text: "[PASS] Function visibility .................." },
  { type: "ok", text: "[PASS] Token standard (ERC-20) conformance .." },
  { type: "line", text: "────────────────────────────────────────" },
  { type: "result", text: "Audit complete  ·  0 critical  ·  1 medium  ·  3 low  ·  gas report written" },
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
  if (type === "warn") return <p className="font-mono text-amber-300">{text}</p>
  if (type === "line") return <p className="font-mono text-slate-600">{text}</p>
  return (
    <p className="font-mono font-bold text-emerald-300">
      <ShieldCheck className="inline h-4 w-4 mr-1 -mt-0.5" />
      {text}
    </p>
  )
}

export function Web3Terminal() {
  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-xl w-full mx-auto">
      <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2 border-b border-slate-800">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs font-mono text-slate-400 truncate">7trendz-web3 · audit pipeline</span>
      </div>
      <div className="p-6 space-y-2.5 text-sm font-mono min-h-[320px]">
        <Line type="cmd" text="7trendz ai audit ./contracts/TrendzToken.sol" />
        <Line type="line" text="" />
        {LINES.slice(1).map((l, i) => (
          <Line key={i} type={l.type} text={l.text} />
        ))}
        <div className="flex items-center gap-1 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500">watching testnet for live findings…</span>
        </div>
      </div>
    </div>
  )
}