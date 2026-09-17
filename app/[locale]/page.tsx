import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { Hero } from "@/components/sections/hero";
import { QuickFacts } from "@/components/sections/quick-facts";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Statement } from "@/components/sections/statement";
import { CTA } from "@/components/sections/cta";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  return pageMetadata({ locale: safe, path: "/" });
}

/**
 * Home, in the order a recruiter reads: who and what (hero), the facts
 * they're hunting for (at a glance), proof of shipping (projects), the
 * stack they keyword-match on (skills), the timeline (experience), the
 * credentials (education), then the close. The longer About narrative
 * lives on `/about`.
 */
export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <QuickFacts />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Statement />
      <CTA />
    </>
  );
}
