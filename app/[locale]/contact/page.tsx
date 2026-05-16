import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <h1 className="text-section font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>

        {/* Form to be implemented as a client component in a later step. */}
      </div>
    </main>
  );
}
