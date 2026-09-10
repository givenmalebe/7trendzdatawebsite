"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, User, Circle } from "lucide-react"

interface ChatMessage {
  role: "user" | "sarah"
  text: string
}

const SAMPLE_QUESTIONS = [
  "How many leave days do I have left?",
  "What's the remote work policy?",
  "How do I request leave?",
  "Who meets me first in onboarding?",
]

const ANSWERS: Record<string, string> = {
  "How many leave days do I have left?": "Let me check your record… You have 14 annual leave days available, plus 2 carried over from last year. You've used 9 so far this calendar year. ",
  "What's the remote work policy?": "You can work remotely up to 3 days a week with manager approval, on-site days are Mon–Tue. Want me to check your specific team's policy?",
  "How do I request leave?": "Easy — just start typing “request leave” in the box below and I'll guide you through it in under a minute. No forms, no follow-up emails.",
  "Who meets me first in onboarding?": "Welcome aboard! Your onboarding checklist: IT setup (done ✓), a meet with your team lead, compliance training, and a 30-minute intro with HR next Tuesday. ",
}

const GREETING: ChatMessage = {
  role: "sarah",
  text: "Hi! I'm Sarah, your AI HR assistant. Ask me about leave balances, policies, or onboarding — in plain language.",
}

export function AskSarahDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  const reply = async (question: string) => {
    if (typing) return
    setMessages((m) => [...m, { role: "user", text: question }])
    setTyping(true)
    await new Promise((r) => setTimeout(r, 900))
    setMessages((m) => [...m, { role: "sarah", text: ANSWERS[question] }])
    setTyping(false)
  }

  const send = () => {
    const q = draft.trim()
    if (!q) return
    setDraft("")
    const matched = Object.keys(ANSWERS).find((k) => q.toLowerCase().includes(k.toLowerCase().split(" ")[0].toLowerCase()))
    reply(matched || Object.keys(ANSWERS)[0])
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-md w-full mx-auto">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ring-2 ring-white/40">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white leading-tight">Sarah</p>
          <p className="flex items-center gap-1.5 text-xs text-violet-100">
            <Circle className="h-2 w-2 fill-emerald-300 text-emerald-300" />
            AI HR Assistant · Online
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 border border-white/20 px-2 py-1 rounded-md">Demo</span>
      </div>

      <div ref={scrollRef} className="h-96 overflow-y-auto bg-gradient-to-b from-slate-50 to-violet-50/40 p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "sarah" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md"
                  : "bg-white text-slate-700 border border-slate-200 rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-3 pt-1 bg-white border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => reply(q)}
              className="text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 hover:border-violet-300 rounded-full px-3 py-1.5 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Sarah anything…"
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 rounded-full px-4 py-2.5 text-sm outline-none transition-colors"
          />
          <button
            onClick={send}
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white flex items-center justify-center shadow-md transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}