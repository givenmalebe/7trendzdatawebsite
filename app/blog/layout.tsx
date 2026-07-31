import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Cybersecurity insights, red teaming case studies, vulnerability analysis tips, and defender matching guides from 7Trendz Data — South Africa's leading security experts.",
  openGraph: {
    title: "Blog | 7Trendz Data",
    description:
      "Cybersecurity insights, red teaming case studies, and vulnerability analysis tips.",
    url: "https://7trendzdata.com/blog",
  },
  alternates: {
    canonical: "https://7trendzdata.com/blog",
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
