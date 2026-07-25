import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "7Trendz Data — AI Automation & Red Teaming",
  description:
    "AI automation plus red teaming and vulnerability analysis. We find your security gaps and connect you with the right defender for each issue — pentesting, AI recon agents, and expert referrals.",
  icons: { icon: "/images/7trendz-logo-final.png" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
