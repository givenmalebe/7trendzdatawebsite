import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

const SITE_URL = "https://7trendzdata.com"
const SITE_NAME = "7Trendz Data"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "7Trendz Data — Building the Future with AI in South Africa",
    template: "%s | 7Trendz Data",
  },
  description:
    "7Trendz Data is a South African AI company building intelligent products across security, learning, HR, Web3, and development. From AI red teaming and FutureLearning LMS to AI HR assistant Ask Sarah, we develop apps using AI.",
  keywords: [
    "AI company South Africa",
    "AI red teaming",
    "AI cyber security",
    "AI learning management system",
    "FutureLearning",
    "Ask Sarah AI HR",
    "AI web3 development",
    "smart contract auditing",
    "AI app development",
    "custom AI applications",
    "AI software development Johannesburg",
    "7trendzlearn.co.za",
  ],
  authors: [{ name: "7Trendz Data", url: SITE_URL }],
  creator: "7Trendz Data",
  publisher: "7Trendz Data",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "7Trendz Data — Building the Future with AI in South Africa",
    description:
      "AI products across security, learning, HR, Web3, and development. FutureLearning LMS, Ask Sarah AI HR, AI red teaming, and more.",
    images: [
      {
        url: "/images/7trendz-logo-final.png",
        width: 1200,
        height: 630,
        alt: "7Trendz Data — Building the Future with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7Trendz Data — Building the Future with AI in South Africa",
    description:
      "AI products across security, learning, HR, Web3, and development. FutureLearning LMS, Ask Sarah AI HR, AI red teaming, and more.",
    images: ["/images/7trendz-logo-final.png"],
    creator: "@7trendzdata",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/7trendz-logo-final.png",
    shortcut: "/images/7trendz-logo-final.png",
    apple: "/apple-icon.png",
  },
  verification: {},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/7trendz-logo-final.png`,
    description: "South African AI company building products across security, learning, HR, Web3, and development.",
    slogan: "Building the future with AI",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Johannesburg",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["English"],
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "FutureLearning", description: "AI-powered learning management system at 7trendzlearn.co.za" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ask Sarah", description: "AI HR assistant for onboarding, policy Q&A, and leave management" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Security", description: "AI-powered red teaming, pentesting, and vulnerability analysis" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Web3 Development", description: "Smart contracts, dApps, token engineering and DAO tools built with AI" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Development", description: "Custom AI-powered applications and integration consulting" } },
    ],
  }

  return (
    <html lang="en">
      <head>
        <meta name="msvalidate.01" content="2B5357F930D8CABC758A10E9E75DD6D2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}