// Auto-mock for `next-intl`. Replaces the ESM-only published bundle with a
// CommonJS-friendly stub so Jest can parse imports without transforming
// `node_modules`. Tests can still override individual exports via jest.mock.

module.exports = {
  useLocale: () => "en",
  useTranslations: () => (key) => key,
  hasLocale: (locales, candidate) =>
    typeof candidate === "string" && Array.from(locales).includes(candidate),
  NextIntlClientProvider: ({ children }) => children,
};
