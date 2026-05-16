/**
 * Segment-level loading fallback. Rendered by Next during the Suspense
 * boundary while a route's data is resolving — feels instant on static
 * routes but covers any future RSC-streamed fetches.
 */
export default function Loading() {
  return (
    <div
      className="flex flex-1 items-center justify-center px-6 py-24"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-4 border-muted border-t-brand-500"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
