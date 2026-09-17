/**
 * Single source of truth for navigation items. Header, mobile menu, and
 * footer all read from here so a new entry only needs to be added once.
 *
 * `labelKey` references a key under the `Nav` namespace in `messages/*.json`.
 * `href` is locale-agnostic — the next-intl `<Link>` from `@/i18n/navigation`
 * prefixes it with the active locale automatically.
 *
 * Order follows what a recruiter looks for: the work first, then the
 * history, then the person, then how to reach them.
 */
export const NAV_ITEMS = [
  { href: "/", labelKey: "home" },
  { href: "/projects", labelKey: "projects" },
  { href: "/#experience", labelKey: "experience" },
  { href: "/about", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

/**
 * Whether a nav item should be marked current.
 *
 * Hash items (`/#experience`) are only current on the home path while that
 * hash is in the URL; plain `/` is current on the home path with no hash.
 * Without the hash check both would light up together — the old bug where
 * "Skills" was permanently highlighted as "Home".
 */
export function isNavItemActive(
  href: string,
  pathname: string,
  hash: string,
): boolean {
  const [path, fragment] = href.split("#");
  const target = path || "/";

  if (fragment !== undefined) {
    return pathname === target && hash === `#${fragment}`;
  }
  if (target === "/") {
    return pathname === "/" && hash === "";
  }
  return pathname === target || pathname.startsWith(`${target}/`);
}
