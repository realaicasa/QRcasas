"use client";

import { useState } from "react";
import { X } from "lucide-react";
import EnquiryForm from "@/components/properties/enquiry-form";
import type { Locale } from "@/lib/i18n";

interface ContactDetailsModalProps {
  locale: Locale;
  propertyId: string;
  propertyName: string;
  advertiser: {
    displayName: string;
    contactChannel: string | null;
    contactValue: string | null;
  };
}

export default function ContactDetailsModal({ locale, propertyId, propertyName, advertiser }: ContactDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const t = (en: string, es: string) => (locale === "es" ? es : en);

  const openModal = () => {
    setOpen(true);
    try {
      const key = "qrcasas_visitor_id";
      let visitorId = window.localStorage.getItem(key);
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        window.localStorage.setItem(key, visitorId);
      }
      void fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, visitorId, language: locale }),
      });
    } catch {
      // Contact display remains available if browser storage is unavailable.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
      >
        {t("Contact advertiser", "Contactar al anunciante")}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{advertiser.displayName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {advertiser.contactChannel && advertiser.contactValue
                    ? `${advertiser.contactChannel}: ${advertiser.contactValue}`
                    : t("Use the enquiry form to contact this advertiser.", "Usa el formulario para contactar a este anunciante.")}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("Close", "Cerrar")} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <EnquiryForm locale={locale} propertyId={propertyId} propertyName={propertyName} />
          </div>
        </div>
      )}
    </>
  );
}
