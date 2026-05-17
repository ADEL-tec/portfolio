"use client";

import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import {
  fadeIn,
  fadeUp,
  fadeDown,
  scaleIn,
  slideIn,
  rotateIn,
  withReducedMotion,
  type SlideDirection,
} from "@/lib/animations";

export type ScrollRevealVariant =
  | "fade"
  | "fadeUp"
  | "fadeDown"
  | "scale"
  | "slide"
  | "rotate";

/** Tag used for the wrapper element. Default `div`. */
type Tag = "div" | "section" | "article" | "li" | "span";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Which entrance variant to use. */
  variant?: ScrollRevealVariant;
  /** Direction for the `"slide"` variant. Ignored otherwise. */
  direction?: SlideDirection;
  /** Seconds before the animation starts. */
  delay?: number;
  /** Fraction of the element that must be visible to trigger (0–1). */
  amount?: number;
  /** Replay every time the element re-enters the viewport. Default false. */
  once?: boolean;
  /** Render tag. Default `div`. */
  as?: Tag;
  className?: string;
  id?: string;
}

/**
 * Reveal-on-scroll wrapper.
 *
 * Drop-in for any block of content that should fade/slide/scale into view
 * the first time it scrolls past 20% visible. Respects
 * `prefers-reduced-motion` automatically — the wrapper still mounts but
 * skips the entrance, so layout-dependent code keeps working.
 *
 * Usage:
 *
 *   <ScrollReveal>
 *     <h2>About</h2>
 *   </ScrollReveal>
 *
 *   <ScrollReveal variant="slide" direction="left" delay={0.1} as="section">
 *     <Card />
 *   </ScrollReveal>
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  direction = "up",
  delay = 0,
  amount = 0.2,
  once = true,
  as = "div",
  ...rest
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseVariants = useMemo<Variants>(() => {
    switch (variant) {
      case "fade":
        return fadeIn;
      case "fadeUp":
        return fadeUp;
      case "fadeDown":
        return fadeDown;
      case "scale":
        return scaleIn;
      case "slide":
        return slideIn(direction);
      case "rotate":
        return rotateIn;
    }
  }, [variant, direction]);

  const variants = prefersReducedMotion
    ? withReducedMotion(baseVariants)
    : baseVariants;

  // Polymorphic motion components don't share a common prop type (each
  // element has its own DOM-event signatures). The spread is runtime-safe;
  // the cast bypasses TS's per-element narrowing.
  const MotionTag = MOTION_TAGS[as] as typeof motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** Pre-resolved motion components per supported tag. */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
} as const;
