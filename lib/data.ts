/**
 * Portfolio data — types, accessors, and localization helpers.
 *
 * The content itself lives in `portfolio-data.json` at the repo root; this
 * module only types it and exposes it. Edit the JSON to update personal info,
 * projects, experience, education, skills, certifications, testimonials, and
 * social links across all three languages. UI chrome (nav labels, form copy,
 * buttons) lives in `messages/*.json` and is managed via next-intl.
 *
 * Every human-readable field is a `Localized` object — `{ en, fr, ar }` —
 * rather than a bare string. Brand names (technologies, company names) and
 * paths stay plain strings, since they aren't translated.
 *
 * Access pattern from components is unchanged:
 *
 *   import { portfolioData, pick, type Locale } from "@/lib/data";
 *   const locale = useLocale() as Locale;
 *   const title  = pick(portfolioData.personal.title, locale);
 */

import raw from "@/portfolio-data.json";

import { routing } from "@/i18n/routing";

// ─── Locale & localization primitives ──────────────────────────────────────

export type Locale = (typeof routing.locales)[number];

/**
 * Multi-locale string. TypeScript enforces that every supported locale is
 * present at compile time — drop a key and the build fails. Add a new locale
 * to `routing.ts` and TS will surface every entry that needs translating.
 */
export type Localized = Record<Locale, string>;

/**
 * Multi-locale list. Use for bulleted features, responsibilities, etc.
 * Length doesn't need to match across locales — each translation is free
 * to phrase items naturally.
 */
export type LocalizedList = Record<Locale, readonly string[]>;

/** Pick the value for the requested locale, with a graceful EN fallback. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}

/** Pick the list for the requested locale, with a graceful EN fallback. */
export function pickList(value: LocalizedList, locale: Locale): readonly string[] {
  return value[locale] ?? value.en;
}

// ─── Type definitions ──────────────────────────────────────────────────────

export type ProjectCategory = "mobile" | "web" | "fullstack";
export type ProjectStatus = "published" | "in-progress" | "archived";

export type SkillCategory =
  | "mobile"
  | "backend"
  | "frontend"
  | "databases"
  | "cloud"
  | "tools"
  | "architecture";

export type SkillLevel = "Expert" | "Advanced" | "Intermediate" | "Beginner";

export type LanguageProficiency =
  | "Native"
  | "Fluent"
  | "Professional"
  | "Intermediate"
  | "Basic";

/** Outbound links a project can ship to. Empty strings are treated as absent. */
export interface ProjectLinks {
  playStore?: string;
  appStore?: string;
  github?: string;
  live?: string;
  caseStudy?: string;
}

export interface Project {
  /** Stable URL-safe slug. Used as the dynamic route segment `/projects/[id]`. */
  id: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Lower-is-earlier — controls the order on the listing page. */
  order: number;
  /** Pin to the homepage "Selected projects" strip. */
  featured: boolean;

  title: Localized;
  subtitle: Localized;
  /** Short blurb (~30 words) for cards. */
  description: Localized;
  /** Long-form copy (~150–250 words) for the project detail page. */
  fullDescription: Localized;

  /** Feature bullets shown on the detail page. */
  features: LocalizedList;
  /** Short highlight pills (e.g. "Production Ready"). */
  highlights: LocalizedList;
  /** Pull-quote / soundbite from a stakeholder. */
  testimonial?: Localized;

  /**
   * Two-letter tile shown beside the project title on the listing rows.
   * Kept explicit rather than derived from the title so multi-word names
   * ("Discount Plus" → DP) don't collide with each other.
   */
  monogram: string;
  /**
   * One-line status shown under the description on the listing rows.
   * Verifiable facts only — where it shipped, what role, what shape of
   * system. Never invented download counts or ratings.
   */
  metric: Localized;

  /** Tech stack tokens (brand names — not translated). */
  technologies: readonly string[];
  /** Translated role title (e.g. "Lead Mobile Developer"). */
  role: Localized;
  /** Translated freeform duration (e.g. "3 months"). */
  duration: Localized;

  /** Hero image path under `/public`. */
  image: string;
  /** Gallery screenshots. */
  images: readonly string[];

  links: ProjectLinks;
}

export interface SkillItem {
  name: string;
  level: SkillLevel;
  /** Self-assessed proficiency, 0–100. Drives bar / ring visualizations. */
  percentage: number;
}

export interface SkillGroup {
  category: SkillCategory;
  title: Localized;
  /** Mixed shape — primary categories carry levels, flat groups are strings. */
  items: readonly (SkillItem | string)[];
}

