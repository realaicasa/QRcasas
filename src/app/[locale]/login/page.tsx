import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import LoginForm from "@/components/auth/login-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Sign in", "Iniciar sesión"),
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  async function handleSignIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
      return;
    }
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
            {t("Sign in to QRcasas", "Inicia sesión en QRcasas")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Access your favorites, watchlists and property management.",
              "Accede a tus favoritos, listas de seguimiento y gestión de propiedades."
            )}
          </p>
        </div>

        <LoginForm locale={locale} onSignIn={handleSignIn} />
      </div>
    </main>
  );
}