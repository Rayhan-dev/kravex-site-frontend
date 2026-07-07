import { Metadata } from "next"
import { notFound } from "next/navigation"

import { sdk } from "@lib/config"
import { getRegion, listRegions } from "@lib/data/regions"
import {
  getProductByHandle,
  getProductFashionDataByHandle,
} from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { getBaseURL } from "@lib/util/env"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )

    if (!countryCodes) {
      return []
    }

    const { products } = await sdk.store.product.list(
      { fields: "handle" },
      { next: { tags: ["products"] } }
    )

    const staticParams = countryCodes
      ?.map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((product) => product.handle)

    return staticParams
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  const description =
    product.description ||
    product.subtitle ||
    `Buy ${product.title} at Kravex — authentic anime & game blade replicas delivered across Bangladesh.`

  const title = `${product.title} | Kravex`
  const canonical = `/${countryCode}/products/${handle}`
  const images = product.thumbnail ? [product.thumbnail] : []

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const [pricedProduct, fashionData] = await Promise.all([
    getProductByHandle(handle, region.id),
    getProductFashionDataByHandle(handle),
  ])

  if (!pricedProduct) {
    notFound()
  }

  const { cheapestPrice } = getProductPrice({ product: pricedProduct })
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const productUrl = `${baseUrl}/${countryCode}/products/${handle}`
  const inStock = pricedProduct.variants?.some(
    (v) =>
      typeof v.inventory_quantity !== "number" || v.inventory_quantity > 0
  )

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pricedProduct.title,
    description:
      pricedProduct.description ||
      pricedProduct.subtitle ||
      pricedProduct.title,
    image: pricedProduct.images?.length
      ? pricedProduct.images.map((i) => i.url)
      : pricedProduct.thumbnail
        ? [pricedProduct.thumbnail]
        : undefined,
    sku: pricedProduct.variants?.[0]?.sku ?? undefined,
    brand: { "@type": "Brand", name: "Kravex" },
    url: productUrl,
    ...(cheapestPrice
      ? {
          offers: {
            "@type": "Offer",
            url: productUrl,
            price: cheapestPrice.calculated_price_number,
            priceCurrency: cheapestPrice.currency_code?.toUpperCase(),
            availability: inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: "Kravex" },
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        materials={fashionData.materials}
        region={region}
        countryCode={countryCode}
      />
    </>
  )
}
