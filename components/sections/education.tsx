"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";
import { useLocale } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { SectionHeading } from "./section-heading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import {
  pick,
  portfolioData,
  type EducationEntry,
  type Locale,
  type Localized,
} from "@/lib/data";

/**
 * Education. Rendered as a pair of framed cards rather than a second
 * timeline — two entries don't justify a rail, and repeating the Experience
 * treatment would make the shorter list look like the more important one.
 *
 * Copy lives here as `Localized` constants rather than in the messages
 * bundle, so adding a locale is a single-file edit.
 */
const COPY = {
  title: {
    en: "Education",
    fr: "Formation",
    ar: "التعليم",
  } satisfies Localized,
  subtitle: {
    en: "Where I trained — and what I picked up along the way.",
    fr: "Là où je me suis formé — et ce que j'y ai appris.",
    ar: "حيث تلقّيت تكويني — وما اكتسبته خلال هذه الرحلة.",
  } satisfies Localized,
};

export function Education() {
  const locale = useLocale() as Locale;

  // Most recent first.
  const entries = [...portfolioData.education].sort(
    (a, b) => parseInt(b.completionDate, 10) - parseInt(a.completionDate, 10),
  );

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
        eyebrow={pick(COPY.title, locale)}
        heading={pick(COPY.subtitle, locale)}
        headingClassName="max-w-160"
        className="mb-11"
      />

      <div className="grid gap-8 sm:grid-cols-2">
        {entries.map((entry) => (
          <EducationCard key={entry.id} entry={entry} locale={locale} />
        ))}
      </div>
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
