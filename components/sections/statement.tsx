"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

import { portfolioData, pick, type Locale } from "@/lib/data";
import { fadeUp, viewportOnce } from "@/lib/animations";

/**
 * Full-bleed statement band.
 *
 * The one place on the page that inverts to the deep panel colour, which is
 * what gives the long scroll a midpoint. Sits between Skills and Experience:
 * the reader has just finished a dense table and is about to start another
 * list, so a single sentence on a dark field resets the eye.
 */
export function Statement() {
  const locale = useLocale() as Locale;

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="bg-brand-950 px-6 py-14 text-center sm:px-8 lg:px-12 lg:py-20"
    >
      <p className="mx-auto max-w-205 font-heading text-[clamp(1.5rem,3.4vw,2.375rem)] font-semibold leading-snug tracking-tight text-surface-50">
        {pick(portfolioData.personal.statement, locale)}
      </p>
    </motion.aside>
  );
}
