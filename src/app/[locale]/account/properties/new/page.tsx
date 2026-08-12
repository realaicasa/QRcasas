import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import PropertyForm from "@/components/properties/property-form";
import type { PropertyFormData } from "@/components/properties/property-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Add Property", "Agregar Propiedad"),
  };
}

export default async function NewPropertyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const agent = await getAgentByUserId(session.userId);
  if (!agent || agent.tierLevel !== "Pro_Plus") {
    redirect(`/${locale}/account/properties`);
  }

  async function handleCreate(data: PropertyFormData) {
    "use server";
    // TODO: Create property record in Teable
    redirect(`/${locale}/account/properties`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <a href={`/${locale}/account/properties`} className="text-sm text-muted-foreground hover:underline">
          &larr; {t("Back to properties", "Volver a propiedades")}
        </a>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        {t("Add Property", "Agregar Propiedad")}
      </h1>
      <PropertyForm
        locale={locale}
        tierLevel={agent.tierLevel}
        onSubmit={handleCreate}
      />
    </main>
  );
}
