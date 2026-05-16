"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeUp, hoverLift } from "@/lib/animations";
import { pick, pickList, type Locale, type Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  /** Render compactly inside grids that already animate as a stagger. */
  asMotionItem?: boolean;
}

/**
 * Single project card. Layout:
 *   • Image header with hover zoom + corner-status badge
 *   • Title + short description
 *   • Tech badges (truncated past 5; rest collapsed into a "+N more" badge)
 *   • Highlights row (small outline pills)
 *   • External-link icons surface from the bottom on hover
 *
 * The whole card is wrapped in next-intl's `<Link>` to the detail page,
 * with external store links rendered as separate `<a>` tags inside that
 * stop propagation so they don't trigger the navigation.
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

  const Wrapper = asMotionItem ? motion.article : "article";
  const motionProps = asMotionItem
    ? { variants: fadeUp, ...hoverLift }
    : (hoverLift as Record<string, unknown>);

  return (
    <Wrapper
      {...motionProps}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-900/5"
    >
      {/* ─── Image header ────────────────────────────────────────── */}
      <Link
        href={`/projects/${project.id}`}
        className="relative block aspect-16/10 overflow-hidden"
        aria-label={title}
      >
        <ProjectImage src={project.image} title={title} />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
        <Badge
          variant={project.status === "published" ? "default" : "outline"}
          className="absolute top-3 inset-e-3 backdrop-blur-sm"
        >
          {statusLabel}
        </Badge>
      </Link>

      {/* ─── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <header className="flex flex-col gap-1.5">
          <Link
            href={`/projects/${project.id}`}
            className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
          >
            {title}
            <ArrowUpRight
              className="ms-1 inline size-3.5 -translate-y-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </header>

        {/* Tech stack */}
        <ul className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Badge variant="secondary" className="font-normal">
                {tech}
              </Badge>
            </li>
          ))}
          {project.technologies.length > 5 && (
            <li>
              <Badge variant="outline" className="font-normal">
                +{project.technologies.length - 5}
              </Badge>
            </li>
          )}
        </ul>

        {/* Highlights row + external links pinned to the bottom */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <ul className="flex flex-wrap gap-1.5">
            {highlights.slice(0, 2).map((h) => (
              <li key={h}>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  {h}
                </Badge>
              </li>
            ))}
          </ul>

          <ProjectLinks project={project} t={t} />
        </div>
      </div>
    </Wrapper>
  );
}

// ─── Project image with graceful fallback ─────────────────────────────────

function ProjectImage({ src, title }: { src: string; title: string }) {
  // No images on disk yet — render a tasteful gradient with the project
  // initial. Once the user adds `public/images/projects/*.jpg`, the path
  // takes over and the placeholder never paints.
  const initial = title.charAt(0).toUpperCase();

  return (
    <>
      <div
        className="bg-gradient-hero absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/80"
        aria-hidden="true"
      >
        {initial}
      </div>
      {src && (
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="relative object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </>
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
    <div className="flex items-center gap-1.5">
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
            "inline-flex size-7 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground",
            "transition-all hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400",
          )}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
