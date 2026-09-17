"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { SectionHeading } from "./section-heading";
import { ExperienceCard } from "./experience-card";
import { staggerContainer, viewportOnce } from "@/lib/animations";
import { getExperiences, type Locale } from "@/lib/data";

/**
 * Work history as a single left-anchored timeline.
 *
 * A hairline rail runs the height of the list with an accent fill that
 * tracks scroll position, so the reader can see how far through the history
 * they are. The fill is driven by `scaleY` on a full-height element rather
 * than an animated `height`, keeping it off the layout path — this updates
 * on every scroll frame.
 *
 * The offsets put the fill at 0 when the list's top reaches 70% down the
 * viewport and at 1 when its bottom does, so it completes as the last role
 * comes into view rather than only after the section has scrolled past.
 */
export function Experience() {
  const t = useTranslations("Experience");
  const locale = useLocale() as Locale;
  const entries = getExperiences();

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 70%"],
  });

  return (
    <motion.section
      id="experience"
      aria-labelledby="experience-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.05)}
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <SectionHeading
        id="experience-heading"
        eyebrow={t("title")}
        heading={t("subtitle")}
        headingClassName="max-w-160"
        className="mb-11"
      />

      <div ref={railRef} className="flex gap-8">
        {/* Rail + scroll-tracking fill */}
        <div
          aria-hidden="true"
          className="relative w-0.5 shrink-0 bg-border"
        >
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute inset-0 origin-top bg-brand-500 dark:bg-brand-400"
          />
        </div>

        <ol className="flex min-w-0 flex-1 flex-col gap-9">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              {/* Node, pulled back over the rail. */}
              <span
                aria-hidden="true"
                className="absolute top-1 -inset-s-10 size-3.5 rounded-full border-2 border-brand-500 bg-background dark:border-brand-400"
              />
              <ExperienceCard entry={entry} locale={locale} />
            </li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
}
