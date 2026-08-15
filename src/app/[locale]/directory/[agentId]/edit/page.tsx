import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId, updateAgentProfile } from "@/lib/data/agents";
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
    });
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
