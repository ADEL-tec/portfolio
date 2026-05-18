const nextJest = require("next/jest.js");

/**
 * `next/jest` discovers `next.config.ts`, the SWC transform, and the
 * configured path aliases automatically — we just pass overrides.
 */
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",

  // Run after the test env (jsdom) is set up but before tests execute.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Pick up `__tests__/**.test.{ts,tsx}` and `*.test.ts(x)` co-located.
  testMatch: [
    "<rootDir>/__tests__/**/*.test.{ts,tsx}",
    "<rootDir>/**/?(*.)+(spec|test).{ts,tsx}",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Replace the ESM-only next-intl bundle with a CommonJS-friendly stub.
    // Real translation logic isn't exercised in tests; the mock returns the
    // key path so assertions match `t("status.published")` shape.
    "^next-intl$": "<rootDir>/__mocks__/next-intl.js",
    "^next-intl/server$": "<rootDir>/__mocks__/next-intl-server.js",
    "^next-intl/navigation$": "<rootDir>/__mocks__/next-intl-navigation.js",
    "^next-intl/routing$": "<rootDir>/__mocks__/next-intl-routing.js",
  },

  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/out/",
    "<rootDir>/cypress/",
    "<rootDir>/e2e/",
  ],

  // next-intl, use-intl, and framer-motion ship as ESM in node_modules.
  // Jest needs to transform them — but `jest.setup.ts` also mocks them, so
  // most real code never runs. The list stays narrow on purpose.
  transformIgnorePatterns: [
    "node_modules/(?!(?:next-intl|use-intl|framer-motion)/)",
  ],

  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!.next/**",
  ],

  coverageThreshold: {
    global: { branches: 0, functions: 0, lines: 0, statements: 0 },
  },

  clearMocks: true,
};

module.exports = createJestConfig(config);
