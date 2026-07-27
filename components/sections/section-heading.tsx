"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

interface SectionHeadingProps {
  /** Uppercase micro-label — the section's name in one or two words. */
  eyebrow: string;
  /** The statement headline. Set in the condensed display cut. */
  heading: string;
  /** Wire to the section's `aria-labelledby`. */
  id?: string;
  /** Cap the headline's measure so it breaks where the design wants it to. */
  headingClassName?: string;
  className?: string;
}

/**
 * The eyebrow-over-headline lockup that opens every section.
 *
 * Both lines animate as stagger children, so the parent section needs to be
 * driving a `staggerContainer` — this renders no container of its own.
 */
export function SectionHeading({
  eyebrow,
  heading,
  id,
  headingClassName,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <motion.p variants={fadeUp} className="eyebrow mb-3.5">
        {eyebrow}
      </motion.p>
      <motion.h2
        id={id}
        variants={fadeUp}
        className={cn(
          "text-section font-heading font-bold text-foreground",
          headingClassName,
        )}
      >
        {heading}
      </motion.h2>
    </div>
  );
}
