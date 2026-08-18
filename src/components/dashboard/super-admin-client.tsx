"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BadgeCheck, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface AgentRow {
  id: string;
  businessName: string;
  agentReference: string | null;
  tierLevel: string;
  featuredAgent: boolean;
  identityVerificationStatus: string | null;
  specialistVocation: string | null;
  photoUrl?: string;
}

interface SuperAdminClientProps {
  agents: AgentRow[];
  locale: Locale;
  initialQuery: string;
}

export default function SuperAdminClient({
  agents,
  locale,
  initialQuery,
}: SuperAdminClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const t = (en: string, es: string) => (locale === "es" ? es : en);

  const filtered = query.trim()
    ? agents.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.businessName.toLowerCase().includes(q) ||
          (a.agentReference ?? "").toLowerCase().includes(q) ||
          (a.specialistVocation ?? "").toLowerCase().includes(q)
        );
      })
    : agents;

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Search by name, business, or agent ID...",
              "Buscar por nombre, negocio, o ID de agente..."
            )}
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Agent table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Photo", "Foto")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Business Name", "Negocio")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Agent ID", "ID de Agente")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Tier", "Nivel")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Specialty", "Especialidad")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Status", "Estado")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                {t("Actions", "Acciones")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent) => (
              <tr key={agent.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="size-10 overflow-hidden rounded-lg bg-muted">
                    {agent.photoUrl ? (
                      <img src={agent.photoUrl} alt={agent.businessName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                        {agent.businessName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{agent.businessName}</td>
                <td className="px-4 py-3">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {agent.agentReference ?? "—"}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {agent.tierLevel === "Pro_Plus" ? "Pro Plus" : agent.tierLevel}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {agent.specialistVocation ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {agent.identityVerificationStatus === "Verified" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                        <BadgeCheck className="size-3.5" />
                        {t("Verified", "Verificado")}
                      </span>
                    )}
                    {agent.identityVerificationStatus === "Pending Review" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                        {t("Pending", "Pendiente")}
                      </span>
                    )}
                    {agent.featuredAgent && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Sparkles className="size-3.5" />
                        {t("Featured", "Destacado")}
                      </span>
                    )}
                    {!agent.identityVerificationStatus &&
                      !agent.featuredAgent && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/directory/${agent.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t("View", "Ver")}
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  {t("No agents found.", "No se encontraron agentes.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} {t("agents", "agentes")}
      </p>
    </div>
  );
}
