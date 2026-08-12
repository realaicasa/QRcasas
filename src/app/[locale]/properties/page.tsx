import { Metadata } from "next";
import { getPublicProperties, type PropertyListFilters, type PropertySortOption } from "@/lib/data/property";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import PropertyCard from "@/components/properties/property-card";

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

  // Parse filters from search params
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
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("Quintana Roo, Mexico", "Quintana Roo, México")}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {t("Find your home in Paradise", "Encuentra tu hogar en el Paraíso")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {t(
                "Verified properties across Riviera Maya: Tulum, Cancún, Playa del Carmen and beyond.",
                "Propiedades verificadas en la Riviera Maya: Tulum, Cancún, Playa del Carmen y más."
              )}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t(
                `${total} verified listings in Quintana Roo`,
                `${total} propiedades verificadas en Quintana Roo`
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Filters */}
        <form className="mb-10 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {t("Type", "Tipo")}
            </label>
            <select
              name="listingType"
              defaultValue={filters.listingType ?? ""}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">{t("All", "Todas")}</option>
              <option value="Sale">{t("For Sale", "En Venta")}</option>
              <option value="Rental">{t("For Rent", "En Renta")}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {t("Min Price", "Precio Mín")}
            </label>
            <input
              type="number"
              name="minPrice"
              defaultValue={filters.minPrice ?? ""}
              placeholder="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {t("Max Price", "Precio Máx")}
            </label>
            <input
              type="number"
              name="maxPrice"
              defaultValue={filters.maxPrice ?? ""}
              placeholder={t("Any", "Cualquiera")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {t("Bedrooms", "Dormitorios")}
            </label>
            <select
              name="bedrooms"
              defaultValue={filters.bedrooms ?? ""}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">{t("Any", "Cualquiera")}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {t("Sort", "Ordenar")}
            </label>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="newest">{t("Newest", "Más reciente")}</option>
              <option value="price_asc">{t("Price: Low to High", "Precio: Menor a Mayor")}</option>
              <option value="price_desc">{t("Price: High to Low", "Precio: Mayor a Menor")}</option>
            </select>
          </div>

          <div className="flex items-end md:col-span-3 lg:col-span-5">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark sm:w-auto"
            >
              {t("Search", "Buscar")}
            </button>
          </div>
        </form>

        {/* Property grid */}
        {properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/60 py-20 text-center">
            <p className="text-lg font-semibold mb-2">
              {t("No properties found", "No se encontraron propiedades")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                "Try adjusting your filters or check back later for new listings.",
                "Intenta ajustar tus filtros o vuelve más tarde para nuevas propiedades."
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
      </div>
    </main>
  );
}
