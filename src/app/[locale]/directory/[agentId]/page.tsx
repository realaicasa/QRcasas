import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { getAgentById, resolveAgentSeoTitle, resolveAgentSeoDescription } from "@/lib/data/agents";
import { getCustomerAuth } from "@/lib/customer-auth";
import { absoluteUrl } from "@/lib/request";

export async function generateMetadata({ params }: { params: { agentId: string } }): Promise<Metadata> {
  const agent = await getAgentById(params.agentId);
  if (!agent) {
    notFound();
  }

  const title = resolveAgentSeoTitle(agent);
  const description = resolveAgentSeoDescription(agent) || `View the profile of ${agent.businessName}, a ${agent.tierLevel} agent in our directory.`;

  return {
    title,
    description,
    openGraph: {
      images: agent.logoImage?.url ? [agent.logoImage.url] : undefined,
    },
  };
}

export default async function AgentProfilePage({ params }: { params: { agentId: string } }) {
  const cookieStore = cookies();
  const session = await getCustomerAuth();
  const userPreferredLanguage = session?.preferredLanguage || "en";

  const agent = await getAgentById(params.agentId);
  if (!agent) {
    notFound();
  }

  const languageMatch = agent.defaultLanguage === userPreferredLanguage;

  // JSON-LD structured data with absolute canonical URL
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.businessName,
    description: agent.bioDescription || undefined,
    url: absoluteUrl(`/directory/${agent.id}`),
    ...(agent.logoImage?.url ? { image: absoluteUrl(agent.logoImage.url) } : {}),
    ...(agent.websiteUrl ? { sameAs: agent.websiteUrl } : {}),
    ...(agent.socialInstagram ? { sameAs: `https://instagram.com/${agent.socialInstagram}` } : {}),
    ...(agent.socialFacebook ? { sameAs: `https://facebook.com/${agent.socialFacebook}` } : {}),
    ...(agent.socialLinkedIn ? { sameAs: `https://linkedin.com/in/${agent.socialLinkedIn}` } : {}),
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

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a href="/directory" className="text-sm text-muted-foreground hover:underline">
              ← Back to Directory
            </a>
            <h1 className="text-3xl font-bold mt-2">{agent.businessName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {agent.tierLevel === "Pro_Plus" && "Pro Plus"} {agent.tierLevel === "Pro" && "Pro"} {agent.tierLevel === "Free" && "Free"} Agent
            </p>
            {!languageMatch && (
              <p className="text-xs text-muted-foreground mt-2">
                Note: Agent&apos;s default language is {agent.defaultLanguage.toUpperCase()}. Your interface is in {userPreferredLanguage.toUpperCase()}.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {agent.logoImage ? (
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img src={agent.logoImage.url} alt={`${agent.businessName} logo`} className="h-full w-full object-cover object-center" />
                </div>
              ) : (
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                    NO LOGO
                  </span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <p className="flex items-center space-x-2 text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L3 21V5z" />
                    </svg>
                    <span>{agent.primaryContactChannel}: {agent.primaryContactValue}</span>
                  </p>
                  
                  {agent.websiteUrl && (
                    <p className="flex items-center space-x-2 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span>Website: <a href={agent.websiteUrl} className="underline" target="_blank" rel="noopener noreferrer">{agent.websiteUrl}</a></span>
                    </p>
                  )}
                  
                  {agent.socialInstagram && (
                    <p className="flex items-center space-x-2 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2-2v-2h-2v2a2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                      </svg>
                      <span>Instagram: {agent.socialInstagram}</span>
                    </p>
                  )}
                  
                  {agent.socialFacebook && (
                    <p className="flex items-center space-x-2 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 00-1-1h-5" />
                      </svg>
                      <span>Facebook: {agent.socialFacebook}</span>
                    </p>
                  )}
                  
                  {agent.socialLinkedIn && (
                    <p className="flex items-center space-x-2 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2-2v-2h-2v2a2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                      </svg>
                      <span>LinkedIn: {agent.socialLinkedIn}</span>
                    </p>
                  )}
                </div>
                
                {agent.bioDescription && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Bio</h3>
                    <p className="text-muted-foreground">{agent.bioDescription}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Language Preferences</h3>
                <p className="text-sm">
                  Your preferred language: <span className="font-medium">{userPreferredLanguage.toUpperCase()}</span>
                </p>
                <p className="text-sm">
                  Agent&apos;s default language: <span className="font-medium">{agent.defaultLanguage.toUpperCase()}</span>
                </p>
                {languageMatch ? (
                  <p className="text-sm text-green-600 mt-2">
                    Your language matches the agent&apos;s default language.
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 mt-2">
                    Consider updating your preferred language to match the agent&apos;s default language for a seamless experience.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
