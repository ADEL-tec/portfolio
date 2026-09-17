/**
 * Pure helpers behind the project index: grouping, counting, the `?type=`
 * parser, and the nav "current item" rule.
 */

import {
  PROJECT_CATEGORIES,
  countByCategory,
  groupProjectsByCategory,
  parseCategoryParam,
} from "@/lib/categories";
import { isNavItemActive } from "@/components/layout/nav-config";

const sample = [
  { id: "b", category: "mobile", order: 2 },
  { id: "api", category: "backend", order: 1 },
  { id: "a", category: "mobile", order: 1 },
] as const;

describe("groupProjectsByCategory", () => {
  it("returns groups in registry order and omits empty categories", () => {
    const groups = groupProjectsByCategory(sample);
    expect(groups.map((g) => g.category)).toEqual(["mobile", "backend"]);
  });

  it("sorts projects within a group by order", () => {
    const [mobile] = groupProjectsByCategory(sample);
    expect(mobile?.projects.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("returns nothing for an empty list", () => {
    expect(groupProjectsByCategory([])).toEqual([]);
  });
});

describe("countByCategory", () => {
  it("zero-fills every registered category", () => {
    const counts = countByCategory(sample);
    expect(Object.keys(counts).sort()).toEqual([...PROJECT_CATEGORIES].sort());
    expect(counts).toEqual({ mobile: 2, backend: 1, web: 0, desktop: 0 });
  });
});

describe("parseCategoryParam", () => {
  it("accepts a known category", () => {
    expect(parseCategoryParam("web")).toBe("web");
  });

  it.each([null, undefined, "", "bogus", "fullstack", "ALL"])(
    "falls back to all for %p",
    (raw) => {
      expect(parseCategoryParam(raw)).toBe("all");
    },
  );
});

describe("isNavItemActive", () => {
  it("marks home current only on / with no hash", () => {
    expect(isNavItemActive("/", "/", "")).toBe(true);
    expect(isNavItemActive("/", "/", "#experience")).toBe(false);
    expect(isNavItemActive("/", "/projects", "")).toBe(false);
  });

  it("marks a hash item current only with its hash on the home path", () => {
    expect(isNavItemActive("/#experience", "/", "#experience")).toBe(true);
    expect(isNavItemActive("/#experience", "/", "")).toBe(false);
    expect(isNavItemActive("/#experience", "/", "#skills")).toBe(false);
    expect(isNavItemActive("/#experience", "/about", "#experience")).toBe(false);
  });

  it("matches section pages by path prefix, whole segments only", () => {
    expect(isNavItemActive("/projects", "/projects", "")).toBe(true);
    expect(isNavItemActive("/projects", "/projects/awashz", "")).toBe(true);
    expect(isNavItemActive("/projects", "/projects-archive", "")).toBe(false);
    expect(isNavItemActive("/about", "/", "")).toBe(false);
  });
});
