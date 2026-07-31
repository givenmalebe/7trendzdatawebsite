import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

const SITE_URL = "https://7trendzdata.com"
const SITE_NAME = "7Trendz Data"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "7Trendz Data — Cybersecurity & Red Teaming in South Africa",
    template: "%s | 7Trendz Data",
  },
  description:
    "South Africa's leading cybersecurity red teaming company. We identify security vulnerabilities through penetration testing and deliver pentesting reports priced by severity — then connect you with the right defender.",
  keywords: [
    "red teaming South Africa",
    "cybersecurity South Africa",
    "penetration testing",
    "pentesting report",
    "vulnerability assessment",
    "defender matching",
    "security consulting Johannesburg",
    "ethical hacking South Africa",
    "red team assessment",
    "cyber security services",
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
    title: "7Trendz Data — Cybersecurity & Red Teaming in South Africa",
    description:
      "South Africa's leading cybersecurity red teaming company. We identify security vulnerabilities through penetration testing and deliver pentesting reports priced by severity.",
    images: [
      {
        url: "/images/7trendz-logo-final.png",
        width: 1200,
        height: 630,
        alt: "7Trendz Data — Cybersecurity & Red Teaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7Trendz Data — Cybersecurity & Red Teaming in South Africa",
    description:
      "South Africa's leading cybersecurity red teaming company. We identify security vulnerabilities through penetration testing and deliver pentesting reports priced by severity.",
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
    description:
      "South Africa's leading cybersecurity red teaming company.",
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
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pentesting Report — Low Vulnerability",
          description: "Pentesting report covering low-severity findings.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pentesting Report — Medium Vulnerability",
          description: "Pentesting report covering medium-severity findings.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pentesting Report — High Vulnerability",
          description: "Pentesting report covering high-severity findings.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pentesting Report — Critical Vulnerability",
          description: "Pentesting report covering critical-severity findings.",
        },
      },
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
