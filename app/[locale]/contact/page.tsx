import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { Contact } from "@/components/sections/contact";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { pick, type Localized } from "@/lib/data";

const PAGE_TITLE: Localized = {
  en: "Contact",
  fr: "Contact",
  ar: "تواصل",
};

const PAGE_DESCRIPTION: Localized = {
  en: "Got a project in mind or just want to say hi? Send me a message.",
  fr: "Un projet en tête ou simplement envie d'échanger ? Envoyez-moi un message.",
  ar: "هل لديك مشروع في بالك أو تودّ إلقاء التحية فقط؟ راسلني.",
};

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  return pageMetadata({
    locale: safe,
    path: "/contact",
    title: `${pick(PAGE_TITLE, safe)} — Adel Labdelli Merioua`,
    description: pick(PAGE_DESCRIPTION, safe),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Contact />;
}
