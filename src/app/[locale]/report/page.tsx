import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export interface ReportReason {
  id: string;
  en: string;
  es: string;
}

export interface Report {
  id: string;
  userId: string;
  propertyId?: string;
  agentId?: string;
  reason: ReportReason;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

const MOCK_REASONS: ReportReason[] = [
  { id: "1", en: "False advertising", es: "Publicidad falsa" },
  { id: "2", en: "Misrepresented property", es: "Propiedad mal representada" },
  { id: "3", en: "Unauthorized contact", es: "Contacto no autorizado" },
  { id: "4", en: "Illegal activity", es: "Actividad ilegal" },
  { id: "5", en: "Privacy violation", es: "Violación de privacidad" },
];

interface ReportPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">{t("Report a Property or Agent", "Reportar una Propiedad o Agente")}</h1>

      <div className="bg-card rounded-xl border border-border p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("Reason for report", "Razón del reporte")}
            </label>
            <select
              name="reason"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {MOCK_REASONS.map(reason => (
                <option key={reason.id} value={reason.id}>{reason.en} ({reason.es})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("Details", "Detalles")}
            </label>
            <textarea
              name="details"
              rows={4}
              placeholder={t("Provide additional details about your report...", "Proporcione detalles adicionales sobre su reporte...")}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
          >
            {t("Submit Report", "Enviar Reporte")}
          </button>
        </form>
      </div>
    </main>
  );
}
