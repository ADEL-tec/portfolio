"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { downloadResume } from "@/lib/utils";
import { pick, type Locale, type Localized } from "@/lib/data";

const COPY = {
  heading: {
    en: "Ready to build something together?",
    fr: "Prêt à construire quelque chose ensemble ?",
    ar: "هل أنت مستعدّ لنبني شيئًا معًا؟",
  } satisfies Localized,
  body: {
    en: "I'm available for new projects, full-time roles, and consultations. Let's chat about what you're working on.",
    fr: "Je suis disponible pour de nouveaux projets, des postes à temps plein et des consultations. Parlons de ce sur quoi vous travaillez.",
    ar: "متاح لمشاريع جديدة ووظائف بدوام كامل واستشارات. لنتحدّث عمّا تعمل عليه.",
  } satisfies Localized,
};

/**
 * Closing CTA strip for the home page. A gradient card with a heading,
 * a short body, and two buttons (Contact + Download CV).
 *
 * Sits at the bottom of the page composition — the visitor has already
 * scrolled through Hero → About → Projects → Skills → Experience →
 * Education → Testimonials by the time they reach it.
 */
export function CTA() {
  const tHero = useTranslations("Hero");
  const tAbout = useTranslations("About");
  const locale = useLocale() as Locale;

  return (
    <motion.section
      aria-labelledby="cta-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1, 0.05)}
      className="relative mx-auto w-full max-w-6xl px-6 py-16"
    >
      <div className="bg-gradient-hero relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-12 sm:py-20">
        {/* Subtle radial glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.25) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-white">
          <motion.h2
            id="cta-heading"
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {pick(COPY.heading, locale)}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
          >
            {pick(COPY.body, locale)}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/contact">
                {tHero("ctaSecondary")}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => downloadResume()}
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Download className="size-4" aria-hidden="true" />
              {tAbout("downloadCv")}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
