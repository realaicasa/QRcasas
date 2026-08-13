"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, X, HelpCircle, Download, FileText, ScrollText, Handshake } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface SiteFooterProps {
  locale: Locale;
}

type ModalKey = "terms" | "privacy" | "acceptableUse" | "advertiserAgreement" | "help" | "download" | null;

const COPY = {
  tagline: { en: "Property marketplace for Quintana Roo", es: "Mercado inmobiliario de Quintana Roo" },
  realtors: { en: "Realtors", es: "Agentes" },
  properties: { en: "Properties", es: "Propiedades" },
  terms: { en: "Terms", es: "Términos" },
  privacy: { en: "Privacy", es: "Privacidad" },
  acceptableUse: { en: "Acceptable Use", es: "Uso Aceptable" },
  advertiserAgreement: { en: "Advertiser Agreement", es: "Acuerdo de Anunciantes" },
  help: { en: "Help & User Manual", es: "Ayuda y Manual de Usuario" },
  download: { en: "Download App", es: "Descargar Aplicación" },
  rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
  ad: { en: "Advertising and introduction platform", es: "Plataforma de publicidad e introducción" },
} as const;

const MODAL_CONTENT: Record<Exclude<ModalKey, null>, { en: { title: string; body: string[] }; es: { title: string; body: string[] } }> = {
  terms: {
    en: {
      title: "Terms",
      body: [
        "QRcasas is a listing marketplace that connects property advertisers with interested parties.",
        "By using this platform you agree to use it lawfully, to provide accurate information, and not to misuse other users' data.",
        "We do not guarantee property ownership or an advertiser's authority, and we do not hold funds. Always verify the advertiser, property, contract and payment instructions before transferring money.",
      ],
    },
    es: {
      title: "Términos",
      body: [
        "QRcasas es un marketplace de anuncios que conecta anunciantes de propiedades con partes interesadas.",
        "Al usar esta plataforma aceptas usarla legalmente, proporcionar información precisa y no hacer mal uso de los datos de otros usuarios.",
        "No garantizamos la propiedad ni la autoridad del anunciante, y no retenemos fondos. Verifica siempre al anunciante, la propiedad, el contrato y las instrucciones de pago antes de transferir dinero.",
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy",
      body: [
        "We collect only the information needed to provide the marketplace service: contact details, language preferences, and your saved items.",
        "Your personal data is used to run the service and is not sold to third parties.",
        "You can request access to, correction of, or deletion of your personal data at any time by contacting us.",
      ],
    },
    es: {
      title: "Privacidad",
      body: [
        "Recopilamos solo la información necesaria para ofrecer el servicio del marketplace: datos de contacto, preferencias de idioma y tus elementos guardados.",
        "Tus datos personales se usan para operar el servicio y no se venden a terceros.",
        "Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier momento contactándonos.",
      ],
    },
  },
  acceptableUse: {
    en: {
      title: "Acceptable Use",
      body: [
        "Advertisers must only post genuine, lawful property listings with accurate information and true photographs.",
        "Spam, scams, fake listings, misleading prices and any fraudulent activity are strictly prohibited.",
        "We reserve the right to remove any listing or profile that violates these rules and to suspend repeat offenders.",
      ],
    },
    es: {
      title: "Uso Aceptable",
      body: [
        "Los anunciantes solo pueden publicar anuncios de propiedades genuinos y legales con información precisa y fotografías reales.",
        "El spam, las estafas, los anuncios falsos, los precios engañosos y cualquier actividad fraudulenta están estrictamente prohibidos.",
        "Nos reservamos el derecho de eliminar cualquier anuncio o perfil que viole estas reglas y de suspender a los infractores reincidentes.",
      ],
    },
  },
  advertiserAgreement: {
    en: {
      title: "Advertiser Agreement",
      body: [
        "Advertisers are responsible for the accuracy of their listings and for complying with all applicable real estate laws.",
        "You confirm that you have the authority to advertise the property you publish.",
        "QRcasas may display sponsored placements and featured listings; sponsors are clearly labelled as such.",
      ],
    },
    es: {
      title: "Acuerdo de Anunciantes",
      body: [
        "Los anunciantes son responsables de la precisión de sus anuncios y de cumplir con todas las leyes inmobiliarias aplicables.",
        "Confirmas que tienes autoridad para publicar la propiedad que anuncias.",
        "QRcasas puede mostrar ubicaciones patrocinadas y anuncios destacados; los patrocinadores están claramente etiquetados como tales.",
      ],
    },
  },
  help: {
    en: {
      title: "Help & User Manual",
      body: [
        "Find a property: use the search bar and filters on the Properties page to narrow results by city, area, type, price and features.",
        "Save a watchlist: use the 'Save watchlist' button to keep track of properties you are interested in.",
        "Contact an agent: open a property or profile and use the enquiry form to reach the advertiser directly.",
        "Add a listing: sign in, create your free realtor profile, then add properties from your dashboard.",
        "Report a problem: use the Report feature to flag suspicious properties or agents to our administrators.",
      ],
    },
    es: {
      title: "Ayuda y Manual de Usuario",
      body: [
        "Encontrar una propiedad: usa la barra de búsqueda y los filtros de la página de Propiedades para acotar por ciudad, zona, tipo, precio y características.",
        "Guardar una lista de seguimiento: usa el botón 'Guardar lista' para dar seguimiento a las propiedades de tu interés.",
        "Contactar a un agente: abre una propiedad o perfil y usa el formulario de consulta para contactar directamente al anunciante.",
        "Publicar un anuncio: inicia sesión, crea tu perfil gratuito de agente y luego agrega propiedades desde tu panel.",
        "Reportar un problema: usa la función Reportar para señalar propiedades o agentes sospechosos a nuestros administradores.",
      ],
    },
  },
  download: {
    en: {
      title: "Download App",
      body: [
        "QRcasas is a Progressive Web App (PWA) — no app store required.",
        "On iPhone (Safari): tap the Share button, then choose 'Add to Home Screen'.",
        "On Android (Chrome): tap the menu (⋮), then choose 'Add to Home screen' or 'Install app'.",
        "After installation, the QRcasas icon appears on your home screen and opens full-screen like a native app.",
      ],
    },
    es: {
      title: "Descargar Aplicación",
      body: [
        "QRcasas es una Aplicación Web Progresiva (PWA) — no requiere tienda de aplicaciones.",
        "En iPhone (Safari): toca el botón Compartir y elige 'Agregar a pantalla de inicio'.",
        "En Android (Chrome): toca el menú (⋮) y elige 'Agregar a pantalla de inicio' o 'Instalar aplicación'.",
        "Tras la instalación, el icono de QRcasas aparece en tu pantalla de inicio y se abre a pantalla completa como una app nativa.",
      ],
    },
  },
};

const MODAL_ICONS: Record<Exclude<ModalKey, null>, typeof FileText> = {
  terms: FileText,
  privacy: ShieldCheck,
  acceptableUse: ScrollText,
  advertiserAgreement: Handshake,
  help: HelpCircle,
  download: Download,
};

export default function SiteFooter({ locale }: SiteFooterProps) {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const t = (key: keyof typeof COPY) => COPY[key][locale];

  const links: Array<{ key: Exclude<ModalKey, null>; label: string }> = [
    { key: "terms", label: t("terms") },
    { key: "privacy", label: t("privacy") },
    { key: "acceptableUse", label: t("acceptableUse") },
    { key: "advertiserAgreement", label: t("advertiserAgreement") },
    { key: "help", label: t("help") },
    { key: "download", label: t("download") },
  ];

  return (
    <>
      <footer className="border-t border-border bg-sand/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="max-w-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-600 to-teal-500 text-sm font-bold text-white">
                  Q
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-bold text-foreground">QRcasas</span>
                  <span className="block text-xs text-muted-foreground">{t("tagline")}</span>
                </span>
              </div>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
              <Link
                href={`/${locale}/properties`}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("properties")}
              </Link>
              <Link
                href={`/${locale}/directory`}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("realtors")}
              </Link>
              {links.map((link) => {
                const Icon = MODAL_ICONS[link.key];
                return (
                  <button
                    key={link.key}
                    type="button"
                    onClick={() => setActiveModal(link.key)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="size-3.5" />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} QRcasas. {t("rights")}</p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              {t("ad")}
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {(() => {
                    const Icon = MODAL_ICONS[activeModal];
                    return <Icon className="size-4" />;
                  })()}
                </span>
                <h2 className="text-lg font-semibold">{MODAL_CONTENT[activeModal][locale].title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {MODAL_CONTENT[activeModal][locale].body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}