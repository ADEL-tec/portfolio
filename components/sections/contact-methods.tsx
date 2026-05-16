"use client";

import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useClipboard } from "@/lib/hooks";
import { pick, portfolioData, type Locale, type Localized } from "@/lib/data";

interface ContactMethod {
  /** Stable key for animation + copy buttons. */
  id: string;
  icon: React.ReactNode;
  label: Localized;
  value: string;
  /** href for the anchor wrapping the row (mailto:, tel:, https:). */
  href: string;
  /** If true, the row is also copyable to the clipboard. */
  copyable?: boolean;
  /** Open in a new tab for external profiles. */
  external?: boolean;
}

/**
 * Contact methods column. Each row is an interactive card linking out to
 * the channel (email opens the mail client, phone places a call, social
 * profiles open in a new tab). Email and phone rows also expose a copy
 * button — useful on desktop where mailto: handlers may not be configured.
 *
 * Layout responsibility belongs to the parent: this component just renders
 * a stacked list of rows that sizes itself to its container.
 */
export function ContactMethods() {
  const t = useTranslations("Contact");
  const locale = useLocale() as Locale;

  const methods: ContactMethod[] = [
    {
      id: "email",
      icon: <Mail className="size-4" aria-hidden="true" />,
      label: { en: "Email", fr: "E-mail", ar: "البريد الإلكتروني" },
      value: portfolioData.social.email,
      href: `mailto:${portfolioData.social.email}`,
      copyable: true,
    },
    {
      id: "phone",
      icon: <Phone className="size-4" aria-hidden="true" />,
      label: { en: "Phone", fr: "Téléphone", ar: "الهاتف" },
      value: portfolioData.social.phone,
      href: `tel:${portfolioData.social.phone.replace(/\s+/g, "")}`,
      copyable: true,
    },
    {
      id: "linkedin",
      icon: <LinkedinMark className="size-4" />,
      label: { en: "LinkedIn", fr: "LinkedIn", ar: "LinkedIn" },
      value: "adel-labdelli-merioua",
      href: portfolioData.social.linkedin,
      external: true,
    },
    {
      id: "github",
      icon: <GithubMark className="size-4" />,
      label: { en: "GitHub", fr: "GitHub", ar: "GitHub" },
      value: "ADEL-tec",
      href: portfolioData.social.github,
      external: true,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.06)}
      className="flex flex-col gap-3"
    >
      {/* Location pill (display only) */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4"
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <MapPin className="size-4" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">{t("locationLabel")}</p>
          <p className="text-sm font-medium text-foreground">
            {pick(portfolioData.personal.location, locale)}
          </p>
        </div>
      </motion.div>

      {methods.map((m) => (
        <ContactRow key={m.id} method={m} locale={locale} />
      ))}
    </motion.div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────

interface ContactRowProps {
  method: ContactMethod;
  locale: Locale;
}

function ContactRow({ method, locale }: ContactRowProps) {
  const { copied, copy } = useClipboard();
  const tCommon = useTranslations("Common");
  const copyLabel = copied
    ? pick(
        {
          en: "Copied!",
          fr: "Copié !",
          ar: "تم النسخ!",
        },
        locale,
      )
    : pick(
        { en: "Copy", fr: "Copier", ar: "نسخ" },
        locale,
      );

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4",
        "transition-colors hover:border-brand-500/40 hover:bg-card",
      )}
    >
      <a
        href={method.href}
        target={method.external ? "_blank" : undefined}
        rel={method.external ? "noopener noreferrer" : undefined}
        aria-label={`${pick(method.label, locale)}: ${method.value}`}
        title={method.external ? tCommon("openInNewTab") : undefined}
        className="flex flex-1 items-center gap-3 text-start"
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400">
          {method.icon}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-xs text-muted-foreground">
            {pick(method.label, locale)}
          </p>
          <p className="truncate text-sm font-medium text-foreground">
            {method.value}
          </p>
        </div>
        {method.external && (
          <ExternalLink
            className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
      </a>

      {method.copyable && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => copy(method.value)}
          aria-label={copyLabel}
          title={copyLabel}
          className="shrink-0"
        >
          {copied ? (
            <Check className="size-3.5 text-accent-500" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
        </Button>
      )}
    </motion.div>
  );
}
