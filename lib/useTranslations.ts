"use client";

/**
 * Translation helpers for client components.
 *
 * Three exports, picked based on what the caller actually needs:
 *
 *   useTranslations(ns)  — re-export of next-intl's hook. Type-safe namespace
 *                          and key paths are wired via next-intl.d.ts, so
 *                          `t('greeting')` inside `useTranslations('Hero')`
 *                          autocompletes and fails the build on typos.
 *
 *   useDirection()       — locale-aware direction info only (no translations).
 *
 *   useI18n(ns)          — bundle: { t, locale, dir, isRtl, rtlClass }. Use
 *                          when a component needs both translated copy AND
 *                          to flip layout/animation direction by language.
 *
 * Server components: use `getTranslations` / `getLocale` from `next-intl/server`
 * directly. Hooks can't run there.
 */

import { useLocale, useTranslations as useNextIntlTranslations } from "next-intl";
import { isRtl, type Locale } from "@/i18n/routing";

// Direct re-export — keeps the type-safe overloads from next-intl.
export { useTranslations } from "next-intl";

export type Direction = "ltr" | "rtl";

export function useDirection(): {
  locale: Locale;
  dir: Direction;
  isRtl: boolean;
  /** Class string ready for `className={...}`. Useful for direction-dependent layout. */
  rtlClass: "rtl" | "ltr";
} {
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  return {
    locale,
    dir: rtl ? "rtl" : "ltr",
    isRtl: rtl,
    rtlClass: rtl ? "rtl" : "ltr",
  };
}

type TranslationNamespace = Parameters<typeof useNextIntlTranslations>[0];

export function useI18n<NS extends TranslationNamespace>(namespace?: NS) {
  const t = useNextIntlTranslations(namespace);
  const direction = useDirection();
  return { t, ...direction };
}
