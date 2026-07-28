import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Article",
  description:
    "Read the latest cybersecurity, AI automation, and red teaming insights from 7Trendz Data — South Africa's leading security experts.",
  openGraph: {
    title: "Article | 7Trendz Data",
    description:
      "Read the latest cybersecurity, AI automation, and red teaming insights.",
    url: "https://7trendzdata.com/blog-reader",
    type: "article",
  },
  alternates: {
    canonical: "https://7trendzdata.com/blog",
  },
}

export default function BlogReaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
