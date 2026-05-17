/**
 * Re-export of the route-level transition wrapper. The implementation lives
 * in `components/layout/page-transition.tsx` (it's a layout concern that
 * ships in the locale layout) — this barrel keeps the animation-related
 * import path tidy:
 *
 *   import { PageTransition } from "@/components/animations/page-transition";
 */
export { PageTransition } from "@/components/layout/page-transition";
