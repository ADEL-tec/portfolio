"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/**
 * Error boundary for everything under `[locale]/`. Logs the error and shows
 * a friendly message with a retry button. `reset()` re-renders the segment
 * without a full page reload so transient failures recover gracefully.
 */
export default function SegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Common");

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button onClick={reset} className="group">
          <RotateCcw
            className="size-4 transition-transform group-hover:-rotate-90"
            aria-hidden="true"
          />
          {t("tryAgain")}
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
