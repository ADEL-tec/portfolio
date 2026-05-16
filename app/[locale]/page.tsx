import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";

type PageProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <About />
      <Projects />
      {/* Skills section anchor — the section component will be wired here later. */}
      <div id="skills" aria-hidden="true" />
    </>
  );
}
