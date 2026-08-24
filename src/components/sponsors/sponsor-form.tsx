"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface SponsorFormProps {
  locale: Locale;
  email: string;
}

export default function SponsorForm({ locale, email }: SponsorFormProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [advertId, setAdvertId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    contactName: "",
    businessName: "",
    businessAddress: "",
    contactInfo: email,
    advertTitle: "",
    advertDescription: "",
    linkUrl: "",
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/sponsors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create advert");
      const { id } = await res.json();
      setAdvertId(id);
    } catch {
      setError(t("Failed to save. Please try again.", "Error al guardar. Intenta de nuevo."));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file || !advertId) return;
    setUploading(true);
    const data = new FormData();
    data.append("recordId", advertId);
    data.append("fieldId", "fldPMEtE6evTyV01UfW");
    data.append("file", file);
    try {
      await fetch("/api/uploads/attachment", { method: "POST", body: data });
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!advertId) return;
    try {
      const res = await fetch("/api/stripe/sponsor-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    } catch {
      setError(t("Checkout unavailable. Please try again later.", "Checkout no disponible. Intenta más tarde."));
    }
  };

  if (advertId) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <h2 className="text-lg font-bold text-green-800 mb-2">
            {t("Advert saved!", "¡Anuncio guardado!")}
          </h2>
          <p className="text-sm text-green-700 mb-4">
            {t(
              "Upload your advert image and start your subscription to go live.",
              "Sube la imagen de tu anuncio e inicia tu suscripción para publicarlo."
            )}
          </p>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-sm">
            {t("Advert Image (1600×800 recommended)", "Imagen del anuncio (1600×800 recomendado)")}
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files?.[0])}
            className="block w-full text-sm"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-xs text-muted-foreground">{t("Uploading...", "Subiendo...")}</p>
          )}
        </div>

        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 text-center">
          <p className="text-sm text-purple-700 mb-4">
            {t(
              "Start your 1,200 MXN/month subscription to display your advert on the homepage.",
              "Inicia tu suscripción de 1,200 MXN/mes para mostrar tu anuncio en la página principal."
            )}
          </p>
          <button
            onClick={handleSubscribe}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            {t("Start Subscription", "Iniciar Suscripción")}
          </button>
        </div>

        <button
          onClick={() => router.push(`/${locale}/sponsors/dashboard`)}
          className="block w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground text-center transition-colors hover:bg-muted"
        >
          {t("Go to Dashboard", "Ir al Panel")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">
          {t("Personal & Business Details", "Datos Personales y del Negocio")}
        </h3>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Personal Name", "Nombre Personal")} *
          </label>
          <input
            type="text"
            required
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Business Name", "Nombre del Negocio")} *
          </label>
          <input
            type="text"
            required
            value={form.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Business Address", "Dirección del Negocio")}
          </label>
          <input
            type="text"
            value={form.businessAddress}
            onChange={(e) => update("businessAddress", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Contact Info (email/phone)", "Información de Contacto")} *
          </label>
          <input
            type="text"
            required
            value={form.contactInfo}
            onChange={(e) => update("contactInfo", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">
          {t("Advert Content", "Contenido del Anuncio")}
        </h3>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Advert Title", "Título del Anuncio")} *
          </label>
          <input
            type="text"
            required
            value={form.advertTitle}
            onChange={(e) => update("advertTitle", e.target.value)}
            maxLength={80}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Advert Description", "Descripción del Anuncio")}
          </label>
          <textarea
            value={form.advertDescription}
            onChange={(e) => update("advertDescription", e.target.value)}
            rows={3}
            maxLength={300}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Link URL (where customers click through to)", "URL de Enlace")} *
          </label>
          <input
            type="url"
            required
            value={form.linkUrl}
            onChange={(e) => update("linkUrl", e.target.value)}
            placeholder="https://"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? t("Saving...", "Guardando...") : t("Save Advert", "Guardar Anuncio")}
      </button>
    </form>
  );
}
