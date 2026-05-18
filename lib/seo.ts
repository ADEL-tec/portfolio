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
import {
  pick,
  pickList,
  portfolioData,
  type Locale,
  type Project,
} from "@/lib/data";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_AR",
};

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://adel-tec.github.io/portfolio"
).replace(/\/$/, "");

/** Build an absolute URL from a public-asset path (e.g. `/images/avatar.jpg`).
 *  SITE_URL already includes the GitHub Pages basePath, so the concat works
 *  for both dev (`localhost:3000`) and prod (`…/portfolio`). */
function absUrl(path: string): string {
  if (/^https?:/.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

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
  const url = `${SITE_URL}${localePath}`;

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

// ─── JSON-LD structured data builders ─────────────────────────────────────
//
// Each function returns a plain object suitable for `JSON.stringify(...)`
// inside a `<script type="application/ld+json">`. Pages own the rendering:
//
//   <script
//     type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(locale)) }}
//   />

/** Person schema describing Adel. Inject once in the root layout. */
export function personSchema(locale: Locale) {
  const { personal, social } = portfolioData;

  const sameAs = [
    social.github,
    social.linkedin,
    social.portfolio,
    social.twitter,
    social.instagram,
  ].filter((url): url is string => Boolean(url));

  // Flatten skill names across all categories for `knowsAbout`. Caps at 40
  // entries so the schema stays compact — Google ignores anything past that.
  const knowsAbout = portfolioData.skills
    .flatMap((g) =>
      g.items.map((i) => (typeof i === "string" ? i : i.name)),
    )
    .slice(0, 40);

  const education = portfolioData.education.map((e) => ({
    "@type": "EducationalOccupationalCredential",
    name: pick(e.degree, locale),
    educationalLevel: pick(e.degree, locale),
    recognizedBy: {
      "@type": "EducationalOrganization",
      name: pick(e.university, locale),
    },
    dateCreated: e.completionDate,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.fullName,
    jobTitle: pick(personal.title, locale),
    description: pick(personal.bio, locale),
    url: SITE_URL,
    image: absUrl(personal.avatar),
    email: `mailto:${personal.email}`,
    telephone: personal.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Doha",
      addressCountry: "QA",
    },
    sameAs,
    knowsAbout,
    hasCredential: education,
  };
}

/** Software-application schema for a single project. */
export function projectSchema(project: Project, locale: Locale) {
  const { personal } = portfolioData;

  // Map distribution links to an operatingSystem hint Google understands.
  const oses: string[] = [];
  if (project.links.playStore) oses.push("Android");
  if (project.links.appStore) oses.push("iOS");
  const operatingSystem = oses.join(", ") || "Cross-platform";

  const downloadUrl =
    project.links.appStore ?? project.links.playStore ?? undefined;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: pick(project.title, locale),
    description: pick(project.description, locale),
    applicationCategory: "MobileApplication",
    operatingSystem,
    image: absUrl(project.image),
    url: `${SITE_URL}/${locale}/projects/${project.id}`,
    downloadUrl,
    keywords: [
      ...project.technologies,
      ...pickList(project.highlights, locale),
    ].join(", "),
    author: {
      "@type": "Person",
      name: personal.fullName,
      url: SITE_URL,
    },
    inLanguage: locale,
  };
}

/** BreadcrumbList for navigation context on deep pages. */
export function breadcrumbSchema(
  items: ReadonlyArray<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebSite schema — pairs with Person on the root layout. Optional but
 *  helps Google understand the canonical name + URL of the site. */
export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: portfolioData.personal.fullName,
    url: SITE_URL,
    description: pick(portfolioData.seo.description, locale),
    inLanguage: locale,
  };
}
