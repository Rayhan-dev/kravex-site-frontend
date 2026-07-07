import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Katana Shop — All Anime & Game Katanas | Kravex BD",
  description:
    "Browse the full Kravex katana shop — every anime and game katana, sword and knife available in Bangladesh. Demon Slayer, One Piece, Bleach, Naruto & Valorant blades, delivered across BD.",
  keywords: [
    "katana shop bd",
    "anime shop bd",
    "buy katana bangladesh",
    "anime sword shop bangladesh",
    "katana price in bangladesh",
  ],
  alternates: {
    canonical: "/store",
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    collection?: string | string[]
    type?: string | string[]
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page, collection, type } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      collection={
        !collection
          ? undefined
          : Array.isArray(collection)
            ? collection
            : [collection]
      }
      type={!type ? undefined : Array.isArray(type) ? type : [type]}
    />
  )
}
