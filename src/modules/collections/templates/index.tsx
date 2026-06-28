import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import { collectionMetadataCustomFieldsSchema } from "@lib/util/collections"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { Layout, LayoutColumn } from "@/components/Layout"
import { getProductTypesList } from "@lib/data/product-types"
import { getRegion } from "@lib/data/regions"

const DragonMark = () => (
  <svg viewBox="0 0 200 210" fill="white" aria-hidden="true">
    <path d="M95 92 C75 78 48 58 22 36 C31 53 40 67 33 82 C22 85 14 95 21 103 C41 96 63 94 79 99 C85 94 91 92 95 92Z" />
    <path d="M105 92 C125 78 152 58 178 36 C169 53 160 67 167 82 C178 85 186 95 179 103 C159 96 137 94 121 99 C115 94 109 92 105 92Z" />
    <path d="M90 90 C87 108 87 130 90 148 C93 152 107 152 110 148 C113 130 113 108 110 90Z" />
    <path d="M91 92 C89 78 90 66 96 58 C98 55 102 55 104 58 C110 66 111 78 109 92Z" />
    <path d="M86 72 C83 60 87 49 97 46 C105 44 114 50 114 60 C114 71 109 77 102 78 C95 79 87 77 86 72Z" />
    <path d="M84 67 C78 62 75 53 82 48 L97 47 C91 52 89 60 92 67Z" />
    <circle cx="104" cy="61" r="3" fill="white" />
    <circle cx="104" cy="61" r="1.5" fill="#0d0d0d" />
    <path d="M91 52 L83 30 L98 50Z" />
    <path d="M109 52 L117 30 L102 50Z" />
    <path d="M100 150 C89 163 86 176 93 186 C97 191 103 191 107 186 C114 176 111 163 100 150Z" />
    <path d="M90 122 C80 130 71 138 65 147 L72 145 C75 139 83 132 89 126Z" />
    <path d="M65 147 L58 155 L66 152 L63 159 L70 152 L72 145Z" />
    <path d="M110 122 C120 130 129 138 135 147 L128 145 C125 139 117 132 111 126Z" />
    <path d="M135 147 L142 155 L134 152 L137 159 L130 152 L128 145Z" />
  </svg>
)

export default async function CollectionTemplate({
  sortBy,
  collection,
  type,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  type?: string[]
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    collection.metadata ?? {}
  )

  const [types, region] = await Promise.all([
    getProductTypesList(0, 100, ["id", "value"]),
    getRegion(countryCode),
  ])

  return (
    <>
      {/* Collection hero banner */}
      <div className="relative overflow-hidden" style={{ background: "#0d0d0d" }}>
        {/* Diagonal texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(255,255,255,0.025) 38px,rgba(255,255,255,0.025) 39px)",
          }}
        />
        {/* Dragon watermark — desktop only */}
        <div
          className="hidden md:flex absolute right-16 top-0 bottom-0 items-center pointer-events-none"
          style={{ opacity: 0.06 }}
        >
          <div className="w-56 h-56">
            <DragonMark />
          </div>
        </div>
        {/* Gold accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, #c9a84c, transparent)" }}
        />
        {/* Content — top padding clears the fixed header, bottom gives breathing room */}
        <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-24 pb-10 md:pt-32 md:pb-14">
          <p
            className="text-white/30 mb-3"
            style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Collection
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
            {collection.title}
          </h1>
          {collectionDetails.success &&
            collectionDetails.data.collection_page_content && (
              <p
                className="text-white/40 mt-4 max-w-lg"
                style={{ fontSize: "0.8rem", lineHeight: 1.6 }}
              >
                {collectionDetails.data.collection_page_content
                  .split("\n")[0]
                  ?.trim()}
              </p>
            )}
        </div>
      </div>

      {collectionDetails.success &&
        ((typeof collectionDetails.data.collection_page_heading === "string" &&
          collectionDetails.data.collection_page_heading.length > 0) ||
          (typeof collectionDetails.data.collection_page_content === "string" &&
            collectionDetails.data.collection_page_content.length > 0)) && (
          <Layout className="mt-12 mb-26 md:mb-36">
            {collectionDetails.data.collection_page_heading && (
              <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
                <h3 className="text-md max-md:mb-6 md:text-2xl">
                  {collectionDetails.data.collection_page_heading}
                </h3>
              </LayoutColumn>
            )}
            {collectionDetails.data.collection_page_content && (
              <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
                <div className="md:text-md md:mt-18 flex flex-col gap-5 md:gap-9">
                  {collectionDetails.data.collection_page_content
                    .split("\n")
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .map((p, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <p key={i}>{p}</p>
                    ))}
                </div>
              </LayoutColumn>
            )}
          </Layout>
        )}
      <div className="pt-8 md:pt-14 pb-16 md:pb-36">
        <RefinementList
          sortBy={sortBy}
          title={collection.title}
          types={Object.fromEntries(
            types.productTypes.map((t) => [t.value, t.value])
          )}
          type={type}
        />
        <Suspense fallback={<SkeletonProductGrid />}>
          {region && (
            <PaginatedProducts
              sortBy={sortBy}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
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
