"use client";

import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/hooks";
import type { Locale } from "@/i18n/routing";

/**
 * Native-script labels for each supported locale. Kept here (not in
 * messages/*.json) on purpose — a language picker should always render
 * "Français" and "العربية" in their own script regardless of UI locale.
 */
const LANGUAGE_LABELS: Record<Locale, { native: string; code: string }> = {
  en: { native: "English", code: "EN" },
  fr: { native: "Français", code: "FR" },
  ar: { native: "العربية", code: "AR" },
};

interface LanguageSwitcherProps {
  /** Render compactly inside the mobile menu (drops the trigger label). */
  compact?: boolean;
  /** Override the alignment of the dropdown content. */
  align?: "start" | "center" | "end";
}

export function LanguageSwitcher({
  compact = false,
  align = "end",
}: LanguageSwitcherProps) {
  const { locale, locales, setLanguage } = useLanguage();
  const t = useTranslations("LanguageSwitcher");
  const current = LANGUAGE_LABELS[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          aria-label={`${t("label")}: ${current.native}`}
          className="gap-2"
        >
          <Languages className="size-4" aria-hidden="true" />
          {!compact && (
            <span className="font-medium tracking-wide">{current.code}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-40">
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((code) => {
          const label = LANGUAGE_LABELS[code];
          const isActive = code === locale;
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => setLanguage(code)}
              className="cursor-pointer"
              /* Render each label in its own script direction — Arabic
                 stays RTL even while the UI is in English. */
              dir={code === "ar" ? "rtl" : "ltr"}
            >
              <span className="flex-1">{label.native}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {label.code}
              </span>
              {isActive && (
                <Check className="size-3.5 ms-2" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
