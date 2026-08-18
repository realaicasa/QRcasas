import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId, updateAgentProfile, type AgentProfile } from "@/lib/data/agents";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import AgentForm from "@/components/directory/agent-form";
import type { AgentFormData } from "@/components/directory/agent-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Edit Profile", "Editar Perfil"),
  };
}

export default async function AgentEditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const agent = await getAgentByUserId(session.userId);
  if (!agent) {
    redirect(`/${locale}/directory/register`);
  }

  async function handleUpdate(data: AgentFormData) {
    "use server";
    await updateAgentProfile(agent!.id, {
      businessName: data.businessName,
      primaryContactChannel: data.primaryContactChannel as "WhatsApp" | "Phone" | "Email" | "Instagram" | "Facebook",
      primaryContactValue: data.primaryContactValue,
      defaultLanguage: data.defaultLanguage,
      bioDescription: data.bioDescription || null,
      websiteUrl: data.websiteUrl || null,
      socialInstagram: data.socialInstagram || null,
      socialFacebook: data.socialFacebook || null,
      socialLinkedIn: data.socialLinkedIn || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      seoKeywords: data.seoKeywords || null,
      displayName: data.displayName || null,
      tagline: data.tagline || null,
      publicWhatsApp: data.publicWhatsApp || null,
      publicEmail: data.publicEmail || null,
      specialistVocation: data.specialistVocation || null,
      identityVerificationStatus: data.requestVerified
        ? (agent!.identityVerificationStatus === "Verified" ? "Verified" : "Pending Review")
        : agent!.identityVerificationStatus,
      featuredAgent: data.requestFeatured,
    } as Partial<AgentProfile>);

    const wantsNewVerified = data.requestVerified && agent!.identityVerificationStatus !== "Verified" && !agent!.verificationFeeActive;
    const wantsNewFeatured = data.requestFeatured && !agent!.featuredAgent;
    if (wantsNewVerified || wantsNewFeatured) {
      const res = await fetch(`${process.env.SITE_URL ?? "https://qrcasas.com"}/api/stripe/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestVerified: wantsNewVerified, requestFeatured: wantsNewFeatured }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) redirect(url);
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <a href={`/${locale}/directory/${agent.id}`} className="text-sm text-muted-foreground hover:underline">
          &larr; {t("Back to profile", "Volver al perfil")}
        </a>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        {t("Edit Profile", "Editar Perfil")}
      </h1>
      <AgentForm
        locale={locale}
        agent={agent}
        tierLevel={agent.tierLevel}
        onSubmit={handleUpdate}
      />
    </main>
  );
}
