"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import type { LocationOption } from "@/lib/data/locations";

interface FilterBarProps {
  total: number;
  locale: string;
  cities: LocationOption[];
  areas: LocationOption[];
  developments: LocationOption[];
}

export default function FilterBar({ total, locale, cities, areas, developments }: FilterBarProps) {
  const [listingType, setListingType] = useState<"Sale" | "Rental">("Sale");
  const [view, setView] = useState<"list" | "map" | "split">("list");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const t = (en: string, es: string) => (locale === "es" ? es : en);

  const selectClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelClass = "text-xs font-semibold text-muted-foreground";

  const types = ["Apartment", "House", "Condo", "Villa", "Land", "Commercial"];
  const amenities = [
    { name: "elevator", label: "Elevator", es: "Ascensor" },
    { name: "wifi", label: "WiFi", es: "WiFi" },
    { name: "pool", label: "Pool", es: "Piscina" },
    { name: "laundry", label: "Laundry", es: "Lavandería" },
    { name: "furnished", label: "Furnished", es: "Amueblado" },
    { name: "petFriendly", label: "Pet friendly", es: "Admite mascotas" },
    { name: "parking", label: "Parking", es: "Estacionamiento" },
    { name: "nearShopping", label: "Near shopping", es: "Cerca de tiendas" },
    { name: "nearJungle", label: "Near jungle", es: "Cerca de la selva" },
    { name: "nearBeach", label: "Near beach", es: "Cerca de la playa" },
    { name: "twentyFourHourSecurity", label: "24-hour security", es: "Seguridad 24 horas" },
  ];

  const toggleAmenity = (name: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) params.set(name, "true");
    else params.delete(name);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const submitFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of data.entries()) {
      if (typeof value === "string" && value.trim()) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-card shadow-sm">
      <form onSubmit={submitFilters} className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        {/* Main search row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Buy/Rent toggle */}
          <div className="flex shrink-0 rounded-lg border border-border bg-muted p-0.5">
            <button
              type="button"
              onClick={() => setListingType("Sale")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                listingType === "Sale"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("Buy", "Comprar")}
            </button>
            <button
              type="button"
              onClick={() => setListingType("Rental")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                listingType === "Rental"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("Rent", "Rentar")}
            </button>
          </div>

          {/* Location search */}
          <div className="min-w-0 flex-1">
            <input
              type="text"
              name="location"
              placeholder={t(
                "Search location, property or feature",
                "Buscar ubicación, propiedad o característica"
              )}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Sort */}
          <select name="sort" defaultValue="newest" className={selectClass + " lg:w-48"}>
            <option value="newest">{t("Sort: Featured first", "Ordenar: Destacadas primero")}</option>
            <option value="price_asc">{t("Price: Low to High", "Precio: Menor a Mayor")}</option>
            <option value="price_desc">{t("Price: High to Low", "Precio: Mayor a Menor")}</option>
          </select>

          {/* Search button */}
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
          >
            {t("Search", "Buscar")}
          </button>
        </div>

        {/* Advanced filters grid - always visible */}
        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("City", "Ciudad")}</label>
              <select
                name="city"
                defaultValue={searchParams.get("city") ?? ""}
                className={selectClass}
              >
                <option value="">{t("Any city", "Cualquier ciudad")}</option>
                {cities.map((city) => <option key={city.id} value={city.name}>{city.name}</option>)}
              </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Area", "Zona")}</label>
              <select name="area" defaultValue={searchParams.get("area") ?? ""} className={selectClass}>
                <option value="">{t("All areas", "Todas las zonas")}</option>
                {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
              </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Development", "Desarrollo")}</label>
              <select name="development" defaultValue={searchParams.get("development") ?? ""} className={selectClass}>
                <option value="">{t("All developments", "Todos los desarrollos")}</option>
                {developments.map((development) => <option key={development.id} value={development.id}>{development.name}</option>)}
              </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Type", "Tipo")}</label>
            <select name="propertyType" defaultValue="" className={selectClass}>
              <option value="">{t("All types", "Todos los tipos")}</option>
              {types.map((ty) => (
                <option key={ty} value={ty}>{t(ty, ty === "House" ? "Casa" : ty)}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Bedrooms", "Dormitorios")}</label>
            <select name="bedrooms" defaultValue="" className={selectClass}>
              <option value="">{t("Any", "Cualquiera")}</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Bathrooms", "Baños")}</label>
            <select name="bathrooms" defaultValue="" className={selectClass}>
              <option value="">{t("Any", "Cualquiera")}</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Minimum price", "Precio mínimo")}</label>
            <input
              type="number"
              name="minPrice"
              placeholder="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Maximum price", "Precio máximo")}</label>
            <input
              type="number"
              name="maxPrice"
              placeholder={t("Any", "Cualquiera")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t("Currency", "Moneda")}</label>
            <select name="currency" defaultValue="" className={selectClass}>
              <option value="">{t("All currencies", "Todas las monedas")}</option>
              <option value="USD">USD ($)</option>
              <option value="MXN">MXN ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 lg:col-span-3">
            <label className={labelClass}>{t("Features", "Características")}</label>
            <div className="flex flex-wrap gap-2">
              {amenities.map((a) => (
                <label
                  key={a.name}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                   <input
                     type="checkbox"
                     name={a.name}
                     checked={searchParams.get(a.name) === "true"}
                     onChange={(e) => toggleAmenity(a.name, e.target.checked)}
                     className="size-3.5 rounded border-border text-primary focus:ring-primary/40"
                   />
                  {t(a.label, a.es)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results count + watchlist + view toggle */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-foreground">
              {total} {t("properties", "propiedades")}
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Heart className="size-3.5" />
              {t("Save watchlist", "Guardar lista")}
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-0.5">
            {[
              { value: "list", label: t("List", "Lista") },
              { value: "map", label: t("Map", "Mapa") },
              { value: "split", label: t("Split", "Dividido") },
            ].map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setView(v.value as typeof view)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === v.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
