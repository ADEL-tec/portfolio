import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "ar"],
  defaultLocale: "en",

  // 'always' is required for static export — every page must have a locale
  // in its path so it can be pre-rendered to a unique file. The bare `/`
  // is handled by `public/index.html`, which meta-refreshes to `/en/`.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// Right-to-left locales — used to set <html dir="rtl"> in the locale layout.
export const rtlLocales: ReadonlyArray<Locale> = ["ar"];
export const isRtl = (locale: Locale) => rtlLocales.includes(locale);
