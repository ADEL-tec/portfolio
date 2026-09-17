import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import {
  ProjectsIndex,
  ProjectsIndexFromParams,
} from "@/components/sections/projects-index";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations<"Projects">({
    locale: safe,
    namespace: "Projects",
  });
  return pageMetadata({
    locale: safe,
    path: "/projects",
    title: `${t("metaTitle")} — Adel Labdelli Merioua`,
    description: t("metaDescription"),
  });
}

/**
 * Full project index, grouped by platform and filterable via `?type=`.
 *
 * The heading is static markup so it prerenders; the grid below reads the
 * search params on the client. Its Suspense fallback is the unfiltered
 * index, so the exported HTML already lists every project and the filter
 * simply takes over on hydration.
 */
export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Projects");

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mb-10 flex flex-col">
        <p className="eyebrow mb-3.5">{t("indexEyebrow")}</p>
        <h1 className="max-w-160 text-section font-heading font-bold text-foreground">
          {t("indexHeading")}
        </h1>
      </div>

      <Suspense fallback={<ProjectsIndex category="all" />}>
        <ProjectsIndexFromParams />
      </Suspense>
    </main>
  );
}
