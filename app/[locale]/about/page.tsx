import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <About />;
}
