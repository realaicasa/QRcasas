import { Metadata } from "next";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getReadinessChecks, type ReadinessCheck } from "@/lib/data/readiness";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "System Readiness - Master Admin",
};

const STATUS_ICONS: Record<string, string> = {
  pass: "\u2705",
  warn: "\u26A0\uFE0F",
  fail: "\u274C",
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  compliance: { en: "Compliance", es: "Cumplimiento" },
  security: { en: "Security", es: "Seguridad" },
  messaging: { en: "Messaging", es: "Mensajería" },
  inventory: { en: "Inventory", es: "Inventario" },
  seo: { en: "SEO", es: "SEO" },
  freshness: { en: "Freshness", es: "Actualización" },
  infrastructure: { en: "Infrastructure", es: "Infraestructura" },
};

export default async function ReadinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  const cookieStore = await cookies();
  const session = await getCustomerAuth(cookieStore.get("qrcasas_session")?.value);

  if (!session) {
    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mt-2">Authentication required.</p>
        </div>
      </section>
    );
  }

  const checks = await getReadinessChecks();
  const passedCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const totalCount = checks.length;

  // Group by category
  const categories = Array.from(new Set(checks.map((c) => c.category)));

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-2">System Readiness</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {passedCount}/{totalCount} checks passing
          {warnCount > 0 && ` \u2022 ${warnCount} warnings`}
          {failCount > 0 && ` \u2022 ${failCount} failures`}
        </p>

        <div className="space-y-8">
          {categories.map((category) => {
            const catChecks = checks.filter((c) => c.category === category);
            const catLabel = CATEGORY_LABELS[category]?.[locale] ?? category;

            return (
              <div key={category}>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  {catLabel}
                </h2>
                <div className="space-y-2">
                  {catChecks.map((check) => (
                    <div
                      key={check.id}
                      className={`border rounded-lg p-4 ${
                        check.status === "pass"
                          ? "border-green-200 bg-green-50"
                          : check.status === "warn"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{STATUS_ICONS[check.status]}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{check.label}</h3>
                          <p className="text-xs text-muted-foreground">{check.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-xs text-muted-foreground border-t pt-4">
          <p>Environment values, table internals, and credentials are not exposed.</p>
        </div>
      </div>
    </section>
  );
}
