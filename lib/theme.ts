/**
 * Theme contract shared by ThemeProvider, the no-flash inline script, and
 * any consumer that needs to read or set the active theme.
 *
 * Colors themselves live in `app/globals.css` as CSS variables. This file
 * intentionally does NOT duplicate color hex/oklch values — that would create
 * two sources of truth. Instead, `cssVar()` returns a `var(--…)` reference
 * suitable for inline styles, chart libraries, or Framer Motion targets.
 */

export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

/** Theme after `'system'` has been resolved against the OS preference. */
export type ResolvedTheme = Exclude<Theme, "system">;

export const STORAGE_KEY = "portfolio-theme";
export const HTML_ATTR = "class"; // tailwind dark mode strategy is class-based
export const SWITCHING_ATTR = "data-theme-switching";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** Reads the OS-level color scheme preference. Browser-only. */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Collapses `'system'` to the actual underlying light/dark choice. */
export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

/**
 * Applies a resolved theme to `<html>`. Suppresses the global 300ms color
 * transition for one frame so the swap is instant — the eye reads
 * "snap-and-settle" rather than "everything fades through gray".
 */
export function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute(SWITCHING_ATTR, "");
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  // Force layout flush so the transition-suppressing attribute takes effect
  // before we remove it on the next frame.
  void root.offsetHeight;
  requestAnimationFrame(() => {
    root.removeAttribute(SWITCHING_ATTR);
  });
}

/** Helper for using palette tokens from JS (e.g. chart configs, motion). */
export function cssVar(token: string): string {
  return `var(--${token})`;
}

/** Semantic color references for use in inline styles or JS-driven UI. */
export const themeColors = {
  background: cssVar("background"),
  foreground: cssVar("foreground"),
  primary: cssVar("color-brand-500"),
  primaryFg: cssVar("color-brand-50"),
  secondary: cssVar("color-accent-500"),
  secondaryFg: cssVar("color-accent-50"),
  accent: cssVar("color-surface-500"),
  muted: cssVar("muted"),
  mutedFg: cssVar("muted-foreground"),
  border: cssVar("border"),
  ring: cssVar("ring"),
} as const;

/**
 * Inline script body executed BEFORE React hydrates. Reads the stored theme
 * (or system preference) and sets the `.dark` class on `<html>` so the first
 * paint already has the correct colors — no flash of incorrect theme.
 *
 * Keep this as a self-contained string with no closures over module state:
 * it's injected via `dangerouslySetInnerHTML` and runs in a fresh scope.
 */
export const NO_FLASH_SCRIPT = `(function(){try{
var stored=localStorage.getItem('${STORAGE_KEY}');
var theme=stored==='light'||stored==='dark'||stored==='system'?stored:'system';
var resolved=theme==='system'
  ?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')
  :theme;
var root=document.documentElement;
if(resolved==='dark')root.classList.add('dark');else root.classList.remove('dark');
root.style.colorScheme=resolved;
}catch(e){}})();`;
