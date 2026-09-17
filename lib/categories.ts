/**
 * Project category registry.
 *
 * One place that knows which categories exist, in which order they're shown,
 * which icon marks each one, and how a project's platforms are labelled.
 * Filter chips, group headings, cards, the detail page, and the JSON-LD
 * builder all read from here — adding a category is a one-line change plus
 * a `Projects.categories.<key>` label in each `messages/*.json`.
 *
 * Kept free of React and of `lib/data` (only a structural type below) so the
 * pure helpers can be unit-tested without the JSON bundle.
 */

import {
  Globe,
  Monitor,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

// ─── Categories ────────────────────────────────────────────────────────────

/** Display order is array order. */
export const PROJECT_CATEGORIES = ["mobile", "web", "desktop", "backend"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** The `?type=` value on `/projects`. `all` is the unfiltered, grouped view. */
export type CategoryFilter = ProjectCategory | "all";

interface CategoryMeta {
  icon: LucideIcon;
  /** schema.org `applicationCategory` for the SoftwareApplication JSON-LD. */
  schemaType: string;
}

export const CATEGORY_META: Record<ProjectCategory, CategoryMeta> = {
  mobile: { icon: Smartphone, schemaType: "MobileApplication" },
  web: { icon: Globe, schemaType: "WebApplication" },
  desktop: { icon: Monitor, schemaType: "DesktopApplication" },
  backend: { icon: Server, schemaType: "SoftwareApplication" },
};

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return (
    typeof value === "string" &&
    (PROJECT_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Coerce a raw `?type=` value. Anything unknown falls back to `all`. */
export function parseCategoryParam(
  raw: string | null | undefined,
): CategoryFilter {
  return isProjectCategory(raw) ? raw : "all";
}

// ─── Platforms ─────────────────────────────────────────────────────────────

export const PLATFORMS = [
  "android",
  "ios",
  "web",
  "windows",
  "macos",
  "linux",
] as const;
export type Platform = (typeof PLATFORMS)[number];

/** Brand spellings — never translated. */
export const PLATFORM_LABEL: Record<Platform, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

export function isPlatform(value: unknown): value is Platform {
  return (
    typeof value === "string" && (PLATFORMS as readonly string[]).includes(value)
  );
}

// ─── Grouping helpers ──────────────────────────────────────────────────────

/** The minimum a project needs to be grouped — keeps this module off `lib/data`. */
interface Categorised {
  category: ProjectCategory;
  order: number;
}

export interface CategoryGroup<T extends Categorised> {
  category: ProjectCategory;
  projects: T[];
}

/**
 * Bucket projects by category in registry order. Empty categories are
 * omitted so callers never render a heading over nothing; within a bucket,
 * projects sort by their `order`.
 */
export function groupProjectsByCategory<T extends Categorised>(
  projects: readonly T[],
): CategoryGroup<T>[] {
  return PROJECT_CATEGORIES.map((category) => ({
    category,
    projects: projects
      .filter((p) => p.category === category)
      .sort((a, b) => a.order - b.order),
  })).filter((group) => group.projects.length > 0);
}

/** Project count per category, zero-filled so chips can test `> 0`. */
export function countByCategory<T extends Categorised>(
  projects: readonly T[],
): Record<ProjectCategory, number> {
  const counts = Object.fromEntries(
    PROJECT_CATEGORIES.map((c) => [c, 0]),
  ) as Record<ProjectCategory, number>;
  for (const p of projects) counts[p.category] += 1;
  return counts;
}
