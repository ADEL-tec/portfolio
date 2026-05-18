/**
 * Pure-function tests for `lib/utils.ts`. These cover the easy wins:
 *
 *   • `cn` — Tailwind class composition + merge
 *   • `formatDate` — locale-aware Intl.DateTimeFormat
 *   • `formatDateRange` — start–end strings
 *   • `getLocalizedText` — Localized<T> pick with EN fallback
 *   • `scrollToSection` — safe no-op in non-browser-like cases
 *   • `asset` — basePath prefixing for static-export image URLs
 *   • `absoluteUrl` — combines site origin and a path
 */

import {
  absoluteUrl,
  asset,
  cn,
  formatDate,
  formatDateRange,
  getLocalizedText,
  scrollToSection,
} from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", null, undefined, false, "c")).toBe("a b c");
  });

  it("deduplicates Tailwind utilities (later wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatDate", () => {
  it("formats an ISO date in English by default", () => {
    const out = formatDate("2026-05-18", "en", { dateStyle: "long" });
    expect(out).toMatch(/May/);
    expect(out).toMatch(/2026/);
  });

  it("formats in French", () => {
    const out = formatDate(new Date("2026-05-18"), "fr", { month: "long" });
    expect(out.toLowerCase()).toContain("mai");
  });

  it("returns an empty string for invalid input", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("formatDateRange", () => {
  it("renders 'Present' label when end date is null", () => {
    const out = formatDateRange("2025-06-01", null, "en", "Present");
    expect(out).toContain("—");
    expect(out).toContain("Present");
  });

  it("renders both ends when both dates are present", () => {
    const out = formatDateRange("2024-01-01", "2025-01-01", "en");
    expect(out).toMatch(/Jan/);
    expect(out).toContain("—");
  });
});

describe("getLocalizedText", () => {
  const value = { en: "Hello", fr: "Bonjour", ar: "مرحبًا" };

  it("returns the requested locale's value", () => {
    expect(getLocalizedText(value, "fr")).toBe("Bonjour");
  });

  it("falls back to English when the requested locale is empty", () => {
    expect(getLocalizedText({ en: "Hi", fr: "", ar: "" }, "fr")).toBe("Hi");
  });
});

describe("scrollToSection", () => {
  it("returns false when the target id doesn't exist", () => {
    expect(scrollToSection("nope")).toBe(false);
  });

  it("scrolls when the element exists and returns true", () => {
    const el = document.createElement("section");
    el.id = "skills";
    el.scrollIntoView = jest.fn();
    document.body.appendChild(el);
    expect(scrollToSection("#skills")).toBe(true);
    expect(el.scrollIntoView).toHaveBeenCalled();
    el.remove();
  });
});

describe("asset", () => {
  it("returns external URLs unchanged", () => {
    expect(asset("https://example.com/x.png")).toBe("https://example.com/x.png");
  });

  it("normalizes a leading slash", () => {
    // No NEXT_PUBLIC_BASE_PATH in dev → no prefix added.
    expect(asset("/images/a.jpg")).toMatch(/\/images\/a\.jpg$/);
    expect(asset("images/a.jpg")).toMatch(/\/images\/a\.jpg$/);
  });
});

describe("absoluteUrl", () => {
  it("combines the configured origin with a path", () => {
    const out = absoluteUrl("/about");
    expect(out).toMatch(/\/about$/);
    expect(out.startsWith("http")).toBe(true);
  });
});
