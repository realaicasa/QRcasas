"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import FilterBar from "@/components/properties/filter-bar";
import PropertyCard from "@/components/properties/property-card";
import MapView from "@/components/properties/map-view";
import type { PropertyListFilters, PropertySortOption, PropertyListItem } from "@/lib/data/property";
import type { LocationOption } from "@/lib/data/locations";
import type { Locale } from "@/lib/i18n";

interface PropertiesExplorerProps {
  properties: PropertyListItem[];
  total: number;
  locale: Locale;
  cities: LocationOption[];
  areas: LocationOption[];
  developments: LocationOption[];
  view: string;
  featuredProperties: PropertyListItem[];
  t: (en: string, es: string) => string;
}

export default function PropertiesExplorer({
  properties,
  total,
  locale,
  cities,
  areas,
  developments,
  view,
  featuredProperties,
  t,
}: PropertiesExplorerProps) {
  const [mode, setMode] = useState<"featured" | "search" | "latest">("featured");
  const [featuredQuery, setFeaturedQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const scrollBy = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  const filteredFeatured = featuredQuery.trim()
    ? featuredProperties.filter((p) => {
        const q = featuredQuery.toLowerCase();
        return (p.title ?? "").toLowerCase().includes(q) || (p.publicLocation ?? "").toLowerCase().includes(q);
      })
    : featuredProperties;

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
        el.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 8000);

    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [filteredFeatured.length]);

  const latestProperties = properties.slice(0, 12);

  return (
    <div>
      {/* Toggle buttons */}
      <div className="sticky top-16 z-30 border-b border-border bg-card shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-center gap-3">
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
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Featured horizontal scroll - always visible */}
        {filteredFeatured.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold">
                {t("Featured Properties", "Propiedades Destacadas")}
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={featuredQuery}
                  onChange={(e) => setFeaturedQuery(e.target.value)}
                  placeholder={t("Search featured...", "Buscar destacadas...")}
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
              {filteredFeatured.map((property) => (
                <div key={property.id} className="w-80 shrink-0">
                  <PropertyCard property={property} locale={locale} t={t} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search mode - shows filter bar + results */}
        {mode === "search" && (
          <div>
            <FilterBar
              total={total}
              locale={locale}
              cities={cities}
              areas={areas}
              developments={developments}
            />
            <div className="mt-6">
              {view !== "list" && (
                <div className="mb-8">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("Results map", "Mapa de resultados")}
                  </h2>
                  <MapView properties={properties} locale={locale} />
                </div>
              )}
              {view !== "map" && (
                properties.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card/60 py-20 text-center">
                    <p className="text-lg font-semibold mb-2">
                      {t(
                        "No published properties match these filters.",
                        "No hay propiedades publicadas que coincidan con estos filtros."
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "Clear one or more filters to broaden the search.",
                        "Limpia uno o más filtros para ampliar la búsqueda."
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} locale={locale} t={t} />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Latest mode */}
        {mode === "latest" && (
          <div>
            <h2 className="mb-4 text-lg font-bold">
              {t("Latest Properties", "Propiedades Recientes")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestProperties.map((property) => (
                <PropertyCard key={property.id} property={property} locale={locale} t={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
