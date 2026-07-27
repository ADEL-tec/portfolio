"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { ProjectRow } from "./project-row";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { getProjects, type Locale } from "@/lib/data";

interface ProjectsProps {
  /**
   * Render the trailing "view all projects" link. Off when this section
   * *is* the `/projects` page — otherwise the link points at the current
   * page.
   */
  showAllLink?: boolean;
}

/**
 * Projects section — every project gets a full row rather than a card in a
 * grid, so each one has room for its device, its stack, and what shipping
 * it actually involved.
 *
 * Shared by the home page and `/projects`, which differ only by that
 * trailing link.
 */
export function Projects({ showAllLink = true }: ProjectsProps) {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const projects = getProjects();

  return (
    <motion.section
      id="projects"
      aria-labelledby="projects-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.05)}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <SectionHeading
        id="projects-heading"
        eyebrow={t("title")}
        heading={t("subtitle")}
        headingClassName="max-w-160"
        className="mb-12"
      />

      <div className="flex flex-col gap-10">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            locale={locale}
            reversed={i % 2 === 1}
          />
        ))}
      </div>

      {showAllLink && (
        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-border px-5.5 py-3 font-heading text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-foreground/6"
          >
            {t("viewAll")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
}
