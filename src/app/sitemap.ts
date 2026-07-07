import { MetadataRoute } from "next"

import { sdk } from "@lib/config"
import { getBaseURL } from "@lib/util/env"
import { getCollectionsList } from "@lib/data/collections"

// Country code used to build canonical, indexable URLs. The storefront is
// region-scoped by path (/[countryCode]/...), so we emit a single canonical
// country to avoid duplicate-content across regions.
const COUNTRY = process.env.NEXT_PUBLIC_DEFAULT_REGION || "bd"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseURL().replace(/\/$/, "")
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/${COUNTRY}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/${COUNTRY}/store`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  let collectionEntries: MetadataRoute.Sitemap = []
  let productEntries: MetadataRoute.Sitemap = []

  try {
    const { collections } = await getCollectionsList(0, 100, [
      "handle",
      "updated_at",
    ])

    collectionEntries = (collections ?? [])
      .filter((c) => c.handle)
      .map((c) => ({
        url: `${base}/${COUNTRY}/collections/${c.handle}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch (error) {
    console.error(
      `sitemap: failed to load collections: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }

  try {
    const limit = 100
    let offset = 0
    const handles: { handle: string; updated_at?: string }[] = []

    // Paginate through the full catalog so every product is indexable.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { products, count } = await sdk.client.fetch<{
        products: { handle?: string; updated_at?: string }[]
        count: number
      }>("/store/products", {
        query: { fields: "handle,updated_at", limit, offset },
        next: { tags: ["products"] },
        cache: "force-cache",
      })

      for (const p of products) {
        if (p.handle) {
          handles.push({ handle: p.handle, updated_at: p.updated_at })
        }
      }

      offset += limit
      if (offset >= count || products.length === 0) {
        break
      }
    }

    productEntries = handles.map((p) => ({
      url: `${base}/${COUNTRY}/products/${p.handle}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error(
      `sitemap: failed to load products: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }

  return [...staticEntries, ...collectionEntries, ...productEntries]
}
