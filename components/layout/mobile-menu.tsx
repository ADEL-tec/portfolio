"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/useTranslations";
import { NAV_ITEMS } from "./nav-config";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

/**
 * Off-canvas navigation for screens below the desktop nav breakpoint.
 * The sheet slides in from the inline-start edge so RTL locales get a
 * right-side drawer naturally — `side` is derived from the document direction.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const { isRtl } = useDirection();

  // Match the active item against the locale-less pathname returned by
  // next-intl. Treat `/` as a strict match, everything else as prefix.
  const isActive = (href: string) => {
    const target = href.split("#")[0] || "/";
    if (target === "/") return pathname === "/";
    return pathname.startsWith(target);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("openMenu")}
          className="md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isRtl ? "left" : "right"}
        className="w-72 sm:w-80 flex flex-col gap-6 p-6"
      >
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="text-base font-semibold">Adel</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1" aria-label={t("openMenu")}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
          <LanguageSwitcher align="start" />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
