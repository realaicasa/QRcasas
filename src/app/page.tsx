import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, normalizeLocale, type Locale } from "@/lib/i18n";

export default async function RootPage() {
  const h = await headers();
  const accept = h.get("accept-language") ?? "";
  const primary = accept.split(",")[0]?.trim() || DEFAULT_LOCALE;
  const locale: Locale = normalizeLocale(primary);

  redirect(`/${locale}/properties`);
}