"use client";

import { useState } from "react";
import { BadgeCheck, Sparkles, Upload, Lock } from "lucide-react";
import type { AgentProfile } from "@/lib/data/agents";
import type { Locale } from "@/lib/i18n";
import SeoFields from "@/components/dashboard/seo-fields";
import QrCodeDisplay from "@/components/shared/qr-code-display";

interface AgentFormProps {
  locale: string;
  agent?: AgentProfile | null;
  tierLevel: string;
  onSubmit: (data: AgentFormData) => void | Promise<void>;
}

export interface AgentFormData {
  businessName: string;
  primaryContactChannel: string;
  primaryContactValue: string;
  defaultLanguage: "en" | "es";
  bioDescription: string;
  websiteUrl: string;
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedIn: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  displayName: string;
  tagline: string;
  publicWhatsApp: string;
  publicEmail: string;
  specialistVocation: string;
  requestVerified: boolean;
  requestFeatured: boolean;
}

const CONTACT_CHANNELS = ["WhatsApp", "Phone", "Email", "Instagram", "Facebook"];
const SPECIALIZATIONS = [
  { en: "Residential Sales", es: "Ventas Residenciales" },
  { en: "Vacation Rentals", es: "Rentas Vacacionales" },
  { en: "Long-term Rentals", es: "Rentas Largo Plazo" },
  { en: "Commercial", es: "Comercial" },
  { en: "Land & Lots", es: "Terrenos y Lotes" },
  { en: "Luxury Properties", es: "Propiedades de Lujo" },
  { en: "Property Management", es: "Administración de Propiedades" },
  { en: "Investment Advisory", es: "Asesoría de Inversión" },
];

