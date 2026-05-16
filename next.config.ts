import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points the plugin at the i18n request config (locales, messages, time zone).
// Create ./i18n/request.ts alongside ./i18n/routing.ts before running `next dev`.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // next/image optimization. Add remote hosts here when serving project
  // screenshots from a CDN (Cloudinary, Vercel Blob, GitHub avatars, etc.).
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Locale prefixing (e.g. `/` → `/en`) is handled by the next-intl middleware,
  // not by this block. Use `redirects` only for non-locale canonical URLs.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
