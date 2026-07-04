"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { useAddLineItem } from "hooks/cart"
import { useCountryCode } from "hooks/country-code"
import QuickViewModal from "@modules/products/components/product-quick-view"
import { withReactQueryProvider } from "@lib/util/react-query"

const CartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
    />
  </svg>
)

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707"
    />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
)

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const { mutateAsync: addToCart, isPending: isAddingToCart } = useAddLineItem()
  const countryCode = useCountryCode()

  const { cheapestPrice } = getProductPrice({ product })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  const images = product.images ?? []
  const secondImage =
    images.length > 1 ? (images[1].url ?? undefined) : undefined

  const hasOneVariant = (product.variants?.length ?? 0) === 1

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!hasOneVariant) {
      setQuickViewOpen(true)
      return
    }

    const variant = product.variants?.[0]
    if (!variant?.id) return

    await addToCart({ variantId: variant.id, quantity: 1, countryCode })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  return (
    <>
      <div className="relative group">
        {/* Image area */}
        <div className="relative overflow-hidden mb-3 md:mb-6">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            hoverImage={secondImage}
            size="square"
            className="transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Dark overlay (desktop hover only) */}
          <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/30 transition-colors duration-400 pointer-events-none" />

          {/* Full-image link (behind buttons) */}
          <LocalizedLink
            href={`/products/${product.handle}`}
            className="absolute inset-0 z-[1]"
            aria-label={product.title}
          />

          {/* Desktop hover action buttons */}
          <div className="hidden md:flex absolute bottom-4 inset-x-0 justify-center gap-2 z-[2] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              aria-label={hasOneVariant ? "Add to cart" : "Select options"}
              className="w-10 h-10 bg-cream text-black flex items-center justify-center border border-black hover:bg-black hover:text-cream transition-colors duration-200 disabled:opacity-50"
            >
              {isAddingToCart ? (
                <SpinnerIcon className="w-4 h-4 animate-spin" />
              ) : (
                <CartIcon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleQuickView}
              aria-label="Quick view"
              className="w-10 h-10 bg-cream text-black flex items-center justify-center border border-black hover:bg-black hover:text-cream transition-colors duration-200"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile action row — always visible, below the image so it never
            covers the product art. Hidden on desktop (hover overlay used there). */}
        <div className="flex md:hidden gap-2 mb-3">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={hasOneVariant ? "Add to cart" : "Select options"}
            className="flex-1 h-9 flex items-center justify-center gap-2 border border-black text-[10px] font-semibold uppercase tracking-[0.15em] active:bg-black active:text-cream transition-colors disabled:opacity-50"
          >
            {isAddingToCart ? (
              <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CartIcon className="w-3.5 h-3.5" />
            )}
            {hasOneVariant ? "Add" : "Options"}
          </button>
          <button
            onClick={handleQuickView}
            aria-label="Quick view"
            className="w-9 h-9 shrink-0 flex items-center justify-center border border-black active:bg-black active:text-cream transition-colors"
          >
            <EyeIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product info */}
        <LocalizedLink href={`/products/${product.handle}`} className="block">
          <div className="flex justify-between max-md:flex-col">
            <div>
              <p className="mb-1 font-medium text-sm md:text-base leading-snug">
                {product.title}
              </p>
              {product.collection && (
                <p className="text-black/40 text-[11px] max-md:hidden tracking-[0.1em] uppercase">
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
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  )
}

// For use from server components that don't already sit under a
// ReactQueryProvider (e.g. related products, homepage sections).
export const ProductPreviewWithProvider = withReactQueryProvider(ProductPreview)
