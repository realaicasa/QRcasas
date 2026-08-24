import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCustomerNotifications } from "@/lib/data/notifications";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  return {
    title: resolved === "es" ? "Mis notificaciones" : "My notifications",
    description: resolved === "es"
      ? "Notificaciones sobre tus búsquedas guardadas y actividad"
      : "Notifications about your saved searches and activity",
  };
}

export default async function NotificationsPage({
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

  const notifications = await getCustomerNotifications(session.userId, 50);

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
          {t("My notifications", "Mis notificaciones")}
        </div>
      </nav>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {t("My notifications", "Mis notificaciones")}
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          {t(
            "Stay updated on new property matches, enquiry responses, and platform updates.",
            "Mantente al día sobre nuevas coincidencias de propiedades, respuestas a consultas y actualizaciones de la plataforma."
          )}
        </p>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-4">
              {t("No notifications yet", "Aún no tienes notificaciones")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                "You will see notifications here when new properties match your watchlists or when advertisers respond to your enquiries.",
                "Verás notificaciones aquí cuando nuevas propiedades coincidan con tus listas de seguimiento o cuando los anunciantes respondan a tus consultas."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {notification.type === "NewMatch"
                        ? t("New property match", "Nueva coincidencia de propiedad")
                        : notification.type === "EnquiryUpdate"
                          ? t("Enquiry update", "Actualización de consulta")
                          : notification.type === "PropertyUpdate"
                            ? t("Property update", "Actualización de propiedad")
                            : t("Watchlist run", "Ejecución de lista de seguimiento")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("Sent", "Enviada")}: {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.status === "Read" && (
                      <span className="text-xs text-muted-foreground/50">
                        {t("Read", "Leído")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="whitespace-pre-line text-sm text-muted-foreground">
                    {notification.messageEn}
                  </div>
                  {notification.messageEs && (
                    <div className="mt-2">
                      <div className="whitespace-pre-line text-sm text-muted-foreground">
                        {notification.messageEs}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
