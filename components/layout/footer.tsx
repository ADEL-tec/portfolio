"use client";

import { ArrowUp, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { portfolioData, pick, type Locale } from "@/lib/data";
import { scrollToSection } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { NAV_ITEMS } from "./nav-config";

/**
 * Site footer. Three-column grid on desktop, single column on mobile:
 *   1. Brand + tagline
 *   2. Quick links (mirrors the header nav)
 *   3. Social profiles
 *
 * The bottom bar holds copyright, tech credit, and a back-to-top button.
 * All copy is locale-aware: nav labels via next-intl, brand title via the
 * `Localized` field in `portfolioData.personal.title`.
 */
export function Footer() {
  const tNav = useTranslations("Nav");
  const tFoot = useTranslations("Footer");
  const locale = useLocale() as Locale;

  const year = new Date().getFullYear();
  const title = pick(portfolioData.personal.title, locale);

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.06)}
      className="mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            >
              {portfolioData.personal.fullName}
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">{title}</p>
            <p className="text-sm text-muted-foreground">{tFoot("tagline")}</p>
          </motion.div>

          {/* Quick links */}
          <motion.nav
            variants={fadeUp}
            aria-label="Footer"
            className="flex flex-col gap-3"
          >
            <h2 className="text-sm font-semibold text-foreground">
              {tNav("home")} · {tNav("projects")}
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Social */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {pick(
                {
                  en: "Find me online",
                  fr: "Me retrouver en ligne",
                  ar: "تواصل عبر الإنترنت",
                },
                locale,
              )}
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              <FooterLink
                href={portfolioData.social.github}
                icon={<GithubMark className="size-4" aria-hidden="true" />}
                label="GitHub"
              />
              <FooterLink
                href={portfolioData.social.linkedin}
                icon={<LinkedinMark className="size-4" aria-hidden="true" />}
                label="LinkedIn"
              />
              <FooterLink
                href={`mailto:${portfolioData.social.email}`}
                icon={<Mail className="size-4" aria-hidden="true" />}
                label={portfolioData.social.email}
              />
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-6"
        >
          <p className="text-xs text-muted-foreground">
            {tFoot("rights", { year })}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{tFoot("builtWith")}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => scrollToSection("top")}
              aria-label={tFoot("backToTop")}
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

/* Lucide v1.16 dropped brand icons; inline SVGs avoid a second icon library. */
function GithubMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.3-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.18-3.1-.12-.3-.51-1.49.11-3.1 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.5 3.17-1.18 3.17-1.18.62 1.61.23 2.8.11 3.1.74.8 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.07.78 2.16v3.2c0 .3.21.66.8.55C20.22 21.4 23.5 17.1 23.5 12.02 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
function LinkedinMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.86 3.36-1.86 3.6 0 4.27 2.37 4.27 5.46v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function FooterLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const isExternal = /^https?:/.test(href);
  return (
    <li>
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {icon}
        <span>{label}</span>
      </a>
    </li>
  );
}
