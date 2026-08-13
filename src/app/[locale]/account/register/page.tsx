import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("My Profile", "Mi Perfil"),
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);

  if (!session) {
    redirect("/login");
  }

  const agent = await getAgentByUserId(session.userId);
  if (!agent) {
    redirect(`/${locale}/directory/register`);
  }

  const isProPlus = agent.tierLevel === "Pro_Plus";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("Profile", "Perfil")}
        </h1>
        {isProPlus && (
          <Link
            href={`/${locale}/account/properties/new`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("Add Property", "Agregar Propiedad")}
          </Link>
        )}
      </div>

      {!isProPlus && (
        <div className="border rounded-lg p-6 bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              "Property management is available for Pro Plus agents.",
              "La gestión de propiedades está disponible para agentes Pro Plus."
            )}
          </p>
          <Link
            href={`/${locale}/directory/${agent.id}/edit`}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("Upgrade to Pro Plus", "Actualizar a Pro Plus")}
          </Link>
        </div>
      )}

      {isProPlus && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            {t(
              "Your property listings will appear here once created.",
              "Tus propiedades aparecerán aquí una vez creadas."
            )}
          </p>
        </div>
      )}
    </main>
  );
}
