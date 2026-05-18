import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Static export targets a sub-path host (adel-tec.github.io/portfolio).
// `basePath` rewrites all internal links and `assetPrefix` the asset URLs.
// Toggle via `STATIC_EXPORT=1`: dev keeps clean URLs and full Next features.
const staticExport = process.env.STATIC_EXPORT === "1";

/**
 * Production security headers. Applied by `next dev`, `next start`, and any
 * Node-runtime host (Vercel reads `vercel.json`). Static export skips this
 * function entirely — GitHub Pages can't honor server headers, so the
 * gh-pages deploy gets whatever Pages itself sets.
 *
 * CSP is intentionally omitted: a strict policy needs nonces (runtime-only)
 * and a loose one with `unsafe-inline` provides little value. Add per-host
 * via `vercel.json` or a reverse proxy when needed.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

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

  // `headers()` is silently ignored when `output: 'export'`. Skip the
  // function entirely in that case so the build doesn't surface confusing
  // "headers are not supported with static export" warnings.
  ...(!staticExport && {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
        {
          source: "/_next/static/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ];
    },
  }),
};

export default withNextIntl(nextConfig);
