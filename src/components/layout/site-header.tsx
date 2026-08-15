import Link from "next/link";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import type { Locale } from "@/lib/i18n";

interface SiteHeaderProps {
  locale: Locale;
}

const COPY = {
  tagline: { en: "Property marketplace for Quintana Roo", es: "Mercado inmobiliario de Quintana Roo" },
  realtors: { en: "Real Estate Agents", es: "Agentes inmobiliarios" },
  properties: { en: "Properties", es: "Propiedades" },
  portal: { en: "My account", es: "Mi cuenta" },
  signIn: { en: "Sign in", es: "Iniciar sesión" },
  register: { en: "Create account", es: "Crear cuenta" },
  signOut: { en: "Sign out", es: "Cerrar sesión" },
} as const;

export default async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = (key: keyof typeof COPY) => COPY[key][locale];
  const other: Locale = locale === "es" ? "en" : "es";

  const store = await cookies();
  const session = await getCustomerAuth(store.get("qrcasas_session")?.value);
  const isLoggedIn = Boolean(session);
  let agent = null;
  if (session) {
    try {
      agent = await getAgentByUserId(session.userId);
    } catch {
      // Keep the global header available if the optional agent lookup fails.
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-6 sm:py-0">
        <div className="order-1 flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href={`/${locale}/properties`}
            className="flex items-center gap-2.5"
            aria-label="QRcasas"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-600 to-teal-500 text-base font-bold text-white shadow-sm">
              Q
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold tracking-tight text-foreground">
                QRcasas
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                {t("tagline")}
              </span>
            </span>
          </Link>
        </div>

        <nav className="order-3 flex w-full items-center justify-center gap-1 sm:order-2 sm:w-auto sm:justify-start sm:gap-2" aria-label="Main">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary sm:px-4 sm:py-2 sm:text-sm"
          >
            {t("properties")}
          </Link>
          <Link
            href={`/${locale}/directory`}
            className="inline-flex items-center rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary sm:px-4 sm:py-2 sm:text-sm"
          >
            {t("realtors")}
          </Link>
        </nav>

        <div className="order-2 flex items-center gap-1 sm:order-3 sm:gap-3">
          <Link
            href={`/${other}/properties`}
            className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {other === "es" ? "ES" : "EN"}
          </Link>
          <span className="hidden h-5 w-px bg-border sm:block" />

          {isLoggedIn ? (
            <>
              <Link
                href={agent ? `/${locale}/account/properties` : `/${locale}/account`}
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
              >
                {t("portal")}
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/login`}
                className="hidden rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
              >
                {t("signIn")}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
