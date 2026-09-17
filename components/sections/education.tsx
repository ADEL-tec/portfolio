"use client";

import { motion } from "framer-motion";
import { GraduationCap, Languages, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { SectionHeading } from "./section-heading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import {
  pick,
  portfolioData,
  type EducationEntry,
  type Locale,
} from "@/lib/data";

/**
 * Education and working languages — the last two lines of a CV, kept
 * together so the page ends its résumé section in one place.
 *
 * Degrees are a pair of framed cards rather than a second timeline — two
 * entries don't justify a rail, and repeating the Experience treatment
 * would make the shorter list look like the more important one. Languages
 * are a single ruled row underneath.
 */
export function Education() {
  const t = useTranslations("Education");
  const locale = useLocale() as Locale;

  // Most recent first.
  const entries = [...portfolioData.education].sort(
    (a, b) => parseInt(b.completionDate, 10) - parseInt(a.completionDate, 10),
  );
  const languages = portfolioData.languages;

  return (
    <motion.section
      id="education"
      aria-labelledby="education-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1, 0.05)}
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <SectionHeading
        id="education-heading"
        eyebrow={t("title")}
        heading={t("subtitle")}
        headingClassName="max-w-160"
        className="mb-11"
      />

      <div className="grid gap-8 sm:grid-cols-2">
        {entries.map((entry) => (
          <EducationCard key={entry.id} entry={entry} locale={locale} />
        ))}
      </div>

      <motion.div variants={fadeUp} className="mt-10">
        <p className="mb-3.5 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
          <Languages
            className="size-4 text-brand-500 dark:text-brand-400"
            aria-hidden="true"
          />
          {t("languages")}
        </p>
        <dl className="relative grid border-s border-t border-border sm:grid-cols-3">
          <TickFrame />
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="flex items-baseline justify-between gap-3 border-b border-e border-border px-5 py-4"
            >
              <dt className="font-heading text-[1.0625rem] font-semibold text-foreground">
                {pick(lang.name, locale)}
              </dt>
              <dd className="text-[0.8125rem] text-muted-foreground">
                {t(`levels.${lang.level}`)}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </motion.section>
  );
}

function EducationCard({
  entry,
  locale,
}: {
  entry: EducationEntry;
  locale: Locale;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="relative flex flex-col border border-border p-6 sm:p-7"
    >
      <TickFrame />

      <div className="mb-3.5 flex items-center gap-2.5">
        <GraduationCap
          className="size-5 shrink-0 text-brand-500 dark:text-brand-400"
          aria-hidden="true"
        />
        <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
          {entry.completionDate}
        </p>
      </div>

      <h3 className="font-heading text-xl font-semibold leading-tight text-foreground">
        {pick(entry.degree, locale)}
      </h3>
      <p className="mt-1.5 text-sm text-brand-700 dark:text-brand-300">
        {pick(entry.institution, locale)}
      </p>
      <p className="text-[0.8125rem] text-muted-foreground">
        {pick(entry.university, locale)}
      </p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
        <MapPin className="size-3 shrink-0" aria-hidden="true" />
        {pick(entry.location, locale)}
      </p>

      <p className="mt-4 text-[0.90625rem] leading-relaxed text-muted-foreground">
        {pick(entry.description, locale)}
      </p>
    </motion.article>
  );
}
