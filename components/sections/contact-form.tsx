"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { pick, portfolioData, type Locale, type Localized } from "@/lib/data";

/** Localized validation messages. Kept inline so the form file is the only
 *  place to edit error copy. */
const ERR: Record<string, Localized> = {
  nameMin: {
    en: "Name must be at least 2 characters.",
    fr: "Le nom doit comporter au moins 2 caractères.",
    ar: "يجب أن يحتوي الاسم على حرفين على الأقل.",
  },
  nameMax: {
    en: "Name is too long (max 50).",
    fr: "Le nom est trop long (max 50).",
    ar: "الاسم طويل جدًا (50 كحدّ أقصى).",
  },
  emailInvalid: {
    en: "Please enter a valid email address.",
    fr: "Veuillez saisir une adresse e-mail valide.",
    ar: "يرجى إدخال بريد إلكتروني صالح.",
  },
  phoneInvalid: {
    en: "Please enter a valid phone number.",
    fr: "Veuillez saisir un numéro de téléphone valide.",
    ar: "يرجى إدخال رقم هاتف صالح.",
  },
  subjectMin: {
    en: "Subject must be at least 5 characters.",
    fr: "L'objet doit comporter au moins 5 caractères.",
    ar: "يجب أن يحتوي الموضوع على 5 أحرف على الأقل.",
  },
  subjectMax: {
    en: "Subject is too long (max 100).",
    fr: "L'objet est trop long (max 100).",
    ar: "الموضوع طويل جدًا (100 كحدّ أقصى).",
  },
  messageMin: {
    en: "Message must be at least 10 characters.",
    fr: "Le message doit comporter au moins 10 caractères.",
    ar: "يجب أن تحتوي الرسالة على 10 أحرف على الأقل.",
  },
  messageMax: {
    en: "Message is too long (max 5000).",
    fr: "Le message est trop long (max 5000).",
    ar: "الرسالة طويلة جدًا (5000 كحدّ أقصى).",
  },
};

/** Localized fallback copy for the "API unavailable" path (static export). */
const FALLBACK: Localized = {
  en: "The form server isn't reachable from here. You can email me directly instead:",
  fr: "Le serveur du formulaire est injoignable. Vous pouvez m'écrire directement :",
  ar: "خادم النموذج غير متاح. يمكنك مراسلتي مباشرةً عبر:",
};

/**
 * Build the zod schema with locale-aware error messages. Recomputed when
 * the active locale changes (cheap; the result is memoized in the caller).
 */
function makeSchema(locale: Locale) {
  const t = (key: keyof typeof ERR) => pick(ERR[key]!, locale);
  return z.object({
    name: z.string().min(2, t("nameMin")).max(50, t("nameMax")),
    email: z.email(t("emailInvalid")),
    phone: z
      .string()
      .regex(/^[+()0-9\s\-]{6,}$/, t("phoneInvalid"))
      .optional()
      .or(z.literal("")),
    subject: z.string().min(5, t("subjectMin")).max(100, t("subjectMax")),
    message: z
      .string()
      .min(10, t("messageMin"))
      .max(5000, t("messageMax")),
    /** Honeypot — must be empty. Real users never see this field. */
    website: z.string().max(0).optional().or(z.literal("")),
  });
}

type FormStatus = "idle" | "submitting" | "success" | "error" | "offline";

/**
 * Contact form. Uses react-hook-form with a locale-aware zod schema so
 * validation messages are always in the active language.
 *
 * Submission flow:
 *   1. Validate locally via zod resolver
 *   2. POST JSON to `/api/contact`
 *   3. On 2xx → success state, reset form
 *   4. On 404 (likely the static-export deploy) → offline state with mailto fallback
 *   5. On other failure → error state with retry
 */
