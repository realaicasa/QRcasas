import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCustomerWatchlists } from "@/lib/data/watchlists";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  return {
    title: resolved === "es" ? "Mis listas de seguimiento" : "My watchlists",
    description: resolved === "es"
      ? "Tus búsquedas guardadas con notificaciones automáticas"
      : "Your saved searches with automatic notifications",
  };
}

export default async function WatchlistsPage({
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

  const watchlists = await getCustomerWatchlists(session.userId);

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
          {t("My watchlists", "Mis listas de seguimiento")}
        </div>
      </nav>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {t("My watchlists", "Mis listas de seguimiento")}
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          {t(
            "Save your searches to get notified when new properties match your criteria.",
            "Guarda tus búsquedas para recibir notificaciones cuando aparezcan nuevas propiedades que coincidan con tus criterios."
          )}
        </p>

        {watchlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-4">
              {t("No watchlists yet", "Aún no tienes listas de seguimiento")}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                "Create a watchlist from the property search page to get started.",
                "Crea una lista de seguimiento desde la página de búsqueda de propiedades para comenzar."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {watchlists.map((watchlist) => (
              <div key={watchlist.watchlistId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{watchlist.watchlistId || t("Unnamed", "Sin nombre")}</h3>
                      <span className="text-xs text-muted-foreground">
                        {t("Created", "Creada")}: {new Date(watchlist.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mb-3 text-sm text-muted-foreground">
                      {t("Last viewed", "Última vista")}: {watchlist.lastViewedAt ? new Date(watchlist.lastViewedAt).toLocaleString() : t("Never", "Nunca")}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("Listing type", "Tipo de lista")}</p>
                      <p className="text-sm font-medium">
                        {watchlist.filters.listingType === "Sale"
                          ? t("For sale", "En venta")
                          : watchlist.filters.listingType === "Rental"
                            ? t("For rent", "En renta")
                            : t("Any", "Cualquiera")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("Property type", "Tipo de propiedad")}</p>
                      <p className="text-sm font-medium">
                        {watchlist.filters.propertyType || t("Any", "Cualquiera")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("Max price", "Precio máximo")}</p>
                      <p className="text-sm font-medium">
                        {watchlist.filters.priceMax != null
                          ? new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
                            style: "currency",
                            currency: watchlist.filters.currency ?? "USD",
                            maximumFractionDigits: 0,
                          }).format(watchlist.filters.priceMax)
                          : t("No maximum", "Sin máximo")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("Bedrooms", "Dormitorios")}</p>
                      <p className="text-sm font-medium">
                        {watchlist.filters.bedrooms != null
                          ? `${watchlist.filters.bedrooms}+`
                          : t("Any", "Cualquiera")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
