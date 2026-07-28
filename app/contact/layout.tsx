import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with 7Trendz Data for cybersecurity red teaming, AI automation, and penetration testing services. Book a consultation in Johannesburg, South Africa.",
  openGraph: {
    title: "Contact Us | 7Trendz Data",
    description:
      "Get in touch for cybersecurity red teaming, AI automation, and penetration testing services.",
    url: "https://7trendzdata.com/contact",
  },
  alternates: {
    canonical: "https://7trendzdata.com/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
