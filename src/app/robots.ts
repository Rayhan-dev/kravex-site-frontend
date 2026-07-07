import { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  const base = getBaseURL().replace(/\/$/, "")

  // Allow opting the whole site out of indexing (e.g. staging/preview).
  if (process.env.DISALLOW_ROBOTS) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Non-content, user-specific or transactional routes have no SEO value
      // and can leak session state — keep them out of the index.
      disallow: [
        "/*/checkout",
        "/*/account",
        "/*/cart",
        "/*/order",
        "/*/auth",
        "/api/",
        "/private/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
