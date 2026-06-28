import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Bebas_Neue, JetBrains_Mono } from "next/font/google"
import { getBaseURL } from "@lib/util/env"

import "../styles/globals.css"
import React from "react"
import { WebMCPProvider } from "@lib/webmcp/WebMCPProvider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Kravex | Anime & Game Katanas in Bangladesh",
    template: "%s | Kravex",
  },
  description:
    "Kravex — Bangladesh's premier store for anime and game katana replicas. Shop Zoro, Demon Slayer, Bleach, Naruto, One Piece, Devil May Cry swords and Valorant knives. Wooden, luminous & metal blades delivered across Bangladesh.",
  keywords: [
    "anime katana Bangladesh",
    "game katana Bangladesh",
    "buy katana Bangladesh",
    "Zoro sword replica",
    "Demon Slayer katana Bangladesh",
    "Bleach Zanpakuto replica",
    "Naruto sword Bangladesh",
    "One Piece katana",
    "Devil May Cry Rebellion sword",
    "Valorant knife replica Bangladesh",
    "wooden katana Bangladesh",
    "metal katana Bangladesh",
    "luminous katana Bangladesh",
    "Kravex Bangladesh",
    "anime sword shop Bangladesh",
  ],
  openGraph: {
    siteName: "Kravex",
    locale: "en_BD",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

const jetbrainsMono = JetBrains_Mono({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: "variable",
  variable: "--font-jetbrains-mono",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en-BD" data-mode="light" className="antialiased">
      <body className={`${jetbrainsMono.className} ${bebasNeue.variable}`}>
        <main className="relative">{props.children}</main>
        <SpeedInsights />
        <WebMCPProvider />
      </body>
    </html>
  )
}
