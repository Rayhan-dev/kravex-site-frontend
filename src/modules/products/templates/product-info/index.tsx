import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  /**
   * "full" — large editorial title for the product page (default).
   * "compact" — smaller, wrapping title for constrained contexts like the
   * quick-view modal, where a viewport-based size would overflow.
   */
  size?: "full" | "compact"
}

const ProductInfo = ({ product, size = "full" }: ProductInfoProps) => {
  const titleFontSize =
    size === "compact"
      ? "clamp(1.75rem, 3.5vw, 2.5rem)"
      : "clamp(2rem, 6vw, 5rem)"

  return (
    <>
      {product.collection && (
        <LocalizedLink
          href={`/collections/${product.collection.handle}`}
          className="hover:opacity-100"
        >
          <p className="text-2xs tracking-[0.3em] uppercase text-black/40 mb-4">
            {product.collection.title}
          </p>
        </LocalizedLink>
      )}
      <div className="w-8 h-px mb-4 bg-black" />
      <h2
        className="font-bebas leading-none mb-3 break-words"
        style={{ fontSize: titleFontSize, letterSpacing: "0.02em" }}
      >
        {product.title}
      </h2>
    </>
  )
}

export default ProductInfo
