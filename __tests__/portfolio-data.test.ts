/**
 * Integrity checks for `portfolio-data.json`.
 *
 * The JSON is imported through `resolveJsonModule`, so TypeScript sees every
 * string as `string` — it cannot verify union members, required locale keys, or
 * that an image path points at a file that exists. Those used to be compile
 * errors when the content lived as typed literals in `lib/data.ts`; these tests
 * take over that job.
 *
 * A failure here means the JSON is malformed, not that the site's logic broke.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { routing } from "@/i18n/routing";
import { portfolioData, type Locale } from "@/lib/data";

const LOCALES = routing.locales;

const PROJECT_CATEGORIES = ["mobile", "web", "fullstack"];
const PROJECT_STATUSES = ["published", "in-progress", "archived"];
const SKILL_CATEGORIES = [
  "mobile",
  "backend",
  "frontend",
  "databases",
  "cloud",
  "tools",
  "architecture",
];
const SKILL_LEVELS = ["Expert", "Advanced", "Intermediate", "Beginner"];

/** Assert a `Localized` object carries a non-empty string for every locale. */
function expectLocalized(value: unknown, label: string) {
  expect(typeof value).toBe("object");
  for (const locale of LOCALES) {
    const text = (value as Record<Locale, string>)?.[locale];
    if (typeof text !== "string" || text.trim() === "") {
      throw new Error(`${label} is missing or empty for locale "${locale}"`);
    }
  }
}

/** Assert a `LocalizedList` carries a non-empty array for every locale. */
function expectLocalizedList(value: unknown, label: string) {
  for (const locale of LOCALES) {
    const list = (value as Record<Locale, readonly string[]>)?.[locale];
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error(`${label} is missing or empty for locale "${locale}"`);
    }
  }
}

