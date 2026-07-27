"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn, downloadResume } from "@/lib/utils";
import { useScrollPosition } from "@/lib/hooks";
import { portfolioData } from "@/lib/data";
import { fadeDown } from "@/lib/animations";
import { NAV_ITEMS } from "./nav-config";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

/**
 * Sticky top navigation.
 *
 * Fully transparent over the top of the hero — the graph-paper backdrop
 * reads through it — then fades in a translucent surface and its bottom
 * rule once the page has scrolled, so the bar separates from the content
 * underneath without ever being a solid slab.
 *
 * Layout uses logical properties throughout so the brand stays at the
 * inline-start and the controls at the inline-end under RTL.
 */
export function Header() {
  const pathname = usePathname();
  const { y } = useScrollPosition();
  const scrolled = y > 8;
  const t = useTranslations("Nav");
  const tAbout = useTranslations("About");

  const isActive = (href: string) => {
    const target = href.split("#")[0] || "/";
    if (target === "/") return pathname === "/";
    return pathname.startsWith(target);
  };

  return (
    <motion.header
      variants={fadeDown}
      initial="hidden"
      animate="visible"
      className={cn(
        "sticky top-0 z-40 w-full border-b",
        "transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          Adel<span className="text-brand-500 dark:text-brand-400">.</span>
        </Link>

        {/* Desktop navigation — md and up */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-foreground hover:text-brand-600 dark:hover:text-brand-400",
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => downloadResume(portfolioData.personal.resumeUrl)}
            className="inline-flex items-center gap-1.5 border border-brand-500 bg-brand-500 px-4 py-2 font-heading text-sm font-semibold text-white transition-colors hover:border-brand-700 hover:bg-brand-700"
          >
            <Download className="size-3.5" aria-hidden="true" />
            {tAbout("downloadCv")}
          </button>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
