import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  getLocale,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { hasLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getProjectById,
  getProjects,
  pick,
  pickList,
  type Locale,
} from "@/lib/data";
import { ProjectCard } from "@/components/sections/project-card";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; id: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const safe = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const project = getProjectById(id);
  if (!project) {
    return pageMetadata({ locale: safe, path: `/projects/${id}` });
  }
  return pageMetadata({
    locale: safe,
    path: `/projects/${id}`,
    title: pick(project.title, safe),
    description: pick(project.description, safe),
    image: project.image || undefined,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const project = getProjectById(id);
  if (!project) notFound();

  const t = await getTranslations("Projects");
  const tCommon = await getTranslations("Common");
  const currentLocale = (await getLocale()) as Locale;

  const title = pick(project.title, currentLocale);
  const subtitle = pick(project.subtitle, currentLocale);
  const fullDescription = pick(project.fullDescription, currentLocale);
  const features = pickList(project.features, currentLocale);
  const highlights = pickList(project.highlights, currentLocale);
  const testimonial = project.testimonial
    ? pick(project.testimonial, currentLocale)
    : null;
  const role = pick(project.role, currentLocale);
  const duration = pick(project.duration, currentLocale);
  const statusLabel =
    project.status === "in-progress"
      ? t("status.inProgress")
      : t(`status.${project.status}`);

  const related = getProjects()
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 2);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      {/* ─── Back link ─────────────────────────────────────────── */}
      <Button asChild variant="ghost" size="sm" className="mb-8 -ms-2">
        <Link href="/projects">
          <ArrowLeft
            className="size-4 rtl:rotate-180"
            aria-hidden="true"
          />
          {tCommon("back")}
        </Link>
      </Button>

      {/* ─── Header ────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 border-b border-border pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={project.status === "published" ? "default" : "outline"}
          >
            {statusLabel}
          </Badge>
          {highlights.map((h) => (
            <Badge key={h} variant="outline" className="font-normal">
              {h}
            </Badge>
          ))}
        </div>

        <h1 className="text-section font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-3xl text-xl text-muted-foreground">{subtitle}</p>
      </header>

      {/* ─── Hero image ────────────────────────────────────────── */}
      <DetailImage src={project.image} title={title} className="my-10" />

      {/* ─── Body: long description + sidebar ──────────────────── */}
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <article className="flex flex-col gap-10">
          {/* Full description */}
          <section className="flex flex-col gap-4">
            <p className="text-lg leading-relaxed text-foreground/90">
              {fullDescription}
            </p>
          </section>

          {/* Features */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {pick(
                {
                  en: "Key features",
                  fr: "Fonctionnalités clés",
                  ar: "الميزات الأساسية",
                },
                currentLocale,
              )}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {features.map((feature, i) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs font-semibold text-brand-600 tabular-nums dark:text-brand-400"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testimonial */}
          {testimonial && (
            <section className="rounded-2xl border-s-4 border-brand-500 bg-muted/40 p-6">
              <p className="text-base italic leading-relaxed text-foreground">
                &ldquo;{testimonial}&rdquo;
              </p>
            </section>
          )}
        </article>

        {/* ─── Sidebar ────────────────────────────────────────── */}
        <aside className="flex h-fit flex-col gap-6 rounded-2xl border border-border bg-card/50 p-6 lg:sticky lg:top-24">
          <SidebarRow label={t("role")} value={role} />
          <SidebarRow label={t("duration")} value={duration} />

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("technologies")}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Badge variant="secondary" className="font-normal">
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <DetailLinks project={project} t={t} />
        </aside>
      </div>

      {/* ─── Related ───────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {pick(
              {
                en: "Related projects",
                fr: "Projets associés",
                ar: "مشاريع ذات صلة",
              },
              currentLocale,
            )}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                locale={currentLocale}
                asMotionItem={false}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function DetailLinks({
  project,
  t,
}: {
  project: NonNullable<ReturnType<typeof getProjectById>>;
  t: Awaited<ReturnType<typeof getTranslations<"Projects">>>;
}) {
  const links = [
    { href: project.links.playStore, label: t("playStore") },
    { href: project.links.appStore, label: t("appStore") },
    { href: project.links.github, label: t("viewCode") },
    { href: project.links.live, label: t("viewLive") },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href));

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <span>{link.label}</span>
          <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

// ─── Hero image with graceful fallback ────────────────────────────────────

function DetailImage({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const initial = title.charAt(0).toUpperCase();
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-3xl border border-border ${className ?? ""}`}
    >
      <div
        className="bg-gradient-hero absolute inset-0 flex items-center justify-center text-8xl font-bold text-white/80"
        aria-hidden="true"
      >
        {initial}
      </div>
      {src && (
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="relative object-cover"
          priority
        />
      )}
    </div>
  );
}
