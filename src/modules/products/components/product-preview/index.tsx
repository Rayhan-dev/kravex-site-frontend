import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  return (
    <LocalizedLink href={`/products/${product.handle}`} className="block group hover:opacity-100">
      <div className="relative overflow-hidden mb-4 md:mb-6">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none" />
        <span className="absolute inset-x-0 bottom-4 flex justify-center text-white text-[10px] tracking-[0.3em] uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          View
        </span>
      </div>
      <div className="flex justify-between max-md:flex-col">
        <div className="max-md:text-xs">
          <p className="mb-1">{product.title}</p>
          {product.collection && (
            <p className="text-grayscale-500 text-xs max-md:hidden">
              {product.collection.title}
            </p>
          )}
        </div>
        {cheapestPrice ? (
          hasReducedPrice ? (
            <div>
              <p className="font-semibold max-md:text-xs text-red-primary">
                {cheapestPrice.calculated_price}
              </p>
              <p className="max-md:text-xs text-grayscale-500 line-through">
                {cheapestPrice.original_price}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold max-md:text-xs">
                {cheapestPrice.calculated_price}
              </p>
            </div>
          )
        ) : null}
      </div>
    </LocalizedLink>
  )
}
