"use client";

import { useState } from "react";
import Image from "next/image";

import { asset } from "@/lib/utils";

interface ProjectGalleryProps {
  /** Public-asset paths to the screenshots (portrait phone captures). */
  images: readonly string[];
  /** Localized section heading (e.g. "Screenshots"). */
  heading: string;
  /** Project title — used for image alt text. */
  title: string;
}

// Phone-screenshot aspect hint (1320×2868). Drives next/image's layout
// reservation so there's no CLS for the common case; `h-auto` lets any
// off-ratio image self-correct after load rather than distort.
const SHOT_W = 1320;
const SHOT_H = 2868;

/**
 * Horizontal scroll-snap strip of app screenshots for the project detail page.
 *
 * Built for portrait phone captures — each tile is a fixed-width, full-bleed
 * screenshot (App-Store style) and the row scrolls horizontally with snap
 * points. Intrinsic `width`/`height` (not `fill`) keeps the layout reserved
 * without needing a sized parent. Images that fail to load are dropped from
 * state so a stale/missing path never leaves a broken tile; if every image
 * fails, the whole section unmounts.
 */
export function ProjectGallery({ images, heading, title }: ProjectGalleryProps) {
  const [failed, setFailed] = useState<readonly string[]>([]);
  const visible = images.filter((src) => !failed.includes(src));

  if (visible.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 text-xl font-semibold text-foreground">{heading}</h2>

      <ul
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4"
        aria-label={heading}
      >
        {visible.map((src, i) => (
          <li key={src} className="shrink-0 snap-start">
            <a
              href={asset(src)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-44 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-shadow hover:shadow-lg sm:w-52"
            >
              <Image
                src={asset(src)}
                alt={`${title} — screenshot ${i + 1}`}
                width={SHOT_W}
                height={SHOT_H}
                sizes="(max-width: 640px) 11rem, 13rem"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                onError={() => setFailed((prev) => [...prev, src])}
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
