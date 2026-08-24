import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return { title: t("Sponsor Dashboard", "Panel de Patrocinador") };
}

export default async function SponsorDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ subscribed?: string; canceled?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);
  const sp = await searchParams;

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/sponsors/dashboard`);
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        {t("Sponsor Dashboard", "Panel de Patrocinador")}
      </h1>

      {sp.subscribed === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {t(
            "Subscription started! Your advert will be live once payment is confirmed.",
            "¡Suscripción iniciada! Tu anuncio estará visible cuando se confirme el pago."
          )}
        </div>
      )}
      {sp.canceled === "1" && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          {t(
            "Checkout cancelled. Your advert was saved but is not yet live.",
            "Pago cancelado. Tu anuncio fue guardado pero aún no está visible."
          )}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground mb-4">
          {t(
            "Manage your sponsor adverts and subscriptions here.",
            "Administra tus anuncios de patrocinador y suscripciones aquí."
          )}
        </p>
        <a
          href={`/${locale}/sponsors/register`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700"
        >
          {t("Create New Advert", "Crear Nuevo Anuncio")}
        </a>
      </div>
    </main>
  );
}
