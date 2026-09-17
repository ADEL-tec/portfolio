"use client";

import { useState } from "react";
import Image from "next/image";

import { asset, cn } from "@/lib/utils";

interface ProjectGalleryProps {
  /** Public-asset paths to the screenshots. */
  images: readonly string[];
  /** Localized section heading (e.g. "Screenshots"). */
  heading: string;
  /** Project title — used for image alt text. */
  title: string;
  /**
   * `phone` for portrait captures (mobile projects); `wide` for landscape
   * captures of web and desktop UIs. Sets the tile width and the intrinsic
   * aspect next/image reserves before load.
   */
  variant?: "phone" | "wide";
}

// Intrinsic aspect hints. They drive next/image's layout reservation so the
// common case has no CLS; `h-auto` lets an off-ratio image self-correct
// after load rather than distort.
const SHOT = {
  phone: { w: 1320, h: 2868, tile: "w-44 sm:w-52", sizes: "(max-width: 640px) 11rem, 13rem" },
  wide: { w: 1600, h: 1000, tile: "w-80 sm:w-96", sizes: "(max-width: 640px) 20rem, 24rem" },
} as const;

/**
 * Horizontal scroll-snap strip of screenshots for the project detail page.
 *
 * Each tile is a fixed-width capture and the row scrolls horizontally with
 * snap points. Intrinsic `width`/`height` (not `fill`) keeps the layout
 * reserved without needing a sized parent. Images that fail to load are
 * dropped from state so a stale path never leaves a broken tile; if every
 * image fails, the whole section unmounts.
 */
export function ProjectGallery({
  images,
  heading,
  title,
  variant = "phone",
}: ProjectGalleryProps) {
  const [failed, setFailed] = useState<readonly string[]>([]);
  const visible = images.filter((src) => !failed.includes(src));
  const shot = SHOT[variant];

  if (visible.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-heading text-[1.375rem] font-semibold text-foreground">
        {heading}
      </h2>

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
              className={cn(
                "group block overflow-hidden border border-border bg-muted transition-colors hover:border-brand-500",
                shot.tile,
              )}
            >
              <Image
                src={asset(src)}
                alt={`${title} — screenshot ${i + 1}`}
                width={shot.w}
                height={shot.h}
                sizes={shot.sizes}
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
