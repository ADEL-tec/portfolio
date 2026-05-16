import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Static export targets a sub-path host (adel-tec.github.io/portfolio).
// `basePath` rewrites all internal links and `assetPrefix` the asset URLs.
// Toggle via `STATIC_EXPORT=1`: dev keeps clean URLs and full Next features.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  ...(staticExport && {
    output: "export",
    basePath: "/portfolio",
    assetPrefix: "/portfolio",
    trailingSlash: true,
  }),

  images: {
    // The Image Optimization API needs a Node runtime — gone in static export.
    // Fall back to serving the source bytes as-is.
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
