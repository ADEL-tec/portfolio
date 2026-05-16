"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { portfolioData, pickList, type Locale } from "@/lib/data";
import { downloadResume } from "@/lib/utils";
import { fadeUp, staggerContainer, transitions } from "@/lib/animations";
import { useMediaQuery } from "@/lib/hooks";

/** How long each rotating subtitle stays on screen, in milliseconds. */
const ROTATION_MS = 3000;

/**
 * Landing hero. Layout:
 *   • Two-column on lg+ (text inline-start, avatar inline-end)
 *   • Single column on mobile (text stacked above avatar)
 *
 * Motion:
 *   • Staggered fade-up entrance for the text column
 *   • AnimatePresence-driven subtitle rotation (paused for reduced-motion users)
 *   • Subtle parallax on the avatar and background blobs while scrolling
 *
 * RTL: every horizontal offset uses logical properties (`start-*`, `end-*`)
 * and the arrow icon mirrors its hover translate via the `rtl:` variant.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const tAbout = useTranslations("About");
  const locale = useLocale() as Locale;

  const titles = pickList(portfolioData.personal.titles, locale);
  const [titleIndex, setTitleIndex] = useState(0);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Rotate the subtitle on a fixed interval. Bailing out for reduced-motion
  // users keeps the page calm and prevents needless re-renders.
  useEffect(() => {
    if (prefersReducedMotion || titles.length <= 1) return;
    const id = window.setInterval(() => {
      setTitleIndex((i) => (i + 1) % titles.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion, titles.length]);

  // Mild parallax: avatar drifts down, blobs drift up as you scroll past.
  const { scrollY } = useScroll();
  const avatarY = useTransform(scrollY, [0, 500], [0, 60]);
  const blobY = useTransform(scrollY, [0, 500], [0, -80]);

  const initials = portfolioData.personal.fullName
    .split(" ")
    .map((s) => s[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  const hasAvatar = Boolean(portfolioData.personal.avatar);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
    >
      <BackgroundShapes y={blobY} />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:py-24">
        {/* ─── Text column ───────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          {/* "Available for opportunities" pill */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <span className="relative inline-flex size-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-500" />
            </span>
            {t("availability")}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-sm font-medium text-brand-600 dark:text-brand-400"
          >
            {t("greeting")}
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="text-display font-bold tracking-tight text-foreground"
          >
            {portfolioData.personal.fullName}
          </motion.h1>

          {/* Rotating subtitle. Positioned absolutely inside a fixed-height
              wrapper so layout doesn't jump as titles change length. */}
          <motion.div
            variants={fadeUp}
            className="relative h-10 sm:h-12"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={titleIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={transitions.base}
                className="text-gradient absolute inset-0 text-2xl font-semibold sm:text-3xl"
              >
                {titles[titleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("tagline")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <Button asChild size="lg" className="group">
              <Link href="/projects">
                {t("ctaPrimary")}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">{t("ctaSecondary")}</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => downloadResume()}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="size-4" aria-hidden="true" />
              {tAbout("downloadCv")}
            </Button>
          </motion.div>
        </motion.div>

        {/* ─── Avatar column ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transitions.slow, delay: 0.3 }}
          style={{ y: avatarY }}
          className="relative mx-auto aspect-square w-56 sm:w-72 lg:w-full lg:max-w-md"
        >
          {/* Ambient glow behind the avatar */}
          <div
            className="bg-gradient-hero absolute inset-0 -z-10 rounded-full opacity-30 blur-2xl"
            aria-hidden="true"
          />
          <div className="shadow-brand-900/20 relative h-full w-full overflow-hidden rounded-full border-4 border-background shadow-2xl ring-1 ring-border">
            {hasAvatar ? (
              <Image
                src={portfolioData.personal.avatar}
                alt={portfolioData.personal.fullName}
                fill
                priority
                sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 28rem"
                className="object-cover"
              />
            ) : (
              <div
                className="bg-gradient-hero flex h-full w-full items-center justify-center text-6xl font-bold text-white"
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

// ─── Background shapes ───────────────────────────────────────────────────────

function BackgroundShapes({ y }: { y: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="bg-gradient-mesh pointer-events-none absolute inset-0 -z-10"
    >
      {/* Three blurred blobs animate on independent phases via animation-delay.
          The mesh gradient lives under them, providing a static base wash. */}
      <motion.div
        style={{ y, animationDelay: "0s" }}
        className="bg-brand-500/20 absolute -top-32 size-96 animate-blob rounded-full blur-3xl start-[-4rem]"
      />
      <motion.div
        style={{ y, animationDelay: "-4s" }}
        className="bg-accent-500/20 absolute top-1/3 size-80 animate-blob rounded-full blur-3xl end-[-2rem]"
      />
      <motion.div
        style={{ y, animationDelay: "-8s" }}
        className="bg-brand-700/20 absolute bottom-0 size-72 animate-blob rounded-full blur-3xl start-1/3"
      />
    </div>
  );
}

// ─── Scroll indicator ────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="absolute bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2"
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-border bg-background/40 backdrop-blur-sm"
      >
        <span className="mt-1.5 block h-2 w-1 rounded-full bg-foreground/60" />
      </motion.div>
    </motion.div>
  );
}
