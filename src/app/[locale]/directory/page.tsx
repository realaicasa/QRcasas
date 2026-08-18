import { Metadata } from "next";
import Link from "next/link";

import { getAllAgents, type AgentRecord } from "@/lib/data/agents";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import { Search, UserPlus, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import DirectoryExplorer from "@/components/directory/directory-explorer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Realtor Directory", "Directorio de Agentes"),
    description: t(
      "Find verified real estate agents and agencies in Quintana Roo.",
      "Encuentra agentes y agencias inmobiliarias verificadas en Quintana Roo."
    ),
  };
}

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  const session = await getCustomerAuth();
  const agents = await getAllAgents();
  const featuredAgents = agents.filter((a) => a.featuredAgent);

  return (
    <main>
      <section className="bg-hero border-b border-border/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("QRcasas", "QRcasas")}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {t("Realtor directory", "Directorio de agentes")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {t(
                "Agents and agencies serving Quintana Roo",
                "Agentes y agencias que atienden en Quintana Roo"
              )}
            </p>
            <div className="mt-6">
              <Link
                href={`/${locale}/directory/register`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
              >
                <UserPlus className="size-4" />
                {t("Create free profile", "Crear perfil gratuito")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <DirectoryExplorer
          agents={agents}
          featuredAgents={featuredAgents}
          locale={locale}
          t={t}
        />
      </div>
    </main>
  );
}
