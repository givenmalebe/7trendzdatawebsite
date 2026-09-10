import { GraduationCap, UserCheck, ShieldAlert, Boxes, Code2, Brain, BookOpenCheck, BarChart3, Award, MessageSquare, FileText, CalendarClock, HeartHandshake, Bug, Radar, FileSearch, ScanLine, Box, Wallet, Vote, Cpu, Workflow, Layers } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface ProductFeature {
  title: string
  description: string
  icon: LucideIcon
}

export interface Product {
  id: string
  name: string
  tagline: string
  short: string
  description: string
  icon: LucideIcon
  color: string
  gradient: string
  url: string
  externalUrl?: string
  ctaLabel: string
  ctaHref: string
  heroTitle: string
  heroSubtitle: string
  features: ProductFeature[]
  steps: { title: string; description: string }[]
  problem: string
  solution: string
}

export const PRODUCTS: Product[] = [
  {
    id: "futurelearning",
    name: "FutureLearning",
    tagline: "AI-Powered Learning Platform",
    short: "Adaptive learning paths, AI tutoring, and progress analytics at 7trendzlearn.co.za.",
    description:
      "FutureLearning is an AI learning management system that adapts to every learner. It builds personalised study paths, tutors learners in real time, tracks progress automatically, and issues verifiable certificates.",
    icon: GraduationCap,
    color: "bg-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    url: "/products/futurelearning/",
    externalUrl: "https://7trendzlearn.co.za",
    ctaLabel: "Visit FutureLearning",
    ctaHref: "/contact?product=futurelearning",
    heroTitle: "AI-Powered Education at 7trendzlearn.co.za",
    heroSubtitle:
      "A learning management system that learns with you — adaptive paths, always-on AI tutoring, and analytics that show real progress.",
    features: [
      { title: "Adaptive Learning Paths", description: "Courses restructure in real time around each learner's pace, strengths, and gaps.", icon: Brain },
      { title: "AI Tutoring", description: "An always-available tutor explains concepts, answers questions, and quizzes learners.", icon: BookOpenCheck },
      { title: "Progress Analytics", description: "Dashboards surface mastery, drop-off points, and completion trends for educators.", icon: BarChart3 },
      { title: "Certificate Generation", description: "Auto-issued, verifiable certificates on course completion.", icon: Award },
    ],
    steps: [
      { title: "Enrol", description: "Learners join a course and complete a short AI assessment of their current level." },
      { title: "Learn", description: "The AI adapts content, pacing, and practice to each learner in real time." },
      { title: "Certify", description: "Progress is tracked continuously and certificates are issued the moment learners finish." },
    ],
    problem:
      "Traditional LMS platforms treat every learner the same — fixed content, no personalisation, and no real insight into who is actually learning.",
    solution:
      "FutureLearning uses AI to personalise every path, tutor every learner, and give educators the analytics they need to improve outcomes.",
  },
  {
    id: "ask-sarah",
    name: "Ask Sarah",
    tagline: "Your AI HR Assistant",
    short: "Automated onboarding, policy Q&A, leave management, and employee sentiment in one assistant.",
    description:
      "Ask Sarah is an AI HR assistant that handles the repetitive, high-volume parts of HR — onboarding, policy questions, leave requests, and sentiment feedback — so your people team focuses on people.",
    icon: UserCheck,
    color: "bg-violet-600",
    gradient: "from-violet-500 to-purple-600",
    url: "/products/ask-sarah/",
    ctaLabel: "Try Ask Sarah",
    ctaHref: "/contact?product=ask-sarah",
    heroTitle: "Meet Sarah — Your AI HR Assistant",
    heroSubtitle:
      "Sarah answers policy questions, guides onboarding, manages leave, and surfaces employee sentiment around the clock.",
    features: [
      { title: "Automated Onboarding", description: "New hires get a guided, conversational onboarding flow without HR having to repeat it.", icon: FileText },
      { title: "Policy Q&A", description: "Employees ask HR policies in plain language and get accurate, compliant answers instantly.", icon: MessageSquare },
      { title: "Leave Management", description: "Leave requests, balances, and approvals handled conversationally with the right workflow.", icon: CalendarClock },
      { title: "Sentiment Analysis", description: "Anonymous pulse surveys analysed with AI to surface team wellbeing trends early.", icon: HeartHandshake },
    ],
    steps: [
      { title: "Deploy", description: "Point Sarah at your HR policies, org chart, and leave rules — she learns them all." },
      { title: "Interact", description: "Employees message Sarah for onboarding, policies, and leave in plain language." },
      { title: "Improve", description: "HR gets sentiment insights and hand-off queues for anything needing a human touch." },
    ],
    problem:
      "High-volume HR questions repeat constantly — onboarding, policy lookups, and leave requests burn hours of people-team time every week.",
    solution:
      "Ask Sarah automates those workflows with AI, answers instantly in natural language, and hands only the sensitive cases to people.",
  },
  {
    id: "security",
    name: "AI Security",
    tagline: "Red Teaming with AI",
    short: "AI-powered recon, red teaming, pentesting, and vulnerability analysis with defender matching.",
    description:
      "Our AI security products red team your environment at machine speed — autonomous recon agents, AI-driven vulnerability analysis, and transparent reporting that routes every finding to the right defender.",
    icon: ShieldAlert,
    color: "bg-red-600",
    gradient: "from-red-500 to-orange-600",
    url: "/products/security/",
    ctaLabel: "Request Assessment",
    ctaHref: "/contact?product=security",
    heroTitle: "AI-Powered Red Teaming",
    heroSubtitle:
      "Autonomous AI agents find the gaps — pentesting, recon, and vulnerability analysis delivered as a clear report.",
    features: [
      { title: "Automated Vulnerability Scanning", description: "AI-driven scans that find and explain the risks that matter, cutting through scanner noise.", icon: ScanLine },
      { title: "AI-Driven Exploit Analysis", description: "Vulnerabilities are scored and rated for likelihood of exploitation, not just severity.", icon: Bug },
      { title: "Continuous Monitoring", description: "24/7 recon agents map your attack surface and alert on new exposures instantly.", icon: Radar },
      { title: "Detailed Reporting", description: "Every finding documented and routed to the right defender by issue type.", icon: FileSearch },
    ],
    steps: [
      { title: "Assess", description: "AI recon agents map your attack surface and automated scans find live vulnerabilities." },
      { title: "Analyse", description: "AI triage scores findings by severity and exploit likelihood, removing false positives." },
      { title: "Report & Match", description: "You receive a clear report and every finding is routed to a matched defender." },
    ],
    problem:
      "Attackers now use AI at machine speed, and manual pentesting cannot keep up with a growing attack surface.",
    solution:
      "We red team with AI — autonomous recon and analysis find vulnerabilities faster and document them for a clear path to fixing.",
  },
  {
    id: "web3",
    name: "AI Web3 Dev",
    tagline: "Decentralized Apps Built with AI",
    short: "Smart contract auditing, dApps, token engineering, and DAO tooling — built and secured with AI.",
    description:
      "We build Web3 products using AI at every stage — smart contracts written and audited by AI, dApps designed for real users, tokenomics modelled, and DAO governance made easy.",
    icon: Boxes,
    color: "bg-indigo-600",
    gradient: "from-indigo-500 to-blue-600",
    url: "/products/web3/",
    ctaLabel: "Start Your Project",
    ctaHref: "/contact?product=web3",
    heroTitle: "Building Decentralized Futures with AI",
    heroSubtitle:
      "Smart contracts, dApps, token engineering, and DAO tools — designed, built, and audited using AI.",
    features: [
      { title: "Smart Contract Auditing", description: "AI-assisted audit of contracts for vulnerabilities, gas issues, and logic flaws before launch.", icon: ShieldAlert },
      { title: "DApp Development", description: "Full-stack decentralised applications with familiar, human-first interfaces.", icon: Box },
      { title: "Token Engineering", description: "AI-modelled tokenomics — supply, incentives, and governance powers that survive reality.", icon: Wallet },
      { title: "DAO Governance Tools", description: "Voting, treasury, and proposal tooling communities actually want to use.", icon: Vote },
    ],
    steps: [
      { title: "Design", description: "We model your tokenomics and governance with AI before writing a single line." },
      { title: "Build", description: "Contracts and dApp interfaces are built with AI tooling and reviewed by engineers." },
      { title: "Audit & Launch", description: "AI-assisted audits run before launch, then we hand over a product you can scale." },
    ],
    problem:
      "Web3 is slow to build and unforgiving — a single contract bug or bad tokenomics decision can destroy value overnight.",
    solution:
      "We use AI to model, build, and audit Web3 products, closing the gap between idea and a safe launch.",
  },
  {
    id: "development",
    name: "AI Development",
    tagline: "Custom AI-Powered Apps",
    short: "We develop apps using AI — integration consulting, custom models, APIs, and full-stack AI products.",
    description:
      "From AI integration consulting to custom model training and full-stack products, we develop software with AI woven through every layer — shipped fast and built to evolve.",
    icon: Code2,
    color: "bg-sky-600",
    gradient: "from-sky-500 to-blue-700",
    url: "/products/development/",
    ctaLabel: "Discuss Your Project",
    ctaHref: "/contact?product=development",
    heroTitle: "Custom AI Applications Built for You",
    heroSubtitle:
      "We develop apps using AI — from integration consulting to custom models, APIs, and full product builds.",
    features: [
      { title: "AI Integration Consulting", description: "A clear roadmap for where and how AI should improve your product and operations.", icon: Cpu },
      { title: "Custom Model Training", description: "Models fine-tuned on your data for your domain — not a generic one-size-fits-all model.", icon: Brain },
      { title: "API Development", description: "Reliable, secure APIs that turn your AI models into usable product features.", icon: Workflow },
      { title: "Full-Stack AI Apps", description: "Complete applications that put AI in front of your users from day one.", icon: Layers },
    ],
    steps: [
      { title: "Workshop", description: "We map your workflows and identify where AI genuinely moves the needle." },
      { title: "Build", description: "We develop the app with AI-assisted engineering and your team looped in throughout." },
      { title: "Ship & Evolve", description: "We launch, measure, and keep improving the models as your data grows." },
    ],
    problem:
      "Most teams struggle to turn AI enthusiasm into shipped software — they don't know where to start or which model fits their problem.",
    solution:
      "We develop apps using AI end to end — you get a working product, not a pilot deck.",
  },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export const PRODUCT_LIST: { name: string; tagline: string; url: string }[] = PRODUCTS.map((p) => ({
  name: p.name,
  tagline: p.tagline,
  url: p.url,
}))