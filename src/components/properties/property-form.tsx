"use client";

import { useState } from "react";
import type { PropertyRecord } from "@/lib/data/property";
import SeoFields from "@/components/dashboard/seo-fields";
import type { LocationOption } from "@/lib/data/locations";

interface PropertyFormProps {
  locale: string;
  property?: PropertyRecord | null;
  tierLevel: string;
  onSubmit: (data: PropertyFormData) => void | Promise<void>;
  onPhotosChange?: (photos: PropertyPhotoDraft[]) => void;
  locations?: {
    city: LocationOption[];
    area: LocationOption[];
    development: LocationOption[];
  };
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
  latitude: string;
  longitude: string;
  wifi: boolean;
  elevator: boolean;
  pool: string;
  furnished: string;
  laundry: string;
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
  photoUpgradeRequested: boolean;
}

export interface PropertyPhotoDraft {
  file: File;
  altText: string;
  previewUrl: string;
}

const LISTING_TYPES = ["Sale", "Rental"];
const LISTING_TERMS = ["Monthly", "Yearly"];
const CURRENCIES = ["USD", "MXN"];
const AREA_UNITS = ["m²", "sq ft"];
const POOL_OPTIONS = ["Private", "Shared", "None"];
const FURNISHED_OPTIONS = ["Furnished", "Part furnished", "Unfurnished"];
const LAUNDRY_OPTIONS = ["In unit", "Hookups", "Shared", "None"];
const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5", "6", "7+"];

export default function PropertyForm({ locale, property, tierLevel, onSubmit, locations, onPhotosChange }: PropertyFormProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [saving, setSaving] = useState(false);
  const [newLocationFields, setNewLocationFields] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<PropertyPhotoDraft[]>([]);

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
    latitude: property?.latitude != null ? String(property.latitude) : "",
    longitude: property?.longitude != null ? String(property.longitude) : "",
    wifi: property?.wifi ?? false,
    elevator: property?.elevator ?? false,
    pool: property?.pool ?? "None",
    furnished: property?.furnished ?? "Unfurnished",
    laundry: property?.laundry ?? "None",
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
    photoUpgradeRequested: false,
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

  const updatePhotos = (next: PropertyPhotoDraft[]) => {
    setPhotos(next);
    onPhotosChange?.(next);
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const limit = form.photoUpgradeRequested ? 10 : 1;
    updatePhotos(Array.from(files).slice(0, limit).map((file) => ({
      file,
      altText: "",
      previewUrl: URL.createObjectURL(file),
    })));
  };

  const updatePhotoAlt = (index: number, altText: string) => {
    updatePhotos(photos.map((photo, photoIndex) => photoIndex === index ? { ...photo, altText } : photo));
  };

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
          {(["city", "area", "development"] as const).map((field) => {
            const type = field === "city" ? "city" : field === "area" ? "area" : "development";
            const options = locations?.[type] ?? [];
            const label = field === "city" ? t("City", "Ciudad") : field === "area" ? t("Area", "Zona") : t("Development", "Desarrollo");
            return (
            <div key={field}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {label}
              </label>
              {newLocationFields[field] || options.length === 0 ? (
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  placeholder={label}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <select
                  value={form[field]}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      update(field, "");
                      setNewLocationFields((prev) => ({ ...prev, [field]: true }));
                    } else {
                      update(field, e.target.value);
                    }
                  }}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">{t(`Select ${label}`, `Selecciona ${label}`)}</option>
                  {options.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}
                  <option value="__new__">{t("+ Add new location", "+ Agregar nueva ubicación")}</option>
                </select>
              )}
            </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {t("Optional: add coordinates to place this property on the map.", "Opcional: agrega coordenadas para colocar esta propiedad en el mapa.")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder={t("Latitude", "Latitud")} className="w-full border rounded-md px-3 py-2 text-sm" />
          <input type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder={t("Longitude", "Longitud")} className="w-full border rounded-md px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Features", "Características")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["wifi", "WiFi", "WiFi"],
            ["elevator", "Elevator", "Ascensor"],
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
          {([
            ["pool", "Pool", "Piscina", POOL_OPTIONS],
            ["furnished", "Furnished", "Amueblado", FURNISHED_OPTIONS],
            ["laundry", "Laundry", "Lavandería", LAUNDRY_OPTIONS],
          ] as const).map(([field, en, es, options]) => (
            <label key={field} className="text-sm">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">{t(en, es)}</span>
              <select value={form[field]} onChange={(e) => update(field, e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
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

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Property Photos", "Fotos de la Propiedad")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("The first image becomes the featured image. Standard listings allow one photo; the 200 MXN upgrade allows up to ten.", "La primera imagen será la imagen destacada. Los anuncios estándar permiten una foto; la mejora de 200 MXN permite hasta diez.")}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.photoUpgradeRequested} onChange={(e) => update("photoUpgradeRequested", e.target.checked)} className="size-4 rounded border-border text-primary" />
          {t("Add photo upgrade (+200 MXN)", "Agregar mejora de fotos (+200 MXN)")}
        </label>
        <input type="file" accept="image/*" multiple={form.photoUpgradeRequested} onChange={(e) => addPhotos(e.target.files)} className="block w-full text-sm" />
        {photos.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <div key={photo.previewUrl} className="rounded-lg border p-2">
                <img src={photo.previewUrl} alt={photo.altText || t("Preview", "Vista previa")} className="mb-2 aspect-video w-full rounded object-cover" />
                <p className="mb-1 text-xs font-medium text-primary">{index === 0 ? t("Featured image", "Imagen destacada") : `${t("Photo", "Foto")} ${index + 1}`}</p>
                <input type="text" required placeholder={t("Alt text", "Texto alternativo")} value={photo.altText} onChange={(e) => updatePhotoAlt(index, e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
            ))}
          </div>
        )}
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
            <select value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">{t("Select", "Selecciona")}</option>
              {BEDROOM_OPTIONS.map((option) => <option key={option} value={option}>{option === "Studio" ? t("Studio", "Estudio") : option}</option>)}
            </select>
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
             {t("Public address or landmark", "Dirección pública o referencia")}
          </label>
          <input
            type="text"
            value={form.publicLocation}
            onChange={(e) => update("publicLocation", e.target.value)}
             placeholder={t("Street, building, or public landmark", "Calle, edificio o referencia pública")}
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
