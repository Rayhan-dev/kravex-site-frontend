import { ProductPageGallery } from "@/components/ProductPageGallery"
import { HoverZoomImage } from "@/components/HoverZoomImage"
import { HttpTypes } from "@medusajs/types"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  className?: string
}

const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const filteredImages = images.filter((image) => Boolean(image.url))

  if (!filteredImages.length) {
    return null
  }

  return (
    <ProductPageGallery className={className}>
      {filteredImages.map((image, index) => (
        <HoverZoomImage
          key={image.id}
          src={image.url}
          priority={index <= 2}
          alt={`Product image ${index + 1}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 589px, (max-width: 1279px) 384px, 456px"
        />
      ))}
    </ProductPageGallery>
  )
}

export default ImageGallery
