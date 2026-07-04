const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    // Tree-shake barrel imports so we don't ship whole libraries to the client.
    // lodash in particular is imported by client components (product-actions).
    optimizePackageImports: [
      "lodash",
      "@medusajs/ui",
      "@medusajs/icons",
      "react-aria-components",
    ],
  },
  images: {
    // AVIF first (≈20–30% smaller than WebP) with WebP fallback.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "fashion-starter-demo.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "media.kravex.store",
      },
    ],
  },
}

module.exports = nextConfig
