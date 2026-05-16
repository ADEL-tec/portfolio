"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/lib/hooks";
import { fadeDown } from "@/lib/animations";
import { NAV_ITEMS } from "./nav-config";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

/**
 * Sticky top navigation. Background and border fade in once the user has
 * scrolled past 8px so the bar reads as flush at the top of the hero and
 * gains a translucent "glass" backdrop while scrolling.
 *
 * Layout uses logical properties (`ms-*`, `me-*`) so the brand stays at the
 * inline-start and controls at the inline-end regardless of RTL/LTR.
 */
export function Header() {
  const pathname = usePathname();
  const { y } = useScrollPosition();
  const scrolled = y > 8;
  const t = useTranslations("Nav");

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
        "sticky top-0 z-40 w-full",
        "transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-md backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Adel<span className="text-brand-500">.</span>
        </Link>

        {/* Desktop navigation — md and up */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.labelKey)}
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-muted"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
