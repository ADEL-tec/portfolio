"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { TickFrame } from "@/components/ui/tick-frame";
import { ProjectCard } from "./project-card";
import {
  CATEGORY_META,
  PROJECT_CATEGORIES,
  countByCategory,
  groupProjectsByCategory,
  parseCategoryParam,
  type CategoryFilter,
  type ProjectCategory,
} from "@/lib/categories";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { getProjects, type Locale } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * The `/projects` index: filter chips over a grid.
 *
 * The active filter lives in the URL (`?type=mobile`) so a recruiter can
 * paste a link straight to the mobile work. Reading it needs
 * `useSearchParams`, which forces client rendering up to the nearest
 * Suspense boundary — the page wraps `ProjectsIndexFromParams` in one and
 * uses the unfiltered `ProjectsIndex` as the fallback, so the static HTML
 * still carries every project.
 */
export function ProjectsIndexFromParams() {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get("type"));
  return <ProjectsIndex category={category} />;
}

interface ProjectsIndexProps {
  category: CategoryFilter;
}

export function ProjectsIndex({ category }: ProjectsIndexProps) {
  const locale = useLocale() as Locale;
  const projects = getProjects();
  const counts = countByCategory(projects);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.06, 0.05)}
      className="flex flex-col gap-12"
    >
      <CategoryChips active={category} counts={counts} />

      {category === "all" ? (
        groupProjectsByCategory(projects).map((group) => (
          <CategorySection
            key={group.category}
            category={group.category}
            count={group.projects.length}
          >
            <Grid>
              {group.projects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </Grid>
          </CategorySection>
        ))
      ) : counts[category] > 0 ? (
        <Grid>
          {projects
            .filter((p) => p.category === category)
            .map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
        </Grid>
      ) : (
        <EmptyState category={category} />
      )}
    </motion.div>
  );
}

// ─── Chips ─────────────────────────────────────────────────────────────────

interface CategoryChipsProps {
  active: CategoryFilter;
  counts: Record<ProjectCategory, number>;
}

/**
 * Only categories with at least one project get a chip. A row reading
 * "Web 0 · Desktop 0" would advertise gaps; the chip appears on its own the
 * day the first project of that kind is added.
 */
function CategoryChips({ active, counts }: CategoryChipsProps) {
  const t = useTranslations("Projects");
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const chips: Array<{ value: CategoryFilter; label: string; count: number }> = [
    { value: "all", label: t("all"), count: total },
    ...PROJECT_CATEGORIES.filter((c) => counts[c] > 0).map((c) => ({
      value: c,
      label: t(`categories.${c}`),
      count: counts[c],
    })),
  ];

  return (
    <motion.nav
      variants={fadeUp}
      aria-label={t("filterLabel")}
      className="flex flex-wrap gap-2"
    >
      {chips.map((chip) => {
        const isActive = chip.value === active;
        return (
          <Link
            key={chip.value}
            href={{
              pathname: "/projects",
              query: chip.value === "all" ? undefined : { type: chip.value },
            }}
            replace
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 border px-3.5 py-1.5 font-heading text-[0.9375rem] font-semibold transition-colors",
              isActive
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-border text-foreground hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300",
            )}
          >
            {chip.label}
            <span
              className={cn(
                "text-[0.75rem] font-normal tabular-nums",
                isActive ? "text-white/75" : "text-muted-foreground",
              )}
            >
              {chip.count}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
}

// ─── Building blocks ───────────────────────────────────────────────────────

function CategorySection({
  category,
  count,
  children,
}: {
  category: ProjectCategory;
  count: number;
  children: React.ReactNode;
}) {
  const t = useTranslations("Projects");
  const Icon = CATEGORY_META[category].icon;
  const headingId = `projects-${category}-heading`;

  return (
    <motion.section
      variants={fadeUp}
      aria-labelledby={headingId}
      className="border-t border-border pt-8"
    >
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          id={headingId}
          className="flex items-center gap-2 font-heading text-[1.375rem] font-semibold text-foreground"
        >
          <Icon
            className="size-5 text-brand-500 dark:text-brand-400"
            aria-hidden="true"
          />
          {t(`categories.${category}`)}
        </h2>
        <p className="text-[0.8125rem] tabular-nums text-muted-foreground">
          {t("count", { count })}
        </p>
      </div>
      {children}
    </motion.section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.06)}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {children}
    </motion.div>
  );
}

function EmptyState({ category }: { category: ProjectCategory }) {
  const t = useTranslations("Projects");
  const label = t(`categories.${category}`);

  return (
    <motion.div
      variants={fadeUp}
      className="relative border border-border px-8 py-14 text-center"
    >
      <TickFrame />
      <p className="text-muted-foreground">
        {t("emptyCategory", { category: label.toLowerCase() })}
      </p>
      <Link
        href="/projects"
        replace
        scroll={false}
        className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-brand-700 transition-colors hover:text-brand-950 dark:text-brand-300 dark:hover:text-brand-100"
      >
        {t("browseAll")}
        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
