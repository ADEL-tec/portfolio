"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { ProjectCard } from "./project-card";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { getFeaturedProjects, type Locale } from "@/lib/data";

/** Cap so the strip stays a highlight reel, not the whole index. */
const MAX_FEATURED = 6;

/**
 * Home-page "Selected projects" strip: the featured projects as a card grid
 * with a link on to the full, filterable `/projects` index.
 *
 * A grid rather than full-width rows so the section stays one viewport
 * tall as the project count grows — the rows were four screens of scroll
 * before a recruiter reached the stack and the timeline.
 */
export function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const projects = getFeaturedProjects().slice(0, MAX_FEATURED);

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
        eyebrow={t("featuredEyebrow")}
        heading={t("featuredHeading")}
        headingClassName="max-w-160"
        className="mb-12"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>

      <motion.div variants={fadeUp} className="mt-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 border border-border px-5.5 py-3 font-heading text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-foreground/6"
        >
          {t("viewAll")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </motion.div>
    </motion.section>
  );
}
