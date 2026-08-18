import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { getAgentById, resolveAgentSeoTitle, resolveAgentSeoDescription } from "@/lib/data/agents";
import { getCustomerAuth } from "@/lib/customer-auth";
import { absoluteUrl } from "@/lib/request";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
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
      <AgentDetailModal agent={agent} locale={locale} />
    </>
  );
}
