import { Metadata } from "next";
import { getCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = normalizeLocale(locale);
  const { t } = getCopy(resolved);
  return {
    title: t("Forgot password", "Olvidé mi contraseña"),
  };
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = normalizeLocale(raw);
  const { t } = getCopy(locale);

  async function handleReset(_formData: FormData) {
    "use server";
    // Placeholder: wire to email provider in production.
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-xl font-bold text-white">
            Q
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Reset your password", "Restablece tu contraseña")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Enter your email and we'll send you a link to reset your password.",
              "Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
            )}
          </p>
        </div>

        <ForgotPasswordForm locale={locale} onReset={handleReset} t={t} />
      </div>
    </main>
  );
}