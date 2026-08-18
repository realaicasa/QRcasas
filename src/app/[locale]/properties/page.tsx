import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Users, Tag } from "lucide-react";
import { getPublicProperties, type PropertyListFilters, type PropertySortOption } from "@/lib/data/property";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import { getLocationsByType } from "@/lib/data/locations";
import PropertiesExplorer from "@/components/properties/properties-explorer";
import SponsorModal from "@/components/sponsors/sponsor-modal";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const locale = normalizeLocale(typeof params.locale === "string" ? params.locale : "en");
  const { t } = getCopy(locale);
  return {
    title: t("Properties for Sale and Rent in Quintana Roo", "Propiedades en Venta y Renta en Quintana Roo"),
    description: t(
      "Browse verified real estate listings in Tulum, Cancun, Playa del Carmen, and throughout Quintana Roo.",
      "Explora propiedades verificadas en Tulum, Cancún, Playa del Carmen y todo Quintana Roo."
    ),
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  const sp = await searchParams;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  const filters: PropertyListFilters = {};
  if (sp.listingType === "Sale" || sp.listingType === "Rental") {
    filters.listingType = sp.listingType;
  }
  if (sp.minPrice && !isNaN(Number(sp.minPrice))) {
    filters.minPrice = Number(sp.minPrice);
  }
  if (sp.maxPrice && !isNaN(Number(sp.maxPrice))) {
    filters.maxPrice = Number(sp.maxPrice);
  }
  if (sp.bedrooms && !isNaN(Number(sp.bedrooms))) {
    filters.bedrooms = Number(sp.bedrooms);
  }
  if (typeof sp.location === "string" && sp.location.trim()) {
    const query = sp.location.trim();
    filters.location = query.toLowerCase() === "pdc" ? "Playa del Carmen" : query;
  }
  if (!filters.location && typeof sp.city === "string" && sp.city.trim()) {
    filters.location = sp.city.trim();
  }
  if (typeof sp.area === "string" && sp.area.trim()) filters.areaId = sp.area;
  if (typeof sp.development === "string" && sp.development.trim()) filters.developmentId = sp.development;
  if (sp.wifi === "true") filters.wifi = true;
  if (sp.elevator === "true") filters.elevator = true;
  if (sp.pool === "true") filters.pool = true;
  if (sp.furnished === "true") filters.furnished = true;
  if (sp.laundry === "true") filters.laundry = true;
  if (sp.petFriendly === "true") filters.petFriendly = true;
  if (sp.parking === "true") filters.parking = true;
  if (sp.nearShopping === "true") filters.nearShopping = true;
  if (sp.nearJungle === "true") filters.nearJungle = true;
  if (sp.nearBeach === "true") filters.nearBeach = true;
  if (sp.twentyFourHourSecurity === "true") filters.twentyFourHourSecurity = true;

  const sort: PropertySortOption =
    sp.sort === "price_asc" || sp.sort === "price_desc" ? sp.sort : "newest";
  const view = sp.view === "map" || sp.view === "split" ? sp.view : "list";

  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = 24;
  const offset = (page - 1) * pageSize;

  const { properties, total } = await getPublicProperties(filters, sort, pageSize, offset);
  const [cities, areas, developments] = await Promise.all([
    getLocationsByType("City"),
    getLocationsByType("Area"),
    getLocationsByType("Development"),
  ]);

  const featuredProperties = await getPublicProperties({ featured: true }, "newest", 20, 0);

  return (
    <main>
      <section className="bg-hero border-b border-border/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("Quintana Roo, Mexico", "Quintana Roo, México")}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {t("Properties in Quintana Roo", "Propiedades en Quintana Roo")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {t(
                "Cities, areas and verified developments",
                "Ciudades, zonas y desarrollos verificados"
              )}
            </p>
          </div>
        </div>
      </section>

      <PropertiesExplorer
        properties={properties}
        total={total}
        locale={locale}
        cities={cities}
        areas={areas}
        developments={developments}
        view={view}
        featuredProperties={featuredProperties.properties}
      />

      {/* Bottom sections */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 space-y-6">
        {/* Marketplace notice */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold mb-2">
                {t("Marketplace notice", "Aviso del mercado")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  "QRcasas is a listing marketplace. We do not independently guarantee property ownership or an advertiser's authority, and we do not hold funds. Independently verify the advertiser, property, contract and payment instructions before transferring money.",
                  "QRcasas es un marketplace de anuncios. No garantizamos de forma independiente la propiedad ni la autoridad del anunciante, y no retenemos fondos. Verifique de forma independiente al anunciante, la propiedad, el contrato y las instrucciones de pago antes de transferir dinero."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Advertise with QRcasas */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-6">
          <h3 className="text-lg font-bold mb-1">
            {t("Advertise with QRcasas", "Anuncia con QRcasas")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              "Register your real estate profile or list a property in Quintana Roo.",
              "Registra tu perfil inmobiliario o publica una propiedad en Quintana Roo."
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SponsorModal locale={locale} />
            <Link
              href={`/${locale}/account/properties/new`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700"
            >
              <Tag className="size-4" />
              {t("Add Property", "Publicar Propiedad")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
