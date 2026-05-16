"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { ContactForm } from "./contact-form";
import { ContactMethods } from "./contact-methods";

/**
 * Contact section. Two-column on desktop (form left, contact methods
 * right), single column on mobile. Form takes most of the width so the
 * textarea has room; the methods column is narrower and sticks to the top.
 */
export function Contact() {
  const t = useTranslations("Contact");

  return (
    <motion.section
      id="contact"
      aria-labelledby="contact-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.05)}
      className="relative mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24"
    >
      <header className="mb-12 flex flex-col gap-3 text-center">
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400"
        >
          {t("title")}
        </motion.p>
        <motion.h2
          id="contact-heading"
          variants={fadeUp}
          className="text-section font-bold tracking-tight text-foreground"
        >
          {t("subtitle")}
        </motion.h2>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        <motion.div
          variants={fadeUp}
          className="order-2 lg:order-1 rounded-3xl border border-border bg-card/50 p-6 sm:p-8"
        >
          <ContactForm />
        </motion.div>

        <motion.aside
          variants={fadeUp}
          aria-label={t("socialLabel")}
          className="order-1 lg:order-2 flex flex-col gap-4"
        >
          <ContactMethods />
        </motion.aside>
      </div>
    </motion.section>
  );
}
