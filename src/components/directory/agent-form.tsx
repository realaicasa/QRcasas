"use client";

import { useState } from "react";
import type { AgentProfile } from "@/lib/data/agents";
import SeoFields from "@/components/dashboard/seo-fields";

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
}

const CONTACT_CHANNELS = ["WhatsApp", "Phone", "Email", "Instagram", "Facebook"];

export default function AgentForm({ locale, agent, tierLevel, onSubmit }: AgentFormProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [saving, setSaving] = useState(false);

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

  const update = (field: keyof AgentFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-sm">{t("Business Information", "Información del Negocio")}</h3>

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
