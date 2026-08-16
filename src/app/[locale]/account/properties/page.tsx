import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import { getPropertiesByAgent, type AgentPropertyListItem } from "@/lib/data/property";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("My Properties", "Mis Propiedades"),
  };
}

function StatusBadge({ status, locale }: { status: AgentPropertyListItem["status"]; locale: Locale }) {
  const labels: Record<AgentPropertyListItem["status"], { en: string; es: string; className: string }> = {
    active: { en: "Active", es: "Activa", className: "bg-green-100 text-green-800" },
    expiring_soon: { en: "Expiring Soon", es: "Por Vencer", className: "bg-yellow-100 text-yellow-800" },
    archived: { en: "Archived", es: "Archivada", className: "bg-gray-100 text-gray-600" },
  };
  const { en, es, className } = labels[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {locale === "es" ? es : en}
    </span>
  );
}

function PropertyRow({ property, locale }: { property: AgentPropertyListItem; locale: Locale }) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const priceFmt = property.price != null
    ? new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-MX", {
        style: "currency",
        currency: property.currency === "MXN" ? "MXN" : "USD",
        minimumFractionDigits: 0,
      }).format(property.price)
    : "—";

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{property.title || t("Untitled", "Sin título")}</h3>
            <StatusBadge status={property.status} locale={locale} />
            {property.featured && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {t("Featured", "Destacada")}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            {property.listingType && <span>{property.listingType}</span>}
            {property.bedrooms != null && <span> · {property.bedrooms} {t("bed", "rec")}</span>}
            {property.bathrooms != null && <span> · {property.bathrooms} {t("bath", "baño")}</span>}
            {property.interiorArea != null && <span> · {property.interiorArea} {property.areaUnit || "m²"}</span>}
          </div>
          <div className="text-sm text-muted-foreground">
            {property.publicLocation && <span>{property.publicLocation} · </span>}
            <span className="font-medium text-foreground">{priceFmt}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t("Enquiries", "Consultas")}: {property.enquiryCount}
            {property.status !== "archived" && (
              <span className="ml-2 text-green-700">
                · {t("Active until", "Activa hasta")} {new Date(property.listingExpiryDate).toLocaleDateString(locale === "es" ? "es-MX" : "en-US")}
              </span>
            )}
            {property.status === "expiring_soon" && (
              <span className="ml-2 text-yellow-600">
                · {t("Expires", "Vence")} {new Date(property.expiryDate).toLocaleDateString(locale === "es" ? "es-MX" : "en-US")}
              </span>
            )}
            {property.status === "archived" && (
              <span className="ml-2 text-gray-500">
                · {t("Archived", "Archivada")} {new Date(property.expiryDate).toLocaleDateString(locale === "es" ? "es-MX" : "en-US")}
                {property.archiveUntilDate && ` · ${t("Can reactivate until", "Se puede reactivar hasta")} ${new Date(property.archiveUntilDate).toLocaleDateString(locale === "es" ? "es-MX" : "en-US")}`}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            aria-label={t("Select for renewal", "Seleccionar para renovación")}
          />
          <Link
            href={`/${locale}/account/properties/${property.id}/edit`}
            className="text-sm text-primary hover:underline"
          >
            {t("Edit", "Editar")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function AccountPropertiesPage({
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

  const agent = await getAgentByUserId(session.userId);
  if (!agent) {
    redirect(`/${locale}/directory/register`);
  }

  const properties = await getPropertiesByAgent(agent.id);
  const activeCount = properties.filter((p) => p.status === "active" || p.status === "expiring_soon").length;
  const archivedCount = properties.filter((p) => p.status === "archived").length;
  const totalEnquiries = properties.reduce((sum, p) => sum + p.enquiryCount, 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("My Properties", "Mis Propiedades")}
        </h1>
        <Link
          href={`/${locale}/account/properties/new`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("Add Property", "Agregar Propiedad")}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold">{activeCount}</div>
          <div className="text-sm text-muted-foreground">{t("Active", "Activas")}</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold">{archivedCount}</div>
          <div className="text-sm text-muted-foreground">{t("Archived", "Archivadas")}</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold">{totalEnquiries}</div>
          <div className="text-sm text-muted-foreground">{t("Total Enquiries", "Total Consultas")}</div>
        </div>
      </div>

      {/* Renewal action bar */}
      {properties.some((p) => p.status === "expiring_soon") && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-center justify-between">
          <span className="text-sm text-yellow-800">
            {t(
              "Some properties are expiring soon. Select and renew to keep them active.",
              "Algunas propiedades están por vencer. Selecciona y renueva para mantenerlas activas."
            )}
          </span>
          <button className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700">
            {t("Renew Selected", "Renovar Seleccionadas")}
          </button>
        </div>
      )}

      {/* Property list */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              "You haven't listed any properties yet.",
              "Aún no has listado propiedades."
            )}
          </p>
          <Link
            href={`/${locale}/account/properties/new`}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("List Your First Property", "Lista Tu Primera Propiedad")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <PropertyRow key={property.id} property={property} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
