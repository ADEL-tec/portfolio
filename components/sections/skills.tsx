"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Cloud,
  Code2,
  Database,
  Server,
  Smartphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { SectionHeading } from "./section-heading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import {
  portfolioData,
  pick,
  type Locale,
  type SkillCategory,
  type SkillGroup,
} from "@/lib/data";

/** One glyph per category — the only decoration each cell gets. */
const CATEGORY_ICON: Record<SkillCategory, LucideIcon> = {
  mobile: Smartphone,
  backend: Server,
  frontend: Code2,
  databases: Database,
  cloud: Cloud,
  tools: Wrench,
  architecture: Boxes,
};

/**
 * Skills matrix — one ruled table rather than a set of floating cards.
 *
 * Cells draw only their own inline-end and block-end edges and the container
 * draws the two outside ones, so neighbours share a single hairline and the
 * grid reads as one object however the columns reflow.
 *
 * Proficiency shows as a word beside each item rather than a progress bar:
 * these are self-assessed, and a bar implies a precision they don't have.
 */
export function Skills() {
  const t = useTranslations("Skills");
  const locale = useLocale() as Locale;
  const groups = portfolioData.skills;

  return (
    <motion.section
      id="skills"
      aria-labelledby="skills-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.05)}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <SectionHeading
        id="skills-heading"
        eyebrow={t("title")}
        heading={t("subtitle")}
        headingClassName="max-w-160"
        className="mb-10"
      />

      <motion.div
        variants={fadeUp}
        className="relative grid border-s border-t border-border sm:grid-cols-2 lg:grid-cols-3"
      >
        <TickFrame />
        {groups.map((group) => (
          <SkillCell key={group.category} group={group} locale={locale} />
        ))}
      </motion.div>
    </motion.section>
  );
}

function SkillCell({ group, locale }: { group: SkillGroup; locale: Locale }) {
  const Icon = CATEGORY_ICON[group.category];

  return (
    <div className="border-b border-e border-border px-6 py-7">
      <Icon
        className="mb-3.5 size-5 text-brand-500 dark:text-brand-400"
        aria-hidden="true"
      />
      <h3 className="mb-2.5 font-heading text-[1.0625rem] font-semibold text-foreground">
        {pick(group.title, locale)}
      </h3>
      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {group.items.map((item) => {
          const name = typeof item === "string" ? item : item.name;
          const level = typeof item === "string" ? null : item.level;
          return (
            <li key={name} className="flex items-baseline justify-between gap-3">
              <span>{name}</span>
              {level && (
                <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.06em] text-foreground/35">
                  {level}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
