"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { pick, type ExperienceEntry, type Locale } from "@/lib/data";
import { fadeUp } from "@/lib/animations";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  locale: Locale;
}

/**
 * One role on the timeline.
 *
 * Role and dates share a baseline-aligned row that wraps rather than
 * truncates — job titles across the three locales vary enough in length
 * that anything fixed-width would clip one of them.
 */
export function ExperienceCard({ entry, locale }: ExperienceCardProps) {
  const t = useTranslations("Experience");

  const role = pick(entry.position, locale);
  const location = pick(entry.location, locale);
  const start = pick(entry.startDate, locale);
  const end = pick(entry.endDate, locale);
  const description = pick(entry.description, locale);

  return (
    <motion.article
      variants={fadeUp}
      className="relative border border-border px-6 py-6"
    >
      <TickFrame />

      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-heading text-[1.1875rem] font-semibold text-foreground">
          {role} — {entry.company}
        </h3>
        <p className="flex items-center gap-1.5 text-[0.78125rem] text-muted-foreground">
          <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
          {start} — {end}
        </p>
      </div>

      <p className="mb-3.5 text-[0.8125rem] text-muted-foreground">
        {location}
        {entry.current && (
          <>
            {" · "}
            <span className="text-brand-600 dark:text-brand-400">
              {t("current")}
            </span>
          </>
        )}
      </p>

      <p className="mb-3.5 text-[0.90625rem] leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="flex flex-wrap gap-2">
        {entry.technologies.map((tech) => (
          <li
            key={tech}
            className="bg-secondary px-2.75 py-1 text-[0.6875rem] text-secondary-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
