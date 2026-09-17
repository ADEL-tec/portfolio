import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  Globe,
} from "lucide-react";
import {
  getLocale,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { hasLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import { TickFrame } from "@/components/ui/tick-frame";
import { GithubMark } from "@/components/ui/brand-icons";
import { ProjectArtwork } from "@/components/ui/project-artwork";
import { ProjectCard } from "@/components/sections/project-card";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { CATEGORY_META, PLATFORM_LABEL } from "@/lib/categories";
import {
  getProjectById,
  getProjects,
  pick,
  pickList,
  type Locale,
  type Project,
} from "@/lib/data";
import { routing } from "@/i18n/routing";
import {
  SITE_URL,
  breadcrumbSchema,
  pageMetadata,
  projectSchema,
} from "@/lib/seo";
import { asset, cn } from "@/lib/utils";

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

/**
 * Project detail page.
 *
 * Same editorial language as every other surface — hairline frames with
 * corner ticks, square chips, condensed headings — so a recruiter arriving
 * here from a shared link sees the same site as one who came via the home
 * page. The sidebar carries the scannable facts (role, platform, stack,
 * where to get it); the body carries the write-up.
 */
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
  const categoryLabel = t(`categories.${project.category}`);
  const CategoryIcon = CATEGORY_META[project.category].icon;
  const platforms = project.platforms.map((p) => PLATFORM_LABEL[p]);

  // Siblings share the project's category so prev/next keeps a reader
  // inside the kind of work they came to see.
  const siblings = getProjects().filter((p) => p.category === project.category);
  const index = siblings.findIndex((p) => p.id === project.id);
  const prev = index > 0 ? siblings[index - 1] : undefined;
  const next = index < siblings.length - 1 ? siblings[index + 1] : undefined;
  const related = siblings.filter((p) => p.id !== project.id).slice(0, 3);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${currentLocale}` },
    { name: t("allProjects"), url: `${SITE_URL}/${currentLocale}/projects` },
    { name: title, url: `${SITE_URL}/${currentLocale}/projects/${project.id}` },
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema(project, currentLocale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ─── Back link ─────────────────────────────────────────── */}
      <Link
        href="/projects"
        className="mb-10 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {tCommon("back")}
      </Link>

      {/* ─── Header ────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 border-b border-border pb-10">
        <p className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.08em] text-brand-600 dark:text-brand-400">
          <CategoryIcon className="size-3.5 shrink-0" aria-hidden="true" />
          {categoryLabel}
          {platforms.length > 0 && <span aria-hidden="true">·</span>}
          {platforms.join(" · ")}
        </p>

        <h1 className="max-w-4xl text-section font-heading font-bold text-foreground">
          {title}
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{subtitle}</p>

        <ul className="flex flex-wrap items-center gap-2">
          <Chip tone="solid">{statusLabel}</Chip>
          {highlights.map((h) => (
            <Chip key={h}>{h}</Chip>
          ))}
        </ul>
      </header>

      {/* ─── Hero art ──────────────────────────────────────────── */}
      <HeroArt project={project} title={title} />

      {/* ─── Body: write-up + sidebar ───────────────────────────── */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <article className="flex flex-col gap-10">
          <p className="text-lg leading-relaxed text-foreground/90">
            {fullDescription}
          </p>

          <section aria-labelledby="features-heading" className="flex flex-col gap-4">
            <h2
              id="features-heading"
              className="font-heading text-[1.375rem] font-semibold text-foreground"
            >
              {t("keyFeatures")}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {features.map((feature, i) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center border border-border font-heading text-xs font-semibold tabular-nums text-brand-700 dark:text-brand-300"
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

          {testimonial && (
            <blockquote className="border-s-2 border-brand-500 ps-5 text-base italic leading-relaxed text-foreground">
              &ldquo;{testimonial}&rdquo;
            </blockquote>
          )}
        </article>

        {/* ─── Sidebar ────────────────────────────────────────── */}
        <aside className="relative flex h-fit flex-col gap-6 border border-border p-6 lg:sticky lg:top-24">
          <TickFrame />

          <SidebarRow label={t("role")}>{role}</SidebarRow>
          <SidebarRow label={t("duration")}>{duration}</SidebarRow>
          <SidebarRow label={t("category")}>
            <span className="flex items-center gap-1.5">
              <CategoryIcon
                className="size-3.5 text-brand-500 dark:text-brand-400"
                aria-hidden="true"
              />
              {categoryLabel}
            </span>
          </SidebarRow>

          {platforms.length > 0 && (
            <SidebarRow label={t("platforms")}>
              <ul className="flex flex-wrap gap-1.5">
                {platforms.map((p) => (
                  <Chip key={p}>{p}</Chip>
                ))}
              </ul>
            </SidebarRow>
          )}

          <SidebarRow label={t("technologies")}>
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="bg-secondary px-2.5 py-0.5 text-[0.6875rem] text-secondary-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </SidebarRow>

          <DetailLinks project={project} t={t} />
        </aside>
      </div>

      {/* ─── Screenshots ───────────────────────────────────────── */}
      {project.images.length > 0 && (
        <ProjectGallery
          images={project.images}
          heading={t("screenshots")}
          title={title}
          variant={project.category === "mobile" ? "phone" : "wide"}
        />
      )}

      {/* ─── Related ───────────────────────────────────────────── */}
      <section
        aria-labelledby="related-heading"
        className="mt-16 border-t border-border pt-12"
      >
        <h2
          id="related-heading"
          className="mb-6 font-heading text-[1.375rem] font-semibold text-foreground"
        >
          {t("related", { category: categoryLabel.toLowerCase() })}
        </h2>
        {related.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                locale={currentLocale}
                asMotionItem={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("noRelated", { category: categoryLabel.toLowerCase() })}{" "}
            <Link
              href="/projects"
              className="font-heading font-semibold text-brand-700 transition-colors hover:text-brand-950 dark:text-brand-300 dark:hover:text-brand-100"
            >
              {t("browseAll")}
            </Link>
          </p>
        )}
      </section>

      {/* ─── Prev / next ───────────────────────────────────────── */}
      <nav
        aria-label={`${t("prev")} / ${t("next")}`}
        className="mt-16 grid border-t border-border sm:grid-cols-2"
      >
        <NeighbourLink
          project={prev}
          locale={currentLocale}
          label={t("prev")}
          direction="prev"
        />
        <NeighbourLink
          project={next}
          locale={currentLocale}
          label={t("next")}
          direction="next"
        />
      </nav>
    </main>
  );
}

// ─── Pieces ────────────────────────────────────────────────────────────────

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

function Chip({
  tone = "outline",
  children,
}: {
  tone?: "outline" | "solid";
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "px-2.5 py-0.5 text-[0.6875rem] uppercase tracking-[0.06em]",
        tone === "solid"
          ? "bg-brand-950 text-surface-50 dark:bg-brand-900"
          : "border border-border text-muted-foreground",
      )}
    >
      {children}
    </li>
  );
}

function SidebarRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

/**
 * Landscape art when the project has it; otherwise the phone composition
 * for a mobile project with screenshots; otherwise nothing at all — an
 * empty frame would only advertise the missing artwork.
 */
function HeroArt({ project, title }: { project: Project; title: string }) {
  const hasImage = project.image !== "";
  const hasScreens = project.category === "mobile" && project.images.length > 0;
  if (!hasImage && !hasScreens) return null;

  return (
    <div className="relative mt-10 aspect-video w-full overflow-hidden border border-border">
      <TickFrame />
      {hasImage ? (
        <Image
          src={asset(project.image)}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="object-cover"
          priority
        />
      ) : (
        <ProjectArtwork project={project} title={title} size="hero" priority />
      )}
    </div>
  );
}

function DetailLinks({
  project,
  t,
}: {
  project: Project;
  t: Awaited<ReturnType<typeof getTranslations<"Projects">>>;
}) {
  const candidates: Array<{ href?: string; label: string; icon: IconComponent }> = [
    { href: project.links.playStore, label: t("playStore"), icon: ExternalLink },
    { href: project.links.appStore, label: t("appStore"), icon: ExternalLink },
    { href: project.links.live, label: t("viewLive"), icon: Globe },
    { href: project.links.github, label: t("viewCode"), icon: GithubMark },
    { href: project.links.caseStudy, label: t("caseStudy"), icon: FileText },
  ];
  const links = candidates.filter(
    (l): l is { href: string; label: string; icon: IconComponent } => Boolean(l.href),
  );

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-5">
      <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
        {t("links")}
      </p>
      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noLinks")}</p>
      ) : (
        links.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-2 border border-border px-3 py-2 font-heading text-sm font-semibold text-foreground transition-colors hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300"
          >
            <span>{label}</span>
            <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </a>
        ))
      )}
    </div>
  );
}

function NeighbourLink({
  project,
  locale,
  label,
  direction,
}: {
  project?: Project;
  locale: Locale;
  label: string;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  const cell = cn(
    "flex min-h-24 flex-col justify-center gap-1 py-6",
    isNext ? "items-end text-end sm:border-s sm:border-border sm:ps-6" : "items-start sm:pe-6",
  );

  if (!project) return <div className={cell} aria-hidden="true" />;

  return (
    <Link href={`/projects/${project.id}`} className={cn(cell, "group")}>
      <span className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
        {!isNext && <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />}
        {label}
        {isNext && <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />}
      </span>
      <span className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
        {pick(project.title, locale)}
      </span>
    </Link>
  );
}
