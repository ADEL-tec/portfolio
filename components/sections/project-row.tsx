"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { TickFrame } from "@/components/ui/tick-frame";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { asset, cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";
import { pick, type Locale, type Project } from "@/lib/data";

interface ProjectRowProps {
  project: Project;
  locale: Locale;
  /** Mirror the row so consecutive projects alternate down the page. */
  reversed?: boolean;
}

/**
 * Full-width project row: device on one side, the write-up on the other,
 * mirroring on alternate rows so the page zig-zags rather than marching.
 *
 * The mirror is done with flex `order` at `lg` only. Below that the row
 * stacks device-then-copy every time, which keeps the reading order stable
 * and stops the alternation from looking like a mistake on a phone.
 */
export function ProjectRow({ project, locale, reversed = false }: ProjectRowProps) {
  const t = useTranslations("Projects");

  const title = pick(project.title, locale);
  const subtitle = pick(project.subtitle, locale);
  const description = pick(project.description, locale);
  const metric = pick(project.metric, locale);

  // A phone chassis only works with a true portrait capture. Landscape hero
  // art letterboxed inside one reads as a broken image, and cropping it to
  // the chassis leaves a narrow vertical strip of the middle — so projects
  // without screenshots get a framed panel at the artwork's own aspect
  // instead. Drop portrait captures into `images` to promote a row to a device.
  const portrait = project.images[0];

  return (
    <motion.article
      variants={fadeUp}
      className="relative flex flex-col items-center gap-x-12 gap-y-8 border border-border p-6 sm:p-10 lg:flex-row"
    >
      <TickFrame />

      <div className={cn("shrink-0", reversed && "lg:order-2")}>
        {portrait ? (
          <PhoneMockup src={portrait} alt={title} width={190} tilt />
        ) : (
          <div className="w-full max-w-72 border border-border lg:w-72">
            <Image
              src={asset(project.image)}
              alt={title}
              width={832}
              height={406}
              sizes="(max-width: 1024px) 100vw, 18rem"
              className="block h-auto w-full"
            />
          </div>
        )}
      </div>

      <div className={cn("min-w-0 flex-1", reversed && "lg:order-1")}>
        <div className="mb-3.5 flex items-center gap-3">
          {/* Monogram tile — stands in for a client logo we don't have. */}
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center bg-brand-950 font-heading text-[0.9375rem] font-bold tracking-tight text-surface-50 dark:bg-brand-900"
          >
            {project.monogram}
          </span>
          <div className="min-w-0">
            <p className="mb-0.5 text-[0.6875rem] uppercase tracking-[0.08em] text-brand-600 dark:text-brand-400">
              {subtitle}
            </p>
            <h3 className="font-heading text-[1.625rem] font-semibold leading-tight text-foreground">
              {title}
            </h3>
          </div>
        </div>

        <p className="max-w-120 leading-relaxed text-muted-foreground">
          {description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="bg-secondary px-2.75 py-1 text-[0.6875rem] text-secondary-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
          <TrendingUp className="size-3.5 shrink-0" aria-hidden="true" />
          {metric}
        </p>

        <Link
          href={`/projects/${project.id}`}
          className="mt-4.5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-brand-700 transition-colors hover:text-brand-950 dark:text-brand-300 dark:hover:text-brand-100"
        >
          {t("viewProject")}
          <ArrowRight
            className="size-3.5 rtl:rotate-180"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
}
