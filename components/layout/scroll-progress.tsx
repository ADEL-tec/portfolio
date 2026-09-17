"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Hairline reading-progress bar pinned to the top of the viewport.
 *
 * Driven by `scaleX` rather than `width` so the browser can composite it on
 * the GPU — this repaints on every scroll frame, and animating `width` would
 * force layout each time. `origin-left` (mirrored under RTL) makes the
 * transform grow from the leading edge.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-brand-500 rtl:origin-right dark:bg-brand-400"
    />
  );
}
