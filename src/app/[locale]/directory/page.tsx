import { Metadata } from "next";
import Link from "next/link";

import { getAllAgents, type AgentRecord } from "@/lib/data/agents";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import { Search, UserPlus } from "lucide-react";

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

  return (
    <main>
      {/* Header */}
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
        {/* Search bar */}
        <form className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="query"
              placeholder={t(
                "Name, agency or specialty",
                "Nombre, agencia o especialidad"
              )}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            name="location"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">{t("All locations", "Todas las ubicaciones")}</option>
          </select>
          <select
            name="specialty"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">{t("All specialties", "Todas las especialidades")}</option>
          </select>
          <select
            name="tier"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">{t("All tiers", "Todos los niveles")}</option>
            <option value="Pro_Plus">Pro Plus</option>
            <option value="Pro">Pro</option>
            <option value="Free">Free</option>
          </select>
          <div className="flex items-end lg:col-span-5">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark sm:w-auto"
            >
              {t("Search", "Buscar")}
            </button>
          </div>
        </form>

        {/* Agents */}
        <div className="space-y-6">
          {agents.map((agent) => (
            <AgentCard key={agent.agentId} agent={agent} locale={locale} />
          ))}

          {agents.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card/60 py-20 text-center">
              <p className="text-lg font-semibold mb-2">
                {t("No profiles match these filters.", "Ningún perfil coincide con estos filtros.")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Be the first to join the QRcasas directory.",
                  "Sé el primero en unirte al directorio de QRcasas."
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
          )}
        </div>
      </div>
    </main>
  );
}

function AgentCard({ agent, locale }: { agent: AgentRecord; locale: Locale }) {
  const { t } = getCopy(locale);
  const tierLabel =
    agent.tierLevel === "Pro_Plus"
      ? t("Pro Plus", "Pro Plus")
      : agent.tierLevel === "Pro"
        ? t("Pro", "Pro")
        : t("Free", "Gratis");

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold text-primary">
          {agent.businessName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{agent.businessName}</h3>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {tierLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("Agent", "Agente")} · {agent.primaryContactChannel}: {agent.primaryContactValue}
          </p>
        </div>
        <Link
          href={`/${locale}/directory/${agent.agentId}`}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {t("View Profile", "Ver Perfil")}
        </Link>
      </div>
    </div>
  );
}