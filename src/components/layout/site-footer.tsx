import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface SiteFooterProps {
  locale: Locale;
}

const COPY = {
  tagline: { en: "Property marketplace for Quintana Roo", es: "Mercado inmobiliario de Quintana Roo" },
  realtors: { en: "Realtors", es: "Agentes" },
  properties: { en: "Properties", es: "Propiedades" },
  terms: { en: "Terms", es: "Términos" },
  privacy: { en: "Privacy", es: "Privacidad" },
  acceptableUse: { en: "Acceptable Use", es: "Uso Aceptable" },
  advertiserAgreement: { en: "Advertiser Agreement", es: "Acuerdo de Anunciantes" },
  notice: {
    en: "QRcasas is a listing marketplace. We do not independently guarantee property ownership or an advertiser's authority, and we do not hold funds. Independently verify the advertiser, property, contract and payment instructions before transferring money.",
    es: "QRcasas es un marketplace de anuncios. No garantizamos de forma independiente la propiedad ni la autoridad del anunciante, y no retenemos fondos. Verifique de forma independiente al anunciante, la propiedad, el contrato y las instrucciones de pago antes de transferir dinero.",
  },
  rights: {
    en: "All rights reserved.",
    es: "Todos los derechos reservados.",
  },
  ad: { en: "Advertising and introduction platform", es: "Plataforma de publicidad e introducción" },
} as const;

export default function SiteFooter({ locale }: SiteFooterProps) {
  const t = (key: keyof typeof COPY) => COPY[key][locale];

  return (
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
            <p className="text-xs leading-relaxed text-muted-foreground">{t("notice")}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
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
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} QRcasas. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href={`/${locale}/terms`} className="transition-colors hover:text-primary">
              {t("terms")}
            </Link>
            <Link href={`/${locale}/privacy`} className="transition-colors hover:text-primary">
              {t("privacy")}
            </Link>
            <Link href={`/${locale}/acceptable-use`} className="transition-colors hover:text-primary">
              {t("acceptableUse")}
            </Link>
            <Link href={`/${locale}/advertiser-agreement`} className="transition-colors hover:text-primary">
              {t("advertiserAgreement")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