export function ContactForm() {
  const t = useTranslations("Contact");
  const locale = useLocale() as Locale;

  const schema = useMemo(() => makeSchema(locale), [locale]);
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 404) {
        setStatus("offline");
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setServerError(body?.error ?? null);
        setStatus("error");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      // Network error — typically also means the API isn't reachable.
      setStatus("offline");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.06, 0)}
      className="flex flex-col gap-5"
      aria-busy={isSubmitting}
    >
      {/* Honeypot — hidden via CSS, not aria-hidden, so bots still find it. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        className="absolute -left-[9999px] h-0 w-0"
        aria-hidden="true"
      />

      <motion.div variants={fadeUp} className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("form.name")}
          error={errors.name?.message}
          required
        >
          <input
            type="text"
            autoComplete="name"
            placeholder={t("form.namePlaceholder")}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "field-name-error" : undefined}
            {...register("name")}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field
          label={t("form.email")}
          error={errors.email?.message}
          required
        >
          <input
            type="email"
            autoComplete="email"
            placeholder={t("form.emailPlaceholder")}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "field-email-error" : undefined}
            {...register("email")}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Field label={t("form.subject")} error={errors.subject?.message} required>
          <input
            type="text"
            placeholder={t("form.subjectPlaceholder")}
            aria-invalid={errors.subject ? "true" : undefined}
            aria-describedby={errors.subject ? "field-subject-error" : undefined}
            {...register("subject")}
            className={inputClass(Boolean(errors.subject))}
          />
        </Field>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Field label={t("form.message")} error={errors.message?.message} required>
          <textarea
            rows={6}
            placeholder={t("form.messagePlaceholder")}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "field-message-error" : undefined}
            {...register("message")}
            className={cn(inputClass(Boolean(errors.message)), "resize-y")}
          />
        </Field>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-xs text-muted-foreground">
          {/* Field-required hint. The label asterisks already convey this. */}
          {pick(
            {
              en: "* Required fields",
              fr: "* Champs obligatoires",
              ar: "* حقول مطلوبة",
            },
            locale,
          )}
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="group min-w-40"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="size-4 animate-spin"
                aria-hidden="true"
              />
              {t("form.submitting")}
            </>
          ) : (
            <>
              {t("form.submit")}
              <Send
                className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {status === "success" && (
          <StatusBanner
            key="success"
            tone="success"
            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
          >
            {t("form.success")}
          </StatusBanner>
        )}
        {status === "error" && (
          <StatusBanner
            key="error"
            tone="error"
            icon={<AlertCircle className="size-4" aria-hidden="true" />}
          >
            {serverError ?? t("form.error")}
          </StatusBanner>
        )}
        {status === "offline" && (
          <StatusBanner
            key="offline"
            tone="error"
            icon={<AlertCircle className="size-4" aria-hidden="true" />}
          >
            <span className="flex flex-wrap items-center gap-1">
              <span>{pick(FALLBACK, locale)}</span>
              <a
                href={`mailto:${portfolioData.social.email}`}
                className="font-medium underline underline-offset-2"
              >
                {portfolioData.social.email}
              </a>
            </span>
          </StatusBanner>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="ms-0.5 text-destructive">*</span>}
      </span>
      {children}
      {error && (
        <span
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </span>
      )}
    </label>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm",
    "transition-all duration-200",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
    "disabled:cursor-not-allowed disabled:opacity-60",
    invalid
      ? "border-destructive/60 focus:ring-destructive/20 focus:border-destructive"
      : "border-border hover:border-foreground/20",
  );
}

// ─── Status banner ────────────────────────────────────────────────────────

interface StatusBannerProps {
  tone: "success" | "error";
  icon: React.ReactNode;
  children: React.ReactNode;
}

function StatusBanner({ tone, icon, children }: StatusBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-2 rounded-lg border p-3 text-sm",
        tone === "success"
          ? "border-accent-500/30 bg-accent-500/10 text-accent-700 dark:text-accent-300"
          : "border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      <span className="mt-0.5">{icon}</span>
      <span className="flex-1">{children}</span>
    </motion.div>
  );
}
