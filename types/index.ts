/**
 * Portfolio domain types.
 *
 * **Translation strategy:** structural data (IDs, dates, URLs, image paths)
 * lives in TS. User-facing copy (titles, descriptions) lives in
 * `messages/{locale}.json` keyed by the same `id`. UI code resolves copy via
 * `useTranslations()` from next-intl — never duplicate strings into TS fields.
 */

import type { routing } from "@/i18n/routing";

// ─── Locale & i18n primitives ──────────────────────────────────────────────

/** UI locale supported by the app (re-exported for convenience). */
export type Locale = (typeof routing.locales)[number];

/**
 * A value provided in every supported locale. Use ONLY when you genuinely need
 * all translations bundled at the same time (e.g. an admin preview).
 * For app rendering, prefer next-intl's `useTranslations` instead.
 */
export type LocaleMap<T> = Record<Locale, T>;

/** Generic helper that pairs a structural record with its translation bundle. */
export type WithTranslations<TData, TI18n> = TData & { i18n: LocaleMap<TI18n> };

// ─── Shared building blocks ────────────────────────────────────────────────

/** Outbound link for a project, social profile, or store listing. */
export interface ExternalLink {
  /** Translation-keyed label, e.g. `"Projects.items.awashz.links.playStore"`. */
  labelKey?: string;
  /** Plain label fallback when no translation key is provided. */
  label?: string;
  href: string;
  /** Optional icon name resolved by the icon set used in the UI. */
  icon?: string;
}

/** Distribution-channel links a project can ship to. */
export interface ProjectLinks {
  playStore?: string;
  appStore?: string;
  github?: string;
  live?: string;
  caseStudy?: string;
}

// ─── Project ───────────────────────────────────────────────────────────────

/**
 * Top-level project category for filtering UI. Lowercase singular tokens —
 * the matching translated label lives at `Projects.filter{Capitalized}`.
 */
export type ProjectCategory = "mobile" | "web" | "fullstack" | "design";

/**
 * Project lifecycle. The matching translated label lives at
 * `Projects.status.{value}`.
 */
export type ProjectStatus = "published" | "in-progress" | "archived";

/**
 * A portfolio project. All user-facing copy (title, subtitle, description,
 * highlights, role, duration) lives under `Projects.items.{id}` in the
 * messages JSON — looked up via `t('Projects.items.{id}.title')`.
 */
export interface Project {
  /** Stable slug; also used as the translation namespace and the URL segment. */
  id: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Lower-is-earlier sort key for the projects grid. */
  order?: number;
  /** Pin to the homepage "Selected projects" strip. */
  featured?: boolean;

  technologies: string[];
  /** Domain tags shown as pills (`fintech`, `marketplace`, `realtime`, …). */
  tags?: string[];

  /** ISO 8601 date strings. Used for sorting and `<time>` rendering. */
  startDate: string;
  endDate?: string;

  /** Hero image shown in cards and at the top of the detail page. */
  image: string;
  /** Additional screenshots for the project detail gallery. */
  gallery?: string[];

  links: ProjectLinks;
}

// ─── Skill ─────────────────────────────────────────────────────────────────

export type SkillCategory =
  | "mobile"
  | "backend"
  | "frontend"
  | "databases"
  | "cloud"
  | "tools"
  | "architecture";

/** A 0–5 proficiency band. Render as stars / bar / pill. */
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

/**
 * A skill entry. Category descriptions live under
 * `Skills.categories.{category}.description`.
 */
export interface Skill {
  /** Display name; usually a brand or technology token (`"Flutter"`). */
  name: string;
  category: SkillCategory;
  /** Optional self-assessed proficiency, 1–5. */
  level?: SkillLevel;
  /** Icon name from the icon library configured in `components.json`. */
  icon?: string;
  /** Years of hands-on use. Used for sorting within a category. */
  yearsOfExperience?: number;
}

// ─── Experience ────────────────────────────────────────────────────────────

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship";

/**
 * A single role on the work timeline. Translated copy (role, description,
 * achievements bullets) lives under `Experience.items.{id}`.
 */
export interface Experience {
  /** Stable slug matching the translation key in `Experience.items.{id}`. */
  id: string;
  company: string;
  /** Company URL, optional. Surface as a subtle link from the company name. */
  companyUrl?: string;
  companyLogo?: string;
  location?: string;
  employmentType?: EmploymentType;

