/**
 * Single source of truth for navigation items. Header, mobile menu, and
 * footer all read from here so a new entry only needs to be added once.
 *
 * `labelKey` references a key under the `Nav` namespace in `messages/*.json`.
 * `href` is locale-agnostic — the next-intl `<Link>` from `@/i18n/navigation`
 * prefixes it with the active locale automatically.
 */
export const NAV_ITEMS = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/projects", labelKey: "projects" },
  { href: "/#skills", labelKey: "skills" },
  { href: "/contact", labelKey: "contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
