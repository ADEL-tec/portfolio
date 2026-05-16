import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/**
 * Locale-segment 404. The page is statically rendered, so we don't try to
 * resolve a locale-aware message at request time — short copy in English
 * is good enough for a 404 surface.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <p className="text-7xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
        404
      </p>
      <h1 className="text-2xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