export default function AgentForm({ locale, agent, tierLevel, onSubmit }: AgentFormProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [saving, setSaving] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [form, setForm] = useState<AgentFormData>({
    businessName: agent?.businessName ?? "",
    primaryContactChannel: agent?.primaryContactChannel ?? "WhatsApp",
    primaryContactValue: agent?.primaryContactValue ?? "",
    defaultLanguage: agent?.defaultLanguage ?? "es",
    bioDescription: agent?.bioDescription ?? "",
    websiteUrl: agent?.websiteUrl ?? "",
    socialInstagram: agent?.socialInstagram ?? "",
    socialFacebook: agent?.socialFacebook ?? "",
    socialLinkedIn: agent?.socialLinkedIn ?? "",
    seoTitle: agent?.seoTitle ?? "",
    seoDescription: agent?.seoDescription ?? "",
    seoKeywords: agent?.seoKeywords ?? "",
    displayName: agent?.displayName ?? "",
    tagline: agent?.tagline ?? "",
    publicWhatsApp: agent?.publicWhatsApp ?? "",
    publicEmail: agent?.publicEmail ?? "",
    specialistVocation: agent?.specialistVocation ?? "",
    requestVerified: agent?.identityVerificationStatus === "Verified" || agent?.identityVerificationStatus === "Pending Review",
    requestFeatured: agent?.featuredAgent ?? false,
  });

  const hasSeoAccess = tierLevel === "Pro" || tierLevel === "Pro_Plus";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof AgentFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const uploadAgentImage = async (file: File | undefined, fieldId: string) => {
    if (!file || !agent) return;
    const data = new FormData();
    data.append("recordId", agent.id);
    data.append("fieldId", fieldId);
    data.append("file", file);
    setUploadMessage(t("Uploading image...", "Subiendo imagen..."));
    const response = await fetch("/api/uploads/attachment", { method: "POST", body: data });
    setUploadMessage(response.ok ? t("Image uploaded", "Imagen subida") : t("Upload failed", "Error al subir"));
  };

  const uploadProofOfId = async (file: File | undefined) => {
    if (!file || !agent) return;
    const data = new FormData();
    data.append("recordId", agent.id);
    data.append("fieldId", "fldsNVLMRO46fBgSfjO");
    data.append("file", file);
    setUploadMessage(t("Uploading proof of ID...", "Subiendo comprobante de identidad..."));
    const response = await fetch("/api/uploads/attachment", { method: "POST", body: data });
    if (response.ok) {
      setUploadMessage(t("Proof of ID uploaded. Your verification will be reviewed.", "Comprobante subido. Tu verificación será revisada."));
      update("requestVerified", true);
    } else {
      setUploadMessage(t("Upload failed", "Error al subir"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Agent Reference (read-only) */}
      {agent?.agentReference && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("Agent ID Reference", "Referencia de Agente")}
              </p>
              <p className="text-lg font-bold tracking-wider text-foreground">{agent.agentReference}</p>
            </div>
            <Lock className="size-5 text-muted-foreground" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "This unique ID is assigned automatically and cannot be edited.",
              "Este ID único se asigna automáticamente y no se puede editar."
            )}
          </p>
        </div>
      )}

      {/* Business Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Business Information", "Información del Negocio")}</h3>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Display Name", "Nombre para Mostrar")}
          </label>
          <input
            type="text"
            value={form.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            placeholder={t("Your name as shown to clients", "Tu nombre como se muestra a clientes")}
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
            {t("Tagline", "Lema")}
          </label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder={t("e.g. Your local expert in Playa del Carmen", "ej. Tu experto local en Playa del Carmen")}
            maxLength={80}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Specializing in", "Especializado en")}
          </label>
          <select
            value={form.specialistVocation}
            onChange={(e) => update("specialistVocation", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">{t("Select specialty", "Seleccionar especialidad")}</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s.en} value={s.en}>
                {locale === "es" ? s.es : s.en}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Contact Channel", "Canal de Contacto")} *
            </label>
            <select
              value={form.primaryContactChannel}
              onChange={(e) => update("primaryContactChannel", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {CONTACT_CHANNELS.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Contact Value", "Valor de Contacto")} *
            </label>
            <input
              type="text"
              required
              value={form.primaryContactValue}
              onChange={(e) => update("primaryContactValue", e.target.value)}
              placeholder="+52 984 123 4567"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Default Language", "Idioma Predeterminado")} *
          </label>
          <select
            value={form.defaultLanguage}
            onChange={(e) => update("defaultLanguage", e.target.value as "en" | "es")}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      {agent && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-sm">{t("Profile images", "Imágenes del perfil")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("Personal profile photo", "Foto personal de perfil")}</span>
              <input type="file" accept="image/*" onChange={(e) => uploadAgentImage(e.target.files?.[0], "fldx4W6ZEhSV29zqJYV")} className="block w-full text-sm" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("Business logo", "Logo del negocio")}</span>
              <input type="file" accept="image/*" onChange={(e) => uploadAgentImage(e.target.files?.[0], "fld6ugy4EQy1HQyseVg")} className="block w-full text-sm" />
            </label>
          </div>
          {uploadMessage && <p className="text-xs text-muted-foreground">{uploadMessage}</p>}
        </div>
      )}

      {/* Agent QR Code */}
      {agent && agent.customSlug && (
        <QrCodeDisplay
          url={`${typeof window !== "undefined" ? window.location.origin : "https://qrcasas.com"}/realtors/${agent.customSlug}?source=qr&contact=1`}
          label={agent.businessName}
          locale={locale as Locale}
        />
      )}

      {/* Profile Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Profile Details", "Detalles del Perfil")}</h3>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Bio / Description", "Bio / Descripción")}
          </label>
          <textarea
            value={form.bioDescription}
            onChange={(e) => update("bioDescription", e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">{form.bioDescription.length}/500</p>
        </div>

        {/* Public Contact Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Public WhatsApp", "WhatsApp Público")}
            </label>
            <input
              type="text"
              value={form.publicWhatsApp}
              onChange={(e) => update("publicWhatsApp", e.target.value)}
              placeholder="+52 984 123 4567"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t("Public Email", "Email Público")}
            </label>
            <input
              type="email"
              value={form.publicEmail}
              onChange={(e) => update("publicEmail", e.target.value)}
              placeholder="contact@yourbusiness.com"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t("Website URL", "URL del Sitio Web")}
          </label>
          <input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => update("websiteUrl", e.target.value)}
            placeholder="https://"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram</label>
            <input
              type="text"
              value={form.socialInstagram}
              onChange={(e) => update("socialInstagram", e.target.value)}
              placeholder="username"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Facebook</label>
            <input
              type="text"
              value={form.socialFacebook}
              onChange={(e) => update("socialFacebook", e.target.value)}
              placeholder="page-name"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">LinkedIn</label>
            <input
              type="text"
              value={form.socialLinkedIn}
              onChange={(e) => update("socialLinkedIn", e.target.value)}
              placeholder="profile-name"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Upsell: Verified + Featured */}
      {agent && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-sm">
            {t("Premium Add-ons", "Complementos Premium")}
          </h3>

          {/* Verified */}
          <div className={`rounded-lg border-2 p-4 transition-colors ${
            form.requestVerified
              ? "border-blue-300 bg-blue-50"
              : "border-border bg-card"
          }`}>
            <div className="flex items-start gap-3">
              <BadgeCheck className={`size-6 shrink-0 ${form.requestVerified ? "text-blue-500" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">
                    {t("Verified Agent", "Agente Verificado")}
                  </h4>
                  <span className="text-xs font-medium text-blue-600">300 MXN/{t("month", "mes")}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(
                    "Display a blue verified badge on your profile. Requires proof of ID upload. Reviewed by admin.",
                    "Muestra un distintivo azul verificado en tu perfil. Requiere comprobante de identidad. Revisado por admin."
                  )}
                </p>
                {form.requestVerified && (
                  <div className="mt-3 rounded-md bg-blue-100 px-3 py-2 text-xs text-blue-800">
                    {agent.identityVerificationStatus === "Verified"
                      ? t("Verified — badge is active.", "Verificado — distintivo activo.")
                      : t("Pending review — admin will verify your ID.", "En revisión — admin verificará tu ID.")}
                  </div>
                )}
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.requestVerified}
                    onChange={(e) => update("requestVerified", e.target.checked)}
                    className="size-4 rounded border-border text-blue-500 focus:ring-blue-400"
                  />
                  <span>{t("Request verification", "Solicitar verificación")}</span>
                </label>
                {form.requestVerified && agent.identityVerificationStatus !== "Verified" && (
                  <div className="mt-3">
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">
                        {t("Upload proof of ID (passport, driver's license, or national ID)", "Sube comprobante de ID (pasaporte, licencia o ID nacional)")}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => uploadProofOfId(e.target.files?.[0])}
                        className="block w-full text-sm"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className={`rounded-lg border-2 p-4 transition-colors ${
            form.requestFeatured
              ? "border-primary/40 bg-primary/5"
              : "border-border bg-card"
          }`}>
            <div className="flex items-start gap-3">
              <Sparkles className={`size-6 shrink-0 ${form.requestFeatured ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">
                    {t("Featured Agent", "Agente Destacado")}
                  </h4>
                  <span className="text-xs font-medium text-primary">300 MXN/{t("month", "mes")}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(
                    "Appear in the featured agents horizontal scroll on the directory homepage with your photo, name, and business name.",
                    "Aparece en el scroll horizontal de agentes destacados en la página principal del directorio con tu foto, nombre y negocio."
                  )}
                </p>
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.requestFeatured}
                    onChange={(e) => update("requestFeatured", e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary/40"
                  />
                  <span>{t("Become a featured agent", "Ser agente destacado")}</span>
                </label>
                {form.requestFeatured && (
                  <p className="mt-2 text-xs text-primary">
                    {t(
                      "You will be redirected to Stripe to complete the monthly subscription.",
                      "Serás redirigido a Stripe para completar la suscripción mensual."
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Fields (tier-gated) */}
      <SeoFields
        hasAccess={hasSeoAccess}
        tierLevel={tierLevel}
        initialValues={{
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
          seoKeywords: form.seoKeywords,
        }}
        onSave={(seo) => {
          setForm((prev) => ({
            ...prev,
            seoTitle: seo.seoTitle,
            seoDescription: seo.seoDescription,
            seoKeywords: seo.seoKeywords,
          }));
        }}
      />

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {saving
          ? t("Saving...", "Guardando...")
          : agent
            ? t("Update Profile", "Actualizar Perfil")
            : t("Create Profile", "Crear Perfil")}
      </button>
    </form>
  );
}
