import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Use these instead of the bare ones
 * from `next/link` and `next/navigation` — they automatically prefix paths
 * with the active locale (per `localePrefix: 'as-needed'`) and let you
 * switch locale by passing `{ locale }` to `router.replace`/`router.push`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
