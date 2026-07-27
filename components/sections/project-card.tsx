"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { TickFrame } from "@/components/ui/tick-frame";
import { asset, cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";
import { pick, pickList, type Locale, type Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  /** Render as a stagger child. Off when the card isn't inside a container. */
  asMotionItem?: boolean;
}

/**
 * Project card for grid contexts — the `/projects` index and the related
 * strip on a detail page. The home page uses `ProjectRow` instead, which
 * has room for a device and the full write-up.
 *
 * Framed rather than filled: a hairline border with corner ticks, matching
 * every other block on the site. The accent only appears on hover, so a
 * grid of these reads as a calm list until the pointer picks one out.
 */
export function ProjectCard({
  project,
  locale,
  asMotionItem = true,
}: ProjectCardProps) {
  const t = useTranslations("Projects");

  const title = pick(project.title, locale);
  const description = pick(project.description, locale);
  const highlights = pickList(project.highlights, locale);
  const statusLabel =
    project.status === "in-progress"
      ? t("status.inProgress")
      : t(`status.${project.status}`);

  return (
    <motion.article
      variants={asMotionItem ? fadeUp : undefined}
      className="group relative flex h-full flex-col border border-border transition-colors hover:border-brand-500"
    >
      <TickFrame />

      {/* ─── Image ───────────────────────────────────────────────── */}
      <Link
        href={`/projects/${project.id}`}
        className="relative block aspect-16/10 overflow-hidden border-b border-border bg-brand-950"
        aria-label={title}
      >
        {/* Sits under the image so a project without artwork still reads as a
            deliberate tile rather than an empty dark rectangle. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-heading text-6xl font-bold text-surface-50/80"
        >
          {title.charAt(0).toUpperCase()}
        </span>
        {project.image && (
          <Image
            src={asset(project.image)}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute top-3 inset-e-3 bg-background/85 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.06em] text-foreground backdrop-blur-sm">
          {statusLabel}
        </span>
      </Link>

      {/* ─── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center bg-brand-950 font-heading text-[0.8125rem] font-bold text-surface-50 dark:bg-brand-900"
          >
            {project.monogram}
          </span>
          <Link
            href={`/projects/${project.id}`}
            className="font-heading text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
          >
            {title}
            <ArrowUpRight
              className="ms-1 inline size-3.5 -translate-y-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="bg-secondary px-2.5 py-0.5 text-[0.6875rem] text-secondary-foreground"
            >
              {tech}
            </li>
          ))}
          {project.technologies.length > 4 && (
            <li className="border border-border px-2.5 py-0.5 text-[0.6875rem] text-muted-foreground">
              +{project.technologies.length - 4}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <ul className="flex flex-wrap gap-1.5">
            {highlights.slice(0, 2).map((h) => (
              <li
                key={h}
                className="border border-border px-2.5 py-0.5 text-[0.6875rem] text-muted-foreground"
              >
                {h}
              </li>
            ))}
          </ul>
          <ProjectLinks project={project} t={t} />
        </div>
      </div>
    </motion.article>
  );
}

// ─── External links row ───────────────────────────────────────────────────

interface ProjectLinksProps {
  project: Project;
  t: ReturnType<typeof useTranslations<"Projects">>;
}

function ProjectLinks({ project, t }: ProjectLinksProps) {
  const links: Array<{ href: string; label: string }> = [];
  if (project.links.playStore) {
    links.push({ href: project.links.playStore, label: t("playStore") });
  }
  if (project.links.appStore) {
    links.push({ href: project.links.appStore, label: t("appStore") });
  }
  if (project.links.github) {
    links.push({ href: project.links.github, label: t("viewCode") });
  }
  if (links.length === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={link.label}
          title={link.label}
          className={cn(
            "inline-flex size-7 items-center justify-center border border-border text-muted-foreground",
            "transition-colors hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400",
          )}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
