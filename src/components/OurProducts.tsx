"use client"

import { HttpTypes } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { Carousel } from "@/components/Carousel"
import { LocalizedButtonLink } from "@/components/LocalizedLink"
import ProductPreview from "@modules/products/components/product-preview"
import { withReactQueryProvider } from "@lib/util/react-query"

export type ProductTypeGroup = {
  id: string
  value: string
  products: HttpTypes.StoreProduct[]
}

export const OurProducts = withReactQueryProvider<{
  groups: ProductTypeGroup[]
  className?: string
}>(({ groups, className }) => {
  if (!groups.length) {
    return null
  }

  return (
    <div className={className}>
      <Layout>
        <LayoutColumn>
          <h3 className="text-md md:text-2xl mb-8 md:mb-15">Our Products</h3>
        </LayoutColumn>
      </Layout>

      <div className="flex flex-col">
        {[...groups].reverse().map((group) => (
          <Carousel
            key={group.id}
            autoplay
            className="mb-16 md:mb-28 last:mb-0"
            heading={
              <div className="w-full">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-2xl md:text-3xl">{group.value}</h4>
                  <LocalizedButtonLink
                    href={`/store?type=${encodeURIComponent(group.value)}`}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    See all
                  </LocalizedButtonLink>
                </div>
                <div className="mt-3 h-px w-full bg-black" />
              </div>
            }
          >
            {group.products.map((product) => (
              <div
                key={product.id}
                className="w-[70%] sm:w-[45%] lg:w-1/4 max-w-80 flex-shrink-0"
              >
                <ProductPreview product={product} />
              </div>
            ))}
          </Carousel>
        ))}
      </div>
    </div>
  )
})
