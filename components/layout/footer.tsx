"use client";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
import { Link } from "@/i18n/navigation";
import { portfolioData, pick, type Locale } from "@/lib/data";
import { scrollToSection } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { NAV_ITEMS } from "./nav-config";

/**
 * Site footer. Three columns on desktop, stacked on mobile:
 *   1. Name + what I do
 *   2. Quick links (mirrors the header nav)
 *   3. Social profiles
 *
 * Separated from the page by a single rule rather than a filled band — the
 * footer is the end of the document, not a different surface.
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
      className="mt-8 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
            <Link
              href="/"
              className="font-heading text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              {portfolioData.personal.fullName}
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{tFoot("tagline")}</p>
          </motion.div>

          {/* Quick links */}
          <motion.nav
            variants={fadeUp}
            aria-label="Footer"
            className="flex flex-col gap-3"
          >
            <h2 className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
              {tNav("home")}
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Social */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <h2 className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
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
          className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 text-[0.8125rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{tFoot("rights", { year })}</p>
          <div className="flex items-center gap-4">
            <span>{tFoot("builtWith")}</span>
            <button
              type="button"
              onClick={() => scrollToSection("top")}
              className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
            >
              {tFoot("backToTop")} ↑
            </button>
          </div>
        </motion.div>
      </div>
    </motion.footer>
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
        className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
      >
        {icon}
        <span>{label}</span>
      </a>
    </li>
  );
}
