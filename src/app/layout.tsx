import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Bebas_Neue, Hanken_Grotesk } from "next/font/google"
import { getBaseURL } from "@lib/util/env"

import "../styles/globals.css"
import React from "react"
import { WebMCPProvider } from "@lib/webmcp/WebMCPProvider"
import { WhatsAppButton } from "@/components/WhatsAppButton"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Kravex | Anime & Game Katanas in Bangladesh",
    template: "%s | Kravex",
  },
  description:
    "Kravex — Bangladesh's premier store for anime and game katana replicas. Shop Zoro, Demon Slayer, Bleach, Naruto, One Piece, Devil May Cry swords and Valorant knives. Wooden, luminous & metal blades delivered across Bangladesh.",
  keywords: [
    "katana shop bd",
    "anime shop bd",
    "katana shop bangladesh",
    "anime shop bangladesh",
    "katana shop in bangladesh",
    "anime shop in bangladesh",
    "buy katana bd",
    "buy katana bangladesh",
    "katana price in bangladesh",
    "anime katana bd",
    "anime katana bangladesh",
    "game katana bangladesh",
    "anime sword shop bangladesh",
    "sword shop bd",
    "katana bd",
    "katana bangladesh",
    "anime store bangladesh",
    "Zoro sword replica bangladesh",
    "Demon Slayer katana bangladesh",
    "Bleach Zanpakuto replica",
    "Naruto sword bangladesh",
    "One Piece katana bd",
    "Devil May Cry Rebellion sword",
    "Valorant knife replica bangladesh",
    "wooden katana bangladesh",
    "metal katana bangladesh",
    "luminous katana bangladesh",
    "Kravex",
    "Kravex Bangladesh",
    "Kravex Collectibles",
  ],
  icons: {
    icon: "/favicon.ico"
  },
  applicationName: "Kravex",
  authors: [{ name: "Kravex" }],
  creator: "Kravex",
  publisher: "Kravex",
  category: "shopping",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Kravex",
    locale: "en_BD",
    type: "website",
    url: getBaseURL(),
    title: "Kravex | Anime & Game Katanas in Bangladesh",
    description:
      "Bangladesh's premier store for anime and game katana replicas. Shop Zoro, Demon Slayer, Bleach, Naruto, One Piece and Valorant blades — delivered across Bangladesh.",
    images: [
      {
        url: "/images/content/kravex-banner.webp",
        width: 1200,
        height: 630,
        alt: "Kravex — Anime & Game Katanas in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kravex | Anime & Game Katanas in Bangladesh",
    description:
      "Bangladesh's premier store for anime and game katana replicas. Delivered across Bangladesh.",
    images: ["/images/content/kravex-banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-hanken",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "OnlineStore"],
        "@id": `${baseUrl}/#organization`,
        name: "Kravex",
        alternateName: [
          "Kravex Bangladesh",
          "Katana Shop BD",
          "Anime Shop BD",
          "Kravex Collectibles",
        ],
        url: baseUrl,
        logo: `${baseUrl}/images/content/kravex-banner.webp`,
        image: `${baseUrl}/images/content/kravex-banner.webp`,
        description:
          "Bangladesh's online katana & anime shop — anime and game blade replicas (Demon Slayer, One Piece, Bleach, Naruto, Valorant) delivered nationwide across BD.",
        slogan: "Bangladesh's anime & game katana shop",
        areaServed: {
          "@type": "Country",
          name: "Bangladesh",
        },
        sameAs: [
          "https://www.instagram.com/kravex_collectibles/",
          "https://www.facebook.com/profile.php?id=61591535542705",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: "Kravex",
        url: baseUrl,
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: "en-BD",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/bd/search?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }

  return (
    <html
      lang="en-BD"
      data-mode="light"
      className={`antialiased ${hankenGrotesk.variable} ${bebasNeue.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main className="relative">{props.children}</main>
        <WhatsAppButton />
        <SpeedInsights />
        <WebMCPProvider />
      </body>
    </html>
  )
}
