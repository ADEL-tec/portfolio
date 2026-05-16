"use client";

import { ArrowUp, Mail } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
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
