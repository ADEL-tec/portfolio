// Stub for `next-intl/server`. Used by server components in production —
// in tests we don't render server components, but the imports still need
// to resolve.

module.exports = {
  getTranslations: () => async (key) => key,
  getLocale: async () => "en",
  setRequestLocale: () => {},
  getMessages: async () => ({}),
};
