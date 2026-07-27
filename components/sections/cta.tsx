"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { TickFrame } from "@/components/ui/tick-frame";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
import { portfolioData, pick, type Locale, type Localized } from "@/lib/data";
import { downloadResume } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const COPY = {
  heading: {
    en: "Let's ship something that works.",
    fr: "Créons quelque chose qui fonctionne.",
    ar: "لنُطلق شيئًا يعمل كما ينبغي.",
  } satisfies Localized,
  body: {
    en: "Open to mobile and full-stack roles, contract work, and consultations. I reply within a day.",
    fr: "Ouvert aux postes mobile et full-stack, aux missions en contrat et aux consultations. Je réponds sous 24 heures.",
    ar: "متاح لوظائف الموبايل والتطوير المتكامل، والعمل بعقود، والاستشارات. أردّ خلال يوم واحد.",
  } satisfies Localized,
  availabilityLabel: {
    en: "Availability",
    fr: "Disponibilité",
    ar: "التوفّر",
  } satisfies Localized,
};

/**
 * Closing block — the pitch on one side, the hard details on the other.
 *
 * Deliberately not a second copy of the `/contact` form. Someone who has
 * scrolled this far wants either an address to write to or a CV to forward,
 * so the panel gives them both and links onward for anything longer.
 */
export function CTA() {
  const t = useTranslations("Contact");
  const tHero = useTranslations("Hero");
  const tAbout = useTranslations("About");
  const locale = useLocale() as Locale;
  const { personal, social } = portfolioData;

  return (
    <motion.section
      id="contact"
      aria-labelledby="cta-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1, 0.05)}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="flex flex-wrap gap-8">
        {/* ─── Pitch ───────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative min-w-70 flex-[1_1_24rem] border border-border p-8 sm:p-10"
        >
          <TickFrame />
          <p className="eyebrow mb-3.5">{t("title")}</p>
          <h2
            id="cta-heading"
            className="font-heading text-[clamp(1.625rem,3.4vw,2.25rem)] font-bold tracking-tight text-foreground"
          >
            {pick(COPY.heading, locale)}
          </h2>
          <p className="mt-3.5 max-w-md leading-relaxed text-muted-foreground">
            {pick(COPY.body, locale)}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-brand-500 bg-brand-500 px-5.5 py-3 font-heading text-[0.9375rem] font-semibold text-white transition-colors hover:border-brand-700 hover:bg-brand-700"
            >
              {tHero("ctaSecondary")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => downloadResume(personal.resumeUrl)}
              className="inline-flex items-center gap-2 border border-border px-5.5 py-3 font-heading text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-foreground/6"
            >
              <Download className="size-4" aria-hidden="true" />
              {tAbout("downloadCv")}
            </button>
          </div>
        </motion.div>

        {/* ─── Details ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative flex min-w-60 flex-[1_1_17rem] flex-col gap-5 border border-border p-8 sm:p-10"
        >
          <TickFrame />

          <Detail label={t("emailLabel")}>
            <a
              href={`mailto:${personal.email}`}
              className="text-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
            >
              {personal.email}
            </a>
          </Detail>

          <Detail label={t("locationLabel")}>
            <span className="flex items-center gap-1.5 text-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {pick(personal.location, locale)}
            </span>
          </Detail>

          <Detail label={pick(COPY.availabilityLabel, locale)}>
            <span className="text-foreground">
              {pick(personal.availability, locale)}
            </span>
          </Detail>

          <div className="mt-1 flex gap-2.5">
            <SocialSquare href={social.github} label="GitHub">
              <GithubMark className="size-4" aria-hidden="true" />
            </SocialSquare>
            <SocialSquare href={social.linkedin} label="LinkedIn">
              <LinkedinMark className="size-4" aria-hidden="true" />
            </SocialSquare>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/** Micro-label over a value — the pattern repeated down the details panel. */
function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <div className="text-[0.9375rem]">{children}</div>
    </div>
  );
}

function SocialSquare({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex size-9.5 items-center justify-center border border-border text-foreground transition-colors hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
    >
      {children}
    </a>
  );
}
