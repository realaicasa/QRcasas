import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import { createUser } from "@/lib/data/users";
import RegisterForm from "@/components/auth/register-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Create account", "Crear cuenta"),
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  async function handleRegister(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (!email || password.length < 8 || password !== confirm) {
      return;
    }

    await createUser({
      email,
      preferredLanguage: locale,
      isVerified: true,
    });

    const store = await cookies();
    store.set("qrcasas_session", email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect(`/${locale}/account`);
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-xl font-bold text-white">
            Q
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Create your QRcasas account", "Crea tu cuenta de QRcasas")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Sign up to save favorites, create watchlists, and manage properties.",
              "Regístrate para guardar favoritos, crear listas de seguimiento y gestionar propiedades."
            )}
          </p>
        </div>

        <RegisterForm locale={locale} onRegister={handleRegister} t={t} />
      </div>
    </main>
  );
}