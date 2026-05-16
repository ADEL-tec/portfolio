import { setRequestLocale } from "next-intl/server";
import { Projects } from "@/components/sections/projects";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Projects />;
}
