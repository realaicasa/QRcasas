import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { normalizeLocale, type Locale } from "@/lib/i18n";
import { getPublicPropertyBySlug, resolveSeoTitle, resolveSeoDescription } from "@/lib/data/property";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Home, Share2, Wifi, Armchair, Shield, Clock } from "lucide-react";
import { getCustomerAuth } from "@/lib/customer-auth";
import { absoluteUrl } from "@/lib/request";
import EnquiryForm from "@/components/properties/enquiry-form";
import ContactDetailsModal from "@/components/properties/contact-details-modal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MetadataParams {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: MetadataParams) {
  const { locale, slug } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const result = await getPublicPropertyBySlug(slug);
  if (!result) {
    return { title: resolved === "es" ? "Propiedad no encontrada" : "Property not found" };
  }
  const { property } = result;
  const locationStr = [property.location.city, property.location.area, property.location.development]
    .filter(Boolean).join(", ") || "Quintana Roo";
  const title = resolveSeoTitle(property, resolved) + ` - ${locationStr} - QRCasas`;
  const description = resolveSeoDescription(property, resolved) || undefined;
  return {
    title,
    description,
    openGraph: {
      images: [property.ogImageOverride || property.photos[0]?.signedUrl || property.photos[0]?.url].filter(Boolean),
    },
  };
}

function formatPrice(price: number | null, currency: string | null, locale: Locale): string {
  if (price == null) return locale === "es" ? "Precio bajo petición" : "Price on request";
  const cur = currency ?? "USD";
  try {
    return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency", currency: cur, maximumFractionDigits: 0
    }).format(price);
  } catch {
    return cur + " " + price.toLocaleString();
  }
}

function formatArea(area: number | null, unit: string | null, locale: Locale): string | null {
  if (area == null) return null;
  const u = unit ?? "m²";
  return locale === "es" ? area.toLocaleString("es-ES") + " " + u : area.toLocaleString("en-US") + " " + u;
}

function formatDate(iso: string, locale: Locale): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
      year: "numeric", month: "short", day: "numeric",
    }).format(d);
  } catch {
    return null;
  }
}

