import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

// Required so `output: 'export'` knows this route is fully static.
export const dynamic = "force-static";

/**
 * Sitemap generator. Runs at build time (works fine under `output: 'export'`)
 * and writes to `out/sitemap.xml`.
 *
 * Strategy: emit one entry per (page × locale) so search engines have a
 * canonical URL per language. Each entry advertises its alternates via
 * hreflang so Google indexes the right language variant per query.
 *
 * Note: with the GitHub Pages basePath, the file is served at
 * `<origin>/portfolio/sitemap.xml`. Search engines look for /sitemap.xml at
 * the apex by default — submit this URL via Search Console directly.
 */

// One change-frequency hint per route, roughly matching how often the page
// would realistically be updated.
const ROUTE_PRIORITY: ReadonlyArray<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const buildAlternates = (path: string) =>
    Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    );

  // Static pages × locales
  for (const { path, priority, changeFrequency } of ROUTE_PRIORITY) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages: buildAlternates(path) },
      });
    }
  }

  // Per-project detail pages × locales
  for (const project of getProjects()) {
    const projectPath = `/projects/${project.id}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${projectPath}`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: buildAlternates(projectPath) },
      });
    }
  }

  return entries;
}
