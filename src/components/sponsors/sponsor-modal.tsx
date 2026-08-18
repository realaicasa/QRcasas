"use client";

import { useState } from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface SponsorModalProps {
  locale: Locale;
}

export default function SponsorModal({ locale }: SponsorModalProps) {
  const [open, setOpen] = useState(false);
  const t = (en: string, es: string) => (locale === "es" ? es : en);

  const benefits = [
    locale === "es"
      ? "Tu anuncio en la página principal frente a decenas de miles de visitantes mensuales"
      : "Your advert on the homepage in front of tens of thousands of monthly visitors",
    locale === "es"
      ? "Panel de control para editar o eliminar tu anuncio en cualquier momento"
      : "Dashboard to edit or delete your advert at any time",
    locale === "es"
      ? "Cancela cuando quieras sin compromiso"
      : "Cancel at any time without commitment",
    locale === "es"
      ? "Logo o imagen de producto, título, descripción y enlace a tu sitio web"
      : "Logo or product image, title, description and link to your website",
  ];

  const requirements = [
    locale === "es" ? "Nombre personal (para contacto)" : "Personal name (for contact)",
    locale === "es" ? "Nombre del negocio" : "Business name",
    locale === "es" ? "Dirección del negocio e información de contacto" : "Business address & contact info",
    locale === "es" ? "Título y descripción del anuncio" : "Advert title & description",
    locale === "es" ? "Logo o imagen del producto" : "Logo or product image",
    locale === "es" ? "Enlace para que los clientes visiten" : "Link for customers to visit",
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700"
      >
        <Sparkles className="size-4" />
        {t("Become a Sponsor", "Conviértete en Patrocinador")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-t-2xl p-6 text-white">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full bg-black/20 p-1.5 text-white transition-colors hover:bg-black/40"
                aria-label={t("Close", "Cerrar")}
              >
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="size-8" />
                <h2 className="text-xl font-bold">
                  {t("Sponsor with QRcasas", "Patrocina con QRcasas")}
                </h2>
              </div>
              <p className="text-sm text-white/90">
                {t(
                  "Get your business featured on the homepage.",
                  "Destaca tu negocio en la página principal."
                )}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Benefits */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  {t("What you get", "Lo que obtienes")}
                </h3>
                <div className="space-y-2">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-green-600 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-lg bg-purple-50 border border-purple-200 p-4 text-center">
                <p className="text-3xl font-bold text-purple-700">
                  $1,200 <span className="text-base font-normal">MXN/{t("month", "mes")}</span>
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {t("Monthly subscription, cancel anytime", "Suscripción mensual, cancela cuando quieras")}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  {t("What to have prepared", "Lo que debes tener preparado")}
                </h3>
                <div className="space-y-1.5">
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={`/${locale}/sponsors/register`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700"
              >
                {t("Proceed to promote your business now", "Procede a promocionar tu negocio ahora")}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
