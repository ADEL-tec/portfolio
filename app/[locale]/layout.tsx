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
import { NO_FLASH_SCRIPT } from "@/lib/theme";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Adel Labdelli Merioua — Full-Stack Developer",
  description:
    "Mobile and web application developer specializing in Flutter and full-stack engineering.",
};

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
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
