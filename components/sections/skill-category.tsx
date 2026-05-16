"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Server,
  Code2,
  Database,
  Cloud,
  Wrench,
  Layers,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";
import {
  pick,
  type Locale,
  type Localized,
  type SkillCategory as SkillCategoryKey,
  type SkillGroup,
  type SkillLevel,
} from "@/lib/data";
import { SkillItem } from "./skill-item";

const CATEGORY_ICONS: Record<SkillCategoryKey, LucideIcon> = {
  mobile: Smartphone,
  backend: Server,
  frontend: Code2,
  databases: Database,
  cloud: Cloud,
  tools: Wrench,
  architecture: Layers,
};

/**
 * One-line category descriptions, inline so the file is the only place to
 * edit copy. The matching `messages/*.json` keys are inconsistent in shape
 * (some are strings, some objects), which makes typed `t()` reads awkward.
 */
const CATEGORY_DESCRIPTIONS: Record<SkillCategoryKey, Localized> = {
  mobile: {
    en: "Cross-platform apps that ship to both stores from one codebase.",
    fr: "Apps multiplateformes publiées sur les deux stores depuis un seul code.",
    ar: "تطبيقات متعدّدة المنصّات تُنشر على المتجرين من شيفرة واحدة.",
  },
  backend: {
    en: "Scalable REST and GraphQL services with secure auth and analytics.",
    fr: "Services REST et GraphQL évolutifs avec auth sécurisée et analytics.",
    ar: "خدمات REST و GraphQL قابلة للتوسّع مع مصادقة آمنة وتحليلات.",
  },
  frontend: {
    en: "Accessible, performant web UIs with TypeScript-first ergonomics.",
    fr: "Interfaces web accessibles et performantes, conçues d'abord en TypeScript.",
    ar: "واجهات ويب سهلة الوصول وعالية الأداء مع تجربة TypeScript أولًا.",
  },
  databases: {
    en: "Relational, document, and realtime stores, picked to fit the read pattern.",
    fr: "Bases relationnelles, documentaires et temps réel, choisies selon les accès.",
    ar: "قواعد بيانات علائقية ومستندية ولحظية، يُختار كلٌّ منها وفق نمط القراءة.",
  },
  cloud: {
    en: "From local Docker to GCP and AWS deploys with CI/CD pipelines.",
    fr: "De Docker en local aux déploiements GCP/AWS avec pipelines CI/CD.",
    ar: "من Docker محليًّا إلى نشر GCP/AWS بأنابيب CI/CD.",
  },
  tools: {
    en: "Day-to-day toolbelt for building, testing, and shipping software.",
    fr: "Boîte à outils quotidienne pour construire, tester et livrer.",
    ar: "أدوات يومية للبناء والاختبار وإطلاق البرمجيات.",
  },
  architecture: {
    en: "Patterns that keep features small, testable, and easy to change later.",
    fr: "Patterns qui gardent les fonctionnalités petites, testables et évolutives.",
    ar: "أنماط تحافظ على الميزات صغيرة وقابلة للاختبار وسهلة التطوير لاحقًا.",
  },
};

/** Map a percentage to a level label for the headline pill. */
function levelFromPercentage(p: number): SkillLevel {
  if (p >= 90) return "Expert";
  if (p >= 75) return "Advanced";
  if (p >= 50) return "Intermediate";
  return "Beginner";
}

interface SkillCategoryProps {
  group: SkillGroup;
  locale: Locale;
}

/**
 * Category card. Renders the title, a one-line description, a headline
 * pill summarizing the category's peak proficiency, and the per-skill
 * progress bars. String-only categories (tools, architecture) skip the
 * progress bars and render the items as badge chips instead.
 */
export function SkillCategory({ group, locale }: SkillCategoryProps) {
  const Icon = CATEGORY_ICONS[group.category];
  const title = pick(group.title, locale);
  const description = pick(CATEGORY_DESCRIPTIONS[group.category], locale);

  // Items can be either `SkillItem` (with percentage) or plain strings.
  const measured = group.items.filter(
    (i): i is Extract<SkillGroup["items"][number], { name: string; level: SkillLevel }> =>
      typeof i === "object",
  );
  const stringItems = group.items.filter(
    (i): i is string => typeof i === "string",
  );

  const peakPercentage = measured.reduce(
    (max, item) => Math.max(max, item.percentage),
    0,
  );
  const headlineLevel =
    measured.length > 0 ? levelFromPercentage(peakPercentage) : null;

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-card/60 p-6",
        "transition-all duration-300 hover:border-brand-500/40 hover:bg-card hover:shadow-lg hover:shadow-brand-900/5",
      )}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
          >
            <Icon className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {headlineLevel && (
          <Badge
            variant="outline"
            className="shrink-0 text-xs font-normal text-muted-foreground"
          >
            {headlineLevel} · {peakPercentage}%
          </Badge>
        )}
      </header>

      {/* ─── Measured skills (with bars) ────────────────────────── */}
      {measured.length > 0 && (
        <div className="flex flex-col gap-3.5">
          {measured.map((skill, i) => (
            <SkillItem key={skill.name} skill={skill} delay={i * 0.05} />
          ))}
        </div>
      )}

      {/* ─── String-only items (badges) ─────────────────────────── */}
      {stringItems.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {stringItems.map((item) => (
            <li key={item}>
              <Badge variant="secondary" className="font-normal">
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}
