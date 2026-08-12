import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { PropertyListItem } from "@/lib/data/property";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";

function formatPrice(price: number | null, currency: string | null, locale: Locale): string {
  if (price == null) return locale === "es" ? "Precio bajo petición" : "Price on request";
  const cur = currency ?? "USD";
  try {
    return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return cur + " " + price.toLocaleString();
  }
}

function formatDate(iso: string, locale: Locale): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return null;
  }
}

interface PropertyCardProps {
  property: PropertyListItem;
  locale: Locale;
  t: (en: string, es: string) => string;
}

export default function PropertyCard({ property, locale, t }: PropertyCardProps) {
  const primaryPhoto = property.photos[0]?.signedUrl ?? property.photos[0]?.url;
  const isRental = property.listingType === "Rental" || property.listingType === "Renta";
  const lastUpdated = formatDate(property.updatedAt, locale);

  return (
    <Link
      href={`/${locale}/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {primaryPhoto ? (
          <img
            src={primaryPhoto}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand to-sand-dark text-xs text-muted-foreground">
            {t("No image", "Sin imagen")}
          </div>
        )}
        {property.featured && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            {t("Featured", "Destacada")}
          </span>
        )}
        <span
          className={`absolute top-2 right-2 inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${
            isRental ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white"
          }`}
        >
          {isRental ? "Renta" : "Venta"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {property.title}
        </h3>

        {property.publicLocation && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span>{property.publicLocation}</span>
          </div>
        )}

        <div className="mt-auto pt-2 text-lg font-bold text-primary">
          {formatPrice(property.price, property.currency, locale)}
          {isRental && (
            <span className="text-xs font-normal text-muted-foreground ml-1">/mo</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-0.5">
              <BedDouble className="size-3" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-0.5">
              <Bath className="size-3" />
              {property.bathrooms}
            </span>
          )}
          {property.interiorArea != null && (
            <span className="flex items-center gap-0.5">
              <Maximize className="size-3" />
              {property.interiorArea.toLocaleString()} {property.areaUnit ?? "m²"}
            </span>
          )}
        </div>

        {lastUpdated && (
          <p className="text-[10px] text-muted-foreground mt-1">
            {t("Updated", "Actualizada")}: {lastUpdated}
          </p>
        )}
      </div>
    </Link>
  );
}
