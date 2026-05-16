// Type augmentation for next-intl. Once messages are linked here, the
// `useTranslations` hook auto-completes namespace and key paths everywhere
// (e.g. `t('greeting')` inside `useTranslations('Hero')`).
//
// Keep `en.json` as the source of truth — all other locales must mirror its
// shape, and next-intl uses this type to flag missing keys at compile time.

import type messages from "./messages/en.json";
import type { routing } from "./i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
