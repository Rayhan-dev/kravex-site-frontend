"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { HttpTypes } from "@medusajs/types"
import { getProductPageData } from "@lib/data/products"
import { useCountryCode } from "hooks/country-code"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductInfo from "@modules/products/templates/product-info"
import { LocalizedLink } from "@/components/LocalizedLink"

type QuickViewData = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: { id: string; name: string; hex_code: string }[]
  }[]
  region: HttpTypes.StoreRegion
}

type QuickViewModalProps = {
  product: HttpTypes.StoreProduct
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<QuickViewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const countryCode = useCountryCode()
  const backdropRef = useRef<HTMLDivElement>(null)

  const galleryImages = data?.product.images ?? product.images ?? []

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!countryCode) return
    setIsLoading(true)
    getProductPageData(product.handle!, countryCode).then((result) => {
      setData(result)
      setIsLoading(false)
    })
  }, [product.handle, countryCode])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    // Close the modal once an item is added so the cart drawer is revealed.
    const handleCartAdd = () => onClose()
    document.addEventListener("keydown", handleKey)
    window.addEventListener("kravex:cart-add", handleCartAdd)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      window.removeEventListener("kravex:cart-add", handleCartAdd)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-cream border border-black w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center border border-black bg-cream text-black hover:bg-black hover:text-cream transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left: image gallery — same carousel as the product page */}
        <div className="md:w-1/2 flex-shrink-0 md:border-r md:border-black bg-[#f3eed6] flex items-center">
          {galleryImages.some((img) => img.url) ? (
            <ImageGallery images={galleryImages} className="w-full" />
          ) : (
            <div className="aspect-[3/4] w-full flex items-center justify-center">
              <span className="text-black/20 text-xs tracking-widest uppercase">
                No image
              </span>
            </div>
          )}
        </div>

        {/* Right: product info */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <ProductInfo product={data?.product ?? product} size="compact" />

          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-4 mt-4">
                <div className="h-8 w-24 bg-black/5 animate-pulse" />
                <div className="h-4 w-full bg-black/5 animate-pulse" />
                <div className="h-4 w-3/4 bg-black/5 animate-pulse" />
                <div className="h-12 w-full bg-black/5 animate-pulse mt-8" />
              </div>
            ) : data ? (
              <Suspense fallback={null}>
                <ProductActions
                  product={data.product}
                  materials={data.materials}
                  region={data.region}
                />
              </Suspense>
            ) : (
              <p className="text-black/40 text-sm mt-4">
                Could not load product details.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-black/10">
            <LocalizedLink
              href={`/products/${product.handle}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black/50 hover:text-black transition-colors duration-200"
            >
              View full product page
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </LocalizedLink>
          </div>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modal, document.body)
}
