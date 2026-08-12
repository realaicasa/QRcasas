import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId, createAgent } from "@/lib/data/agents";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import AgentForm from "@/components/directory/agent-form";
import type { AgentFormData } from "@/components/directory/agent-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Register as Agent", "Registrarse como Agente"),
  };
}

export default async function AgentRegisterPage({
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

  // Check if user already has an agent profile
  const existing = await getAgentByUserId(session.userId);
  if (existing) {
    redirect(`/${locale}/directory/${existing.id}/edit`);
  }

  async function handleCreate(data: AgentFormData) {
    "use server";
    await createAgent(session!.userId, {
      businessName: data.businessName,
      primaryContactChannel: data.primaryContactChannel,
      primaryContactValue: data.primaryContactValue,
      defaultLanguage: data.defaultLanguage,
    });
    redirect(`/${locale}/directory`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        {t("Register as Agent", "Registrarse como Agente")}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {t(
          "Create your public directory profile to receive enquiries from buyers.",
          "Crea tu perfil público en el directorio para recibir consultas de compradores."
        )}
      </p>
      <AgentForm
        locale={locale}
        tierLevel="Free"
        onSubmit={handleCreate}
      />
    </main>
  );
}
