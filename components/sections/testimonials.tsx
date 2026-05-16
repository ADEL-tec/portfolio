"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
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
  type Locale,
  type Localized,
} from "@/lib/data";

/** Section copy is inline (not in messages bundle) so locale tweaks are
 *  a single-file edit. */
const COPY = {
  eyebrow: {
    en: "Testimonials",
    fr: "Témoignages",
    ar: "آراء العملاء",
  } satisfies Localized,
  heading: {
    en: "What people say about working with me",
    fr: "Ce que disent les personnes avec qui j'ai travaillé",
    ar: "ما يقوله من تعاملوا معي",
  } satisfies Localized,
};

/**
 * Testimonials. Renders a small grid of pull-quote cards backed by
 * `portfolioData.testimonials`. Star rating sits below the quote, author
 * meta below the rating.
 *
 * With only a handful of entries we render as a static grid rather than a
 * carousel — keeps motion budget low and skips the dependency on a
 * carousel primitive.
 */
export function Testimonials() {
  const locale = useLocale() as Locale;
  const testimonials = portfolioData.testimonials;

  if (testimonials.length === 0) return null;

  return (
    <motion.section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1, 0.05)}
      className="relative mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24"
    >
      <header className="mb-12 flex flex-col items-center gap-3 text-center">
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400"
        >
          {pick(COPY.eyebrow, locale)}
        </motion.p>
        <motion.h2
          id="testimonials-heading"
          variants={fadeUp}
          className="max-w-2xl text-section font-bold tracking-tight text-foreground"
        >
          {pick(COPY.heading, locale)}
        </motion.h2>
      </header>

      <div
        className={cn(
          "grid gap-6",
          testimonials.length === 1
            ? "max-w-2xl mx-auto"
            : "sm:grid-cols-2",
        )}
      >
        {testimonials.map((t) => (
          <motion.figure
            key={t.id}
            variants={fadeUp}
            className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-900/5"
          >
            <Quote
              className="absolute top-6 inset-e-6 size-6 text-brand-500/30"
              aria-hidden="true"
            />
            <blockquote className="text-base leading-relaxed text-foreground">
              &ldquo;{pick(t.quote, locale)}&rdquo;
            </blockquote>
            <div
              className="flex items-center gap-0.5"
              aria-label={`${t.rating} / 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < t.rating
                      ? "fill-orange-400 text-orange-400"
                      : "text-muted-foreground/30",
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <figcaption className="flex flex-col gap-0.5 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">{t.author}</p>
              <p className="text-xs text-muted-foreground">
                {pick(t.position, locale)} · {t.company}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}
