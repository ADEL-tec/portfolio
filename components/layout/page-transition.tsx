"use client";

import { motion } from "framer-motion";

import { usePathname } from "@/i18n/navigation";

/**
 * Cross-route fade-up. Keyed on the locale-less pathname so a navigation
 * remounts the wrapper and triggers the entrance variants.
 *
 * Intentionally lightweight: no `AnimatePresence` (it interacts poorly with
 * server-component streaming in App Router) and no exit animation. Routes
 * still pre-render statically; this only adds a 350ms entrance on the
 * client after hydration.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
