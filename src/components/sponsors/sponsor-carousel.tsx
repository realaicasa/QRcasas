"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import type { SponsorAdvert } from "@/lib/data/sponsors";
import type { Locale } from "@/lib/i18n";

interface SponsorCarouselProps {
  adverts: SponsorAdvert[];
  locale: Locale;
}

export default function SponsorCarousel({ adverts, locale }: SponsorCarouselProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const scrollBy = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  useEffect(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (adverts.length <= 1) return;
    autoRef.current = setInterval(() => {
      if (pausedRef.current || !scrollRef.current) return;
      const el = scrollRef.current;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: 340, behavior: "smooth" });
    }, 8000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [adverts.length]);

  if (adverts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/60 py-8 text-center">
        <Sparkles className="mx-auto mb-2 size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {t("No sponsor adverts yet. Become the first sponsor!", "Aún no hay anuncios patrocinados. ¡Sé el primer patrocinador!")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-purple-600" />
          {t("Our Sponsors", "Nuestros Patrocinadores")}
        </h3>
        {adverts.length > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => scrollBy(-1)} className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={t("Previous", "Anterior")}><ChevronLeft className="size-4" /></button>
            <button onClick={() => scrollBy(1)} className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={t("Next", "Siguiente")}><ChevronRight className="size-4" /></button>
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollbarWidth: "thin" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onFocus={() => { pausedRef.current = true; }}
        onBlur={() => { pausedRef.current = false; }}
      >
        {adverts.map((ad) => (
          <a
            key={ad.id}
            href={ad.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-purple-300"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
              {ad.imageUrl && ad.imageUrl !== "/images/property-placeholder.webp" ? (
                <img src={ad.imageUrl} alt={ad.advertTitle} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <Sparkles className="size-8" />
                </div>
              )}
              <span className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-0.5 text-xs font-semibold text-white">{t("Sponsored", "Patrocinado")}</span>
            </div>
            <div className="p-3">
              <h4 className="truncate text-sm font-semibold">{ad.advertTitle}</h4>
              <p className="truncate text-xs text-muted-foreground">{ad.businessName}</p>
              {ad.offer && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ad.offer}</p>}
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:underline">
                {t("Visit", "Visitar")} <ExternalLink className="size-3" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
