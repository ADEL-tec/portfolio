"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { portfolioData, pickList, type Locale } from "@/lib/data";
import { asset } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

interface AboutProps {
  /**
   * Eagerly load the portrait. Set on `/about`, where it sits above the
   * fold and is the LCP element; left off on the home page, where it's far
   * below the fold and preloading it would compete with the hero.
   */
  priority?: boolean;
}

/**
 * About section — portrait alongside the narrative.
 *
 * The portrait is desaturated and washed with the brand accent via a
 * `color` blend, which collapses the photo into the two-tone palette so it
 * sits with the rest of the page instead of introducing a third colour.
 */
export function About({ priority = false }: AboutProps) {
  const t = useTranslations("About");
  const locale = useLocale() as Locale;
  const { personal } = portfolioData;

  const focusAreas = pickList(personal.focusAreas, locale);

  return (
    <motion.section
      id="about"
      aria-labelledby="about-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1, 0.05)}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
        {/* ─── Portrait ────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative w-full max-w-80 shrink-0"
        >
          <TickFrame />
          <div className="relative overflow-hidden border border-border">
            <Image
              src={asset(personal.avatar)}
              alt={personal.fullName}
              width={640}
              height={640}
              priority={priority}
              sizes="20rem"
              className="block h-auto w-full grayscale contrast-[1.05]"
            />
            {/* Duotone wash — `color` blend keeps the photo's luminance and
                takes its hue from the accent. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-brand-500 mix-blend-color"
            />
          </div>
        </motion.div>

        {/* ─── Narrative ───────────────────────────────────────────── */}
        <div className="min-w-70 flex-[1_1_26rem]">
          <motion.p variants={fadeUp} className="eyebrow mb-3.5">
            {t("title")}
          </motion.p>

          <motion.h2
            id="about-heading"
            variants={fadeUp}
            className="max-w-140 text-section font-heading font-bold text-foreground"
          >
            {t("heading")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-150 leading-relaxed text-muted-foreground"
          >
            {t("bio")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-150 leading-relaxed text-muted-foreground"
          >
            {t("extended")}
          </motion.p>

          {/* Capability pills — outlined in the accent rather than filled, so
              they read as annotations on the copy, not as buttons. */}
          <motion.ul variants={fadeUp} className="mt-7 flex flex-wrap gap-2.5">
            {focusAreas.map((area) => (
              <li
                key={area}
                className="border border-brand-500 px-3.5 py-1.5 text-[0.8125rem] text-brand-700 dark:text-brand-300"
              >
                {area}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.section>
  );
}
