import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCustomerEnquiries, enrichEnquiryWithPropertySlug } from "@/lib/data/enquiries";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  return {
    title: resolved === "es" ? "Historial de consultas" : "Enquiry history",
    description: resolved === "es"
      ? "Todas tus consultas enviadas a anunciantes"
      : "All your enquiries sent to advertisers",
  };
}

const STATUS_STYLES: Record<string, string> = {
  "New": "bg-blue-50 text-blue-600",
  "Contacted": "bg-green-50 text-green-600",
  "Qualified": "bg-purple-50 text-purple-600",
  "Viewing Booked": "bg-indigo-50 text-indigo-600",
  "Closed": "bg-gray-50 text-gray-600",
  "Spam": "bg-red-50 text-red-600",
};

export default async function EnquiryHistoryPage({
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

  const enquiries = await getCustomerEnquiries(session.userId, 50);
  const enquiriesWithSlugs = await Promise.all(
    enquiries.map((e) => enrichEnquiryWithPropertySlug(e))
  );

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
          {t("Enquiry history", "Historial de consultas")}
        </div>
      </nav>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {t("Enquiry history", "Historial de consultas")}
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          {t(
            "A record of all your enquiries sent to advertisers.",
            "Un registro de todas tus consultas enviadas a anunciantes."
          )}
        </p>

        {enquiriesWithSlugs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-4">
              {t("No enquiries yet", "Aún no tienes consultas")}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                "Send enquiries from property pages to connect with advertisers.",
                "Envía consultas desde las páginas de propiedades para conectarte con anunciantes."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiriesWithSlugs.map((enquiry) => (
              <div key={enquiry.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {enquiry.propertyName ?? t("Property details", "Detalles de propiedad")}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {enquiry.propertySlug ? (
                        <Link
                          href={`/${locale}/properties/${enquiry.propertySlug}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {enquiry.propertySlug}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {t("Property no longer available", "Propiedad ya no disponible")}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("Submitted", "Enviada")}: {new Date(enquiry.submittedAt ?? enquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${STATUS_STYLES[enquiry.status as string] || "bg-gray-50 text-gray-600"}`}>
                      {enquiry.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium">{t("Your message", "Tu mensaje")}</p>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                    {enquiry.message ?? t("No message provided", "No se proporcionó mensaje")}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{t("Lead name", "Nombre del cliente")}:</span>
                      <span className="text-sm">{enquiry.leadName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{t("Email", "Correo")}:</span>
                      <span className="text-sm">{enquiry.email ?? t("Not provided", "No proporcionado")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{t("Phone", "Teléfono")}:</span>
                      <span className="text-sm">{enquiry.phone ?? t("Not provided", "No proporcionado")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{t("Preferred contact", "Contacto preferido")}:</span>
                      <span className="text-sm">
                        {enquiry.preferredChannel === "WhatsApp"
                          ? t("WhatsApp", "WhatsApp")
                          : enquiry.preferredChannel === "Email"
                            ? t("Email", "Correo")
                            : enquiry.preferredChannel === "Phone"
                              ? t("Phone call", "Llamada")
                              : t("Not specified", "No especificado")}
                      </span>
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
