"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  portfolioData,
  pick,
  type Locale,
  type SkillCategory as SkillCategoryKey,
} from "@/lib/data";
import { SkillCategory } from "./skill-category";

type FilterKey = SkillCategoryKey | "all";

/**
 * Skills section. Renders the full skill matrix grouped by category, with
 * an optional filter bar to focus on one category at a time.
 *
 * Animation budget:
 *   • The whole section fades up once when it enters the viewport
 *   • Each category card staggers in via `staggerContainer`
 *   • Inside each card, progress bars animate from 0 → target (in SkillItem)
 *
 * Layout: 1 column on mobile, 2 on tablet, 3 on desktop. Keeps card width
 * comfortable for the small text inside without empty wrapping at xl.
 */
export function Skills() {
  const t = useTranslations("Skills");
  const locale = useLocale() as Locale;
  const groups = portfolioData.skills;

  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = useMemo(
    () =>
      filter === "all" ? groups : groups.filter((g) => g.category === filter),
    [groups, filter],
  );

  // Only surface the filter bar when there's enough variety to benefit.
  const showFilters = groups.length > 3;

  return (
    <motion.section
      id="skills"
      aria-labelledby="skills-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.05)}
      className="relative mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24"
    >
      <header className="mb-10 flex flex-col gap-3">
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400"
        >
          {t("title")}
        </motion.p>
        <motion.h2
          id="skills-heading"
          variants={fadeUp}
          className="text-section font-bold tracking-tight text-foreground"
        >
          {t("subtitle")}
        </motion.h2>
      </header>

      {/* ─── Filter bar ──────────────────────────────────────────── */}
      {showFilters && (
        <motion.div
          variants={fadeUp}
          role="tablist"
          aria-label={t("title")}
          className="mb-8 flex flex-wrap gap-2"
        >
          <FilterButton
            label={pick(
              { en: "All", fr: "Tout", ar: "الكل" },
              locale,
            )}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {groups.map((g) => (
            <FilterButton
              key={g.category}
              label={pick(g.title, locale)}
              active={filter === g.category}
              onClick={() => setFilter(g.category)}
            />
          ))}
        </motion.div>
      )}

      {/* ─── Grid ────────────────────────────────────────────────── */}
      <motion.div
        layout
        className={cn(
          "grid gap-6",
          "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {visible.map((group) => (
          <SkillCategory
            key={group.category}
            group={group}
            locale={locale}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <Button
      role="tab"
      aria-selected={active}
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="rounded-full"
    >
      {label}
    </Button>
  );
}
