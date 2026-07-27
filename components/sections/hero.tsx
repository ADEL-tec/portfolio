"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ChevronDown, Download, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { portfolioData, pick, type Locale } from "@/lib/data";
import { downloadResume } from "@/lib/utils";
import { fadeUp, staggerContainer, transitions } from "@/lib/animations";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Landing hero.
 *
 * Two columns that wrap to one on narrow viewports: the type block leads,
 * a trio of floating devices sits opposite. Behind both, a graph-paper wash
 * drifts at a slower rate than the devices, which drift at slower rates than
 * the page — three parallax planes that give the section depth without any
 * of it moving fast enough to distract.
 *
 * The stat strip carries only facts that come out of `portfolioData`, so it
 * can't drift out of sync with the rest of the site.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const tAbout = useTranslations("About");
  const locale = useLocale() as Locale;
  const { personal, projects, skills } = portfolioData;

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollY } = useScroll();

  // Distinct rates per plane. The backdrop barely moves; the centre device —
  // the one the eye lands on — moves most.
  const gridY = useParallax(scrollY, reduceMotion ? 0 : 0.05);
  const leftY = useParallax(scrollY, reduceMotion ? 0 : 0.1);
  const centreY = useParallax(scrollY, reduceMotion ? 0 : 0.22);
  const rightY = useParallax(scrollY, reduceMotion ? 0 : 0.16);

  // Every figure below is derived, never typed in by hand.
  const storeCount = new Set(
    projects.flatMap((p) =>
      [
        p.links.playStore ? "play" : null,
        p.links.appStore ? "app" : null,
      ].filter(Boolean),
    ),
  ).size;
  const techCount = skills.reduce((sum, g) => sum + g.items.length, 0);

  const stats = [
    { value: `${personal.yearsExperience}+`, label: t("stats.years") },
    { value: `${projects.length}`, label: t("stats.apps") },
    { value: `${storeCount}`, label: t("stats.stores") },
    { value: `${Math.floor(techCount / 10) * 10}+`, label: t("stats.tech") },
  ];

  const [firstName, ...restName] = personal.fullName.split(" ");
  // The trio is all-or-nothing — two floating phones round an empty slot
  // reads as a broken image, not as a deliberate composition.
  const [leftScreen, centreScreen, rightScreen] = personal.heroScreens;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Graph-paper backdrop. Inset negatively so the parallax shift never
          exposes an unpainted edge at the section boundary. */}
      <motion.div
        aria-hidden="true"
        style={{ y: gridY }}
        className="bg-grid pointer-events-none absolute inset-x-[-5%] top-[-10%] bottom-[-5%] -z-10"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-16 gap-y-14 px-6 pt-16 pb-20 sm:px-8 lg:px-12 lg:pt-24 lg:pb-28">
        {/* ─── Type block ──────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.09, 0.05)}
          initial="hidden"
          animate="visible"
          className="min-w-75 flex-[1_1_28.75rem]"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-4">
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="text-display font-heading font-bold text-foreground"
          >
            {firstName}
            <br />
            {restName.join(" ")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-2.5 font-heading text-2xl font-medium text-brand-700 sm:text-[1.4rem] dark:text-brand-300"
          >
            {t("title")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-128 text-[1.0625rem] leading-relaxed text-muted-foreground"
          >
            {t("tagline")}
          </motion.p>

          {/* CTAs — square, letter-spaced, condensed. Deliberately not the
              shadcn Button: this design has no radius and no shadow. */}
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadResume(personal.resumeUrl)}
              className="inline-flex items-center gap-2 border border-brand-500 bg-brand-500 px-5.5 py-3 font-heading text-[0.9375rem] font-semibold text-white transition-colors hover:border-brand-700 hover:bg-brand-700"
            >
              <Download className="size-4" aria-hidden="true" />
              {tAbout("downloadCv")}
            </button>
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-2 border border-border px-5.5 py-3 font-heading text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-foreground/6"
            >
              <Mail className="size-4" aria-hidden="true" />
              {t("emailMe")}
            </a>
          </motion.div>

          {/* ─── Stat strip ────────────────────────────────────────── */}
          <motion.dl
            variants={fadeUp}
            className="relative mt-8 flex max-w-140 flex-wrap border border-border"
          >
            <TickFrame />
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex-[1_1_120px] border-e border-border px-4.5 py-4 last:border-e-0"
              >
                <dt className="font-heading text-[1.7rem] font-bold tabular-nums text-foreground">
                  {stat.value}
                </dt>
                <dd className="mt-0.5 text-[0.65rem] uppercase tracking-[0.06em] text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* ─── Device trio ─────────────────────────────────────────── */}
        {leftScreen && centreScreen && rightScreen && (
          <div
            aria-hidden="true"
            className="relative hidden h-125 min-w-70 flex-[1_1_23.75rem] items-center justify-center sm:flex"
          >
            <motion.div
              style={{ y: leftY }}
              className="absolute top-[14%] inset-s-0"
            >
              <div className="rotate-[-9deg]">
                <div
                  className="animate-float-y"
                  style={{ animationDuration: "6.5s" }}
                >
                  <PhoneMockup src={leftScreen} alt="" width={148} />
                </div>
              </div>
            </motion.div>

            <motion.div style={{ y: centreY }} className="relative z-2">
              <div
                className="animate-float-y"
                style={{ animationDuration: "5.5s", animationDelay: "0.3s" }}
              >
                <PhoneMockup src={centreScreen} alt="" width={222} priority />
              </div>
            </motion.div>

            <motion.div
              style={{ y: rightY }}
              className="absolute top-[6%] inset-e-[2%]"
            >
              <div className="rotate-[9deg]">
                <div
                  className="animate-float-y"
                  style={{ animationDuration: "7s", animationDelay: "0.6s" }}
                >
                  <PhoneMockup src={rightScreen} alt="" width={140} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transitions.slow, delay: 1.2 }}
        aria-label={pick(
          { en: "Scroll to About", fr: "Aller à la section À propos", ar: "انتقل إلى نبذة عني" },
          locale,
        )}
        className="absolute bottom-4 inset-s-1/2 -translate-x-1/2 text-foreground/40 transition-colors hover:text-brand-500 rtl:translate-x-1/2"
      >
        <ChevronDown className="size-5 animate-bounce-down" aria-hidden="true" />
      </motion.a>
    </section>
  );
}

/** Scroll-linked upward drift. `rate` 0 disables it (reduced motion). */
function useParallax(scrollY: MotionValue<number>, rate: number) {
  return useTransform(scrollY, (y) => -y * rate);
}
