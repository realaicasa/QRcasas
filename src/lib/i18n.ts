export type Locale = "en" | "es";

const LOCALE_MAP: Record<string, Locale> = {
  en: "en",
  es: "es",
  "en-us": "en",
  "es-mx": "es",
};

export function normalizeLocale(raw: string): Locale {
  return LOCALE_MAP[raw?.toLowerCase()] ?? "en";
}

export const DEFAULT_LOCALE: Locale = "en";

/** Simple copy getter — returns a no-op copy object for now */
export function getCopy(locale: Locale) {
  return {
    locale,
    t: (en: string, es: string) => (locale === "es" ? es : en),
  };
}
