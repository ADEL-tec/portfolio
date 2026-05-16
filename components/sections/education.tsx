"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  pick,
  portfolioData,
  type EducationEntry,
  type Locale,
  type Localized,
} from "@/lib/data";

/**
 * Education timeline — shorter than the work timeline so we render it inline
 * rather than splitting a card component out. Same vertical-rail visual
 * vocabulary as `Experience`, with the alternating left/right layout and
 * the rail centered at md+.
 *
 * Title and subtitle copy isn't in the messages bundle today — kept inline
 * as `Localized` constants so adding a locale is a single-file edit.
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
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24"
    >
      <header className="mb-12 flex flex-col gap-3">
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400"
        >
          {pick(COPY.title, locale)}
        </motion.p>
        <motion.h2
          id="education-heading"
          variants={fadeUp}
          className="text-section font-bold tracking-tight text-foreground"
        >
          {pick(COPY.subtitle, locale)}
        </motion.h2>
      </header>

      <ol className="relative" aria-label={pick(COPY.title, locale)}>
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 start-4 w-px bg-gradient-to-b from-border via-border to-transparent md:start-1/2 md:-translate-x-1/2"
        />

        {entries.map((entry, i) => {
          const side: "start" | "end" = i % 2 === 0 ? "start" : "end";
          return (
            <li
              key={entry.id}
              className={cn(
                "relative pb-10 last:pb-0 ps-12",
                "md:ps-0 md:grid md:grid-cols-2 md:gap-12",
              )}
            >
              {/* Dot */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-6 start-4 -translate-x-1/2 md:start-1/2 md:-translate-x-1/2",
                  "inline-flex size-7 items-center justify-center rounded-full",
                  "bg-brand-500/10 text-brand-600 ring-4 ring-background dark:text-brand-400",
                )}
              >
                <GraduationCap className="size-3.5" />
              </span>

              <div
                className={cn(
                  "md:col-span-1",
                  side === "start" ? "md:col-start-1" : "md:col-start-2",
                )}
              >
                <EducationCard entry={entry} locale={locale} side={side} />
              </div>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}

interface EducationCardProps {
  entry: EducationEntry;
  locale: Locale;
  side: "start" | "end";
}

function EducationCard({ entry, locale, side }: EducationCardProps) {
  const degree = pick(entry.degree, locale);
  const institution = pick(entry.institution, locale);
  const university = pick(entry.university, locale);
  const location = pick(entry.location, locale);
  const description = pick(entry.description, locale);

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border bg-card/60 p-5 sm:p-6",
        "transition-all duration-300 hover:border-brand-500/40 hover:bg-card hover:shadow-lg hover:shadow-brand-900/5",
        side === "start" && "md:text-end md:items-end",
      )}
    >
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-wider text-muted-foreground",
        )}
      >
        {entry.completionDate}
      </p>
      <h3 className="text-lg font-semibold leading-tight text-foreground">
        {degree}
      </h3>
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
        {institution}
      </p>
      <p className="text-xs text-muted-foreground">{university}</p>
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs text-muted-foreground",
          side === "start" && "md:flex-row-reverse",
        )}
      >
        <MapPin className="size-3" aria-hidden="true" />
        <span>{location}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        {description}
      </p>
    </motion.article>
  );
}
