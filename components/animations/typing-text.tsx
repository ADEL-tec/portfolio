"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TypingTextBase {
  /** ms per character while typing. Default 60. */
  speed?: number;
  /** ms per character while deleting (multi-text mode only). Default 30. */
  deleteSpeed?: number;
  /** ms to pause once a text is fully typed (multi-text mode). Default 1500. */
  pause?: number;
  /** Show a blinking cursor at the end of the text. Default true. */
  cursor?: boolean;
  className?: string;
}

type TypingTextProps =
  | (TypingTextBase & { text: string; texts?: never })
  | (TypingTextBase & { texts: string[]; text?: never });

/**
 * Typing-animation text.
 *
 * Two modes:
 *   • `text="..."` — types the string out once and stops.
 *   • `texts={["A", "B", ...]}` — types each in turn, pauses, deletes,
 *     advances to the next, loops indefinitely.
 *
 * SSR-safe: the server renders the full text (or the first item) so search
 * crawlers and JS-disabled users see real content. After mount, the
 * animation takes over and replaces the displayed value.
 *
 * Honors `prefers-reduced-motion`: the wrapper renders the resolved text
 * statically with no cursor, no setInterval, no work.
 */
export function TypingText({
  text,
  texts,
  speed = 60,
  deleteSpeed = 30,
  pause = 1500,
  cursor = true,
  className,
}: TypingTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const list = text != null ? [text] : (texts ?? []);
  const fallback = list[0] ?? "";

  // Don't animate on the server / first paint. The static fallback also
  // covers reduced-motion users — they see the real text immediately.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || prefersReducedMotion || list.length === 0) {
    return (
      <span className={className}>
        {fallback}
        {cursor && !prefersReducedMotion && mounted && <Cursor />}
      </span>
    );
  }

  return (
    <TypingTextInner
      list={list}
      speed={speed}
      deleteSpeed={deleteSpeed}
      pause={pause}
      cursor={cursor}
      className={className}
      loop={list.length > 1}
    />
  );
}

// ─── Internals ────────────────────────────────────────────────────────────

interface TypingTextInnerProps {
  list: string[];
  speed: number;
  deleteSpeed: number;
  pause: number;
  cursor: boolean;
  className?: string;
  loop: boolean;
}

function TypingTextInner({
  list,
  speed,
  deleteSpeed,
  pause,
  cursor,
  className,
  loop,
}: TypingTextInnerProps) {
  const [display, setDisplay] = useState("");
  const indexRef = useRef(0);
  const phaseRef = useRef<"typing" | "pausing" | "deleting">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      const current = list[indexRef.current] ?? "";
      const phase = phaseRef.current;

      if (phase === "typing") {
        setDisplay((prev) => {
          const next = current.slice(0, prev.length + 1);
          if (next === current) {
            // Finished typing this entry.
            if (loop) {
              phaseRef.current = "pausing";
              timerRef.current = setTimeout(tick, pause);
            }
            return next;
          }
          timerRef.current = setTimeout(tick, speed);
          return next;
        });
      } else if (phase === "pausing") {
        phaseRef.current = "deleting";
        timerRef.current = setTimeout(tick, deleteSpeed);
      } else if (phase === "deleting") {
        setDisplay((prev) => {
          const next = prev.slice(0, -1);
          if (next.length === 0) {
            // Advance to the next entry.
            indexRef.current = (indexRef.current + 1) % list.length;
            phaseRef.current = "typing";
            timerRef.current = setTimeout(tick, speed);
            return next;
          }
          timerRef.current = setTimeout(tick, deleteSpeed);
          return next;
        });
      }
    };

    // Kick off after one frame so the initial render isn't blocking.
    timerRef.current = setTimeout(tick, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [list, speed, deleteSpeed, pause, loop]);

  return (
    <span className={className} aria-live="polite">
      {display}
      {cursor && <Cursor />}
    </span>
  );
}

function Cursor() {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      className={cn(
        "ms-0.5 inline-block w-[2px] -mb-0.5 align-middle bg-current",
        "h-[1em]",
      )}
    />
  );
}
