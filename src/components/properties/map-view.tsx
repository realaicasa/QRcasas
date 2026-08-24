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
    () => properties.filter((p) => p.latitude != null && p.longitude != null),
    [properties]
  );

  // Default center: Riviera Maya / Quintana Roo
  const center = useMemo(() => {
    const lats = mapped.map((p) => p.latitude as number);
    const lngs = mapped.map((p) => p.longitude as number);
    if (lats.length > 0 && lngs.length > 0) {
      const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const meanLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      return { lat: meanLat, lng: meanLng };
    }
    return { lat: 20.6843, lng: -86.8515 };
  }, [mapped]);

  const embedUrl = useMemo(() => {
    const pad = 1.5;
    const bbox = `${center.lng - pad}%2C${center.lat - pad}%2C${center.lng + pad}%2C${center.lat + pad}`;
    const marker = mapped.length > 0 ? `&marker=${center.lat}%2C${center.lng}` : "";
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;
  }, [center, mapped.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
      <iframe
        title="Property map"
        src={embedUrl}
        className="h-[420px] w-full"
        style={{ border: 0 }}
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
        <p className="text-xs text-muted-foreground">
          © OpenStreetMap contributors · {mapped.length}{" "}
          {mapped.length === 1
            ? t("mapped property", "propiedad mapeada")
            : t("mapped properties", "propiedades mapeadas")}
        </p>
      </div>
    </div>
  );
}