import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAllAgents } from "@/lib/data/agents";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import SuperAdminClient from "@/components/dashboard/super-admin-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return { title: t("Super Admin", "Super Admin") };
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SuperAdminDashboard({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);
  const sp = await searchParams;

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/super-admin/dashboard`);
  }

  if (session.email !== "realai.agency@gmail.com" && session.email !== "mike@dynamicmike.com") {
    redirect(`/${locale}/login?next=/${locale}/super-admin/dashboard`);
  }

  const allAgents = await getAllAgents();

  const query = (sp.q ?? "").trim().toLowerCase();
  const filteredAgents = query
    ? allAgents.filter((a) => {
        return (
          a.businessName.toLowerCase().includes(query) ||
          (a.agentReference ?? "").toLowerCase().includes(query) ||
          (a.specialistVocation ?? "").toLowerCase().includes(query)
        );
      })
    : allAgents;

  const pendingVerifications = allAgents.filter(
    (a) => a.identityVerificationStatus === "Pending Review",
  );
  const featuredCount = allAgents.filter((a) => a.featuredAgent).length;
  const verifiedCount = allAgents.filter(
    (a) => a.identityVerificationStatus === "Verified",
  ).length;

  const agentRows = filteredAgents.map((a) => ({
    id: a.agentId,
    businessName: a.businessName,
    agentReference: a.agentReference,
    tierLevel: a.tierLevel,
    featuredAgent: a.featuredAgent,
    identityVerificationStatus: a.identityVerificationStatus,
    specialistVocation: a.specialistVocation,
    photoUrl: a.profilePhoto?.url,
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {t("Super Admin Dashboard", "Panel de Super Admin")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("Manage agents, verifications, and featured listings", "Gestionar agentes, verificaciones y anuncios destacados")}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold">{allAgents.length}</div>
          <div className="text-xs text-muted-foreground">{t("Total Agents", "Total Agentes")}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{verifiedCount}</div>
          <div className="text-xs text-muted-foreground">{t("Verified", "Verificados")}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{pendingVerifications.length}</div>
          <div className="text-xs text-muted-foreground">{t("Pending Review", "En Revisión")}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{featuredCount}</div>
          <div className="text-xs text-muted-foreground">{t("Featured", "Destacados")}</div>
        </div>
      </div>

      {/* Pending verifications */}
      {pendingVerifications.length > 0 && (
        <div className="mb-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-amber-900">
            {t("Verification Requests Pending Review", "Solicitudes de Verificación Pendientes")}
          </h2>
          <div className="space-y-2">
            {pendingVerifications.map((a) => (
              <div key={a.agentId} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{a.businessName}</span>
                  {a.agentReference && (
                    <span className="ml-2 text-xs text-muted-foreground">{a.agentReference}</span>
                  )}
                </div>
                <Link
                  href={`/${locale}/directory/${a.agentId}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t("Review", "Revisar")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + agent table */}
      <SuperAdminClient
        agents={agentRows}
        locale={locale}
        initialQuery={sp.q ?? ""}
      />
    </main>
  );
}
