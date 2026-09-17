import { cn } from "@/lib/utils";

/**
 * Crosshair tick marks that straddle the four corners of a framed block.
 *
 * Each mark is a small square holding two hairlines — one vertical, one
 * horizontal — crossing at its centre. Offsetting the square by half its
 * size puts that crossing exactly on the corner, so the marks read as
 * registration crosses on a print layout rather than as a second border.
 *
 * The parent must establish a stacking context (`relative`); the marks are
 * decorative and sit outside the parent's padding box, so give the parent
 * enough surrounding space that they aren't clipped by `overflow-hidden`.
 *
 *   <div className="relative border border-border p-6">
 *     <TickFrame />
 *     …
 *   </div>
 */
export function TickFrame({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      // `absolute inset-0` keeps the wrapper out of flow. Left in flow it
      // becomes a layout box of its own — a grid parent hands it a whole
      // empty cell and shifts every real child along one. It covers the
      // parent's padding box either way, so the marks land identically.
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <Tick className="-top-[5px] -start-[5px]" />
      <Tick className="-top-[5px] -end-[5px]" />
      <Tick className="-bottom-[5px] -start-[5px]" />
      <Tick className="-bottom-[5px] -end-[5px]" />
    </span>
  );
}

/** One corner cross: a 11px box with two 1px rules through its middle. */
function Tick({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "absolute size-[11px] text-foreground/55",
        // The two rules. `bg-current` inherits the colour above so a single
        // text-* class on the parent retints the whole set.
        "before:absolute before:start-[5px] before:top-0 before:h-full before:w-px before:bg-current before:content-['']",
        "after:absolute after:start-0 after:top-[5px] after:h-px after:w-full after:bg-current after:content-['']",
        className,
      )}
    />
  );
}
