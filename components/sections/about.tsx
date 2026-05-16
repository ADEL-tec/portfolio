"use client";

import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { portfolioData, pick, type Locale } from "@/lib/data";
import { downloadResume } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";

/**
 * About section. Two-column on desktop:
 *   • Left: eyebrow → heading → bio → CTAs
 *   • Right: stat grid (years, projects, technologies)
 *
 * Stats are derived from `portfolioData` at render time so they stay in
 * sync as the data file grows. The years value drives an ICU plural via
 * the `About.yearsExperience` message.
 */
export function About() {
  const t = useTranslations("About");
  const locale = useLocale() as Locale;

  const { personal, projects, skills } = portfolioData;
  const technologiesCount = skills.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  const stats = [
    {
      value: personal.yearsExperience,
      label: t("yearsLabel"),
      ariaLabel: t("yearsExperience", { count: personal.yearsExperience }),
    },
    {
      value: projects.length,
      label: t("projectsLabel"),
    },
    {
      value: `${technologiesCount}+`,
      label: t("technologiesLabel"),
    },
  ];

  return (
    <motion.section
      id="about"
      aria-labelledby="about-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1, 0.05)}
      className="relative mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
        {/* ─── Left: copy ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400"
          >
            {t("title")}
          </motion.p>

          <motion.h2
            id="about-heading"
            variants={fadeUp}
            className="text-section font-bold tracking-tight text-foreground"
          >
            {t("heading")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-lg leading-relaxed text-foreground/90"
          >
            {pick(personal.bio, locale)}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            {t("extended")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-4">
            <Button onClick={() => downloadResume()} className="group">
              <Download
                className="size-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden="true"
              />
              {t("downloadCv")}
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                <Mail className="size-4" aria-hidden="true" />
                {t("contactMe")}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* ─── Right: stats card ──────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-sm"
        >
          {/* Decorative gradient corner */}
          <div
            className="bg-gradient-hero pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-20 blur-3xl"
            aria-hidden="true"
          />

          <dl className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1"
                aria-label={stat.ariaLabel}
              >
                <dt className="text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">📍</span>
              <span className="text-foreground">
                {pick(personal.location, locale)}
              </span>
            </div>
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-baseline gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>✉</span>
              <span className="font-mono text-xs">{personal.email}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
