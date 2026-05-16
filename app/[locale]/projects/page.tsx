import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { Projects } from "@/components/sections/projects";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { pick, type Localized } from "@/lib/data";

const PAGE_TITLE: Localized = {
  en: "Projects",
  fr: "Projets",
  ar: "المشاريع",
};

const PAGE_DESCRIPTION: Localized = {
  en: "Production apps I've shipped — Flutter mobile, full-stack web, and cloud-deployed services.",
  fr: "Applications de production que j'ai livrées — Flutter mobile, web full-stack et services cloud.",
  ar: "تطبيقات إنتاجية أطلقتُها — موبايل بـ Flutter، وويب متكامل، وخدمات سحابية.",
};

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  return pageMetadata({
    locale: safe,
    path: "/projects",
    title: `${pick(PAGE_TITLE, safe)} — Adel Labdelli Merioua`,
    description: pick(PAGE_DESCRIPTION, safe),
  });
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Projects />;
}
