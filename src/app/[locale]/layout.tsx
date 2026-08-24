import type { ReactNode } from "react";
import { cookies } from "next/headers";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import { getCustomerAuth } from "@/lib/customer-auth";
import { normalizeLocale, type Locale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);

  const store = await cookies();
  const session = await getCustomerAuth(store.get("qrcasas_session")?.value);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader locale={locale} />
      <div className="flex-1">{children}</div>
      <SiteFooter locale={locale} session={session} />
    </div>
  );
}