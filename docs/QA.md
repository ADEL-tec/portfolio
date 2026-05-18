# QA Checklist

Pre-release pass for the portfolio. Sectioned by concern; tick what's
verified and note exceptions inline. Update on every meaningful release.

## Automated

- [ ] `npm run typecheck` — zero errors
- [ ] `npm test` — all suites green
- [ ] `npm run lint` — zero errors, warnings reviewed
- [ ] `npm run build:static` — succeeds, `out/` populated

## Cross-browser

Desktop (current N and N-1):

- [ ] Chrome / Chromium
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Edge

Mobile:

- [ ] Safari iOS (small + medium screens)
- [ ] Chrome Android

## Responsive layout

- [ ] iPhone SE (375 × 667)
- [ ] iPhone 12/13/14 (390 × 844)
- [ ] iPad portrait (768 × 1024)
- [ ] Desktop ≥ 1280 × 800
- [ ] Ultra-wide 1920+ — no awkward gaps

## Functionality

- [ ] Home page composes Hero → About → Projects → Skills → Experience → Education → Testimonials → CTA
- [ ] Header nav links route correctly
- [ ] Mobile hamburger opens the sheet, link click closes it
- [ ] Language switcher persists across pages (cookie-backed)
- [ ] Theme toggle: light ↔ dark, no flash on load, no hydration warnings in console
- [ ] Footer links open in new tabs for externals
- [ ] Project card → detail page → back link works
- [ ] Contact form: validation triggers for each field, success state shows on 200, offline state shows when `/api/contact` 404s (gh-pages)
- [ ] Resume download button triggers a `.pdf` download
- [ ] Scroll-to-top button visible on long pages

## Internationalization

- [ ] `/en`, `/fr`, `/ar` all render with translated copy
- [ ] Arabic page renders RTL (`<html dir="rtl">`); icons that point along the reading axis flip
- [ ] Language switcher dropdown shows native-script labels
- [ ] Date / number formatting respects the active locale
- [ ] `formatDateRange` shows the "Present" label localized in current locale (TODO: not yet localized)
- [ ] No untranslated keys leak through (no raw `Nav.home` strings)

## Forms

- [ ] Name: min 2 / max 50 enforced
- [ ] Email: invalid format rejected
- [ ] Phone: empty allowed, non-empty validated against regex
- [ ] Subject: min 5 / max 100 enforced
- [ ] Message: min 10 / max 5000 enforced
- [ ] Honeypot field is hidden from real users (offscreen, `tabIndex={-1}`)
- [ ] Submit disabled while in flight, spinner visible
- [ ] Form resets after successful submit
- [ ] Error banner shows on 4xx; offline banner shows on 404 / network failure

## Performance

- [ ] Lighthouse mobile score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] First Contentful Paint < 1.5s on emulated 3G
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No console errors or warnings in the production build
- [ ] Bundle size review: no unexpected large vendor packages
- [ ] Images served at appropriate resolution (`sizes` prop set on all `<Image>`)

## Accessibility

- [ ] Tab order is sensible across the whole page
- [ ] Focus indicators visible on all interactive elements (`focus-visible:ring`)
- [ ] All images have `alt` text (project gallery images include the project name)
- [ ] All form inputs have associated `<label>` (visually or `aria-label`)
- [ ] All buttons announce purpose (visible text or `aria-label`)
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text — verified in both themes
- [ ] `prefers-reduced-motion`: page-wide CSS rule disables transitions; framer-motion variants flatten via `useReducedMotion`
- [ ] Skip-link to main content (TODO: not yet added)
- [ ] Headings outline forms a logical hierarchy (one `<h1>` per page)
- [ ] Screen reader smoke test: macOS VoiceOver / Windows NVDA — navigation, hero, form

## SEO

- [ ] `<title>` and `<meta name="description">` set on every page
- [ ] Open Graph image renders on Facebook / LinkedIn previews (test via the platform's debug tool)
- [ ] Twitter card renders (cards-validator)
- [ ] `alternates.languages` hreflang correct in HTML head
- [ ] `/sitemap.xml` reachable, includes all locale × page combinations
- [ ] `/robots.txt` reachable (note: lives under basePath on GitHub Pages)
- [ ] JSON-LD validates via Google Rich Results test
- [ ] Person, WebSite, SoftwareApplication, BreadcrumbList schemas present where expected

## Security

- [ ] `.env.local` is git-ignored and never committed
- [ ] `ANTHROPIC_API_KEY` only set in `.env.local` (server-only — no `NEXT_PUBLIC_` prefix)
- [ ] API routes validate every input field
- [ ] Rate limits on `/api/contact` (5/hr/IP) and `/api/claude` (10/hr/IP) — verify via repeated requests
- [ ] HTTPS enforced (GitHub Pages does this automatically for `*.github.io`)
- [ ] Security headers present on Node-hosted deploys (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) — verify with `curl -I`
- [ ] No secrets in client bundle (`grep -r "ANTHROPIC" out/` returns nothing)

## Deployment

- [ ] `main` branch is green in CI
- [ ] gh-pages branch was last updated by the workflow (not a manual push)
- [ ] Live URL loads at https://adel-tec.github.io/portfolio/
- [ ] Asset paths include the `/portfolio` basePath (no 404s in Network tab)
- [ ] `/en`, `/fr`, `/ar` and project detail pages all load
- [ ] Root URL (`/portfolio/`) redirects to `/portfolio/en/` (via `public/index.html`)

---

## Tools used

- **Lighthouse** — Chrome DevTools or PageSpeed Insights (https://pagespeed.web.dev)
- **axe DevTools** — accessibility audit
- **Google Rich Results test** — JSON-LD validation (https://search.google.com/test/rich-results)
- **WAVE** — accessibility & contrast (https://wave.webaim.org)
- **Browser dev tools** — responsive simulator + Network throttling
- **Real devices** — at least one physical iOS + Android device pass per release
