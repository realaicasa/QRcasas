import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import { createProperty } from "@/lib/data/property";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import PropertyCreateFlow from "@/components/properties/property-create-flow";
import type { PropertyFormData } from "@/components/properties/property-form";
import type { PricingTier } from "@/components/pricing/pricing-modal";

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
  if (!agent) {
    redirect(`/${locale}/directory/register`);
  }
  const agentId = agent.id;
  const agentTierLevel = agent.tierLevel;

  async function handleCreate(data: PropertyFormData, tier: PricingTier) {
    "use server";
    await createProperty(agentId, {
      title: data.title,
      description: data.description,
      keyFeatures: data.keyFeatures,
      price: data.price ? Number(data.price) : undefined,
      currency: data.currency,
      listingType: data.listingType,
      listingTerm: data.listingTerm,
      bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
      interiorArea: data.interiorArea ? Number(data.interiorArea) : undefined,
      areaUnit: data.areaUnit,
      publicLocation: data.publicLocation,
      seoTitleEn: data.seoTitleEn,
      seoTitleEs: data.seoTitleEs,
      seoDescriptionEn: data.seoDescriptionEn,
      seoDescriptionEs: data.seoDescriptionEs,
      seoKeywords: data.seoKeywords,
    });
    // TODO: Store tier.id, tier.price, expiryDate in a payment/order record
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
      <PropertyCreateFlow
        locale={locale}
        tierLevel={agentTierLevel}
        agentId={agentId}
        onSubmit={handleCreate}
      />
    </main>
  );
}
