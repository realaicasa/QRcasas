import { type ReportReason } from "@/lib/data/properties"; // Will define this interface

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

export type ReportFormAction = "approve" | "reject" | "dismiss";

export interface ReportPageProps {
  reportId?: string;
  adminRole?: "super_admin" | "moderator";
}

export default function ReportPage({ reportId, adminRole }: ReportPageProps) {
  const { t } = getCopy(); // Need to import getCopy from i18n
  
  // Mock data - in reality this would come from the database
  const mockReasons: ReportReason[] = [
    { id: "1", en: "False advertising", es: "Publicidad falsa" },
    { id: "2", en: "Misrepresented property", es: "Propiedad mal representada" },
    { id: "3", en: "Unauthorized contact", es: "Contacto no autorizado" },
    { id: "4", en: "Illegal activity", es: "Actividad ilegal" },
    { id: "5", en: "Privacy violation", es: "Violación de privacidad" },
  ];

  if (reportId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Report Details</h1>
            {reportId && <p className="text-sm text-muted-foreground">Report #{reportId}</p>}
          </div>
          <div className="flex gap-2">
            {adminRole === "super_admin" && (
              <button onClick={() => console.log("Approved report")} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>
            )}
            {adminRole === "super_admin" && (
              <button onClick={() => console.log("Rejected report")} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
            )}
            {adminRole === "super_admin" && (
              <button onClick={() => console.log("Dismiss report")} className="px-3 py-1 bg-gray-500 text-white rounded">Dismiss</button>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t("Report Reason")}</h2>
          <select className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {mockReasons.map(reason => (
              <option key={reason.id} value={reason.id}>{reason.en} ({reason.es})</option>
            ))}
          </select>
          <p className="mt-4 text-sm text-muted-foreground">Submitted by: {t("reporter")}</p>
          <p className="mt-2 text-sm text-muted-foreground">Submitted at: {new Date().toLocaleString()}</p>
        </div>
      </div>
    );
  }
}