export interface ExperienceEntry {
  id: number;
  position: Localized;
  company: string;
  /** Optional company URL. */
  companyUrl?: string;
  location: Localized;
  /** Freeform start/end strings — keep locale-friendly ("June 2025" / "juin 2025"). */
  startDate: Localized;
  endDate: Localized;
  /** Computed duration string, also localized. */
  duration: Localized;
  current: boolean;
  description: Localized;
  responsibilities: LocalizedList;
  technologies: readonly string[];
}

export interface EducationEntry {
  id: number;
  degree: Localized;
  institution: Localized;
  university: Localized;
  location: Localized;
  completionDate: string;
  description: Localized;
}

export interface Certification {
  title: Localized;
  issuer: Localized;
  date: string;
  description: Localized;
}

export interface LanguageSkill {
  /** ISO 639-1 code. */
  code: "en" | "fr" | "ar";
  /** Translated language name. */
  name: Localized;
  level: LanguageProficiency;
  percentage: number;
}

export interface Testimonial {
  id: number;
  author: string;
  position: Localized;
  company: string;
  quote: Localized;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface PersonalInfo {
  fullName: string;
  title: Localized;
  /** Rotating job-title phrases shown under the name in the hero. */
  titles: LocalizedList;
  subtitle: Localized;
  location: Localized;
  bio: Localized;
  shortBio: Localized;
  email: string;
  phone: string;
  yearsExperience: number;
  avatar: string;
  backgroundImage: string;
  resumeUrl?: string;

  /** Current hiring status, shown in the contact card. */
  availability: Localized;
  /** Short capability pills under the About copy. */
  focusAreas: LocalizedList;
  /** Statement line for the full-bleed band between Skills and Experience. */
  statement: Localized;
  /**
   * Portrait screenshots for the hero's floating devices, ordered
   * left → centre → right. Needs true phone-aspect images.
   */
  heroScreens: readonly string[];
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  email: string;
  phone: string;
  portfolio?: string;
  twitter?: string;
  instagram?: string;
}

export interface SeoMetadata {
  title: Localized;
  description: Localized;
  keywords: readonly string[];
}

/** The full shape of `portfolio-data.json`. */
export interface PortfolioData {
  personal: PersonalInfo;
  projects: readonly Project[];
  skills: readonly SkillGroup[];
  experience: readonly ExperienceEntry[];
  education: readonly EducationEntry[];
  certifications: readonly Certification[];
  languages: readonly LanguageSkill[];
  testimonials: readonly Testimonial[];
  social: SocialLinks;
  seo: SeoMetadata;
}

// ─── Exported aggregate ────────────────────────────────────────────────────

/**
 * The cast is unavoidable: `resolveJsonModule` types every string in the file
 * as `string`, so the union members (`category: "mobile"`, `level: "Expert"`)
 * widen and no longer satisfy the interfaces. Going through `unknown` keeps
 * that one unchecked boundary in a single place — every consumer downstream
 * still gets the narrow types.
 *
 * Because TS can't verify the JSON against `PortfolioData`, a typo in the file
 * surfaces at runtime rather than at build time. `pnpm test` guards the fields
 * that would fail silently (bad locale keys, unknown categories, gallery paths
 * that don't exist on disk) — see `__tests__/portfolio-data.test.ts`.
 */
export const portfolioData = raw as unknown as PortfolioData;

// ─── Convenience accessors (used by existing pages) ────────────────────────

/** All projects in display order. */
export function getProjects(): readonly Project[] {
  return [...portfolioData.projects].sort((a, b) => a.order - b.order);
}

/** Lookup a single project by `id`, or `undefined`. */
export function getProjectById(id: string): Project | undefined {
  return portfolioData.projects.find((p) => p.id === id);
}

/** Featured projects for the homepage strip. */
export function getFeaturedProjects(): readonly Project[] {
  return portfolioData.projects.filter((p) => p.featured);
}

/** All skills, optionally filtered by category. */
export function getSkills(category?: SkillCategory): readonly SkillGroup[] {
  return category
    ? portfolioData.skills.filter((g) => g.category === category)
    : portfolioData.skills;
}

/** Work experience in reverse chronological order (most recent first). */
export function getExperiences(): readonly ExperienceEntry[] {
  return [...portfolioData.experience].sort((a, b) => b.id - a.id);
}

/** Currently-held positions. */
export function getCurrentRoles(): readonly ExperienceEntry[] {
  return portfolioData.experience.filter((e) => e.current);
}

/** Re-export for convenience. */
export const personalInfo = portfolioData.personal;
