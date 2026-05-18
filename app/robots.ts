import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

// Required so `output: 'export'` knows this route is fully static.
export const dynamic = "force-static";

/**
 * robots.txt — Allow everything, disallow nothing public. Sitemap pointer
 * uses the absolute URL so a crawler can fetch it directly.
 *
 * Caveat: hosted under the GitHub Pages basePath
 * (`/portfolio/robots.txt`). Crawlers query `/robots.txt` at the apex by
 * default and won't auto-discover this. If SEO matters, submit the
 * sitemap via Search Console explicitly or move to a custom domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
