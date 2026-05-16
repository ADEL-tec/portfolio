"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type ResolvedTheme,
  type Theme,
  STORAGE_KEY,
  applyTheme,
  getSystemTheme,
  isTheme,
  resolveTheme,
} from "@/lib/theme";

type ThemeContextValue = {
  /** The user's chosen preference: `'light' | 'dark' | 'system'`. */
  theme: Theme;
  /** The currently displayed theme after `'system'` is resolved. */
  resolvedTheme: ResolvedTheme;
  /** Set the preference. Persists to localStorage. */
  setTheme: (next: Theme) => void;
  /** Convenience: flip between `light` and `dark` (skips `system`). */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  /** Preference applied on first visit when nothing is stored. */
  defaultTheme?: Theme;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  // Lazy initializer: read from localStorage exactly once. SSR returns the
  // default; the no-flash script in <head> has already set the correct class
  // on <html>, so the first client render matches the DOM.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme),
  );

  // Apply the resolved theme on any preference change. Also re-syncs the
  // <html> class in case it drifted (e.g. devtools edits).
  useEffect(() => {
    const next = resolveTheme(theme);
    setResolvedTheme(next);
    applyTheme(next);
  }, [theme]);

  // Track OS preference changes while the user is on `'system'`. We attach
  // unconditionally and just early-return inside the handler so we don't
  // re-subscribe on every theme change.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme !== "system") return;
      const sys = getSystemTheme();
      setResolvedTheme(sys);
      applyTheme(sys);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Sync across tabs: another window writing the storage key should update
  // this one without requiring a reload.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue && isTheme(e.newValue)) setThemeState(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage can throw in private-browsing / quota scenarios — the
      // in-memory state still updates, just no cross-session persistence.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Read the current theme. Throws if used outside <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
