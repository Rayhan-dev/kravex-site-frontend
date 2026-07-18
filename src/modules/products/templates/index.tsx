import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { Layout, LayoutColumn } from "@/components/Layout"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  materials,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const images = product.images || []
  const hasImages = Boolean(
    product.images &&
    product.images.filter((image) => Boolean(image.url)).length > 0
  )

  return (
    <div
      className="pt-18 md:pt-26 lg:pt-37 pb-16 md:pb-36"
      data-testid="product-container"
    >
      <ImageGallery className="md:hidden" images={images} />
      <Layout>
        <LayoutColumn className="mb-26 md:mb-52">
          <div className="flex max-lg:flex-col gap-8 xl:gap-27">
            {hasImages && (
              <div className="lg:w-1/2 flex flex-1 flex-col gap-8">
                <ImageGallery className="max-md:hidden" images={images} />
              </div>
            )}
            <div className="sticky flex-1 top-0">
              <ProductInfo product={product} />
              <Suspense>
                <ProductActions
                  product={product}
                  materials={materials}
                  region={region}
                />
              </Suspense>
            </div>
            {!hasImages && <div className="flex-1" />}
          </div>
        </LayoutColumn>
      </Layout>
      {/* Editorial full-bleed band */}
      <div className="w-full bg-[#0d0d0d] py-20 md:py-28 px-6 flex flex-col items-center text-center mb-0">
        <p className="text-white/30 text-2xs tracking-[0.3em] uppercase mb-4">Kravex</p>
        <h2
          className="font-bebas text-white leading-none mb-4"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)", letterSpacing: "0.02em" }}
        >
          Forged in Steel
        </h2>
        <p className="text-white/35 text-sm max-w-sm tracking-wide">
          Every blade is a tribute to the story behind it.
        </p>
      </div>

      <Suspense fallback={<SkeletonRelatedProducts />}>
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>
    </div>
  )
}

export default ProductTemplate
