import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "../globals.css";
import { cn } from "@/lib/utils";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
// ChatWidget is intentionally not mounted — the assistant is built but the
// public site doesn't surface it. Re-add `import { ChatWidget } from
// "@/components/chat/widget"` and the `<ChatWidget />` line below to re-enable.
import { NO_FLASH_SCRIPT } from "@/lib/theme";
import { pageMetadata } from "@/lib/seo";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
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
        geistSans.variable,
        geistMono.variable,
        figtree.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint so the correct .dark class is on <html> — */}
        {/* prevents a light/dark flash on first load. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div id="top" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider defaultTheme="system">
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
