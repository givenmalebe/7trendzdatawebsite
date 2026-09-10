import { Bot, CheckCircle2, Lock, Sparkles, TrendingUp, BookOpenCheck } from "lucide-react"

const MODULES = [
  { name: "Foundations of Data", status: "done" as const },
  { name: "Statistics & Probability", status: "done" as const },
  { name: "Machine Learning Basics", status: "progress" as const, mastery: 62 },
  { name: "Capstone Project", status: "locked" as const },
  { name: "Final Assessment", status: "locked" as const },
]

export function LearnDashboard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-xl w-full mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ring-2 ring-white/40">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white leading-tight">Data Analytics Fundamentals</p>
          <p className="flex items-center gap-1.5 text-xs text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            FutureLearning · AI-adapted for you
          </p>
        </div>
        <span className="text-xs font-bold text-white bg-white/10 border border-white/20 rounded-md px-2 py-1">82%</span>
      </div>

      <div className="p-5 space-y-2">
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[82%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
        </div>
        <p className="text-xs text-slate-500 font-medium">82% mastered — on track to certify in 3 weeks</p>
      </div>

      <div className="px-5 pb-2 space-y-2">
        {MODULES.map((m) => (
          <div key={m.name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            {m.status === "done" && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
            {m.status === "progress" && <BookOpenCheck className="h-5 w-5 text-emerald-600 shrink-0" />}
            {m.status === "locked" && <Lock className="h-5 w-5 text-slate-300 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${m.status === "locked" ? "text-slate-400" : "text-slate-800"}`}>{m.name}</p>
              {m.status === "progress" && (
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full w-[62%] bg-emerald-500 rounded-full" />
                </div>
              )}
            </div>
            {m.status === "done" && <span className="text-xs font-bold text-emerald-600">Mastered</span>}
            {m.status === "progress" && <span className="text-xs font-bold text-emerald-600">62%</span>}
            {m.status === "locked" && <span className="text-xs text-slate-400">Locked</span>}
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-slate-100">
        <div className="flex items-start gap-3 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-100 p-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 mb-0.5">AI Tutor</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Great progress! Let&apos;s review hypothesis testing before you start your capstone.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center mt-4">A verifiable certificate is issued the moment you finish.</p>
      </div>
    </div>
  )
}