function ListingBadge({ listingType }: { listingType: string | null }) {
  const isRental = listingType === "Rental" || listingType === "Renta";
  return (
    <span className={"inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium " +
      (isRental ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700")}>
      {isRental ? "Renta" : "Venta"}
    </span>
  );
}

function FeatureRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span>{label}</span>
    </div>
  );
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = normalizeLocale(raw);
  const t = (en: string, es: string) => locale === "es" ? es : en;

  const result = await getPublicPropertyBySlug(slug);
  if (!result) {
    notFound();
  }
  const { property, advertiser, locationLabels } = result;

  const photos = property.photos.filter((p) => p.signedUrl ?? p.url);
  const primaryPhoto = photos[0]?.signedUrl ?? photos[0]?.url;

  const amenities = [
    property.wifi && <FeatureRow key="wifi" icon={Wifi} label={t("Wi-Fi", "Wi-Fi")} />,
    property.elevator && <FeatureRow key="elevator" icon={Maximize} label={t("Elevator", "Ascensor")} />,
    property.pool && property.pool !== "None" && <FeatureRow key="pool" icon={Home} label={t("Pool", "Alberca")} />,
    property.furnished && property.furnished !== "None" && <FeatureRow key="furnished" icon={Armchair} label={t("Furnished", "Amueblado")} />,
    property.laundry && property.laundry !== "None" && <FeatureRow key="laundry" icon={Home} label={t("Laundry", "Lavado")} />,
  ].filter(Boolean);

  const locationName = [
    locationLabels[property.location.city || ""],
    locationLabels[property.location.area || ""],
    locationLabels[property.location.development || ""],
    property.publicLocation,
  ].filter(Boolean)[0] || "Quintana Roo";

  // Get customer session if available (for pre-filling enquiry form)
  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);
  const customerInfo = session ? {
    name: session.email ?? "",
    email: session.email ?? "",
    phone: "",
  } : null;

  // JSON-LD structured data with absolute canonical URL
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description?.slice(0, 500) || undefined,
    url: absoluteUrl(`/properties/${property.slug}`),
    dateModified: property.updatedAt || undefined,
    ...(primaryPhoto ? { image: absoluteUrl(primaryPhoto) } : {}),
    ...(property.price != null ? {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: property.currency ?? "USD",
      },
    } : {}),
    ...(locationName ? {
      contentLocation: {
        "@type": "Place",
        name: locationName,
      },
    } : {}),
    ...(advertiser ? {
      seller: {
        "@type": "RealEstateAgent",
        name: advertiser.displayName,
      },
    } : {}),
  };

  const lastUpdated = formatDate(property.updatedAt, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href={`/${locale}/properties`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          {t("Back to marketplace", "Volver al mercado")}
        </Link>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-8">
          {/* Gallery */}
          <div>
            {primaryPhoto ? (
              <img
                src={primaryPhoto}
                alt={property.title}
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                {t("No photo available", "Sin foto")}
              </div>
            )}
          </div>

          {/* Key details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.share) {
                    navigator.share({ title: property.title, url: window.location.href });
                  }
                }}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                aria-label={t("Share", "Compartir")}
              >
                <Share2 className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <ListingBadge listingType={property.listingType} />
              {property.verified && (
                <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <Shield className="size-3" />
                  {t("Verified", "Verificado")}
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price, property.currency, locale)}
              {property.listingType === "Rental" && property.listingTerm && (
                <span className="text-base font-normal text-muted-foreground">
                  /{property.listingTerm === "Monthly" ? (locale === "es" ? "mes" : "mo") : property.listingTerm.toLowerCase()}
                </span>
              )}
            </p>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              <span>{locationName}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1"><BedDouble className="size-4" /> {property.bedrooms} {t("bd", "dorm")}</span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1"><Bath className="size-4" /> {property.bathrooms} {t("ba", "baño")}</span>
              )}
              {property.interiorArea != null && (
                <span className="flex items-center gap-1"><Maximize className="size-4" /> {formatArea(property.interiorArea, property.areaUnit, locale)}</span>
              )}
            </div>

            {amenities.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {amenities}
              </div>
            )}

            {property.listingTerm && (
              <p className="text-xs text-muted-foreground">
                {t("Listing term", "Plazo de anuncio")}: {property.listingTerm === "Monthly" ? (locale === "es" ? "Mensual" : "Monthly") : property.listingTerm}
              </p>
            )}

            {/* Last updated indicator - truthful, not "verified" */}
            {lastUpdated && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
                <Clock className="size-3" />
                {t(`Listing updated: ${lastUpdated}`, `Anuncio actualizado: ${lastUpdated}`)}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">{t("Description", "Descripción")}</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{property.description}</p>
          </div>
        )}

        {/* Key Features */}
        {property.keyFeatures && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">{t("Key features", "Características")}</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{property.keyFeatures}</p>
          </div>
        )}

        {/* Advertiser info + trust */}
        {advertiser && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-start gap-4">
              {advertiser.logo[0]?.url ? (
                <img src={advertiser.logo[0].url} alt={advertiser.displayName} className="h-12 w-12 rounded object-cover" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                  {advertiser.displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold">{advertiser.displayName}</h3>
                {advertiser.tagline && <p className="text-sm text-muted-foreground">{advertiser.tagline}</p>}
                {advertiser.identityVerified && (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-green-700">
                    <Shield className="size-3" />
                    {t("Identity verified", "Identidad verificada")}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t(
                "Contact details are only shared with verified advertisers through the lead form.",
                "Los datos de contacto se comparten solo con anunciantes verificados mediante el formulario.",
              )}
            </p>
          </div>
        )}

      {advertiser && (
        <ContactDetailsModal
          locale={locale}
          propertyId={property.id}
          propertyName={property.title}
          advertiser={advertiser}
        />
      )}

        {/* Map placeholder */}
        {property.latitude != null && property.longitude != null && (
          <div className="mt-8">
            <h3 className="text-sm font-medium mb-2">{t("Location", "Ubicación")}</h3>
            <div className="aspect-[16/9] w-full rounded-lg bg-muted text-xs text-muted-foreground flex items-center justify-center">
              {t("Map view", "Vista de mapa")} (lat: {property.latitude}, lng: {property.longitude})
            </div>
          </div>
        )}
      </main>
    </>
  );
}
