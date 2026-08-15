import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import { getPropertyById, updateProperty } from "@/lib/data/property";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import PropertyForm from "@/components/properties/property-form";
import type { PropertyFormData } from "@/components/properties/property-form";
import { getLocationsByType } from "@/lib/data/locations";

interface PageProps {
  params: Promise<{ locale: string; propertyId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Edit Property", "Editar Propiedad"),
  };
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { locale: raw, propertyId } = await params;
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

  const property = await getPropertyById(propertyId);
  if (!property) {
    redirect(`/${locale}/account/properties`);
  }

  // Ensure the agent owns this property
  if (property.clientId !== agent.id) {
    redirect(`/${locale}/account/properties`);
  }

  const locations = {
    city: await getLocationsByType("City"),
    area: await getLocationsByType("Area"),
    development: await getLocationsByType("Development"),
  };

  async function handleUpdate(data: PropertyFormData) {
    "use server";
    await updateProperty(propertyId, {
      title: data.title,
      description: data.description || null,
      keyFeatures: data.keyFeatures || null,
      price: data.price ? Number(data.price) : null,
      currency: data.currency || null,
      listingType: data.listingType || null,
      listingTerm: data.listingTerm || null,
      bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
      interiorArea: data.interiorArea ? Number(data.interiorArea) : null,
      areaUnit: data.areaUnit || null,
      publicLocation: data.publicLocation || null,
      petFriendly: data.petFriendly,
      parking: data.parking,
      nearShopping: data.nearShopping,
      nearJungle: data.nearJungle,
      nearBeach: data.nearBeach,
      twentyFourHourSecurity: data.twentyFourHourSecurity,
      wifi: data.wifi,
      elevator: data.elevator,
      pool: data.pool,
      furnished: data.furnished,
      laundry: data.laundry,
      seoTitleEn: data.seoTitleEn || null,
      seoTitleEs: data.seoTitleEs || null,
      seoDescriptionEn: data.seoDescriptionEn || null,
      seoDescriptionEs: data.seoDescriptionEs || null,
      seoKeywords: data.seoKeywords || null,
    });
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
        {t("Edit Property", "Editar Propiedad")}
      </h1>
      <PropertyForm
        locale={locale}
        property={property}
        tierLevel={agent.tierLevel}
        locations={locations}
        onSubmit={handleUpdate}
      />
    </main>
  );
}
