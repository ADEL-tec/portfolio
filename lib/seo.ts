/**
 * Shared metadata builder.
 *
 * Each page calls `pageMetadata()` from its `generateMetadata` function to
 * produce a typed `Metadata` object with consistent OpenGraph, Twitter,
 * canonical, and language-alternate fields. Page-specific overrides
 * (title, description, OG image) flow through the options arg.
 */

import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { pick, portfolioData, type Locale } from "@/lib/data";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_AR",
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://adel-tec.github.io/portfolio";

interface PageMetadataOptions {
  locale: Locale;
  /** Path without locale prefix or basePath (e.g. `"/about"`, `"/projects/awashz"`). */
  path: string;
  /** Override the default site title. */
  title?: string;
  /** Override the default site description. */
  description?: string;
  /** Override the default OG image (place under `/public`). */
  image?: string;
}

/**
 * Build a `Metadata` object for a single page.
 *
 * The canonical URL and the `alternates.languages` map use locale-prefixed
 * paths — Next.js prepends the configured `basePath` automatically.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = "/og-image.png",
}: PageMetadataOptions): Metadata {
  const resolvedTitle = title ?? pick(portfolioData.seo.title, locale);
  const resolvedDescription =
    description ?? pick(portfolioData.seo.description, locale);

  const localePath = path === "/" ? `/${locale}` : `/${locale}${path}`;
  const url = `${SITE_URL.replace(/\/$/, "")}${localePath}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: [...portfolioData.seo.keywords],
    authors: [{ name: portfolioData.personal.fullName }],
    creator: portfolioData.personal.fullName,
    alternates: {
      canonical: localePath,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          path === "/" ? `/${l}` : `/${l}${path}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      url,
      siteName: portfolioData.personal.fullName,
      title: resolvedTitle,
      description: resolvedDescription,
      locale: OG_LOCALE[locale],
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: resolvedTitle }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: image ? [image] : undefined,
    },
  };
}
