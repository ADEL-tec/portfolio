"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { TickFrame } from "@/components/ui/tick-frame";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { SectionHeading } from "./section-heading";
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
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <SectionHeading
        id="contact-heading"
        eyebrow={t("title")}
        heading={t("subtitle")}
        headingClassName="max-w-160"
        className="mb-11"
      />

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        <motion.div
          variants={fadeUp}
          className="relative order-2 border border-border p-6 sm:p-8 lg:order-1"
        >
          <TickFrame />
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
