"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { SkillItem as SkillItemType, SkillLevel } from "@/lib/data";

/**
 * Tailwind class mappings per proficiency level. Kept here (not in the
 * theme) because they're domain-specific: brand-500 conveys "expertise" in
 * this UI, but using `--color-primary` would couple it to shadcn semantics.
 */
const LEVEL_STYLES: Record<
  SkillLevel,
  { bar: string; dot: string; text: string }
> = {
  Expert: {
    bar: "bg-brand-500",
    dot: "bg-brand-500",
    text: "text-brand-600 dark:text-brand-400",
  },
  Advanced: {
    bar: "bg-accent-500",
    dot: "bg-accent-500",
    text: "text-accent-600 dark:text-accent-400",
  },
  Intermediate: {
    bar: "bg-orange-500",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
  },
  Beginner: {
    bar: "bg-surface-500",
    dot: "bg-surface-500",
    text: "text-muted-foreground",
  },
};

interface SkillItemProps {
  skill: SkillItemType;
  /** Stagger delay for the bar fill animation, in seconds. */
  delay?: number;
}

/**
 * Single skill row: name + level label + animated progress bar.
 *
 * The bar animates from 0 to its target percentage the first time it
 * scrolls into view (`whileInView` + `once: true`). The native `title`
 * attribute carries the level + percentage so it's discoverable via hover
 * and via screen readers without an extra tooltip layer.
 */
export function SkillItem({ skill, delay = 0 }: SkillItemProps) {
  const style = LEVEL_STYLES[skill.level];

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group"
      title={`${skill.level} · ${skill.percentage}%`}
    >
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span
            aria-hidden="true"
            className={cn("inline-block size-1.5 rounded-full", style.dot)}
          />
          {skill.name}
        </span>
        <span className={cn("text-xs tabular-nums font-medium", style.text)}>
          {skill.level}
          <span className="ms-1.5 text-muted-foreground">
            {skill.percentage}%
          </span>
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={skill.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={skill.name}
      >
        <motion.div
          className={cn("h-full rounded-full", style.bar)}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 1,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </motion.div>
  );
}
