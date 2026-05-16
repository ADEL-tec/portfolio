"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  type Locale,
  type ProjectCategory,
} from "@/lib/data";
import { ProjectCard } from "./project-card";

type FilterKey = ProjectCategory | "all";

/**
 * Projects section. Renders a category filter + responsive grid.
 *
 * Filter buttons are derived from the categories that actually appear in
 * the data so the bar doesn't show empty options. "All" is always present.
 * Switching filter animates the grid via `AnimatePresence`.
 */
export function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const projects = portfolioData.projects;

  // Build the filter set dynamically from the data.
  const availableFilters = useMemo<FilterKey[]>(() => {
    const present = new Set<FilterKey>();
    for (const p of projects) present.add(p.category);
    return ["all", ...Array.from(present)];
  }, [projects]);

  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [projects, filter],
  );

  return (
    <motion.section
      id="projects"
      aria-labelledby="projects-heading"
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
          id="projects-heading"
          variants={fadeUp}
          className="text-section font-bold tracking-tight text-foreground"
        >
          {t("subtitle")}
        </motion.h2>
      </header>

      {/* ─── Filter bar ──────────────────────────────────────────── */}
      {availableFilters.length > 2 && (
        <motion.div
          variants={fadeUp}
          role="tablist"
          aria-label={t("title")}
          className="mb-8 flex flex-wrap gap-2"
        >
          {availableFilters.map((key) => {
            const active = filter === key;
            return (
              <Button
                key={key}
                role="tab"
                aria-selected={active}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className={cn("rounded-full transition-all")}
              >
                {filterLabel(t, key)}
              </Button>
            );
          })}
        </motion.div>
      )}

      {/* ─── Grid ────────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={filter}
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.length === 0 ? (
            <motion.p
              variants={fadeUp}
              className="col-span-full py-12 text-center text-muted-foreground"
            >
              {/* Reuse a Common key — no project matches the filter */}
              —
            </motion.p>
          ) : (
            visible.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

// ─── Filter label resolver ────────────────────────────────────────────────

function filterLabel(
  t: ReturnType<typeof useTranslations<"Projects">>,
  key: FilterKey,
): string {
  switch (key) {
    case "all":
      return t("filterAll");
    case "mobile":
      return t("filterMobile");
    case "web":
      return t("filterWeb");
    case "fullstack":
      // Not in the message bundle today — fall back to a sensible literal.
      return "Full-stack";
  }
}
