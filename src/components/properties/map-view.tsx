"use client";

import { useEffect, useRef } from "react";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const t = (en: string, es: string) => (locale === "es" ? es : en);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import MapLibre GL
    const loadMap = async () => {
      try {
        const maplibregl = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");

        const map = new maplibregl.Map({
          container: mapRef.current!,
          style: "https://tiles.openfreemap.org/positron",
          center: [-86.8515, 20.6843], // Quintana Roo center
          zoom: 9,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        // Add markers for properties with coordinates
        properties.forEach((property) => {
          if (property.latitude && property.longitude) {
            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${property.title}</h3>
                <p class="text-primary font-bold">
                  ${property.price != null
                    ? new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
                        style: "currency",
                        currency: property.currency ?? "USD",
                        maximumFractionDigits: 0,
                      }).format(property.price)
                    : t("Price on request", "Precio bajo petición")}
                </p>
                <a href="/${locale}/properties/${property.slug}" class="text-primary text-xs underline">
                  ${t("View details", "Ver detalles")}
                </a>
              </div>
            `);

            new maplibregl.Marker()
              .setLngLat([property.longitude, property.latitude])
              .setPopup(popup)
              .addTo(map);
          }
        });
      } catch (error) {
        console.error("Failed to load map:", error);
      }
    };

    loadMap();
  }, [properties, locale]);

  return (
    <div className="relative w-full rounded-xl border border-border overflow-hidden bg-muted">
      <div ref={mapRef} className="h-[400px] w-full" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
        <p className="text-xs text-muted-foreground">
          MapLibre | OpenFreeMap © OpenMapTiles Data from OpenStreetMap
        </p>
      </div>
    </div>
  );
}
