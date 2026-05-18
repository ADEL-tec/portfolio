/**
 * Per-test setup. Loaded by `setupFilesAfterEach` in `jest.config.ts`, so
 * each describe block starts with a fresh DOM + the matchers below.
 */

import "@testing-library/jest-dom";

// ─── next-intl: provide a deterministic locale and translator ──────────────
//
// We mock the next-intl runtime so component tests don't need to wrap each
// render in `<NextIntlClientProvider>`. The translator returns the key path
// unchanged — assertions can match either the key or substring.

jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
  hasLocale: (locales: readonly string[], candidate: unknown) =>
    typeof candidate === "string" && locales.includes(candidate),
}));

// next-intl/navigation — return the simplest possible stand-ins.
jest.mock("@/i18n/navigation", () => {
  const React = require("react");
  return {
    Link: ({ href, children, ...rest }: any) =>
      React.createElement("a", { href: String(href), ...rest }, children),
    usePathname: () => "/",
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }),
    getPathname: ({ href }: { href: string }) => href,
    redirect: jest.fn(),
  };
});

// ─── next/image: render a plain <img> so attributes are inspectable ───────

jest.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ src, alt, fill: _fill, ...rest }: any) =>
      React.createElement("img", { src, alt, ...rest }),
  };
});

// ─── framer-motion: strip animations, pass children through ───────────────
//
// motion.<tag> becomes a transparent wrapper. AnimatePresence renders its
// children. Hooks return inert values. Strips Framer-specific props
// (whileHover, whileInView, etc.) before forwarding to the DOM to avoid
// React "unknown prop" warnings.

jest.mock("framer-motion", () => {
  const React = require("react");

  const stripFramerProps = (props: Record<string, unknown>) => {
    const FRAMER_PROPS = new Set([
      "initial",
      "animate",
      "exit",
      "variants",
      "transition",
      "whileHover",
      "whileTap",
      "whileFocus",
      "whileInView",
      "viewport",
      "layout",
      "layoutId",
      "drag",
      "dragConstraints",
      "onAnimationStart",
      "onAnimationComplete",
    ]);
    return Object.fromEntries(
      Object.entries(props).filter(([k]) => !FRAMER_PROPS.has(k)),
    );
  };

  const motion = new Proxy(
    {},
    {
      get: (_, tag) =>
        // `React` is required dynamically (untyped), so we keep the props
        // loose and only constrain the tag name. The runtime behaviour is
        // unchanged — animation props are stripped before forwarding.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.forwardRef((props: any, ref: any) =>
          React.createElement(tag as string, {
            ref,
            ...stripFramerProps(props),
          }),
        ),
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollY: { get: () => 0, set: jest.fn() } }),
    useTransform: () => 0,
    useMotionValue: (initial: number) => ({ get: () => initial, set: jest.fn() }),
    useInView: () => true,
    useReducedMotion: () => false,
  };
});

// ─── matchMedia: jsdom doesn't ship one ───────────────────────────────────

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ─── IntersectionObserver: needed for `useInView` & some Framer paths ─────

class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  takeRecords = jest.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}
(global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
