"use client";

import Image from "next/image";
import { useCallback, type CSSProperties, type MouseEvent } from "react";

import { asset, cn } from "@/lib/utils";

/**
 * Phone chassis wrapping a screenshot — the recurring device motif in the
 * hero and the project rows.
 *
 * Every dimension derives from `width` using the ratios of the reference
 * drawing (222×462 body, 12px bezel, 32px outer radius, 62×15 notch). One
 * number therefore scales the whole chassis without the bezel looking
 * chunky on the small phones or hairline-thin on the large one.
 */

/** Body aspect (h/w) and the bezel/radius/notch ratios taken off the design. */
const ASPECT = 462 / 222;
const RATIO = {
  bezel: 12 / 222,
  radius: 32 / 222,
  screenRadius: 22 / 222,
  notchW: 62 / 222,
  notchH: 15 / 222,
} as const;

interface PhoneMockupProps {
  src: string;
  alt: string;
  /** Chassis width in px. Everything else is derived from it. */
  width: number;
  /**
   * `cover` for true portrait screenshots; `contain` letterboxes wider
   * artwork instead of cropping a narrow vertical slice out of it.
   */
  fit?: "cover" | "contain";
  /** Follow the pointer with a slight perspective tilt. */
  tilt?: boolean;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function PhoneMockup({
  src,
  alt,
  width,
  fit = "cover",
  tilt = false,
  priority = false,
  className,
  style,
}: PhoneMockupProps) {
  const bezel = width * RATIO.bezel;

  // Pointer tilt is written straight to the node rather than held in state —
  // this fires on every mousemove and React would re-render the tree each time.
  const handleMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!tilt) return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      e.currentTarget.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    },
    [tilt],
  );

  const handleLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!tilt) return;
      e.currentTarget.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
    },
    [tilt],
  );

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "shrink-0 bg-surface-900 shadow-2xl shadow-surface-900/25",
        tilt && "transition-transform duration-300",
        className,
      )}
      style={{
        width,
        height: width * ASPECT,
        padding: bezel,
        borderRadius: width * RATIO.radius,
        ...style,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-black"
        style={{ borderRadius: width * RATIO.screenRadius }}
      >
        {/* Notch */}
        <span
          aria-hidden="true"
          className="absolute start-1/2 z-2 -translate-x-1/2 bg-surface-900 rtl:translate-x-1/2"
          style={{
            top: bezel * 0.75,
            width: width * RATIO.notchW,
            height: width * RATIO.notchH,
            borderRadius: width * RATIO.notchH,
          }}
        />
        <Image
          src={asset(src)}
          alt={alt}
          fill
          priority={priority}
          sizes={`${Math.round(width)}px`}
          className={cn(fit === "cover" ? "object-cover" : "object-contain")}
        />
      </div>
    </div>
  );
}
