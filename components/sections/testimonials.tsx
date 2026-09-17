"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLocale } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { pick, portfolioData, type Locale, type Localized } from "@/lib/data";

/** Section copy is inline (not in the messages bundle) so locale tweaks are
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
 * Testimonials — a short grid of framed pull-quotes.
 *
 * Stars are tinted with the brand accent rather than the usual gold: the
 * page runs on two colours, and a third one here would pull the eye to the
 * rating instead of the quote.
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
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <SectionHeading
        id="testimonials-heading"
        eyebrow={pick(COPY.eyebrow, locale)}
        heading={pick(COPY.heading, locale)}
        headingClassName="max-w-160"
        className="mb-11"
      />

      <div
        className={cn(
          "grid gap-8",
          testimonials.length === 1 ? "max-w-2xl" : "sm:grid-cols-2",
        )}
      >
        {testimonials.map((item) => (
          <motion.figure
            key={item.id}
            variants={fadeUp}
            className="relative flex flex-col border border-border p-6 sm:p-8"
          >
            <TickFrame />

            <div
              className="mb-4 flex items-center gap-0.5"
              aria-label={`${item.rating} / 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < item.rating
                      ? "fill-brand-500 text-brand-500 dark:fill-brand-400 dark:text-brand-400"
                      : "text-foreground/20",
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>

            <blockquote className="leading-relaxed text-foreground/90">
              &ldquo;{pick(item.quote, locale)}&rdquo;
            </blockquote>

            <figcaption className="mt-5 border-t border-border pt-4">
              <p className="font-heading text-[0.9375rem] font-semibold text-foreground">
                {item.author}
              </p>
              <p className="text-[0.8125rem] text-muted-foreground">
                {pick(item.position, locale)} · {item.company}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}
