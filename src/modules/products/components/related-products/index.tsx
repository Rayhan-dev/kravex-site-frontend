import { ProductPreviewWithProvider as Product } from "@modules/products/components/product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 5,
  }
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  // Only filter by tags when the product actually has some. An empty tags
  // array is still truthy, and passing an empty `tag_id[]` makes Medusa match
  // nothing — which silently hid all related products. Filter by tag id, not
  // the tag's display value.
  if (product.tags?.length) {
    queryParams.tag_id = product.tags.map((t) => t.id).filter(Boolean)
  }
  queryParams.is_giftcard = false

  const products = await getProductsList({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .slice(0, 4)
  })

  if (!products.length) {
    return null
  }

  return (
    <>
      <Layout>
        <LayoutColumn className="mt-26 md:mt-36">
          <h4 className="text-md md:text-2xl mb-8 md:mb-16">
            Related products
          </h4>
        </LayoutColumn>
      </Layout>
      <Layout className="gap-y-10 md:gap-y-16">
        {products.map((product) => (
          <LayoutColumn key={product.id} className="!col-span-12 md:!col-span-3">
            <Product product={product} />
          </LayoutColumn>
        ))}
      </Layout>
    </>
  )
}
