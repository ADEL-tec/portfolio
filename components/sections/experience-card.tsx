"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";
import { pick, pickList, type ExperienceEntry, type Locale } from "@/lib/data";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  locale: Locale;
  /** Position on the centered timeline at md+. Mobile always renders left. */
  side: "start" | "end";
}

/**
 * One experience row.
 *
 * Layout responsibilities are split between this component and its parent:
 *   • Parent (`Experience`) draws the connector line and the absolute-
 *     positioned dot, owns the grid that alternates left/right at md+.
 *   • This component renders the card body and aligns its text toward the
 *     connector (text-end when on the start side, text-start on the end
 *     side) so descenders never collide with the timeline.
 *
 * Mobile collapses to a single column — `side` is ignored below md.
 */
export function ExperienceCard({ entry, locale, side }: ExperienceCardProps) {
  const role = pick(entry.position, locale);
  const description = pick(entry.description, locale);
  const location = pick(entry.location, locale);
  const start = pick(entry.startDate, locale);
  const end = pick(entry.endDate, locale);
  const responsibilities = pickList(entry.responsibilities, locale);

  // Text alignment toward the connector: left-side cards align right at md+.
  const desktopAlignment =
    side === "start" ? "md:text-end md:items-end" : "md:text-start md:items-start";

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 sm:p-6",
        "transition-all duration-300 hover:border-brand-500/40 hover:bg-card hover:shadow-lg hover:shadow-brand-900/5",
        desktopAlignment,
      )}
    >
      <header className="flex flex-col gap-1">
        <div
          className={cn(
            "flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
            side === "start" && "md:flex-row-reverse",
          )}
        >
          <Briefcase className="size-3.5" aria-hidden="true" />
          <span>
            {start} — {end}
          </span>
          {entry.current && (
            <Badge
              variant="default"
              className="ms-1 h-5 px-2 text-[10px] tracking-normal"
            >
              {/* The "Current" label is locale-aware via the data — we display
                  whatever the user has put in their endDate (e.g. "Present"). */}
              •
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-tight text-foreground">
          {role}
        </h3>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          {entry.company}
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs text-muted-foreground",
            side === "start" && "md:flex-row-reverse",
          )}
        >
          <MapPin className="size-3" aria-hidden="true" />
          <span>{location}</span>
        </p>
      </header>

      <p className="text-sm leading-relaxed text-foreground/90">
        {description}
      </p>

      {/* Responsibilities — collapsed to first 3 on the timeline view to keep
          the rail readable. The full list lives in the data; if a "view all"
          interaction is later wanted, it pulls from the same source. */}
      {responsibilities.length > 0 && (
        <ul
          className={cn(
            "flex flex-col gap-1.5 text-sm text-muted-foreground",
            side === "start" && "md:items-end",
          )}
        >
          {responsibilities.slice(0, 3).map((r) => (
            <li
              key={r}
              className={cn(
                "flex items-start gap-2",
                side === "start" && "md:flex-row-reverse md:text-end",
              )}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-brand-500"
              />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.technologies.length > 0 && (
        <ul
          className={cn(
            "flex flex-wrap gap-1.5 pt-1",
            side === "start" && "md:justify-end",
          )}
        >
          {entry.technologies.map((tech) => (
            <li key={tech}>
              <Badge variant="secondary" className="font-normal">
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}
