"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

export default function BillingPortalButton({ labelEn, labelEs, locale }: { labelEn: string; labelEs: string; locale: string }) {
  const [loading, setLoading] = useState(false);
  const label = locale === "es" ? labelEs : labelEn;

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (res.ok) {
        const { url } = await res.json();
        if (url) { window.location.href = url; return; }
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50">
      <CreditCard className="size-4" />
      {loading ? "..." : label}
    </button>
  );
}
