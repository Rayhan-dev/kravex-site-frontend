import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { CollectionsSlider } from "@modules/store/components/collections-slider"

import { getCollectionsList } from "@lib/data/collections"
import { getProductTypesList } from "@lib/data/product-types"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { getRegion } from "@lib/data/regions"

const StoreTemplate = async ({
  sortBy,
  collection,
  type,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection?: string[]
  type?: string[]
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page, 10) : 1

  const [collections, types, region] = await Promise.all([
    getCollectionsList(0, 100, ["id", "title", "handle"]),
    getProductTypesList(0, 100, ["id", "value"]),
    getRegion(countryCode),
  ])

  return (
    <>
      {/* Store hero */}
      <div className="relative overflow-hidden" style={{ background: "#0d0d0d" }}>
        {/* Diagonal texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(255,255,255,0.025) 38px,rgba(255,255,255,0.025) 39px)",
          }}
        />
        {/* Gold line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(to right, #c9a84c 0%, transparent 60%)",
          }}
        />
        {/* Content — top padding clears the fixed header */}
        <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-24 pb-10 md:pt-32 md:pb-14">
          <p
            className="text-white/30 mb-3"
            style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Kravex
          </p>
          <h1
            className="text-white"
            style={{
              fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 9vw, 6.5rem)",
              letterSpacing: "0.03em",
              lineHeight: 1,
            }}
          >
            All Blades
          </h1>
          <p
            className="text-white/30 mt-3"
            style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Katanas &middot; Knives &middot; Collectibles
          </p>
        </div>
      </div>

      <div className="py-10 md:py-16 md:pb-36">
        <CollectionsSlider />
        <RefinementList
          collections={Object.fromEntries(
            collections.collections.map((c) => [c.handle, c.title])
          )}
          collection={collection}
          types={Object.fromEntries(
            types.productTypes.map((t) => [t.value, t.value])
          )}
          type={type}
          sortBy={sortBy}
        />
        <Suspense fallback={<SkeletonProductGrid />}>
          {region && (
            <PaginatedProducts
              sortBy={sortBy}
              page={pageNumber}
              countryCode={countryCode}
              collectionId={
                !collection
                  ? undefined
                  : collections.collections
                      .filter((c) => collection.includes(c.handle))
                      .map((c) => c.id)
              }
              typeId={
                !type
                  ? undefined
                  : types.productTypes
                      .filter((t) => type.includes(t.value))
                      .map((t) => t.id)
              }
            />
          )}
        </Suspense>
      </div>
    </>
  )
}

export default StoreTemplate
