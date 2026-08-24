import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getFavoriteProperties } from "@/lib/data/favorites";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  return {
    title: resolved === "es" ? "Mis favoritos" : "My favorites",
    description: resolved === "es"
      ? "Tus propiedades guardadas para acceso rápido"
      : "Your saved properties for quick access",
  };
}

export default async function FavoritesPage({
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

  const favoriteProperties = await getFavoriteProperties(session.userId);

  return (
    <main className="min-h-dvh flex-col">
      <nav className="flex h-14 items-center border-b bg-background/90 backdrop-blur px-4 sm:px-6">
        <Link href={`/${locale}/account`} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="size-4">&larr;</span>
          </span>
          <span className="text-lg font-semibold tracking-tight">QRCasas</span>
        </Link>
        <div className="ml-auto text-sm text-muted-foreground">
          {t("My favorites", "Mis favoritos")}
        </div>
      </nav>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {t("My favorites", "Mis favoritos")}
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          {t(
            "Save properties you love to access them quickly and get notified about updates.",
            "Guarda las propiedades que amas para acceder rápidamente y recibir notificaciones sobre actualizaciones."
          )}
        </p>

        {favoriteProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-4">
              {t("No favorites yet", "Aún no tienes favoritos")}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                "Click the heart icon on any property card to save it to your favorites.",
                "Haz clic en el ícono de corazón en cualquier tarjeta de propiedad para guardarla en tus favoritos."
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProperties.map((property) => (
              <div key={property.id} className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
                <Link
                  href={`/${locale}/properties/${property.slug}`}
                  className="flex-1 flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {property.photos[0]?.signedUrl ?? property.photos[0]?.url ? (
                      <img
                        src={property.photos[0]?.signedUrl ?? property.photos[0]?.url}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        {t("No image", "Sin imagen")}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold">{property.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {property.publicLocation && (
                        <>
                          <span>{property.publicLocation}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-auto pt-2 text-base font-bold text-primary">
                      {property.price != null && property.currency != null ? (
                        <>
                          {new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
                            style: "currency",
                            currency: property.currency,
                            maximumFractionDigits: 0,
                          }).format(property.price)}
                        </>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">
                          {t("Price on request", "Precio bajo petición")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {property.bedrooms != null && (
                        <span>{property.bedrooms} {t("bd", "dorm")}</span>
                      )}
                      {property.bathrooms != null && (
                        <span>{property.bathrooms} {t("ba", "baño")}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
