"use client"

import { HttpTypes } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"
import ProductPreview from "@modules/products/components/product-preview"
import { withReactQueryProvider } from "@lib/util/react-query"

export const RecentlyAddedProducts = withReactQueryProvider<{
  products: HttpTypes.StoreProduct[]
  className?: string
}>(({ products, className }) => {
  if (!products.length) {
    return null
  }

  return (
    <div className={className}>
      <Layout>
        <LayoutColumn>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-black/40 mb-3">
            Fresh from the forge
          </p>
          <h3 className="text-md md:text-2xl mb-8 md:mb-15">Recently Added</h3>
        </LayoutColumn>
      </Layout>
      <Layout className="gap-y-10 md:gap-y-16">
        {products.map((product) => (
          <LayoutColumn key={product.id} className="md:!col-span-4 !col-span-6">
            <ProductPreview product={product} />
          </LayoutColumn>
        ))}
      </Layout>
    </div>
  )
})
