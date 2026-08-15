"use client";

import { useState } from "react";
import type { PropertyRecord } from "@/lib/data/property";
import SeoFields from "@/components/dashboard/seo-fields";

interface PropertyFormProps {
  locale: string;
  property?: PropertyRecord | null;
  tierLevel: string;
  onSubmit: (data: PropertyFormData) => void | Promise<void>;
}

export interface PropertyFormData {
  title: string;
  description: string;
  keyFeatures: string;
  price: string;
  currency: string;
  listingType: string;
  listingTerm: string;
  bedrooms: string;
  bathrooms: string;
  interiorArea: string;
  areaUnit: string;
  publicLocation: string;
  city: string;
  area: string;
  development: string;
  petFriendly: boolean;
  parking: boolean;
  nearShopping: boolean;
  nearJungle: boolean;
  nearBeach: boolean;
  twentyFourHourSecurity: boolean;
  seoTitleEn: string;
  seoTitleEs: string;
  seoDescriptionEn: string;
  seoDescriptionEs: string;
  seoKeywords: string;
}

const LISTING_TYPES = ["Sale", "Rental"];
const LISTING_TERMS = ["Monthly", "Yearly"];
const CURRENCIES = ["USD", "MXN"];
const AREA_UNITS = ["m²", "sq ft"];

export default function PropertyForm({ locale, property, tierLevel, onSubmit }: PropertyFormProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<PropertyFormData>({
    title: property?.title ?? "",
    description: property?.description ?? "",
    keyFeatures: property?.keyFeatures ?? "",
    price: property?.price != null ? String(property.price) : "",
    currency: property?.currency ?? "USD",
    listingType: property?.listingType ?? "Sale",
    listingTerm: property?.listingTerm ?? "Monthly",
    bedrooms: property?.bedrooms != null ? String(property.bedrooms) : "",
    bathrooms: property?.bathrooms != null ? String(property.bathrooms) : "",
    interiorArea: property?.interiorArea != null ? String(property.interiorArea) : "",
    areaUnit: property?.areaUnit ?? "m²",
    publicLocation: property?.publicLocation ?? "",
    city: "",
    area: "",
    development: "",
    petFriendly: false,
    parking: false,
    nearShopping: false,
    nearJungle: false,
    nearBeach: false,
    twentyFourHourSecurity: false,
    seoTitleEn: property?.seoTitleEn ?? "",
    seoTitleEs: property?.seoTitleEs ?? "",
    seoDescriptionEn: property?.seoDescriptionEn ?? "",
    seoDescriptionEs: property?.seoDescriptionEs ?? "",
    seoKeywords: property?.seoKeywords ?? "",
  });

  const hasSeoAccess = tierLevel === "Pro_Plus";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Property Details", "Detalles de la Propiedad")}</h3>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Title", "Título")} *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Description", "Descripción")}
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Key Features", "Características Principales")}
          </label>
          <textarea
            value={form.keyFeatures}
            onChange={(e) => update("keyFeatures", e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(["city", "area", "development"] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {field === "city"
                  ? t("City", "Ciudad")
                  : field === "area"
                    ? t("Area", "Zona")
                    : t("Development", "Desarrollo")}
              </label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={field === "city" ? "Tulum" : field === "area" ? "Aldea Zama" : "Development name"}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Features", "Características")}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            ["petFriendly", "Pet friendly", "Admite mascotas"],
            ["parking", "Parking", "Estacionamiento"],
            ["nearShopping", "Near shopping", "Cerca de tiendas"],
            ["nearJungle", "Near jungle", "Cerca de la selva"],
            ["nearBeach", "Near beach", "Cerca de la playa"],
            ["twentyFourHourSecurity", "24-hour security", "Seguridad 24 horas"],
          ] as const).map(([field, en, es]) => (
            <label key={field} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form[field]}
                onChange={(e) => update(field, e.target.checked)}
                className="size-4 rounded border-border text-primary"
              />
              {t(en, es)}
            </label>
          ))}
        </div>
      </div>

      {/* Pricing & Type */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Pricing & Type", "Precio y Tipo")}</h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Price", "Precio")}
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Currency", "Moneda")}
            </label>
            <select
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Listing Type", "Tipo de Anuncio")} *
            </label>
            <select
              value={form.listingType}
              onChange={(e) => update("listingType", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {LISTING_TYPES.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          </div>
        </div>

        {form.listingType === "Rental" && (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Rental Term", "Plazo de Renta")}
            </label>
            <select
              value={form.listingTerm}
              onChange={(e) => update("listingTerm", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {LISTING_TERMS.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Specs */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Specifications", "Especificaciones")}</h3>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Bedrooms", "Dormitorios")}
            </label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Bathrooms", "Baños")}
            </label>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => update("bathrooms", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Interior Area", "Área Interior")}
            </label>
            <input
              type="number"
              min="0"
              value={form.interiorArea}
              onChange={(e) => update("interiorArea", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Area Unit", "Unidad de Área")}
            </label>
            <select
              value={form.areaUnit}
              onChange={(e) => update("areaUnit", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Public Location", "Ubicación Pública")}
          </label>
          <input
            type="text"
            value={form.publicLocation}
            onChange={(e) => update("publicLocation", e.target.value)}
            placeholder="Aldea Zama, Tulum"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* SEO Fields (Pro Plus only) */}
      {hasSeoAccess && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-sm">{t("SEO Metadata (EN)", "Metadatos SEO (EN)")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("SEO Title EN", "Título SEO EN")}
              </label>
              <input
                type="text"
                value={form.seoTitleEn}
                onChange={(e) => update("seoTitleEn", e.target.value)}
                maxLength={70}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">{form.seoTitleEn.length}/70</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("SEO Title ES", "Título SEO ES")}
              </label>
              <input
                type="text"
                value={form.seoTitleEs}
                onChange={(e) => update("seoTitleEs", e.target.value)}
                maxLength={70}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">{form.seoTitleEs.length}/70</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("SEO Description EN", "Descripción SEO EN")}
              </label>
              <textarea
                value={form.seoDescriptionEn}
                onChange={(e) => update("seoDescriptionEn", e.target.value)}
                maxLength={180}
                rows={2}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">{form.seoDescriptionEn.length}/180</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("SEO Description ES", "Descripción SEO ES")}
              </label>
              <textarea
                value={form.seoDescriptionEs}
                onChange={(e) => update("seoDescriptionEs", e.target.value)}
                maxLength={180}
                rows={2}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">{form.seoDescriptionEs.length}/180</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Keywords", "Palabras Clave")}
            </label>
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => update("seoKeywords", e.target.value)}
              maxLength={500}
              placeholder="tulum condo, aldea zama, luxury listing"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.seoKeywords.length}/500</p>
          </div>
        </div>
      )}

      {!hasSeoAccess && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            {t(
              "Upgrade to Pro Plus to customize SEO metadata for this property.",
              "Actualiza a Pro Plus para personalizar los metadatos SEO de esta propiedad."
            )}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {saving
          ? t("Saving...", "Guardando...")
          : property
            ? t("Update Property", "Actualizar Propiedad")
            : t("Create Property", "Crear Propiedad")}
      </button>
    </form>
  );
}
