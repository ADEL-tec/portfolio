"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
import { portfolioData, pick, type Locale } from "@/lib/data";
import { downloadResume } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

/**
 * "At a glance" — the six things a recruiter hunts for, in one ruled strip
 * directly under the hero: where, when available, how long, what's shipped,
 * which stack, and where to find the CV and profiles.
 *
 * Same ruled-grid recipe as the skills matrix: cells draw their own end and
 * bottom edges, the container draws the other two, so neighbours share one
 * hairline however the columns reflow. Every figure is derived from
 * `portfolioData` so it can't drift from the rest of the site.
 */
export function QuickFacts() {
  const t = useTranslations("QuickFacts");
  const locale = useLocale() as Locale;
  const { personal, projects, social } = portfolioData;

  const storeCount = new Set(
    projects.flatMap((p) =>
      [
        p.links.playStore ? "play" : null,
        p.links.appStore ? "app" : null,
      ].filter(Boolean),
    ),
  ).size;

  return (
    <motion.section
      id="at-a-glance"
      aria-label={t("label")}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.06)}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 sm:px-8 lg:px-12"
    >
      <motion.dl
        variants={fadeUp}
        className="relative grid border-s border-t border-border sm:grid-cols-3 lg:grid-cols-6"
      >
        <TickFrame />

        <Fact label={t("location")}>{pick(personal.location, locale)}</Fact>
        <Fact label={t("availability")}>
          <span className="text-brand-700 dark:text-brand-300">
            {pick(personal.availability, locale)}
          </span>
        </Fact>
        <Fact label={t("experience")}>
          {t("years", { count: personal.yearsExperience })}
        </Fact>
        <Fact label={t("shipped")}>
          {t("shippedValue", { apps: projects.length, stores: storeCount })}
        </Fact>
        <Fact label={t("stack")}>{personal.coreStack.join(" · ")}</Fact>
        <Fact label={t("links")}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadResume(personal.resumeUrl)}
              className="inline-flex h-8 items-center gap-1.5 border border-brand-500 bg-brand-500 px-2.5 font-heading text-[0.8125rem] font-semibold text-white transition-colors hover:border-brand-700 hover:bg-brand-700"
            >
              <Download className="size-3.5" aria-hidden="true" />
              {t("cv")}
            </button>
            <IconLink href={social.github} label="GitHub">
              <GithubMark className="size-3.5" aria-hidden="true" />
            </IconLink>
            <IconLink href={social.linkedin} label="LinkedIn">
              <LinkedinMark className="size-3.5" aria-hidden="true" />
            </IconLink>
          </div>
        </Fact>
      </motion.dl>
    </motion.section>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-e border-border px-5 py-4">
      <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-[0.9375rem] font-medium leading-snug text-foreground">
        {children}
      </dd>
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center border border-border text-foreground transition-colors hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
    >
      {children}
    </a>
  );
}
