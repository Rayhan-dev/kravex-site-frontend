import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <>
      {product.collection && (
        <LocalizedLink
          href={`/collections/${product.collection.handle}`}
          className="hover:opacity-100"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-grayscale-500 mb-4">
            {product.collection.title}
          </p>
        </LocalizedLink>
      )}
      <div className="w-8 h-px mb-4" style={{ background: "#c9a84c" }} />
      <h2 className="text-md md:text-xl mb-2">{product.title}</h2>
    </>
  )
}

export default ProductInfo
