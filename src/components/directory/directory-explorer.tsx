"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, BadgeCheck, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { AgentRecord } from "@/lib/data/agents";
import type { Locale } from "@/lib/i18n";

interface DirectoryExplorerProps {
  agents: AgentRecord[];
  featuredAgents: AgentRecord[];
  locale: Locale;
  t: (en: string, es: string) => string;
}

export default function DirectoryExplorer({
  agents,
  featuredAgents,
  locale,
  t,
}: DirectoryExplorerProps) {
  const [mode, setMode] = useState<"featured" | "search" | "latest">("featured");
  const [query, setQuery] = useState("");
  const [featuredQuery, setFeaturedQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const scrollBy = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  const filteredFeatured = featuredQuery.trim()
    ? featuredAgents.filter((a) => {
        const q = featuredQuery.toLowerCase();
        return a.businessName.toLowerCase().includes(q) || (a.specialistVocation ?? "").toLowerCase().includes(q);
      })
    : featuredAgents;

  useEffect(() => {
    if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    if (filteredFeatured.length === 0) return;

    autoAdvanceRef.current = setInterval(() => {
      if (pausedRef.current || !scrollRef.current) return;
      const el = scrollRef.current;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 8000);

    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [filteredFeatured.length]);

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

  const latestAgents = [...agents].slice(0, 12);

  return (
    <div>
      {/* Toggle buttons */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <button
          onClick={() => setMode("search")}
          className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
            mode === "search"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border text-foreground hover:bg-muted"
          }`}
        >
          <Search className="size-4" />
          {t("Search", "Buscar")}
        </button>
        <button
          onClick={() => setMode("latest")}
          className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
            mode === "latest"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border text-foreground hover:bg-muted"
          }`}
        >
          <Clock className="size-4" />
          {t("Latest", "Recientes")}
        </button>
      </div>

      {/* Featured horizontal scroll - always visible */}
      {filteredFeatured.length > 0 && (
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">
              {t("Featured Agents", "Agentes Destacados")}
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={featuredQuery}
                onChange={(e) => setFeaturedQuery(e.target.value)}
                placeholder={t("Search featured...", "Buscar destacados...")}
                className="w-40 rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 sm:w-56"
              />
              <button
                onClick={() => scrollBy(-1)}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("Previous", "Anterior")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("Next", "Siguiente")}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "thin" }}
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
            onFocus={() => { pausedRef.current = true; }}
            onBlur={() => { pausedRef.current = false; }}
          >
            {filteredFeatured.map((agent) => (
              <FeaturedAgentCard key={agent.agentId} agent={agent} locale={locale} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Search mode */}
      {mode === "search" && (
        <div>
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(
                  "Name, business or specialty",
                  "Nombre, negocio o especialidad"
                )}
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent) => (
              <SimpleAgentCard key={agent.agentId} agent={agent} locale={locale} t={t} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card/60 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {t("No agents found.", "No se encontraron agentes.")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Latest mode */}
      {mode === "latest" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestAgents.map((agent) => (
            <SimpleAgentCard key={agent.agentId} agent={agent} locale={locale} t={t} />
          ))}
        </div>
      )}

      {/* Featured always visible at bottom in search/latest modes */}
      {filteredFeatured.length > 0 && mode !== "featured" && (
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">
              {t("Featured Agents", "Agentes Destacados")}
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={featuredQuery}
                onChange={(e) => setFeaturedQuery(e.target.value)}
                placeholder={t("Search featured...", "Buscar destacados...")}
                className="w-40 rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 sm:w-56"
              />
              <button
                onClick={() => scrollBy(-1)}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("Previous", "Anterior")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("Next", "Siguiente")}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "thin" }}
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
            onFocus={() => { pausedRef.current = true; }}
            onBlur={() => { pausedRef.current = false; }}
          >
            {filteredFeatured.map((agent) => (
              <FeaturedAgentCard key={agent.agentId} agent={agent} locale={locale} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleAgentCard({
  agent,
  locale,
  t,
}: {
  agent: AgentRecord;
  locale: Locale;
  t: (en: string, es: string) => string;
}) {
  const photoUrl = agent.profilePhoto?.url || agent.profilePhoto?.signedUrl;
  const isVerified = agent.identityVerificationStatus === "Verified";

  return (
    <Link
      href={`/${locale}/directory/${agent.agentId}`}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-center gap-3">
        <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          {photoUrl ? (
            <img src={photoUrl} alt={agent.businessName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
              {agent.businessName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="truncate text-sm font-semibold">
              {agent.businessName}
            </h3>
            {isVerified && <BadgeCheck className="size-4 shrink-0 text-blue-500" />}
          </div>
          {agent.specialistVocation && (
            <p className="truncate text-xs text-muted-foreground">
              {agent.specialistVocation}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function FeaturedAgentCard({
  agent,
  locale,
  t,
}: {
  agent: AgentRecord;
  locale: Locale;
  t: (en: string, es: string) => string;
}) {
  const photoUrl = agent.profilePhoto?.url || agent.profilePhoto?.signedUrl;
  const isVerified = agent.identityVerificationStatus === "Verified";

  return (
    <Link
      href={`/${locale}/directory/${agent.agentId}`}
      className="flex w-72 shrink-0 flex-col rounded-xl border-2 border-primary/20 bg-card p-5 shadow-md transition-all hover:shadow-lg hover:border-primary/40"
    >
      <div className="mb-3 size-20 overflow-hidden rounded-xl bg-muted">
        {photoUrl ? (
          <img src={photoUrl} alt={agent.businessName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
            {agent.businessName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <h3 className="truncate text-sm font-bold">
          {agent.businessName}
        </h3>
        {isVerified && <BadgeCheck className="size-4 shrink-0 text-blue-500" />}
      </div>
      {agent.specialistVocation && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {agent.specialistVocation}
        </p>
      )}
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
        {t("Featured", "Destacado")}
      </span>
    </Link>
  );
}
