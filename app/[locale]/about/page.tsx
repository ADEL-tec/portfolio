import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Skills } from "@/components/sections/skills";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { pick, portfolioData } from "@/lib/data";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  return pageMetadata({
    locale: safe,
    path: "/about",
    title: `About — ${portfolioData.personal.fullName}`,
    description: pick(portfolioData.personal.bio, safe),
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <About />
      <Experience />
      <Education />
      <Skills />
    </>
  );
}
