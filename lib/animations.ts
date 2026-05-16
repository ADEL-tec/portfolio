/**
 * Reusable Framer Motion variants and helpers.
 *
 * All variants share the same `hidden` / `visible` state names so a parent
 * `staggerContainer` can drive children automatically with one `animate` prop.
 * The cubic-bezier easing is a "smooth-out" curve that lands more elegantly
 * than the default `ease-in-out` for typography and cards.
 *
 * Reduced-motion is honored via the global CSS rule in `app/globals.css` —
 * variants here don't need their own check.
 */

import type { Transition, Variants } from "framer-motion";

const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];
const easeInOut: Transition["ease"] = [0.4, 0, 0.2, 1];

/** Named durations matching the design system's transition tiers. */
export const durations = {
  fast: 0.25,
  base: 0.45,
  slow: 0.7,
  hero: 0.9,
} as const;

export const transitions = {
  fast: { duration: durations.fast, ease: easeOut },
  base: { duration: durations.base, ease: easeOut },
  slow: { duration: durations.slow, ease: easeOut },
  hero: { duration: durations.hero, ease: easeOut },
  spring: { type: "spring", stiffness: 260, damping: 22 },
} as const;

// ─── Atomic variants ───────────────────────────────────────────────────────

/** Fade only — for elements that shouldn't translate (icons, dividers). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

/** Fade + rise 16px — the workhorse for section content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

/** Fade + drop from above — use for headers / toast banners. */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

/** Scale from 96% — good for cards entering the viewport. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.base },
};

// ─── Directional slide ────────────────────────────────────────────────────

export type SlideDirection = "up" | "down" | "left" | "right";

/**
 * Slide in from a given direction. Distance and duration are configurable;
 * defaults read well at body-copy scale. Use for cards, list items, or any
 * content that should feel like it's coming "from" a specific edge.
 */
export function slideIn(
  direction: SlideDirection = "up",
  distance: number = 24,
  duration: number = durations.base,
): Variants {
  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "down"
        ? { y: -distance }
        : direction === "left"
          ? { x: distance }
          : { x: -distance };

  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: easeOut },
    },
  };
}

// ─── Containers ───────────────────────────────────────────────────────────

/**
 * Generic container that fades its children in unison. Use when items
 * should appear together rather than staggered (e.g. a hero with one
 * headline and one CTA).
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easeInOut },
  },
};

/**
 * Container that staggers its direct children. Pair with `fadeUp` /
 * `scaleIn` / `slideIn(...)` variants on each child — they all share
 * `hidden` / `visible` names so one parent `animate` drives the tree.
 */
export function staggerContainer(
  stagger: number = 0.08,
  delayChildren: number = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}

// ─── Text ─────────────────────────────────────────────────────────────────

/**
 * Variants for animating headings or paragraphs as a whole. For per-word
 * reveal, split the text into words/characters and apply `textCharVariants`
 * to each, wrapped in a `staggerContainer`.
 */
export const textVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easeOut },
  },
};

/** Per-character variant. Wrap each character in a `motion.span` and
 *  combine with `staggerContainer(0.03)` for a hand-typed feel. */
export const textCharVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

// ─── Interaction presets ──────────────────────────────────────────────────

/** Hover lift + tap shrink, attach with `{...hoverLift}` on a motion element. */
export const hoverLift = {
  whileHover: { y: -2, transition: transitions.fast },
  whileTap: { scale: 0.98, transition: transitions.fast },
} as const;

/** Standard `whileInView` config — animate once when 20% is visible. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