  /** ISO 8601 month-precision (`2023-04`) is enough; rendered via `Intl`. */
  startDate: string;
  /** Omit for current role; UI then renders the `Experience.current` label. */
  endDate?: string;

  technologies?: string[];
}

// ─── Education ─────────────────────────────────────────────────────────────

/**
 * Academic credential or certification. Translatable fields (field of study,
 * description) live under `Education.items.{id}`.
 */
export interface Education {
  id: string;
  institution: string;
  institutionUrl?: string;
  institutionLogo?: string;
  location?: string;
  /** Degree shorthand (`"BSc"`, `"MSc"`, `"Diploma"`, `"Certificate"`). */
  degree: string;
  startDate: string;
  endDate?: string;
  /** GPA / grade — keep as freeform string so locale-specific formats fit. */
  grade?: string;
}

// ─── Language proficiency ──────────────────────────────────────────────────

/**
 * CEFR-style band used on CVs. Distinct from the app's UI `Locale` type —
 * these are languages the *portfolio owner* speaks.
 */
export type LanguageProficiency =
  | "native"
  | "fluent"
  | "professional"
  | "conversational"
  | "basic";

/** A spoken language and its proficiency. */
export interface LanguageSkill {
  /** ISO 639-1 code (`"en"`, `"fr"`, `"ar"`). */
  code: string;
  /** English name, used as the translation key under `Languages.{name}`. */
  name: string;
  proficiency: LanguageProficiency;
}

// ─── Testimonial ───────────────────────────────────────────────────────────

/**
 * A short quote from a colleague, client, or manager. The quote itself lives
 * under `Testimonials.items.{id}.quote` so it can be translated; everything
 * here is structural.
 */
export interface Testimonial {
  id: string;
  authorName: string;
  /** Optional headshot. Should be a square image, 96×96 or larger. */
  authorAvatar?: string;
  /** LinkedIn / Twitter / website URL for the author. */
  authorUrl?: string;
  /** ISO 8601 date the testimonial was given. Optional. */
  date?: string;
  /** Pin a testimonial to the homepage carousel. */
  featured?: boolean;
}

// ─── Social profiles ───────────────────────────────────────────────────────

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "email"
  | "website"
  | "youtube"
  | "dribbble";

/** A single social/profile link rendered in the navbar, footer, or contact. */
export interface SocialProfile {
  platform: SocialPlatform;
  /** Public-facing handle (`"@adeltech"`) — display only. */
  handle?: string;
  /** Full URL or `mailto:` href. */
  url: string;
}

// ─── Contact form ──────────────────────────────────────────────────────────

/** Payload accepted by the contact form & `/api/contact`. */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot field — must be empty for a submission to be accepted. */
  website?: string;
}

/** Server response envelope returned by the contact endpoint. */
export type ContactFormResponse =
  | { ok: true }
  | { ok: false; error: string; field?: keyof ContactFormData };

// ─── Claude chat (powers the AI chat widget) ───────────────────────────────

/** One turn in a chat exchange with the assistant. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  /** Epoch millis. Use `new Date(ts)` for rendering. */
  createdAt: number;
}

/** Payload accepted by `/api/claude`. */
export interface ChatRequest {
  messages: Pick<ChatMessage, "role" | "content">[];
  /** Optional system override; defaults to a portfolio-aware prompt. */
  systemPrompt?: string;
}

// ─── Personal & site metadata ──────────────────────────────────────────────

/**
 * Identity fields rendered in the header, footer, and structured data.
 * Translatable copy (title/subtitle/bio) is NOT here — it lives in
 * `Hero` and `About` namespaces.
 */
export interface PersonalInfo {
  fullName: string;
  /** Where you live / are available from. Plain string (translation-free). */
  location: string;
  email: string;
  phone?: string;
  /** Public CV download URL or `/file.pdf` path under `public/`. */
  resumeUrl?: string;
  avatar: string;
  /** Optional hero/background image. */
  backgroundImage?: string;
  /** Years of experience — drives the ICU plural in `About.yearsExperience`. */
  yearsExperience: number;
}

/** Compile-time helper: every locale must satisfy this shape. */
export type LocaleConfig = {
  code: Locale;
  /** Native-script label shown in the language switcher. */
  label: string;
  /** Latin-script fallback for screen readers or analytics. */
  englishLabel: string;
  dir: "ltr" | "rtl";
};
