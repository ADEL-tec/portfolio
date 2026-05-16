"use client";

/**
 * Cross-cutting React hooks for the portfolio UI.
 *
 * All hooks here are client-only and SSR-safe: any state that depends on
 * `window` is initialized to a defensible default and only updated inside
 * `useEffect` so the server render matches the client's first render.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useInView as useFramerInView, type UseInViewOptions } from "framer-motion";
import { useLocale } from "next-intl";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { ChatMessage, ChatRequest } from "@/types";

// ─── Theme ─────────────────────────────────────────────────────────────────

/**
 * Re-export of the theme hook so callers can import all hooks from one place.
 * The provider lives in `components/theme-provider.tsx` — see that file for
 * the underlying implementation (localStorage, system preference, no-flash).
 */
export { useTheme } from "@/components/theme-provider";

// ─── Language ──────────────────────────────────────────────────────────────

export interface UseLanguageResult {
  /** Current UI locale (`'en' | 'fr' | 'ar'`). */
  locale: Locale;
  /** All supported locales, in display order. */
  locales: readonly Locale[];
  /** Switch locale while preserving the current pathname. */
  setLanguage: (next: Locale) => void;
}

/**
 * Read the current language and switch it without losing the current page.
 * Uses next-intl's locale-aware router — preserves query string and hash,
 * and the next-intl middleware persists the choice via the `NEXT_LOCALE` cookie.
 */
export function useLanguage(): UseLanguageResult {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      router.replace(pathname, { locale: next });
    },
    [locale, pathname, router],
  );

  return { locale, locales: routing.locales, setLanguage };
}

// ─── Mounted flag ──────────────────────────────────────────────────────────

/** True once the component has mounted on the client. Gate browser-only
 *  APIs (`window`, `document`) on this to avoid hydration mismatches. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// ─── Media query ───────────────────────────────────────────────────────────

/** Reactive `matchMedia`. Returns `false` on the server. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ─── Scroll ────────────────────────────────────────────────────────────────

export interface ScrollPosition {
  x: number;
  y: number;
  /** True while the user is scrolling down vs. their last position. */
  scrollingDown: boolean;
}

/**
 * Raw scroll position. Use for header hide/show effects, parallax, and
 * "scroll past N pixels" affordances. For a 0–1 page-progress ratio (e.g.
 * for a progress bar), reach for `useScrollProgress` instead.
 */
export function useScrollPosition(): ScrollPosition {
  const [pos, setPos] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    scrollingDown: false,
  });
  const lastY = useRef(0);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setPos({
        x: window.scrollX,
        y,
        scrollingDown: y > lastY.current,
      });
      lastY.current = y;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return pos;
}

/** Page scroll progress as a 0–1 number. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

// ─── In-view detection ─────────────────────────────────────────────────────

export interface UseInViewResult<T extends Element = HTMLElement> {
  /** Attach to the element you want to observe. */
  ref: RefObject<T | null>;
  /** Whether the element currently intersects the viewport. */
  inView: boolean;
}

/**
 * SSR-safe wrapper around Framer Motion's `useInView`. Defaults to firing
 * once (so animations don't replay on every scroll-in) and triggers when
 * 20% of the element is visible — generally where readers register it as
 * "on screen".
 */
export function useInView<T extends Element = HTMLElement>(
  options?: UseInViewOptions,
): UseInViewResult<T> {
  const ref = useRef<T>(null);
  const inView = useFramerInView(ref as RefObject<Element>, {
    once: true,
    amount: 0.2,
    ...options,
  });
  return { ref, inView };
}

// ─── Clipboard ─────────────────────────────────────────────────────────────

/** Copy a string to the clipboard. `copied` auto-resets after `resetMs`. */
export function useClipboard(resetMs: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (value: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  return { copied, copy };
}

// ─── Claude chat ───────────────────────────────────────────────────────────

export interface UseClaudeAPIResult {
  messages: ChatMessage[];
  isLoading: boolean;
  /** Last error message, or `null` if the previous send succeeded. */
  error: string | null;
  /** Send a user message and append the assistant reply when it arrives. */
  send: (content: string) => Promise<void>;
  /** Clear the conversation. */
  reset: () => void;
}

/**
 * Drives a chat conversation against `/api/claude`. The hook owns the
 * message list; render it however you like. The server route validates
 * the payload and (once wired up) forwards to the Anthropic SDK.
 */
export function useClaudeAPI(): UseClaudeAPIResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    setIsLoading(true);
    setError(null);
    // Optimistically append the user turn so the UI updates immediately.
    setMessages((prev) => {
      const next = [...prev, userMsg];
      void postChat(next).then(
        (assistant) =>
          setMessages((curr) => [...curr, { ...assistant, id: crypto.randomUUID() }]),
        (err: Error) => setError(err.message),
      ).finally(() => setIsLoading(false));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, reset };
}

async function postChat(history: ChatMessage[]): Promise<ChatMessage> {
  const body: ChatRequest = {
    messages: history.map(({ role, content }) => ({ role, content })),
  };
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const data: { role: "assistant"; content: string } = await res.json();
  return {
    id: "", // assigned by caller
    role: "assistant",
    content: data.content,
    createdAt: Date.now(),
  };
}
