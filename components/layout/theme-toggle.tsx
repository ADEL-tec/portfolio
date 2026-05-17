"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useTheme, useMounted } from "@/lib/hooks";

/**
 * One-tap light/dark toggle. Sun ↔ Moon swap is animated via AnimatePresence
 * with a brief rotate-and-fade. Server render shows a neutral placeholder
 * (avoids hydration mismatch since the resolved theme isn't known on the
 * server) — see `useMounted`.
 */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useMounted();
  const t = useTranslations("ThemeToggle");

  const isDark = resolvedTheme === "dark";
  // Both the icon AND the a11y label depend on resolvedTheme, which differs
  // between server (default "light") and client (after localStorage + system
  // pref). Before mount, render a neutral label so SSR + first client paint
  // match — the specific value swaps in on the next render.
  const nextLabel = isDark ? t("light") : t("dark");
  const ariaLabel = mounted ? `${t("label")}: ${nextLabel}` : t("label");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={mounted ? nextLabel : undefined}
      className="relative"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-flex"
          >
            {isDark ? (
              <Moon className="size-4" aria-hidden="true" />
            ) : (
              <Sun className="size-4" aria-hidden="true" />
            )}
          </motion.span>
        ) : (
          /* Static fallback during SSR / first paint */
          <Sun className="size-4 opacity-0" aria-hidden="true" />
        )}
      </AnimatePresence>
    </Button>
  );
}
