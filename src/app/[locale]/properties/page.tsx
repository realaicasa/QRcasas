import { Metadata } from "next";
import Link from "next/link";
import { getPublicProperties, type PropertyListFilters, type PropertySortOption } from "@/lib/data/property";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import PropertyCard from "@/components/properties/property-card";
import FilterBar from "@/components/properties/filter-bar";
import MapView from "@/components/properties/map-view";

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
    filters.location = sp.location.trim();
  }

  const sort: PropertySortOption =
    sp.sort === "price_asc" || sp.sort === "price_desc" ? sp.sort : "newest";

  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = 24;
  const offset = (page - 1) * pageSize;

  const { properties, total } = await getPublicProperties(filters, sort, pageSize, offset);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <main>
      {/* Hero */}
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

      {/* Filter Bar */}
      <FilterBar total={total} locale={locale} />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Results map */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("Results map", "Mapa de resultados")}
          </h2>
          <MapView properties={properties} locale={locale} />
        </div>

        {/* Property grid */}
        {properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/60 py-20 text-center">
            <p className="text-lg font-semibold mb-2">
              {t(
                "No published properties match these filters.",
                "No hay propiedades publicadas que coincidan con estos filtros."
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                "Clear one or more filters to broaden the search.",
                "Limpia uno o más filtros para ampliar la búsqueda."
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={locale} t={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <a
                href={`?${new URLSearchParams({
                  ...(filters.listingType ? { listingType: filters.listingType } : {}),
                  ...(filters.minPrice != null ? { minPrice: String(filters.minPrice) } : {}),
                  ...(filters.maxPrice != null ? { maxPrice: String(filters.maxPrice) } : {}),
                  ...(filters.bedrooms != null ? { bedrooms: String(filters.bedrooms) } : {}),
                  ...(filters.location ? { location: filters.location } : {}),
                  sort,
                  page: String(page - 1),
                }).toString()}`}
                className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                {t("Previous", "Anterior")}
              </a>
            )}
            <span className="text-sm text-muted-foreground">
              {t(`Page ${page} of ${totalPages}`, `Página ${page} de ${totalPages}`)}
            </span>
            {page < totalPages && (
              <a
                href={`?${new URLSearchParams({
                  ...(filters.listingType ? { listingType: filters.listingType } : {}),
                  ...(filters.minPrice != null ? { minPrice: String(filters.minPrice) } : {}),
                  ...(filters.maxPrice != null ? { maxPrice: String(filters.maxPrice) } : {}),
                  ...(filters.bedrooms != null ? { bedrooms: String(filters.bedrooms) } : {}),
                  ...(filters.location ? { location: filters.location } : {}),
                  sort,
                  page: String(page + 1),
                }).toString()}`}
                className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                {t("Next", "Siguiente")}
              </a>
            )}
          </nav>
        )}

        {/* Latest market updates */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("Latest market updates", "Últimas actualizaciones del mercado")}
          </h3>
          <div className="text-center py-8 text-sm text-muted-foreground">
            {t(
              "No sourced updates yet. The administrator can add the first bilingual market update.",
              "Aún no hay actualizaciones. El administrador puede agregar la primera actualización bilingüe del mercado."
            )}
          </div>
        </div>

        {/* Marketplace notice */}
        <div className="mt-8 rounded-xl border border-border bg-card/60 p-6">
          <h3 className="text-sm font-semibold mb-3">
            {t("Marketplace notice", "Aviso del mercado")}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t(
              "QRcasas is a listing marketplace. We do not independently guarantee property ownership or an advertiser's authority, and we do not hold funds. Independently verify the advertiser, property, contract and payment instructions before transferring money.",
              "QRcasas es un marketplace de anuncios. No garantizamos de forma independiente la propiedad ni la autoridad del anunciante, y no retenemos fondos. Verifique de forma independiente al anunciante, la propiedad, el contrato y las instrucciones de pago antes de transferir dinero."
            )}
          </p>
        </div>
      </div>
    </main>
  );
}