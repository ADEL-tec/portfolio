import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist_Mono, Barlow, Barlow_Condensed } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "../globals.css";
import { cn } from "@/lib/utils";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { ScrollProgress } from "@/components/layout/scroll-progress";
// ChatWidget is intentionally not mounted — the assistant is built but the
// public site doesn't surface it. Re-add `import { ChatWidget } from
// "@/components/chat/widget"` and the `<ChatWidget />` line below to re-enable.
import { pageMetadata, personSchema, websiteSchema } from "@/lib/seo";

// Body copy. Barlow's slightly condensed lowercase keeps long paragraphs
// compact without the cramped feel of a true condensed face.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

// Display cut — headings, stats, nav, buttons. The width contrast against
// Barlow is what makes the headings read as a distinct voice.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-condensed",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Default metadata used when a child page doesn't define `generateMetadata`.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  return pageMetadata({ locale: safeLocale, path: "/" });
}

// Pre-render every supported locale at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  // Catch-all dynamic segments accept any value — verify it's one we support.
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required so server-rendered translations resolve to the correct locale
  // when this layout/page is statically prerendered.
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(
        "h-full antialiased",
        barlow.variable,
        barlowCondensed.variable,
        geistMono.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint so the correct .dark class is on <html> —
            prevents a light/dark flash on first load. Server-render only;
            see the component for why. The JSON-LD tags below stay as plain
            <script> — React exempts non-executable types. */}
        <ThemeScript />
        {/* JSON-LD: Person + WebSite. One script per @type so search engines
            can parse them independently. Generated server-side at build. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema(locale as Locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema(locale as Locale)),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div id="top" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider defaultTheme="system">
            <ScrollProgress />
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
