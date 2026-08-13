import { Report } from "@/lib/data/properties";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

type AdminRole = "super_admin" | "moderator" | "member";

interface DashboardProps {
  reports: Report[];
  totalReports: number;
  adminRole: AdminRole;
  locale?: string;
}

export default async function SuperAdminDashboard({ reports, totalReports, adminRole, locale = "en" }: DashboardProps) {
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);

  const filteredReports = totalReports > 0 && adminRole === "super_admin" 
    ? reports.filter(r => r.status !== "approved" && r.status !== "rejected") 
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage reports and marketplace integrity</p>
        </div>
        <div className="flex gap-2">
          {adminRole === "super_admin" && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded">View All Reports</button>
          )}
          {adminRole === "super_admin" && (
            <button className="px-4 py-2 bg-green-600 text-white rounded">Export Reports</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Report #{report.id}</h2>
              <span className="text-sm text-muted-foreground">{report.status}</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Reason</label>
                <select className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {report.reason.en ? (
                    <option value={report.reason.id}>{report.reason.en}</option>
                  ) : (
                    <option value="">-- Select reason --</option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Submitted by</label>
                <span className="text-sm text-muted-foreground">{report.userId}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Submitted At</label>
                <span className="text-sm text-muted-foreground">{new Date(report.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalReports > 0 && (
        <div className="mt-8 p-6 bg-amber-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <div className="text-sm text-muted-foreground">
            Total reports: <strong>{totalReports}</strong> (Pending: {filteredReports.length})
          </div>
        </div>
      )}
    </div>
  );
}
