"use client";

import { useState } from "react";
import { X, Check, Tag } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface PricingModalProps {
  locale: Locale;
  onSelect: (tier: PricingTier) => void;
  onClose: () => void;
}

export interface PricingTier {
  id: "single" | "pack_10" | "pack_25";
  label: { en: string; es: string };
  price: number;
  currency: string;
  maxProperties: number;
  durationWeeks: number;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "single",
    label: { en: "Single listing", es: "Anuncio único" },
    price: 500,
    currency: "MXN",
    maxProperties: 1,
    durationWeeks: 13,
  },
  {
    id: "pack_10",
    label: { en: "10 listings", es: "10 anuncios" },
    price: 3000,
    currency: "MXN",
    maxProperties: 10,
    durationWeeks: 13,
  },
  {
    id: "pack_25",
    label: { en: "25 listings", es: "25 anuncios" },
    price: 6900,
    currency: "MXN",
    maxProperties: 25,
    durationWeeks: 13,
  },
];

const COPY = {
  title: { en: "List your property", es: "Publica tu propiedad" },
  subtitle: {
    en: "Choose a listing plan. Each plan includes 13 weeks of visibility.",
    es: "Elige un plan de publicación. Cada plan incluye 13 semanas de visibilidad.",
  },
  perProperty: { en: "per property", es: "por propiedad" },
  duration: { en: "13 weeks", es: "13 semanas" },
  proceed: { en: "Proceed", es: "Continuar" },
  cancel: { en: "Cancel", es: "Cancelar" },
  mostPopular: { en: "Most popular", es: "Más popular" },
  savings: { en: "Save", es: "Ahorra" },
};

export default function PricingModal({ locale, onSelect, onClose }: PricingModalProps) {
  const [selected, setSelected] = useState<PricingTier["id"]>("single");
  const t = (key: keyof typeof COPY) => COPY[key][locale];

  const handleProceed = () => {
    const tier = PRICING_TIERS.find((t) => t.id === selected)!;
    onSelect(tier);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const perPropertyPrice = (tier: PricingTier) => {
    return Math.round(tier.price / tier.maxProperties);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">{t("title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const isSelected = selected === tier.id;
            const isPopular = tier.id === "pack_10";
            const perProp = perPropertyPrice(tier);

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelected(tier.id)}
                className={`relative flex flex-col rounded-xl border-2 p-5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    {t("mostPopular")}
                  </span>
                )}

                <div className="mb-3">
                  <span className="text-2xl font-bold">{formatPrice(tier.price)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">{tier.currency}</span>
                </div>

                <p className="mb-1 text-sm font-medium">{tier.label[locale]}</p>
                <p className="mb-4 text-xs text-muted-foreground">
                  {formatPrice(perProp)} {t("perProperty")} · {t("duration")}
                </p>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    <span>
                      {tier.maxProperties === 1
                        ? `1 ${locale === "es" ? "anuncio" : "listing"}`
                        : `${tier.maxProperties} ${locale === "es" ? "anuncios" : "listings"}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    <span>13 {locale === "es" ? "semanas" : "weeks"}</span>
                  </div>
                  {tier.maxProperties > 1 && (
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Check className="size-4" />
                      <span>
                        {t("savings")} {formatPrice(perPropertyPrice(PRICING_TIERS[0]) * tier.maxProperties - tier.price)}
                      </span>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
                    {locale === "es" ? "Seleccionado" : "Selected"}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Proceed button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
          >
            {t("proceed")}
          </button>
        </div>
      </div>
    </div>
  );
}
