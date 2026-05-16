"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { getExperiences, type Locale } from "@/lib/data";
import { ExperienceCard } from "./experience-card";

/**
 * Vertical experience timeline.
 *
 * Visual structure at md+:
 *
 *     [card 0]   ●━━━━━━━━━┓
 *                          ┃
 *               ┏━━━━━━━━━●  [card 1]
 *               ┃
 *     [card 2]  ●━━━━━━━━━┛
 *
 * On mobile, cards stack to the right of a single rail on the inline-start.
 * The connector line is one absolute element (1px wide background). Dots
 * sit on top of it and pulse when the role is `current`.
 */
export function Experience() {
  const t = useTranslations("Experience");
  const locale = useLocale() as Locale;
  const entries = getExperiences();

  return (
    <motion.section
      id="experience"
      aria-labelledby="experience-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.05)}
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24"
    >
      <header className="mb-12 flex flex-col gap-3">
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400"
        >
          {t("title")}
        </motion.p>
        <motion.h2
          id="experience-heading"
          variants={fadeUp}
          className="text-section font-bold tracking-tight text-foreground"
        >
          {t("subtitle")}
        </motion.h2>
      </header>

      <ol className="relative" aria-label={t("title")}>
        {/* The connector rail — left of cards on mobile, centered at md+. */}
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
              {/* Dot on the rail */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-6 start-4 -translate-x-1/2 md:start-1/2 md:-translate-x-1/2",
                  "size-3 rounded-full ring-4 ring-background transition-transform duration-300",
                  entry.current
                    ? "bg-brand-500"
                    : "bg-surface-400 dark:bg-surface-600",
                  "group-hover:scale-125",
                )}
              >
                {/* Soft ping for the current role only */}
                {entry.current && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-500 opacity-60" />
                )}
              </span>

              {/* Card — col 1 for even, col 2 for odd at md+. */}
              <div
                className={cn(
                  "md:col-span-1",
                  side === "start" ? "md:col-start-1" : "md:col-start-2",
                )}
              >
                <ExperienceCard entry={entry} locale={locale} side={side} />
              </div>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}
