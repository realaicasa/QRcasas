"use client";

import { useMemo } from "react";

interface MapViewProps {
  properties: Array<{
    id: string;
    title: string;
    price: number | null;
    currency: string | null;
    latitude: number | null;
    longitude: number | null;
    slug: string;
  }>;
  locale: string;
}

export default function MapView({ properties, locale }: MapViewProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);

  const mapped = useMemo(
    () =>
      properties.filter(
        (p) => p.latitude != null && p.longitude != null
      ),
    [properties]
  );

  // Center on Quintana Roo by default, or the first mapped property
  const center = useMemo(() => {
    const first = mapped[0];
    return first && first.latitude != null && first.longitude != null
      ? [first.longitude, first.latitude]
      : [-86.8515, 20.6843];
  }, [mapped]);

  const markers = useMemo(
    () =>
      mapped
        .filter((p) => p.latitude != null && p.longitude != null)
        .map(
          (p) => `${p.longitude},${p.latitude},${encodeURIComponent(p.title)}`
        )
        .join("|"),
    [mapped]
  );

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center[0] - 1.5}%2C${center[1] - 1.0}%2C${center[0] + 1.5}%2C${center[1] + 1.0}&layer=mapnik&marker=${center[1]}%2C${center[0]}`;

  console.log("OSM embed URL:", embedUrl);

  if (mapped.length === 0) {
    return (
      <div className="relative w-full rounded-xl border border-border overflow-hidden bg-muted">
        <div className="flex h-[400px] w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {t("The map is temporarily unavailable.", "El mapa no está disponible temporalmente.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl border border-border overflow-hidden bg-muted">
      <iframe
        title="Property map"
        src={embedUrl}
        className="h-[400px] w-full"
        style={{ border: 0 }}
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
        <p className="text-xs text-muted-foreground">
          © OpenStreetMap contributors · {mapped.length} {t("properties mapped", "propiedades mapeadas")}
        </p>
      </div>
    </div>
  );
}