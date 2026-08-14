"use client";

import { useState } from "react";
import PricingModal from "@/components/pricing/pricing-modal";
import PropertyForm from "@/components/properties/property-form";
import type { PricingTier } from "@/components/pricing/pricing-modal";
import type { PropertyFormData } from "@/components/properties/property-form";
import type { Locale } from "@/lib/i18n";

interface PropertyCreateFlowProps {
  locale: Locale;
  tierLevel: string;
  agentId: string;
  onSubmit: (data: PropertyFormData, tier: PricingTier) => void | Promise<void>;
}

export default function PropertyCreateFlow({
  locale,
  tierLevel,
  agentId,
  onSubmit,
}: PropertyCreateFlowProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showPricing, setShowPricing] = useState(true);

  const handleTierSelect = (tier: PricingTier) => {
    setSelectedTier(tier);
    setShowPricing(false);
  };

  const handleBack = () => {
    setSelectedTier(null);
    setShowPricing(true);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    if (selectedTier) {
      await onSubmit(data, selectedTier);
    }
  };

  if (showPricing || !selectedTier) {
    return (
      <PricingModal
        locale={locale}
        onSelect={handleTierSelect}
        onClose={() => setShowPricing(false)}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {locale === "es" ? "Plan seleccionado:" : "Selected plan:"}{" "}
          <span className="font-medium text-foreground">
            {selectedTier.label[locale]} —{" "}
            {new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-MX", {
              style: "currency",
              currency: "MXN",
              minimumFractionDigits: 0,
            }).format(selectedTier.price)}{" "}
            MXN
          </span>
          <button
            type="button"
            onClick={handleBack}
            className="ml-3 text-primary underline hover:no-underline"
          >
            {locale === "es" ? "Cambiar" : "Change"}
          </button>
        </p>
      </div>
      <PropertyForm
        locale={locale}
        tierLevel={tierLevel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