/** Resolve a `/public`-relative asset path to disk. */
function publicPath(p: string) {
  return resolve(__dirname, "..", "public", p.replace(/^\//, ""));
}

describe("personal", () => {
  const { personal } = portfolioData;

  it.each(["title", "subtitle", "location", "bio", "shortBio", "availability", "statement"])(
    "has a translated %s",
    (field) => {
      expectLocalized(personal[field as "title"], `personal.${field}`);
    },
  );

  it.each(["titles", "focusAreas"])("has a translated %s list", (field) => {
    expectLocalizedList(personal[field as "titles"], `personal.${field}`);
  });

  it("has a name, email, and phone", () => {
    expect(personal.fullName).toBeTruthy();
    expect(personal.email).toMatch(/@/);
    expect(personal.phone).toBeTruthy();
  });

  it("points avatar and background at files that exist", () => {
    expect(existsSync(publicPath(personal.avatar))).toBe(true);
    expect(existsSync(publicPath(personal.backgroundImage))).toBe(true);
  });

  it("points every hero screen at a file that exists", () => {
    expect(personal.heroScreens.length).toBeGreaterThan(0);
    for (const src of personal.heroScreens) {
      if (!existsSync(publicPath(src))) {
        throw new Error(`personal.heroScreens: missing file ${src}`);
      }
    }
  });
});

describe("projects", () => {
  const { projects } = portfolioData;

  it("is non-empty", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique, URL-safe ids", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has a unique order per project", () => {
    const orders = projects.map((p) => p.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  describe.each(portfolioData.projects.map((p) => [p.id, p] as const))("%s", (id, project) => {
    it.each(["title", "subtitle", "description", "fullDescription", "role", "duration", "metric"])(
      "has a translated %s",
      (field) => {
        expectLocalized(project[field as "title"], `${id}.${field}`);
      },
    );

    it.each(["features", "highlights"])("has a translated %s list", (field) => {
      expectLocalizedList(project[field as "features"], `${id}.${field}`);
    });

    it("uses a known category and status", () => {
      expect(PROJECT_CATEGORIES).toContain(project.category);
      expect(PROJECT_STATUSES).toContain(project.status);
    });

    it("has a two-character monogram", () => {
      expect(project.monogram).toHaveLength(2);
    });

    // An unreleased project legitimately has nowhere to link yet, so absence
    // is allowed — but anything present has to be a real absolute URL.
    it("has absolute URLs for any links it does declare", () => {
      for (const url of Object.values(project.links).filter(Boolean)) {
        expect(url).toMatch(/^https?:\/\//);
      }
    });

    it("points its hero image at a file that exists", () => {
      expect(existsSync(publicPath(project.image))).toBe(true);
    });

    // The failure this is here to catch: listing screenshots that were never
    // exported. A missing gallery file renders as a broken image rather than
    // falling back, so it has to fail the build instead.
    it("points every gallery image at a file that exists", () => {
      for (const src of project.images) {
        if (!existsSync(publicPath(src))) {
          throw new Error(`${id}.images: missing file ${src}`);
        }
      }
    });
  });
});

describe("skills", () => {
  const { skills } = portfolioData;

  it("uses known categories, without duplicates", () => {
    const categories = skills.map((g) => g.category);
    for (const category of categories) {
      expect(SKILL_CATEGORIES).toContain(category);
    }
    expect(new Set(categories).size).toBe(categories.length);
  });

  it("has a translated title per group", () => {
    for (const group of skills) {
      expectLocalized(group.title, `skills.${group.category}.title`);
    }
  });

  it("has valid items — either a plain string or a levelled entry", () => {
    for (const group of skills) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        if (typeof item === "string") {
          expect(item.trim()).not.toBe("");
          continue;
        }
        expect(item.name.trim()).not.toBe("");
        expect(SKILL_LEVELS).toContain(item.level);
        expect(item.percentage).toBeGreaterThan(0);
        expect(item.percentage).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("experience", () => {
  const { experience } = portfolioData;

  it("has unique ids", () => {
    const ids = experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has translated fields per entry", () => {
    for (const entry of experience) {
      const label = `experience[${entry.id}]`;
      expect(entry.company).toBeTruthy();
      for (const field of ["position", "location", "startDate", "endDate", "duration", "description"]) {
        expectLocalized(entry[field as "position"], `${label}.${field}`);
      }
      expectLocalizedList(entry.responsibilities, `${label}.responsibilities`);
      expect(entry.technologies.length).toBeGreaterThan(0);
    }
  });

  it("marks at least one role current", () => {
    expect(experience.some((e) => e.current)).toBe(true);
  });
});

describe("education, certifications, languages, testimonials", () => {
  it("has translated education entries", () => {
    for (const entry of portfolioData.education) {
      const label = `education[${entry.id}]`;
      for (const field of ["degree", "institution", "university", "location", "description"]) {
        expectLocalized(entry[field as "degree"], `${label}.${field}`);
      }
      expect(entry.completionDate).toMatch(/^\d{4}$/);
    }
  });

  it("has translated certifications", () => {
    for (const cert of portfolioData.certifications) {
      for (const field of ["title", "issuer", "description"]) {
        expectLocalized(cert[field as "title"], `certification.${field}`);
      }
    }
  });

  it("has one language entry per supported locale, with valid percentages", () => {
    const codes = portfolioData.languages.map((l) => l.code);
    for (const locale of LOCALES) {
      expect(codes).toContain(locale);
    }
    for (const lang of portfolioData.languages) {
      expectLocalized(lang.name, `language.${lang.code}.name`);
      expect(lang.percentage).toBeGreaterThan(0);
      expect(lang.percentage).toBeLessThanOrEqual(100);
    }
  });

  it("has translated testimonials with a 1–5 rating", () => {
    for (const t of portfolioData.testimonials) {
      expectLocalized(t.quote, `testimonial[${t.id}].quote`);
      expectLocalized(t.position, `testimonial[${t.id}].position`);
      expect(t.author).toBeTruthy();
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
    }
  });
});

describe("social and seo", () => {
  it("has absolute social URLs and a valid email", () => {
    const { social } = portfolioData;
    expect(social.linkedin).toMatch(/^https:\/\//);
    expect(social.github).toMatch(/^https:\/\//);
    expect(social.email).toMatch(/@/);
  });

  it("has translated seo copy and keywords", () => {
    expectLocalized(portfolioData.seo.title, "seo.title");
    expectLocalized(portfolioData.seo.description, "seo.description");
    expect(portfolioData.seo.keywords.length).toBeGreaterThan(0);
  });
});
