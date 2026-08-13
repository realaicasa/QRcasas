"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  total: number;
  locale: string;
}

export default function FilterBar({ total, locale }: FilterBarProps) {
  const [listingType, setListingType] = useState<"Sale" | "Rental">("Sale");
  const [view, setView] = useState<"list" | "map" | "split">("list");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const t = (en: string, es: string) => (locale === "es" ? es : en);

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        {/* Main search row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Buy/Rent toggle */}
          <div className="flex rounded-lg border border-border bg-muted p-0.5">
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
              {t("Rent", "Alquilar")}
            </button>
          </div>

          {/* Location search */}
          <div className="flex-1">
            <input
              type="text"
              name="location"
              placeholder={t("Search location, property or feature", "Buscar ubicación, propiedad o característica")}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Sort dropdown */}
          <select
            name="sort"
            defaultValue="newest"
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="newest">{t("Newest", "Más reciente")}</option>
            <option value="price_asc">{t("Price: Low to High", "Precio: Menor a Mayor")}</option>
            <option value="price_desc">{t("Price: High to Low", "Precio: Mayor a Menor")}</option>
          </select>

          {/* Advanced filters toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <SlidersHorizontal className="size-4" />
            {t("Filters", "Filtros")}
          </button>

          {/* Search button */}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
          >
            {t("Search", "Buscar")}
          </button>
        </div>

        {/* Advanced filters panel */}
        {showAdvanced && (
          <div className="mt-4 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {/* City */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("City", "Ciudad")}
              </label>
              <select
                name="city"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("All cities", "Todas las ciudades")}</option>
                <option value="Tulum">Tulum</option>
                <option value="Cancun">Cancún</option>
                <option value="Playa del Carmen">Playa del Carmen</option>
                <option value="Puerto Morelos">Puerto Morelos</option>
                <option value="Isla Mujeres">Isla Mujeres</option>
                <option value="Cozumel">Cozumel</option>
              </select>
            </div>

            {/* Area */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Area", "Zona")}
              </label>
              <select
                name="area"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("All areas", "Todas las zonas")}</option>
              </select>
            </div>

            {/* Development */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Development", "Desarrollo")}
              </label>
              <select
                name="development"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("All developments", "Todos los desarrollos")}</option>
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Type", "Tipo")}
              </label>
              <select
                name="propertyType"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("All types", "Todos los tipos")}</option>
                <option value="Apartment">{t("Apartment", "Apartamento")}</option>
                <option value="House">{t("House", "Casa")}</option>
                <option value="Condo">{t("Condo", "Condominio")}</option>
                <option value="Villa">{t("Villa", "Villa")}</option>
                <option value="Land">{t("Land", "Terreno")}</option>
                <option value="Commercial">{t("Commercial", "Comercial")}</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Bedrooms", "Dormitorios")}
              </label>
              <select
                name="bedrooms"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("Any", "Cualquiera")}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Bathrooms", "Baños")}
              </label>
              <select
                name="bathrooms"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("Any", "Cualquiera")}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Minimum price */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Minimum price", "Precio mínimo")}
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="0"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Maximum price */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Maximum price", "Precio máximo")}
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder={t("Any", "Cualquiera")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Currency */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Currency", "Moneda")}
              </label>
              <select
                name="currency"
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("All currencies", "Todas las monedas")}</option>
                <option value="USD">USD ($)</option>
                <option value="MXN">MXN ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            {/* Amenities */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("Amenities", "Comodidades")}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "elevator", label: "Elevator", es: "Ascensor" },
                  { name: "wifi", label: "WiFi", es: "WiFi" },
                  { name: "pool", label: "Pool", es: "Piscina" },
                  { name: "laundry", label: "Laundry", es: "Lavandería" },
                  { name: "furnished", label: "Furnished", es: "Amueblado" },
                ].map((amenity) => (
                  <label
                    key={amenity.name}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={amenity.name}
                      className="size-3.5 rounded border-border text-primary focus:ring-primary/40"
                    />
                    {t(amenity.label, amenity.es)}
                  </label>
                ))}
              </div>
            </div>

            {/* Save watchlist */}
            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t("Save watchlist", "Guardar lista de seguimiento")}
              </button>
            </div>
          </div>
        )}

        {/* Results count and view toggle */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} {t("properties", "propiedades")}
          </p>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-0.5">
            {[
              { value: "list", label: "List", es: "Lista" },
              { value: "map", label: "Map", es: "Mapa" },
              { value: "split", label: "Split", es: "Dividir" },
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
                {t(v.label, v.es)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
