"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { pick, pickList, type ExperienceEntry, type Locale } from "@/lib/data";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  locale: Locale;
}

/** Responsibilities shown before the reader has to ask for the rest. */
const VISIBLE_RESPONSIBILITIES = 3;

/**
 * One role on the timeline.
 *
 * Role and dates share a baseline-aligned row that wraps rather than
 * truncates — job titles across the three locales vary enough in length
 * that anything fixed-width would clip one of them.
 *
 * The first three responsibilities are always visible; the rest sit behind
 * a disclosure so five roles don't turn the timeline into a wall of bullets.
 */
export function ExperienceCard({ entry, locale }: ExperienceCardProps) {
  const t = useTranslations("Experience");
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  const role = pick(entry.position, locale);
  const location = pick(entry.location, locale);
  const start = pick(entry.startDate, locale);
  const end = pick(entry.endDate, locale);
  const description = pick(entry.description, locale);
  const responsibilities = pickList(entry.responsibilities, locale);

  const hasMore = responsibilities.length > VISIBLE_RESPONSIBILITIES;
  const shown = expanded
    ? responsibilities
    : responsibilities.slice(0, VISIBLE_RESPONSIBILITIES);

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

      <ul id={listId} className="mb-4 flex flex-col gap-1.5">
        {shown.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[0.875rem] leading-relaxed text-foreground/85"
          >
            <span
              aria-hidden="true"
              className="mt-2.5 h-px w-3 shrink-0 bg-brand-500 dark:bg-brand-400"
            />
            {item}
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mb-4 inline-flex items-center gap-1 font-heading text-[0.8125rem] font-semibold text-brand-700 transition-colors hover:text-brand-950 dark:text-brand-300 dark:hover:text-brand-100"
        >
          {expanded
            ? t("showLess")
            : t("showAll", { count: responsibilities.length })}
          <ChevronDown
            className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      )}

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
