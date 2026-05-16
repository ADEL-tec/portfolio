import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "ar"],
  defaultLocale: "en",

  // 'as-needed' keeps the default locale unprefixed (`/`), and prefixes others
  // (`/fr/...`, `/ar/...`). Switch to 'always' if you want canonical `/en/...`.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

// Right-to-left locales — used to set <html dir="rtl"> in the locale layout.
export const rtlLocales: ReadonlyArray<Locale> = ["ar"];
export const isRtl = (locale: Locale) => rtlLocales.includes(locale);
