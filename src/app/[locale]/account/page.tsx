import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCustomerFavorites } from "@/lib/data/favorites";
import { getCustomerWatchlists } from "@/lib/data/watchlists";
import { getCustomerEnquiries } from "@/lib/data/enquiries";
import type { Locale } from "@/lib/i18n";
import { getCopy, normalizeLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  return {
    title: resolved === "es" ? "Panel de cliente" : "Customer dashboard",
  };
}

export default async function CustomerDashboardPage({
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

  const [favorites, watchlists, enquiries] = await Promise.all([
    getCustomerFavorites(session.userId),
    getCustomerWatchlists(session.userId),
    getCustomerEnquiries(session.userId, 10),
  ]);

  const tabs = [
    { id: "favorites", label: t("Favorites", "Favoritos"), count: favorites.length, href: `/${locale}/account/favorites` },
    { id: "watchlists", label: t("Watchlists", "Listas de seguimiento"), count: watchlists.length, href: `/${locale}/account/watchlists` },
    { id: "enquiries", label: t("Enquiry history", "Historial de consultas"), count: enquiries.length, href: `/${locale}/account/enquiries` },
    { id: "notifications", label: t("Notifications", "Notificaciones"), count: 0, href: `/${locale}/account/notifications` },
  ];

  return (
    <main className="flex min-h-dvh flex-col">
      <nav className="flex h-14 items-center border-b bg-background/90 backdrop-blur px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="size-4">Q</span>
          </span>
          <span className="text-lg font-semibold tracking-tight">QRCasas</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="text-xs text-muted-foreground">
            {t("Customer dashboard", "Panel de cliente")}
          </span>
        </div>
      </nav>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-4">
          {t("Welcome back", "Bienvenido de nuevo")}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {t(
            "Here you can manage your favorites, watchlists, enquiries, and notifications.",
            "Aquí puedes gestionar tus favoritos, listas de seguimiento, consultas y notificaciones."
          )}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className="group flex-1 flex-col items-center justify-center rounded-lg border p-6 text-center hover:bg-accent"
            >
              <div className="flex flex-col items-center mb-3">
                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-left w-full">
                <h3 className="font-medium">{tab.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {tab.count > 0 ? `${tab.count} ${t("items", "elementos")}` : t("Empty", "Vacío")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            {t("Quick stats", "Estadísticas rápidas")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t("Favorites", "Favoritos")}</p>
              <p className="text-2xl font-bold">{favorites.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t("Watchlists", "Listas de seguimiento")}</p>
              <p className="text-2xl font-bold">{watchlists.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t("Recent enquiries", "Consultas recientes")}</p>
              <p className="text-2xl font-bold">{enquiries.length}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
