import { z } from "zod"

export const collectionMetadataCustomFieldsSchema = z.object({
  image: z
    .object({
      id: z.string(),
      url: z.string().url(),
    })
    .nullish(),
  description: z.string().optional(),
  collection_page_image: z
    .object({
      id: z.string(),
      url: z.string().url(),
    })
    .nullish(),
  collection_page_heading: z.string().optional(),
  collection_page_content: z.string().optional(),
  product_page_heading: z.string().optional(),
  product_page_image: z
    .object({
      id: z.string(),
      url: z.string().url(),
    })
    .nullish(),
  product_page_wide_image: z
    .object({
      id: z.string(),
      url: z.string().url(),
    })
    .nullish(),
  product_page_cta_image: z
    .object({
      id: z.string(),
      url: z.string().url(),
    })
    .nullish(),
  product_page_cta_heading: z.string().optional(),
  product_page_cta_link: z.string().optional(),
})
