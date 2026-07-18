import { sdk } from "@lib/config"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"

export const getProductTypesList = async function (
  offset: number = 0,
  limit: number = 100,
  fields?: (keyof HttpTypes.StoreProductType)[]
): Promise<{ productTypes: HttpTypes.StoreProductType[]; count: number }> {
  return sdk.client
    .fetch<
      PaginatedResponse<{
        product_types: HttpTypes.StoreProductType[]
        count: number
      }>
    >("/store/custom/product-types", {
      query: { limit, offset, fields: fields ? fields.join(",") : undefined },
      // Time-based revalidation so the statically-rendered header/nav picks up
      // product types added in the backend without a redeploy. (force-cache
      // would cache indefinitely and never show new types in production.)
      next: { tags: ["product-types"], revalidate: 60 },
    })
    .then(({ product_types, count }) => ({
      productTypes: product_types,
      count,
    }))
}

export const getProductTypeByHandle = async function (
  handle: string
): Promise<HttpTypes.StoreProductType> {
  return sdk.client
    .fetch<
      PaginatedResponse<{
        product_types: HttpTypes.StoreProductType[]
        count: number
      }>
    >("/store/custom/product-types", {
      query: { handle, limit: 1 },
      next: { tags: ["product-types"], revalidate: 60 },
    })
    .then(({ product_types }) => product_types[0])
}
