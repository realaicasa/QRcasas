import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft } from "lucide-react";

import { getAgentById, resolveAgentSeoTitle, resolveAgentSeoDescription } from "@/lib/data/agents";
import { getPublicPropertiesByAgent } from "@/lib/data/property";
import { getCustomerAuth } from "@/lib/customer-auth";
import { absoluteUrl } from "@/lib/request";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import { getFirstSafeImage } from "@/lib/media";
import AgentDetailModal from "@/components/directory/agent-detail-modal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agentId: string }>;
}): Promise<Metadata> {
  const { agentId } = await params;
  const agent = await getAgentById(agentId);
  if (!agent) {
    notFound();
  }

  const title = resolveAgentSeoTitle(agent);
  const description =
    resolveAgentSeoDescription(agent) ||
    `View the profile of ${agent.businessName}, a ${agent.tierLevel} agent in our directory.`;

  return {
    title,
    description,
    openGraph: {
      images: agent.logoImage?.url ? [agent.logoImage.url] : undefined,
    },
  };
}

function formatPrice(price: number | null, currency: string | null, locale: Locale): string {
  if (price == null) return locale === "es" ? "Precio bajo petición" : "Price on request";
  const cur = currency ?? "USD";
  try {
    return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency", currency: cur, maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return cur + " " + price.toLocaleString();
  }
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const cookieStore = await cookies();
  const session = await getCustomerAuth();
  const userPreferredLanguage = session?.preferredLanguage || "en";
  const locale: Locale = normalizeLocale(userPreferredLanguage);
  const { t } = getCopy(locale);

  const agent = await getAgentById(agentId);
  if (!agent) {
    notFound();
  }

  const isLoggedIn = Boolean(session);
  const portfolio = await getPublicPropertiesByAgent(agentId, 20);
  const photoUrl = agent.profilePhoto?.url || agent.logoImage?.url;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.businessName,
    description: agent.bioDescription || undefined,
    url: absoluteUrl(`/directory/${agent.id}`),
    ...(agent.logoImage?.url ? { image: absoluteUrl(agent.logoImage.url) } : {}),
    ...(agent.websiteUrl ? { sameAs: agent.websiteUrl } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: [agent.defaultLanguage === "es" ? "Spanish" : "English"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentDetailModal agent={agent} locale={locale} isLoggedIn={isLoggedIn} />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href={`/${locale}/directory`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          {t("Back to directory", "Volver al directorio")}
        </Link>

        {/* Agent header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
            {photoUrl ? (
              <img src={photoUrl} alt={agent.businessName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                {agent.businessName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{agent.displayName || agent.businessName}</h1>
            <p className="text-sm text-muted-foreground">{agent.businessName}</p>
            {agent.specialistVocation && (
              <p className="mt-1 text-sm text-primary">{agent.specialistVocation}</p>
            )}
            {agent.agentReference && (
              <p className="mt-1 text-xs text-muted-foreground">ID: {agent.agentReference}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {agent.bioDescription && (
          <div className="mb-8">
            <h2 className="mb-2 text-lg font-semibold">{t("About", "Acerca de")}</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
              {agent.bioDescription}
            </p>
          </div>
        )}

        {/* Portfolio */}
        {portfolio.length > 0 && (
          <div id="portfolio" className="scroll-mt-20">
            <h2 className="mb-4 text-lg font-semibold">
              {t("Portfolio", "Portafolio")}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {portfolio.length} {t("properties", "propiedades")}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((property) => {
                const img = getFirstSafeImage(property.photos);
                const hasPhoto = property.photos.length > 0;
                return (
                  <Link
                    key={property.id}
                    href={`/${locale}/properties/${property.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      {hasPhoto ? (
                        <img
                          src={img}
                          alt={property.photoAltText[0] || property.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          {t("No photo available", "Sin foto disponible")}
                        </div>
                      )}
                      {property.featured && (
                        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          {t("Featured", "Destacada")}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="truncate text-sm font-semibold">{property.title}</h3>
                      {property.publicLocation && (
                        <p className="truncate text-xs text-muted-foreground">{property.publicLocation}</p>
                      )}
                      <p className="mt-1 text-sm font-bold text-primary">
                        {formatPrice(property.price, property.currency, locale)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {portfolio.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/60 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {t(
                "This agent has no published properties yet.",
                "Este agente aún no tiene propiedades publicadas."
              )}
            </p>
          </div>
        )}
      </main>
    </>
  );
}
