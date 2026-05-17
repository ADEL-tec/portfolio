import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Locale } from "@/i18n/routing";
import type { Localized } from "@/lib/data";

// ─── Class names ───────────────────────────────────────────────────────────

/**
 * Compose className strings, deduping Tailwind utilities so later classes
 * actually win. Use everywhere class lists are conditional.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Dates ─────────────────────────────────────────────────────────────────

/**
 * Locale-aware date formatter. Pass `'en' | 'fr' | 'ar'` and the value is
 * formatted using `Intl.DateTimeFormat` — including Arabic numerals,
 * native month names, and locale-specific ordering.
 *
 * Accepts a `Date`, an epoch number, or any ISO string. Returns `''` if the
 * input can't be parsed — never throws, so it's safe in render.
 */
export function formatDate(
  value: Date | string | number,
  locale: Locale = "en",
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  // Map our short locale codes to BCP-47 tags Intl recognizes natively.
  const bcp47 = { en: "en-US", fr: "fr-FR", ar: "ar-EG" }[locale];
  return new Intl.DateTimeFormat(bcp47, options).format(d);
}

/** Format a date range like `"Jun 2025 — Present"`. */
export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number | null | undefined,
  locale: Locale = "en",
  presentLabel: string = "Present",
): string {
  const startStr = formatDate(start, locale, { year: "numeric", month: "short" });
  if (end == null) return `${startStr} — ${presentLabel}`;
  const endStr = formatDate(end, locale, { year: "numeric", month: "short" });
  return `${startStr} — ${endStr}`;
}

// ─── Localized text ────────────────────────────────────────────────────────

/**
 * Pick the value for `locale` from a `Localized` object, falling back to
 * English. Equivalent to `pick()` in `lib/data.ts` — re-exported here so
 * components have one place to import all string utilities from.
 */
export function getLocalizedText(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}

// ─── Scroll ────────────────────────────────────────────────────────────────

/**
 * Smooth-scroll the page to an element by id (or accepts a leading `#`).
 * Respects the user's `prefers-reduced-motion` setting via the browser's
 * own `scrollIntoView` honoring of the media query — no extra check needed.
 */
export function scrollToSection(
  target: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" },
): boolean {
  if (typeof document === "undefined") return false;
  const id = target.startsWith("#") ? target.slice(1) : target;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView(options);
  return true;
}

// ─── Clipboard ─────────────────────────────────────────────────────────────

/**
 * Copy text to the clipboard. Returns `true` on success.
 *
 * The function form is convenient for one-off calls (`onClick`); for UI that
 * needs to show a "Copied!" state, prefer the `useClipboard` hook.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ─── Resume download ───────────────────────────────────────────────────────

/**
 * Trigger a download of the resume PDF. Defaults to `/resume.pdf` (place
 * the file under `public/`) but accepts an override for hosted URLs.
 *
 * Uses the standard anchor-trick rather than `window.open` so the browser
 * treats it as a download even when the server doesn't send
 * `Content-Disposition: attachment`.
 */
export function downloadResume(
  url: string = "/resume.pdf",
  filename: string = "adel-labdelli-merioua-resume.pdf",
): void {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ─── Misc ──────────────────────────────────────────────────────────────────

/** Build an absolute URL from the configured site origin and a path. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/**
 * Prepend the configured basePath to a public-asset URL.
 *
 * Required for image `src` and other static-asset paths in static export
 * builds: `next/image` with `unoptimized: true` does NOT apply `basePath`
 * to the rendered `<img src>`, so we have to do it ourselves.
 *
 * In dev (NEXT_PUBLIC_BASE_PATH unset), this is a no-op. External URLs
 * (anything starting with `http`) are returned unchanged.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path || /^https?:/.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
