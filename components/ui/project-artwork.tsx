"use client";

import Image from "next/image";

import { PhoneMockup } from "@/components/ui/phone-mockup";
import { asset, cn } from "@/lib/utils";
import type { Project } from "@/lib/data";

interface ProjectArtworkProps {
  project: Project;
  /** Localized project title, for alt text. */
  title: string;
  /** `card` for grid tiles, `hero` for the large frame on the detail page. */
  size?: "card" | "hero";
  priority?: boolean;
  className?: string;
}

/**
 * The picture a project shows on cards and at the top of its detail page,
 * chosen by what the project is and what artwork it actually has.
 *
 *   mobile  + screenshot   → phone in a dark panel, cropped App-Store style
 *   mobile  + hero art     → the art, cover-fit
 *   web     + hero art     → the art under a hairline browser bar
 *   desktop + hero art     → the art, cover-fit
 *   backend                → terminal tile listing the stack
 *   nothing                → monogram tile
 *
 * Fills whatever aspect box the parent gives it (`absolute inset-0`), and
 * only mounts an `<Image>` for a non-empty path — so a project can go live
 * before its artwork does without ever rendering a broken image.
 */
export function ProjectArtwork({
  project,
  title,
  size = "card",
  priority = false,
  className,
}: ProjectArtworkProps) {
  const hasImage = project.image !== "";
  const screenshot = project.category === "mobile" ? project.images[0] : undefined;

  const sizes =
    size === "hero"
      ? "(max-width: 1024px) 100vw, 64rem"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  if (screenshot) {
    return (
      <Panel className={className}>
        {/* Anchored by its top edge below the panel's midline so the chassis
            runs off the bottom — the composition the app stores use. */}
        <div className="absolute start-1/2 top-[14%] -translate-x-1/2 rtl:translate-x-1/2">
          <PhoneMockup
            src={screenshot}
            alt={title}
            width={size === "hero" ? 200 : 112}
            priority={priority}
          />
        </div>
      </Panel>
    );
  }

  if (hasImage) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden bg-brand-950", className)}>
        {project.category === "web" && <BrowserBar />}
        <Image
          src={asset(project.image)}
          alt={title}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            project.category === "web" && "top-5.5!",
          )}
        />
      </div>
    );
  }

  if (project.category === "backend") {
    return (
      <Panel className={className}>
        <pre className="absolute inset-x-5 top-5 font-mono text-[0.75rem] leading-6 text-surface-50/75">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="block">
              <span className="text-brand-300">$ </span>
              {tech}
            </span>
          ))}
        </pre>
        <Monogram text={project.monogram} className="inset-e-5 bottom-4" />
      </Panel>
    );
  }

  return (
    <Panel className={className}>
      <Monogram text={project.monogram} className="inset-0 flex items-center justify-center" />
    </Panel>
  );
}

/** Dark stage shared by the phone, terminal, and monogram treatments. */
function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "bg-gradient-hero absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Monogram({ text, className }: { text: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute font-heading text-5xl font-bold tracking-tight text-surface-50/85",
        className,
      )}
    >
      {text}
    </span>
  );
}

/** Three-dot chrome strip that marks a screenshot as a web page. */
function BrowserBar() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 z-1 flex h-5.5 items-center gap-1.5 border-b border-surface-50/15 bg-brand-950 px-2.5"
    >
      <span className="size-1.5 rounded-full bg-surface-50/40" />
      <span className="size-1.5 rounded-full bg-surface-50/40" />
      <span className="size-1.5 rounded-full bg-surface-50/40" />
    </span>
  );
}
