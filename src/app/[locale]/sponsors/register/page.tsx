import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import SponsorForm from "@/components/sponsors/sponsor-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return { title: t("Become a Sponsor", "Conviértete en Patrocinador") };
}

export default async function SponsorRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/sponsors/register`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        {locale === "es" ? "Conviértete en Patrocinador" : "Become a Sponsor"}
      </h1>
      <SponsorForm locale={locale} email={session.email} />
    </main>
  );
}
